from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Header
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import math
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timedelta, timezone
import bcrypt
import httpx
from jose import jwt, JWTError


# Configure logging early so it's available during startup/seed
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# JWT config
JWT_SECRET = os.environ.get('JWT_SECRET', 'flexofficers-dev-secret-key-change-in-prod-9f8a7c6d5e4b')
JWT_ALGORITHM = 'HS256'
JWT_EXPIRE_MINUTES = 60 * 24 * 7  # 7 days

app = FastAPI(title="FlexOfficers API")
api_router = APIRouter(prefix="/api")

security = HTTPBearer(auto_error=False)

# ============== MODELS ==============

Role = Literal["officer", "company"]


class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    full_name: str
    role: Role
    company_name: Optional[str] = None


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserOut(BaseModel):
    id: str
    email: EmailStr
    full_name: str
    role: Role
    company_name: Optional[str] = None
    location: Optional[str] = "Miami, FL"
    verified: dict = Field(default_factory=lambda: {
        "background": True,
        "licensed": True,
        "id_verified": True,
        "insured": True,
    })


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class ShiftCreate(BaseModel):
    title: str
    venue: str
    city: str
    state: str
    start_time: str  # ISO datetime
    end_time: str
    pay_rate: float
    officers_needed: int = 1
    description: str = ""
    requirements: List[str] = Field(default_factory=list)


class Shift(BaseModel):
    id: str
    title: str
    venue: str
    city: str
    state: str
    start_time: str
    end_time: str
    pay_rate: float
    officers_needed: int
    description: str
    requirements: List[str]
    status: str = "open"  # open | filling_fast | closed
    distance_mi: float = 2.4
    posted_by: Optional[str] = None
    posted_by_company: Optional[str] = None
    applicants: List[str] = Field(default_factory=list)
    created_at: str
    lat: Optional[float] = None
    lng: Optional[float] = None


class ApplyRequest(BaseModel):
    pass


class GoogleSessionRequest(BaseModel):
    session_token: str
    role: Optional[Role] = "officer"  # default role when creating new account via Google


class RatingCreate(BaseModel):
    shift_id: str
    ratee_id: str  # user being rated
    stars: int = Field(ge=1, le=5)
    comment: Optional[str] = ""


class Rating(BaseModel):
    id: str
    shift_id: str
    rater_id: str
    ratee_id: str
    stars: int
    comment: str
    created_at: str


class RatingsSummary(BaseModel):
    user_id: str
    average: float
    count: int
    ratings: List[Rating] = Field(default_factory=list)


# ============== AUTH HELPERS ==============

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode('utf-8'), hashed.encode('utf-8'))
    except Exception:
        return False


def create_access_token(user_id: str, email: str, role: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRE_MINUTES)
    payload = {"sub": user_id, "email": email, "role": role, "exp": expire}
    return jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security),
) -> dict:
    if not credentials:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(credentials.credentials, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
    user = await db.users.find_one({"id": user_id}, {"_id": 0, "hashed_password": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user


def user_doc_to_out(doc: dict) -> UserOut:
    return UserOut(
        id=doc["id"],
        email=doc["email"],
        full_name=doc["full_name"],
        role=doc["role"],
        company_name=doc.get("company_name"),
        location=doc.get("location", "Miami, FL"),
        verified=doc.get("verified", {
            "background": True, "licensed": True, "id_verified": True, "insured": True,
        }),
    )


# ============== AUTH ROUTES ==============

@api_router.post("/auth/register", response_model=TokenResponse)
async def register(body: UserRegister):
    existing = await db.users.find_one({"email": body.email.lower()})
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    user_id = str(uuid.uuid4())
    user_doc = {
        "id": user_id,
        "email": body.email.lower(),
        "hashed_password": hash_password(body.password),
        "full_name": body.full_name,
        "role": body.role,
        "company_name": body.company_name,
        "location": "Miami, FL",
        "verified": {"background": True, "licensed": True, "id_verified": True, "insured": True},
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(user_doc)
    token = create_access_token(user_id, body.email.lower(), body.role)
    return TokenResponse(access_token=token, user=user_doc_to_out(user_doc))


@api_router.post("/auth/login", response_model=TokenResponse)
async def login(body: UserLogin):
    user = await db.users.find_one({"email": body.email.lower()})
    if not user or not verify_password(body.password, user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    token = create_access_token(user["id"], user["email"], user["role"])
    return TokenResponse(access_token=token, user=user_doc_to_out(user))


@api_router.get("/auth/me", response_model=UserOut)
async def me(current_user: dict = Depends(get_current_user)):
    return user_doc_to_out(current_user)


@api_router.post("/auth/logout")
async def logout(current_user: dict = Depends(get_current_user)):
    return {"ok": True}


# ============== GOOGLE OAUTH (Emergent-managed) ==============

EMERGENT_OAUTH_URL = "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data"


@api_router.post("/auth/google", response_model=TokenResponse)
async def google_auth(body: GoogleSessionRequest):
    """Exchange Emergent session_token for FlexOfficers JWT. Upserts user by email."""
    try:
        async with httpx.AsyncClient(timeout=10.0) as http:
            resp = await http.get(
                EMERGENT_OAUTH_URL,
                headers={"X-Session-ID": body.session_token},
            )
        if resp.status_code != 200:
            raise HTTPException(status_code=401, detail="Invalid Google session")
        data = resp.json()
    except httpx.HTTPError as e:
        raise HTTPException(status_code=502, detail=f"OAuth provider error: {e}")

    email = (data.get("email") or "").lower()
    if not email:
        raise HTTPException(status_code=400, detail="No email returned from Google")

    existing = await db.users.find_one({"email": email})
    if existing:
        token = create_access_token(existing["id"], existing["email"], existing["role"])
        return TokenResponse(access_token=token, user=user_doc_to_out(existing))

    # Create new user via Google
    user_id = str(uuid.uuid4())
    role = body.role or "officer"
    user_doc = {
        "id": user_id,
        "email": email,
        "hashed_password": "",  # Google-only account
        "full_name": data.get("name") or email.split("@")[0],
        "role": role,
        "company_name": None,
        "location": "Miami, FL",
        "picture": data.get("picture"),
        "auth_provider": "google",
        "verified": {"background": True, "licensed": True, "id_verified": True, "insured": True},
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.users.insert_one(user_doc)
    token = create_access_token(user_id, email, role)
    return TokenResponse(access_token=token, user=user_doc_to_out(user_doc))


# ============== SHIFTS ==============

VENUE_COORDS = {
    "Hard Rock Stadium": (25.9580, -80.2389),
    "Downtown Miami Conference Center": (25.7740, -80.1918),
    "Aventura Mall": (25.9569, -80.1430),
    "Miami General Hospital": (25.7900, -80.2100),
    "Brickell Heights Project": (25.7616, -80.1917),
    "Kaseya Center": (25.7814, -80.1870),
    "LIV Nightclub": (25.8198, -80.1228),
    "Miami International Airport": (25.7959, -80.2870),
    "Doral Distribution Hub": (25.8195, -80.3553),
    "Star Island Residence": (25.7783, -80.1547),
}


def haversine_miles(lat1: float, lng1: float, lat2: float, lng2: float) -> float:
    R = 3958.8  # miles
    p1 = math.radians(lat1)
    p2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dl = math.radians(lng2 - lng1)
    a = math.sin(dphi / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * R * math.asin(math.sqrt(a))


@api_router.get("/shifts", response_model=List[Shift])
async def list_shifts(
    city: Optional[str] = None,
    status_filter: Optional[str] = None,
    lat: Optional[float] = None,
    lng: Optional[float] = None,
):
    query: dict = {}
    if city and city != "All Cities":
        query["city"] = city
    if status_filter and status_filter != "all":
        query["status"] = status_filter
    docs = await db.shifts.find(query, {"_id": 0}).sort("created_at", -1).to_list(200)
    if lat is not None and lng is not None:
        for d in docs:
            if d.get("lat") is not None and d.get("lng") is not None:
                d["distance_mi"] = round(haversine_miles(lat, lng, d["lat"], d["lng"]), 1)
        docs.sort(key=lambda d: d["distance_mi"] if d.get("distance_mi") is not None else 9999)
    return [Shift(**d) for d in docs]


@api_router.get("/shifts/cities", response_model=List[str])
async def list_cities():
    cities = await db.shifts.distinct("city")
    return ["All Cities"] + sorted([c for c in cities if c])


@api_router.get("/shifts/mine", response_model=List[Shift])
async def my_posted_shifts(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "company":
        return []
    docs = await db.shifts.find({"posted_by": current_user["id"]}, {"_id": 0}).sort("created_at", -1).to_list(200)
    return [Shift(**d) for d in docs]


@api_router.get("/shifts/{shift_id}", response_model=Shift)
async def get_shift(shift_id: str):
    doc = await db.shifts.find_one({"id": shift_id}, {"_id": 0})
    if not doc:
        raise HTTPException(status_code=404, detail="Shift not found")
    return Shift(**doc)


@api_router.post("/shifts", response_model=Shift)
async def create_shift(body: ShiftCreate, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "company":
        raise HTTPException(status_code=403, detail="Only companies can post shifts")
    shift_id = str(uuid.uuid4())
    doc = {
        "id": shift_id,
        **body.dict(),
        "status": "open",
        "distance_mi": 2.4,
        "posted_by": current_user["id"],
        "posted_by_company": current_user.get("company_name") or current_user["full_name"],
        "applicants": [],
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.shifts.insert_one(doc)
    doc.pop("_id", None)
    return Shift(**doc)


@api_router.post("/shifts/{shift_id}/apply")
async def apply_to_shift(shift_id: str, current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "officer":
        raise HTTPException(status_code=403, detail="Only officers can apply to shifts")
    shift = await db.shifts.find_one({"id": shift_id})
    if not shift:
        raise HTTPException(status_code=404, detail="Shift not found")
    if current_user["id"] in shift.get("applicants", []):
        return {"ok": True, "already_applied": True}
    await db.shifts.update_one(
        {"id": shift_id},
        {"$addToSet": {"applicants": current_user["id"]}},
    )
    # Save to applications collection too
    await db.applications.insert_one({
        "id": str(uuid.uuid4()),
        "shift_id": shift_id,
        "officer_id": current_user["id"],
        "status": "applied",
        "applied_at": datetime.now(timezone.utc).isoformat(),
    })
    return {"ok": True, "already_applied": False}


@api_router.get("/applications/me", response_model=List[Shift])
async def my_applications(current_user: dict = Depends(get_current_user)):
    if current_user["role"] != "officer":
        return []
    apps = await db.applications.find({"officer_id": current_user["id"]}, {"_id": 0}).to_list(200)
    shift_ids = [a["shift_id"] for a in apps]
    if not shift_ids:
        return []
    docs = await db.shifts.find({"id": {"$in": shift_ids}}, {"_id": 0}).to_list(200)
    return [Shift(**d) for d in docs]


# ============== RATINGS ==============

@api_router.post("/ratings", response_model=Rating)
async def create_rating(body: RatingCreate, current_user: dict = Depends(get_current_user)):
    # Verify shift exists and current user was associated with it
    shift = await db.shifts.find_one({"id": body.shift_id}, {"_id": 0})
    if not shift:
        raise HTTPException(status_code=404, detail="Shift not found")

    me_id = current_user["id"]
    role = current_user["role"]

    # Authorization rules:
    # - Officer can rate the company that posted the shift (if officer applied to shift)
    # - Company that posted can rate any officer that applied
    if role == "officer":
        if me_id not in shift.get("applicants", []):
            raise HTTPException(status_code=403, detail="You must apply to a shift before rating it")
        if shift.get("posted_by") != body.ratee_id:
            raise HTTPException(status_code=400, detail="Officer can only rate the posting company")
    elif role == "company":
        if shift.get("posted_by") != me_id:
            raise HTTPException(status_code=403, detail="You can only rate shifts you posted")
        if body.ratee_id not in shift.get("applicants", []):
            raise HTTPException(status_code=400, detail="Ratee must be an applicant on this shift")
    else:
        raise HTTPException(status_code=403, detail="Unknown role")

    # Prevent duplicate (rater, ratee, shift) ratings
    existing = await db.ratings.find_one({
        "shift_id": body.shift_id,
        "rater_id": me_id,
        "ratee_id": body.ratee_id,
    })
    if existing:
        raise HTTPException(status_code=400, detail="You've already rated this user for this shift")

    doc = {
        "id": str(uuid.uuid4()),
        "shift_id": body.shift_id,
        "rater_id": me_id,
        "ratee_id": body.ratee_id,
        "stars": body.stars,
        "comment": body.comment or "",
        "created_at": datetime.now(timezone.utc).isoformat(),
    }
    await db.ratings.insert_one(doc)
    doc.pop("_id", None)
    return Rating(**doc)


@api_router.get("/users/{user_id}/ratings", response_model=RatingsSummary)
async def get_user_ratings(user_id: str):
    docs = await db.ratings.find({"ratee_id": user_id}, {"_id": 0}).sort("created_at", -1).to_list(200)
    if not docs:
        return RatingsSummary(user_id=user_id, average=0.0, count=0, ratings=[])
    total = sum(d["stars"] for d in docs)
    avg = round(total / len(docs), 2)
    return RatingsSummary(
        user_id=user_id,
        average=avg,
        count=len(docs),
        ratings=[Rating(**d) for d in docs],
    )


# ============== MESSAGES (stub) ==============

@api_router.get("/messages")
async def list_messages(current_user: dict = Depends(get_current_user)):
    # Static stub conversations for MVP
    return [
        {
            "id": "m1",
            "name": "Dispatch — Hard Rock Stadium",
            "last_message": "Your shift is confirmed for Friday 8 PM.",
            "time": "2m ago",
            "unread": 2,
        },
        {
            "id": "m2",
            "name": "FlexOfficers Support",
            "last_message": "Welcome to FlexOfficers! Tap here to start.",
            "time": "1h ago",
            "unread": 0,
        },
        {
            "id": "m3",
            "name": "Site Lead — Downtown Miami",
            "last_message": "Briefing starts 30 min before shift.",
            "time": "Yesterday",
            "unread": 0,
        },
    ]


# ============== HEALTH ==============

@api_router.get("/")
async def root():
    return {"message": "FlexOfficers API"}


# ============== SEED DATA ==============

SEED_SHIFTS = [
    {
        "title": "Concert Security",
        "venue": "Hard Rock Stadium",
        "city": "Miami Gardens", "state": "FL",
        "start_time": "2026-05-24T20:00:00",
        "end_time": "2026-05-25T04:00:00",
        "pay_rate": 28.0, "officers_needed": 3,
        "description": "Provide perimeter security and crowd management for a major concert event. Coordinate with stadium staff and respond to incidents.",
        "requirements": ["Security License (Class D)", "2+ years experience", "Background check"],
        "status": "open", "distance_mi": 2.4,
    },
    {
        "title": "Corporate Event",
        "venue": "Downtown Miami Conference Center",
        "city": "Miami", "state": "FL",
        "start_time": "2026-05-25T18:00:00",
        "end_time": "2026-05-26T00:00:00",
        "pay_rate": 24.0, "officers_needed": 2,
        "description": "Executive protection and access control for a private corporate gala.",
        "requirements": ["Suit/formal attire", "Class D license", "Customer service"],
        "status": "filling_fast", "distance_mi": 3.1,
    },
    {
        "title": "Retail Loss Prevention",
        "venue": "Aventura Mall",
        "city": "Aventura", "state": "FL",
        "start_time": "2026-05-26T10:00:00",
        "end_time": "2026-05-26T18:00:00",
        "pay_rate": 22.0, "officers_needed": 1,
        "description": "Monitor retail floor, deter theft, assist store managers.",
        "requirements": ["Class D license", "Plain clothes", "Reporting skills"],
        "status": "open", "distance_mi": 5.6,
    },
    {
        "title": "Hospital Overnight",
        "venue": "Miami General Hospital",
        "city": "Miami", "state": "FL",
        "start_time": "2026-05-27T22:00:00",
        "end_time": "2026-05-28T06:00:00",
        "pay_rate": 26.0, "officers_needed": 2,
        "description": "Maintain ER lobby security overnight, control visitor access.",
        "requirements": ["Class D license", "De-escalation training"],
        "status": "open", "distance_mi": 4.2,
    },
    {
        "title": "Construction Site Patrol",
        "venue": "Brickell Heights Project",
        "city": "Miami", "state": "FL",
        "start_time": "2026-05-28T19:00:00",
        "end_time": "2026-05-29T07:00:00",
        "pay_rate": 21.0, "officers_needed": 2,
        "description": "Roving patrol of active construction site, deter trespassers.",
        "requirements": ["Class D license", "Flashlight", "Comfortable outdoors"],
        "status": "filling_fast", "distance_mi": 1.8,
    },
    {
        "title": "Sports Arena Gate",
        "venue": "Kaseya Center",
        "city": "Miami", "state": "FL",
        "start_time": "2026-05-29T17:00:00",
        "end_time": "2026-05-30T01:00:00",
        "pay_rate": 25.0, "officers_needed": 4,
        "description": "Gate check & bag screening for NBA game.",
        "requirements": ["Class D license", "Bag screening experience"],
        "status": "open", "distance_mi": 2.9,
    },
    {
        "title": "Nightclub Door Security",
        "venue": "LIV Nightclub",
        "city": "Miami Beach", "state": "FL",
        "start_time": "2026-05-30T22:00:00",
        "end_time": "2026-05-31T05:00:00",
        "pay_rate": 30.0, "officers_needed": 3,
        "description": "ID verification, capacity control, de-escalation at upscale nightclub.",
        "requirements": ["Class D license", "21+ years old", "Door experience"],
        "status": "open", "distance_mi": 6.4,
    },
    {
        "title": "Airport VIP Escort",
        "venue": "Miami International Airport",
        "city": "Miami", "state": "FL",
        "start_time": "2026-05-31T08:00:00",
        "end_time": "2026-05-31T14:00:00",
        "pay_rate": 35.0, "officers_needed": 1,
        "description": "Discreet VIP arrival escort from gate to ground transport.",
        "requirements": ["Class G license", "Executive protection cert"],
        "status": "filling_fast", "distance_mi": 7.1,
    },
    {
        "title": "Warehouse Overnight",
        "venue": "Doral Distribution Hub",
        "city": "Doral", "state": "FL",
        "start_time": "2026-06-01T20:00:00",
        "end_time": "2026-06-02T06:00:00",
        "pay_rate": 20.0, "officers_needed": 1,
        "description": "Static post, monitor CCTV and gate.",
        "requirements": ["Class D license"],
        "status": "open", "distance_mi": 8.3,
    },
    {
        "title": "Private Estate Detail",
        "venue": "Star Island Residence",
        "city": "Miami Beach", "state": "FL",
        "start_time": "2026-06-02T12:00:00",
        "end_time": "2026-06-03T00:00:00",
        "pay_rate": 32.0, "officers_needed": 2,
        "description": "Residential perimeter and visitor management for high-net-worth client.",
        "requirements": ["Class D license", "Discretion", "Clean record"],
        "status": "open", "distance_mi": 5.8,
    },
]


async def seed_data():
    count = await db.shifts.count_documents({})
    if count > 0:
        return
    logger.info(f"Seeding {len(SEED_SHIFTS)} shifts...")
    now = datetime.now(timezone.utc).isoformat()
    docs = []
    for s in SEED_SHIFTS:
        coords = VENUE_COORDS.get(s["venue"], (None, None))
        docs.append({
            "id": str(uuid.uuid4()),
            **s,
            "description": s["description"],
            "requirements": s["requirements"],
            "posted_by": None,
            "posted_by_company": "FlexOfficers Network",
            "applicants": [],
            "lat": coords[0],
            "lng": coords[1],
            "created_at": now,
        })
    await db.shifts.insert_many(docs)
    logger.info("Seed complete.")


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.ratings.create_index([("ratee_id", 1)])
    await db.ratings.create_index([("shift_id", 1), ("rater_id", 1), ("ratee_id", 1)], unique=True)
    await seed_data()
    # Backfill lat/lng on existing shifts (idempotent)
    cursor = db.shifts.find({"$or": [{"lat": {"$exists": False}}, {"lat": None}]}, {"_id": 0, "id": 1, "venue": 1})
    async for doc in cursor:
        coords = VENUE_COORDS.get(doc.get("venue"))
        if coords:
            await db.shifts.update_one({"id": doc["id"]}, {"$set": {"lat": coords[0], "lng": coords[1]}})


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
