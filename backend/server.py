from fastapi import FastAPI, APIRouter, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, EmailStr
from typing import List, Optional, Literal
import uuid
from datetime import datetime, timedelta, timezone
import bcrypt
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


class ApplyRequest(BaseModel):
    pass


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


# ============== SHIFTS ==============

@api_router.get("/shifts", response_model=List[Shift])
async def list_shifts(city: Optional[str] = None, status_filter: Optional[str] = None):
    query: dict = {}
    if city:
        query["city"] = city
    if status_filter and status_filter != "all":
        query["status"] = status_filter
    docs = await db.shifts.find(query, {"_id": 0}).sort("created_at", -1).to_list(200)
    return [Shift(**d) for d in docs]


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
        docs.append({
            "id": str(uuid.uuid4()),
            **s,
            "description": s["description"],
            "requirements": s["requirements"],
            "posted_by": None,
            "posted_by_company": "FlexOfficers Network",
            "applicants": [],
            "created_at": now,
        })
    await db.shifts.insert_many(docs)
    logger.info("Seed complete.")


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await seed_data()


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
