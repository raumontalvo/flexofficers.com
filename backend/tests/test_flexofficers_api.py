"""FlexOfficers backend API tests"""
import os
import uuid
import pytest
import requests

BASE_URL = os.environ.get("EXPO_PUBLIC_BACKEND_URL", "https://flexofficers-mobile.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="module")
def session():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


@pytest.fixture(scope="module")
def officer_creds():
    # Use unique email each run to avoid duplicate conflicts
    suffix = uuid.uuid4().hex[:8]
    return {
        "email": f"TEST_off_{suffix}@example.com",
        "password": "test1234",
        "full_name": "TEST Officer",
        "role": "officer",
    }


@pytest.fixture(scope="module")
def company_creds():
    suffix = uuid.uuid4().hex[:8]
    return {
        "email": f"TEST_co_{suffix}@example.com",
        "password": "test1234",
        "full_name": "TEST Company Owner",
        "role": "company",
        "company_name": "TEST Security Corp",
    }


@pytest.fixture(scope="module")
def officer_auth(session, officer_creds):
    r = session.post(f"{API}/auth/register", json=officer_creds)
    assert r.status_code == 200, r.text
    data = r.json()
    return {"token": data["access_token"], "user": data["user"]}


@pytest.fixture(scope="module")
def company_auth(session, company_creds):
    r = session.post(f"{API}/auth/register", json=company_creds)
    assert r.status_code == 200, r.text
    data = r.json()
    return {"token": data["access_token"], "user": data["user"]}


# -------- Health --------
class TestHealth:
    def test_root(self, session):
        r = session.get(f"{API}/")
        assert r.status_code == 200
        assert "message" in r.json()


# -------- Auth --------
class TestAuth:
    def test_register_officer(self, officer_auth):
        assert officer_auth["token"]
        assert officer_auth["user"]["role"] == "officer"
        assert officer_auth["user"]["verified"]["background"] is True

    def test_register_company(self, company_auth):
        assert company_auth["token"]
        assert company_auth["user"]["role"] == "company"
        assert company_auth["user"]["company_name"] == "TEST Security Corp"

    def test_register_duplicate_rejected(self, session, officer_creds):
        r = session.post(f"{API}/auth/register", json=officer_creds)
        assert r.status_code == 400

    def test_login_success(self, session, officer_creds):
        r = session.post(f"{API}/auth/login", json={
            "email": officer_creds["email"], "password": officer_creds["password"]
        })
        assert r.status_code == 200
        assert r.json()["access_token"]

    def test_login_wrong_password(self, session, officer_creds):
        r = session.post(f"{API}/auth/login", json={
            "email": officer_creds["email"], "password": "wrongpass"
        })
        assert r.status_code == 401

    def test_me_with_token(self, session, officer_auth, officer_creds):
        r = session.get(f"{API}/auth/me", headers={"Authorization": f"Bearer {officer_auth['token']}"})
        assert r.status_code == 200
        assert r.json()["email"] == officer_creds["email"].lower()

    def test_me_without_token(self, session):
        # Use a fresh session to avoid module-level auth header bleed
        r = requests.get(f"{API}/auth/me")
        assert r.status_code == 401


# -------- Shifts --------
class TestShifts:
    def test_list_shifts(self, session):
        r = session.get(f"{API}/shifts")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 10
        first = data[0]
        for k in ["id", "title", "venue", "pay_rate", "status", "city", "state"]:
            assert k in first

    def test_filter_open(self, session):
        r = session.get(f"{API}/shifts", params={"status_filter": "open"})
        assert r.status_code == 200
        for s in r.json():
            assert s["status"] == "open"

    def test_filter_filling_fast(self, session):
        r = session.get(f"{API}/shifts", params={"status_filter": "filling_fast"})
        assert r.status_code == 200
        for s in r.json():
            assert s["status"] == "filling_fast"

    def test_filter_all(self, session):
        r = session.get(f"{API}/shifts", params={"status_filter": "all"})
        assert r.status_code == 200
        assert len(r.json()) >= 10

    def test_get_shift_by_id(self, session):
        listing = session.get(f"{API}/shifts").json()
        shift_id = listing[0]["id"]
        r = session.get(f"{API}/shifts/{shift_id}")
        assert r.status_code == 200
        assert r.json()["id"] == shift_id

    def test_get_shift_not_found(self, session):
        r = session.get(f"{API}/shifts/nonexistent-id-xyz")
        assert r.status_code == 404


# -------- Shift creation / role permission --------
class TestShiftCreation:
    @pytest.fixture(scope="class")
    def created_shift_id(self, session, company_auth):
        body = {
            "title": "TEST_Patrol",
            "venue": "TEST Venue",
            "city": "Miami", "state": "FL",
            "start_time": "2026-06-10T20:00:00",
            "end_time": "2026-06-11T04:00:00",
            "pay_rate": 27.5,
            "officers_needed": 2,
            "description": "TEST shift",
            "requirements": ["Class D"],
        }
        r = session.post(
            f"{API}/shifts",
            json=body,
            headers={"Authorization": f"Bearer {company_auth['token']}"},
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["title"] == "TEST_Patrol"
        assert data["posted_by"] == company_auth["user"]["id"]
        return data["id"]

    def test_company_can_create(self, created_shift_id, session):
        # Verify persisted via GET
        r = session.get(f"{API}/shifts/{created_shift_id}")
        assert r.status_code == 200
        assert r.json()["title"] == "TEST_Patrol"

    def test_officer_cannot_create(self, session, officer_auth):
        body = {
            "title": "Should Fail", "venue": "X", "city": "Miami", "state": "FL",
            "start_time": "2026-06-10T20:00:00", "end_time": "2026-06-11T04:00:00",
            "pay_rate": 20.0, "officers_needed": 1, "description": "", "requirements": [],
        }
        r = session.post(
            f"{API}/shifts", json=body,
            headers={"Authorization": f"Bearer {officer_auth['token']}"},
        )
        assert r.status_code == 403

    def test_shifts_mine_company(self, session, company_auth, created_shift_id):
        r = session.get(
            f"{API}/shifts/mine",
            headers={"Authorization": f"Bearer {company_auth['token']}"},
        )
        assert r.status_code == 200
        ids = [s["id"] for s in r.json()]
        assert created_shift_id in ids


# -------- Apply --------
class TestApply:
    def test_officer_apply(self, session, officer_auth):
        listing = session.get(f"{API}/shifts").json()
        shift_id = listing[0]["id"]
        headers = {"Authorization": f"Bearer {officer_auth['token']}"}
        r = session.post(f"{API}/shifts/{shift_id}/apply", headers=headers)
        assert r.status_code == 200
        assert r.json()["ok"] is True

        # Idempotent
        r2 = session.post(f"{API}/shifts/{shift_id}/apply", headers=headers)
        assert r2.status_code == 200
        assert r2.json()["already_applied"] is True

    def test_company_cannot_apply(self, session, company_auth):
        listing = session.get(f"{API}/shifts").json()
        shift_id = listing[0]["id"]
        r = session.post(
            f"{API}/shifts/{shift_id}/apply",
            headers={"Authorization": f"Bearer {company_auth['token']}"},
        )
        assert r.status_code == 403

    def test_applications_me(self, session, officer_auth):
        r = session.get(
            f"{API}/applications/me",
            headers={"Authorization": f"Bearer {officer_auth['token']}"},
        )
        assert r.status_code == 200
        assert isinstance(r.json(), list)
        assert len(r.json()) >= 1


# -------- Messages --------
class TestMessages:
    def test_messages_requires_auth(self, session):
        r = requests.get(f"{API}/messages")
        assert r.status_code == 401

    def test_messages_returns_stub(self, session, officer_auth):
        r = session.get(
            f"{API}/messages",
            headers={"Authorization": f"Bearer {officer_auth['token']}"},
        )
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 1
        assert "name" in data[0] and "last_message" in data[0]
