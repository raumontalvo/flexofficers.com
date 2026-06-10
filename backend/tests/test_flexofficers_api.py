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



# -------- Google Auth (Emergent) --------
class TestGoogleAuth:
    def test_invalid_session_token_returns_401(self, session):
        r = session.post(f"{API}/auth/google", json={"session_token": "definitely-not-a-valid-token", "role": "officer"})
        # 401 expected from upstream; 502 acceptable if provider not reachable
        assert r.status_code in (401, 502), r.text


# -------- Cities --------
class TestCities:
    def test_cities_endpoint(self, session):
        r = session.get(f"{API}/shifts/cities")
        assert r.status_code == 200
        data = r.json()
        assert isinstance(data, list)
        assert len(data) >= 2
        assert data[0] == "All Cities"
        # Remaining must be sorted
        tail = data[1:]
        assert tail == sorted(tail)

    def test_filter_by_city(self, session):
        r = session.get(f"{API}/shifts", params={"city": "Miami"})
        assert r.status_code == 200
        data = r.json()
        assert len(data) >= 1
        for s in data:
            assert s["city"] == "Miami"

    def test_filter_all_cities_returns_all(self, session):
        r = session.get(f"{API}/shifts", params={"city": "All Cities"})
        assert r.status_code == 200
        assert len(r.json()) >= 10


# -------- Geo Distance Sort --------
class TestGeoSort:
    def test_seed_shifts_have_lat_lng(self, session):
        r = session.get(f"{API}/shifts")
        assert r.status_code == 200
        data = r.json()
        # Seeded shifts are FlexOfficers Network (have coords). User-created shifts may not.
        seeded = [s for s in data if s.get("posted_by_company") == "FlexOfficers Network"]
        assert len(seeded) >= 10
        for s in seeded:
            assert s.get("lat") is not None, f"Seed shift missing lat: {s['title']}"
            assert s.get("lng") is not None, f"Seed shift missing lng: {s['title']}"

    def test_geo_sort_ascending(self, session):
        # Brickell coords -> closest seeded venue is Brickell Heights
        r = session.get(f"{API}/shifts", params={"lat": 25.7617, "lng": -80.1918})
        assert r.status_code == 200
        data = r.json()
        # Filter to seeded shifts (others may lack lat/lng)
        with_dist = [s for s in data if s.get("lat") is not None]
        distances = [s["distance_mi"] for s in with_dist]
        assert distances == sorted(distances), f"Distances not ascending: {distances}"
        # Brickell should be #1 amongst seeded
        seed_with_dist = [s for s in with_dist if s.get("posted_by_company") == "FlexOfficers Network"]
        assert seed_with_dist[0]["venue"] == "Brickell Heights Project"


# -------- Ratings --------
class TestRatings:
    @pytest.fixture(scope="class")
    def rating_setup(self, session, officer_auth, company_auth):
        """Company posts a shift; officer applies. Returns (shift_id, officer_user, company_user)."""
        body = {
            "title": "TEST_RatingShift",
            "venue": "TEST Rating Venue",
            "city": "Miami", "state": "FL",
            "start_time": "2026-07-01T20:00:00",
            "end_time": "2026-07-02T04:00:00",
            "pay_rate": 25.0, "officers_needed": 1,
            "description": "for rating tests", "requirements": [],
        }
        r = session.post(
            f"{API}/shifts", json=body,
            headers={"Authorization": f"Bearer {company_auth['token']}"},
        )
        assert r.status_code == 200, r.text
        shift_id = r.json()["id"]

        # Officer applies
        r2 = session.post(
            f"{API}/shifts/{shift_id}/apply",
            headers={"Authorization": f"Bearer {officer_auth['token']}"},
        )
        assert r2.status_code == 200
        return {
            "shift_id": shift_id,
            "officer": officer_auth,
            "company": company_auth,
        }

    def test_officer_rates_company_success(self, session, rating_setup):
        r = session.post(
            f"{API}/ratings",
            json={
                "shift_id": rating_setup["shift_id"],
                "ratee_id": rating_setup["company"]["user"]["id"],
                "stars": 5,
                "comment": "Great gig",
            },
            headers={"Authorization": f"Bearer {rating_setup['officer']['token']}"},
        )
        assert r.status_code == 200, r.text
        data = r.json()
        assert data["stars"] == 5
        assert data["ratee_id"] == rating_setup["company"]["user"]["id"]

    def test_officer_rate_duplicate_rejected(self, session, rating_setup):
        r = session.post(
            f"{API}/ratings",
            json={
                "shift_id": rating_setup["shift_id"],
                "ratee_id": rating_setup["company"]["user"]["id"],
                "stars": 4,
            },
            headers={"Authorization": f"Bearer {rating_setup['officer']['token']}"},
        )
        assert r.status_code == 400

    def test_officer_rate_wrong_ratee_rejected(self, session, rating_setup):
        # Officer tries to rate a different user (not posted_by)
        r = session.post(
            f"{API}/ratings",
            json={
                "shift_id": rating_setup["shift_id"],
                "ratee_id": "some-other-user-id",
                "stars": 5,
            },
            headers={"Authorization": f"Bearer {rating_setup['officer']['token']}"},
        )
        assert r.status_code == 400

    def test_officer_rate_without_applying_rejected(self, session, company_auth):
        # Create a brand new officer who did NOT apply
        suffix = uuid.uuid4().hex[:8]
        reg = session.post(f"{API}/auth/register", json={
            "email": f"TEST_unapplied_{suffix}@example.com",
            "password": "test1234",
            "full_name": "TEST Unapplied",
            "role": "officer",
        })
        assert reg.status_code == 200
        tok = reg.json()["access_token"]

        # Company posts a shift
        body = {
            "title": "TEST_NoApplyShift", "venue": "TEST V", "city": "Miami", "state": "FL",
            "start_time": "2026-07-10T20:00:00", "end_time": "2026-07-11T04:00:00",
            "pay_rate": 22.0, "officers_needed": 1, "description": "", "requirements": [],
        }
        sr = session.post(
            f"{API}/shifts", json=body,
            headers={"Authorization": f"Bearer {company_auth['token']}"},
        )
        assert sr.status_code == 200
        shift_id = sr.json()["id"]

        r = session.post(
            f"{API}/ratings",
            json={"shift_id": shift_id, "ratee_id": company_auth["user"]["id"], "stars": 5},
            headers={"Authorization": f"Bearer {tok}"},
        )
        assert r.status_code == 403

    def test_company_rates_officer_success(self, session, rating_setup):
        r = session.post(
            f"{API}/ratings",
            json={
                "shift_id": rating_setup["shift_id"],
                "ratee_id": rating_setup["officer"]["user"]["id"],
                "stars": 4,
                "comment": "Solid officer",
            },
            headers={"Authorization": f"Bearer {rating_setup['company']['token']}"},
        )
        assert r.status_code == 200
        assert r.json()["stars"] == 4

    def test_company_rate_other_shift_rejected(self, session, company_auth, officer_auth):
        # Another company posts a shift; first company tries to rate
        suffix = uuid.uuid4().hex[:8]
        reg = session.post(f"{API}/auth/register", json={
            "email": f"TEST_co2_{suffix}@example.com",
            "password": "test1234",
            "full_name": "TEST Co2 Owner",
            "role": "company",
            "company_name": "TEST Co2",
        })
        assert reg.status_code == 200
        co2_token = reg.json()["access_token"]

        body = {
            "title": "TEST_Co2Shift", "venue": "TEST V2", "city": "Miami", "state": "FL",
            "start_time": "2026-08-01T20:00:00", "end_time": "2026-08-02T04:00:00",
            "pay_rate": 23.0, "officers_needed": 1, "description": "", "requirements": [],
        }
        sr = session.post(
            f"{API}/shifts", json=body,
            headers={"Authorization": f"Bearer {co2_token}"},
        )
        shift_id = sr.json()["id"]

        # Officer applies to co2 shift
        session.post(
            f"{API}/shifts/{shift_id}/apply",
            headers={"Authorization": f"Bearer {officer_auth['token']}"},
        )

        # First company tries to rate officer on co2's shift
        r = session.post(
            f"{API}/ratings",
            json={
                "shift_id": shift_id,
                "ratee_id": officer_auth["user"]["id"],
                "stars": 3,
            },
            headers={"Authorization": f"Bearer {company_auth['token']}"},
        )
        assert r.status_code == 403

    def test_get_user_ratings(self, session, rating_setup):
        # Company should have 1 rating (the 5-star from officer)
        company_id = rating_setup["company"]["user"]["id"]
        r = session.get(f"{API}/users/{company_id}/ratings")
        assert r.status_code == 200
        data = r.json()
        assert data["user_id"] == company_id
        assert data["count"] >= 1
        assert data["average"] >= 1.0
        assert isinstance(data["ratings"], list)
        assert len(data["ratings"]) == data["count"]

    def test_get_ratings_no_auth_required(self, session, rating_setup):
        # No Authorization header should still work
        company_id = rating_setup["company"]["user"]["id"]
        r = requests.get(f"{API}/users/{company_id}/ratings")
        assert r.status_code == 200

    def test_get_ratings_nonexistent_user(self, session):
        r = session.get(f"{API}/users/nonexistent-user-zzz/ratings")
        assert r.status_code == 200
        data = r.json()
        assert data["count"] == 0
        assert data["average"] == 0
        assert data["ratings"] == []
