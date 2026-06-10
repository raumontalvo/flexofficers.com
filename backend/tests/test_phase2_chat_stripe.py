"""
Phase 2 tests: Apple sign-in, conversations REST, WebSocket chat,
Stripe Checkout, Stripe Connect onboard/status, complete-shift gating,
webhook simulation, location override, posted_by_rating aggregation.
"""
import os
import json
import uuid
import asyncio
import time
import pytest
import requests
import websockets

BASE = os.environ.get("EXPO_PUBLIC_BACKEND_URL", "https://flexofficers-mobile.preview.emergentagent.com").rstrip("/")
WS_BASE = BASE.replace("https://", "wss://").replace("http://", "ws://")
API = f"{BASE}/api"


# ---------- fixtures ----------

@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


def _register(session, role, prefix):
    email = f"TEST_p2_{prefix}_{uuid.uuid4().hex[:8]}@example.com"
    payload = {
        "email": email, "password": "test1234",
        "full_name": f"TEST_{prefix}_{role}",
        "role": role,
    }
    if role == "company":
        payload["company_name"] = f"TEST_{prefix} Corp"
    r = session.post(f"{API}/auth/register", json=payload)
    assert r.status_code == 200, r.text
    return r.json()


@pytest.fixture(scope="module")
def officer(session):
    return _register(session, "officer", "off")


@pytest.fixture(scope="module")
def company(session):
    return _register(session, "company", "co")


@pytest.fixture(scope="module")
def other_company(session):
    return _register(session, "company", "co2")


def _h(token):
    return {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}


@pytest.fixture(scope="module")
def shift(session, company, officer):
    body = {
        "title": "TEST_P2_Shift",
        "venue": "TEST_Venue_P2",
        "city": "Miami", "state": "FL",
        "start_time": "2026-06-10T18:00:00",
        "end_time": "2026-06-11T02:00:00",
        "pay_rate": 25.0, "officers_needed": 2,
        "description": "phase2 test", "requirements": ["Class D"],
    }
    r = session.post(f"{API}/shifts", json=body,
                     headers=_h(company["access_token"]))
    assert r.status_code == 200, r.text
    sh = r.json()
    # officer applies
    ra = session.post(f"{API}/shifts/{sh['id']}/apply",
                      headers=_h(officer["access_token"]))
    assert ra.status_code == 200, ra.text
    return sh


# ---------- Auth regressions ----------

class TestAuthRegressions:
    def test_google_invalid_token_401(self, session):
        r = session.post(f"{API}/auth/google", json={"session_token": "definitely-not-valid"})
        assert r.status_code == 401, r.text

    def test_apple_malformed_token_400(self, session):
        r = session.post(f"{API}/auth/apple", json={"identity_token": "not-a-jwt"})
        assert r.status_code == 400
        assert "Invalid Apple identity token" in r.text


# ---------- Conversations ----------

class TestConversations:
    def test_officer_conversations_includes_applied_shift(self, session, officer, shift):
        r = session.get(f"{API}/conversations", headers=_h(officer["access_token"]))
        assert r.status_code == 200, r.text
        convs = r.json()
        ids = [c["shift_id"] for c in convs]
        assert shift["id"] in ids
        match = [c for c in convs if c["shift_id"] == shift["id"]][0]
        assert match["shift_title"] == shift["title"]
        assert match["venue"] == shift["venue"]

    def test_company_conversations_includes_own_shift(self, session, company, shift):
        r = session.get(f"{API}/conversations", headers=_h(company["access_token"]))
        assert r.status_code == 200
        ids = [c["shift_id"] for c in r.json()]
        assert shift["id"] in ids

    def test_get_messages_forbidden_for_outsider(self, session, other_company, shift):
        r = session.get(
            f"{API}/conversations/{shift['id']}/messages",
            headers=_h(other_company["access_token"]),
        )
        assert r.status_code == 403, r.text

    def test_get_messages_ok_for_participant(self, session, officer, shift):
        r = session.get(
            f"{API}/conversations/{shift['id']}/messages",
            headers=_h(officer["access_token"]),
        )
        assert r.status_code == 200
        assert isinstance(r.json(), list)

    def test_post_message_empty_400(self, session, officer, shift):
        r = session.post(
            f"{API}/conversations/{shift['id']}/messages",
            json={"text": "   "},
            headers=_h(officer["access_token"]),
        )
        assert r.status_code == 400

    def test_post_message_stores_and_returns(self, session, officer, shift):
        txt = f"TEST_msg_{uuid.uuid4().hex[:6]}"
        r = session.post(
            f"{API}/conversations/{shift['id']}/messages",
            json={"text": txt},
            headers=_h(officer["access_token"]),
        )
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["text"] == txt
        assert body["sender_id"] == officer["user"]["id"]
        # GET should include it
        rg = session.get(
            f"{API}/conversations/{shift['id']}/messages",
            headers=_h(officer["access_token"]),
        )
        assert any(m["text"] == txt for m in rg.json())


# ---------- WebSocket ----------

class TestWebSocketChat:
    def test_ws_bad_token_closes_4401(self, shift):
        async def run():
            url = f"{WS_BASE}/api/ws/chat/{shift['id']}?token=BADTOKEN"
            try:
                async with websockets.connect(url) as ws:
                    await ws.recv()
                return None
            except websockets.exceptions.InvalidStatus as e:
                return ("invalid_status", e.response.status_code)
            except websockets.exceptions.ConnectionClosed as e:
                return ("closed", e.code)
            except Exception as e:
                return ("err", str(e))
        result = asyncio.get_event_loop().run_until_complete(run())
        assert result is not None
        # Accept either close code 4401 or rejection at handshake (some proxies translate)
        assert (result[0] == "closed" and result[1] == 4401) or result[0] in ("invalid_status",), f"unexpected: {result}"

    def test_ws_valid_token_broadcasts(self, officer, shift):
        async def run():
            url = f"{WS_BASE}/api/ws/chat/{shift['id']}?token={officer['access_token']}"
            async with websockets.connect(url) as ws:
                txt = f"TEST_ws_{uuid.uuid4().hex[:6]}"
                await ws.send(json.dumps({"text": txt}))
                msg = await asyncio.wait_for(ws.recv(), timeout=5)
                data = json.loads(msg)
                return txt, data
        sent, echo = asyncio.get_event_loop().run_until_complete(run())
        assert echo["text"] == sent
        assert echo["shift_id"] == shift["id"]
        # persistence check
        r = requests.get(
            f"{API}/conversations/{shift['id']}/messages",
            headers=_h(officer["access_token"]),
        )
        assert any(m["text"] == sent for m in r.json())


# ---------- Stripe Checkout (company) ----------

class TestStripeCheckout:
    def test_checkout_rejects_officer(self, session, officer, shift):
        r = session.post(f"{API}/shifts/{shift['id']}/checkout",
                         headers=_h(officer["access_token"]))
        assert r.status_code == 403

    def test_checkout_rejects_other_company(self, session, other_company, shift):
        r = session.post(f"{API}/shifts/{shift['id']}/checkout",
                         headers=_h(other_company["access_token"]))
        assert r.status_code == 403

    def test_checkout_owner_ok_or_stripe_unavailable(self, session, company, shift):
        r = session.post(f"{API}/shifts/{shift['id']}/checkout",
                         headers=_h(company["access_token"]))
        if r.status_code == 502:
            pytest.skip(f"Stripe API key invalid/unavailable in env: {r.text}")
        assert r.status_code == 200, r.text
        body = r.json()
        assert "checkout_url" in body and body["checkout_url"].startswith("http")
        assert "session_id" in body
        # payment_status set to pending
        rs = session.get(f"{API}/shifts/{shift['id']}/payment-status")
        assert rs.status_code == 200
        assert rs.json()["payment_status"] in ("pending", "paid")


# ---------- Stripe Connect (officer onboarding) ----------

class TestStripeConnect:
    def test_onboard_rejects_company(self, session, company):
        r = session.post(f"{API}/officers/stripe/onboard",
                         headers=_h(company["access_token"]))
        assert r.status_code == 403

    def test_onboard_officer_ok_or_unavailable(self, session, officer):
        r = session.post(f"{API}/officers/stripe/onboard",
                         headers=_h(officer["access_token"]))
        if r.status_code == 502:
            pytest.skip(f"Stripe unavailable: {r.text}")
        assert r.status_code == 200, r.text
        body = r.json()
        assert body["url"].startswith("http")
        assert body["account_id"]

    def test_status_for_officer(self, session, officer):
        r = session.get(f"{API}/officers/stripe/status",
                        headers=_h(officer["access_token"]))
        assert r.status_code == 200
        body = r.json()
        assert "payouts_enabled" in body
        assert body["payouts_enabled"] is False  # nothing onboarded yet


# ---------- Complete shift gating ----------

class TestCompleteShiftGating:
    def test_complete_rejects_when_unpaid(self, session, officer, shift):
        r = session.post(f"{API}/shifts/{shift['id']}/complete",
                         headers=_h(officer["access_token"]))
        assert r.status_code == 400
        assert "paid" in r.text.lower()


# ---------- Webhook simulation ----------

class TestStripeWebhook:
    def test_fake_checkout_completed_marks_paid(self, session, company, officer):
        # Make a dedicated shift to mark paid via webhook (don't disturb main fixture if checkout succeeded)
        body = {
            "title": "TEST_P2_WebhookShift",
            "venue": "TEST_Venue_WH", "city": "Miami", "state": "FL",
            "start_time": "2026-06-12T18:00:00", "end_time": "2026-06-12T22:00:00",
            "pay_rate": 20.0, "officers_needed": 1,
            "description": "wh test", "requirements": [],
        }
        r = session.post(f"{API}/shifts", json=body, headers=_h(company["access_token"]))
        assert r.status_code == 200
        sid = r.json()["id"]

        event = {
            "type": "checkout.session.completed",
            "data": {"object": {
                "client_reference_id": sid,
                "payment_status": "paid",
                "payment_intent": "pi_test_" + uuid.uuid4().hex[:8],
                "metadata": {"shift_id": sid},
            }},
        }
        # webhook is on /api/webhooks/stripe (raw mount)
        wh = requests.post(f"{API}/webhooks/stripe", data=json.dumps(event),
                           headers={"Content-Type": "application/json"})
        assert wh.status_code == 200, wh.text

        rs = session.get(f"{API}/shifts/{sid}/payment-status")
        assert rs.status_code == 200
        assert rs.json()["payment_status"] == "paid"


# ---------- Location override ----------

class TestLocationOverride:
    def test_patch_location_persists(self, session, officer):
        new_loc = "TEST_LOC_" + uuid.uuid4().hex[:6]
        r = session.patch(f"{API}/users/me/location",
                          json={"location": new_loc, "lat": 30.1, "lng": -81.6},
                          headers=_h(officer["access_token"]))
        assert r.status_code == 200, r.text
        assert r.json()["location"] == new_loc
        # /auth/me reflects
        me = session.get(f"{API}/auth/me", headers=_h(officer["access_token"]))
        assert me.status_code == 200
        assert me.json()["location"] == new_loc


# ---------- Posted-by ratings on /shifts ----------

class TestShiftPostedByRatings:
    def test_shifts_include_posted_by_rating_when_rated(self, session, company, officer):
        # Create a TEST shift posted by company, officer applies, officer rates company
        body = {
            "title": "TEST_P2_RatedShift", "venue": "TEST_Venue_RP",
            "city": "Miami", "state": "FL",
            "start_time": "2026-06-13T18:00:00", "end_time": "2026-06-13T22:00:00",
            "pay_rate": 22.0, "officers_needed": 1,
            "description": "rated", "requirements": [],
        }
        r = session.post(f"{API}/shifts", json=body, headers=_h(company["access_token"]))
        sid = r.json()["id"]
        session.post(f"{API}/shifts/{sid}/apply", headers=_h(officer["access_token"]))
        rr = session.post(f"{API}/ratings", json={
            "shift_id": sid, "ratee_id": company["user"]["id"],
            "stars": 5, "comment": "great",
        }, headers=_h(officer["access_token"]))
        assert rr.status_code == 200, rr.text

        # Now GET /api/shifts and find this one
        lst = session.get(f"{API}/shifts").json()
        match = [s for s in lst if s["id"] == sid]
        assert match, "shift not in list"
        s = match[0]
        assert s.get("posted_by_rating") is not None
        assert s.get("posted_by_rating_count") is not None
        assert s["posted_by_rating"] == 5.0
        assert s["posted_by_rating_count"] >= 1

    def test_unrated_shift_has_null_rating(self, session):
        # Seeded shifts have posted_by=None → no rating attached
        lst = session.get(f"{API}/shifts").json()
        unrated = [s for s in lst if s.get("posted_by") is None]
        assert unrated, "expected at least one seeded shift"
        assert unrated[0].get("posted_by_rating") is None
