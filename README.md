# FlexOfficers Mobile App

> America's #1 Security Staffing Platform — now in your pocket.

A native React Native (Expo) mobile marketplace connecting verified security officers with companies that need shift coverage. Built as a companion app to [flexofficers.com](https://www.flexofficers.com).

![Stack](https://img.shields.io/badge/Expo-SDK%2054-000020?logo=expo&logoColor=white)
![Stack](https://img.shields.io/badge/React%20Native-0.81-61DAFB?logo=react&logoColor=white)
![Stack](https://img.shields.io/badge/FastAPI-Python%203.11-009688?logo=fastapi&logoColor=white)
![Stack](https://img.shields.io/badge/MongoDB-Motor-47A248?logo=mongodb&logoColor=white)
![Stack](https://img.shields.io/badge/Stripe-Connect-635BFF?logo=stripe&logoColor=white)

---

## Features

### For Officers
- **Browse shifts** sorted by real GPS distance from your location
- **Filter** by status (All / Open / Filling Fast) and city
- **One-tap apply** to any open shift
- **Real-time chat** with the hiring team for each shift you apply to
- **Mark complete → get paid** via Stripe Connect Express (direct bank payout)
- **5-star rating system** — rate companies you've worked for
- **Sign in** with Email, Google, or Apple (iOS)

### For Companies
- **Post shifts** with venue, pay rate, requirements, and officers needed
- **Pay via Stripe Checkout** at posting (escrow-style; funds released on completion)
- **Per-shift chat** with all applicants
- **Rate officers** after they complete a shift
- **Track applicants** in real time on the My Shifts tab

### Platform
- **$5/shift platform fee** built into every checkout
- **Verification badges** — Background Checked, State Licensed, ID Verified, Insured & Bonded
- **Dark "Tactical" theme** matching the FlexOfficers brand

---

## Tech Stack

| Layer | Tech |
|------|------|
| Mobile | Expo SDK 54 + Expo Router, React Native, TypeScript |
| Backend | FastAPI, Motor (async MongoDB), Pydantic v2 |
| Auth | JWT (bcrypt), Emergent-managed Google OAuth, Apple Sign-In |
| Payments | Stripe Checkout + Stripe Connect Express + Transfers |
| Real-time | Native FastAPI WebSockets with in-memory hub |
| Location | `expo-location` + Haversine distance |
| Secure storage | `expo-secure-store` via `@/src/utils/storage` |

---

## Project Structure

```
app/
├── backend/
│   ├── server.py            # All FastAPI routes + WS chat + Stripe + seed
│   ├── requirements.txt
│   └── .env                 # MONGO_URL, DB_NAME, STRIPE_API_KEY, JWT_SECRET
├── frontend/
│   ├── app/                 # Expo Router file-based routes
│   │   ├── _layout.tsx      # Root layout (icon prewarming + AuthProvider)
│   │   ├── index.tsx        # Splash/redirect
│   │   ├── (auth)/          # welcome, login, register
│   │   ├── (tabs)/          # browse, my-shifts, messages, profile
│   │   ├── shift/[id].tsx   # Shift detail + apply + rate + complete
│   │   ├── chat/[id].tsx    # Real-time WebSocket chat
│   │   └── post-shift.tsx   # Company posts a shift + Stripe Checkout
│   ├── src/
│   │   ├── api/client.ts    # Typed REST + WS client
│   │   ├── context/         # AuthContext
│   │   ├── components/      # ShiftCard, StarRating, GoogleSignInButton, AppleSignInButton
│   │   ├── hooks/           # use-user-location, use-google-web-return, use-icon-fonts
│   │   ├── utils/storage/   # Cross-platform secure storage wrapper
│   │   └── theme.ts
│   ├── app.json             # Expo config + permissions
│   └── package.json
└── memory/
    ├── PRD.md               # Full product spec + endpoint reference
    └── test_credentials.md  # Test accounts for QA
```

---

## Local Development

### Prerequisites
- Node.js 20+ and Yarn (Expo prefers Yarn 1.x — version pinned in `package.json`)
- Python 3.11+
- MongoDB running locally (or a connection string)
- Expo Go app on your phone (for device preview)

### Backend
```bash
cd backend
pip install -r requirements.txt
# Configure backend/.env:
#   MONGO_URL="mongodb://localhost:27017"
#   DB_NAME="flexofficers"
#   JWT_SECRET="<long random string>"
#   STRIPE_API_KEY="sk_test_..."   # from https://dashboard.stripe.com/test/apikeys
uvicorn server:app --reload --host 0.0.0.0 --port 8001
```

### Frontend
```bash
cd frontend
yarn install
# Configure frontend/.env:
#   EXPO_PUBLIC_BACKEND_URL=https://your-backend.example.com
yarn start
```

Scan the QR with the Expo Go app, or press `w` for the web preview.

---

## API Reference (summary)

All endpoints are prefixed with `/api`. Full schema in [`memory/PRD.md`](memory/PRD.md).

### Auth
- `POST /auth/register` — email/password signup
- `POST /auth/login` — email/password login
- `POST /auth/google` — exchange Emergent session_token for app JWT
- `POST /auth/apple` — exchange Apple identity_token for app JWT
- `GET  /auth/me` — current user

### Shifts
- `GET  /shifts?status_filter=&city=&lat=&lng=` — geo-sorted list with company ratings attached
- `GET  /shifts/cities` — distinct cities
- `GET  /shifts/{id}` — detail
- `POST /shifts` — create (company)
- `POST /shifts/{id}/apply` — apply (officer)
- `POST /shifts/{id}/checkout` — Stripe Checkout session (company)
- `POST /shifts/{id}/complete` — mark complete + transfer (officer)
- `GET  /shifts/{id}/payment-status` — payment_status (refreshes from Stripe if pending)

### Chat
- `GET  /conversations` — list user's per-shift threads
- `GET  /conversations/{shift_id}/messages` — history
- `POST /conversations/{shift_id}/messages` — send (REST fallback)
- `WS   /ws/chat/{shift_id}?token=<jwt>` — real-time bidirectional

### Ratings, Payouts, Profile
- `POST /ratings` — rate company or officer
- `GET  /users/{id}/ratings` — public summary
- `POST /officers/stripe/onboard` — Stripe Connect Express link
- `GET  /officers/stripe/status` — `payouts_enabled` check
- `PATCH /users/me/location` — update location override

### Webhooks
- `POST /webhooks/stripe` — `checkout.session.completed` flips payment_status; `account.updated` refreshes `payouts_enabled`

---

## Stripe Setup

1. Create a [Stripe account](https://dashboard.stripe.com/register) and switch to **Test mode**.
2. Copy your test secret key (`sk_test_...`) into `backend/.env` as `STRIPE_API_KEY`.
3. (Production) Set `STRIPE_WEBHOOK_SECRET` and add your `/api/webhooks/stripe` URL to the Stripe Webhooks dashboard for `checkout.session.completed` and `account.updated`.
4. Enable **Connect** in your Stripe dashboard so officers can onboard Express accounts.

Test card: `4242 4242 4242 4242`, any future expiry, any CVC, any ZIP.

---

## Auth Setup

### JWT (default)
Set a strong `JWT_SECRET` in `backend/.env`. Tokens are valid for 7 days.

### Google (Emergent-managed)
No setup required — works out of the box via Emergent's OAuth proxy.

### Apple (iOS only)
Apple Sign-In works in development builds out of the box on iOS. For App Store submission, configure the **Sign in with Apple** capability in your Apple Developer account and add your team ID + bundle ID to your Expo build profile.

---

## Deployment

The recommended path is via the **Emergent Publish button** (top-right of the workspace):
- **Web preview** — instant deploy of the Expo web build + FastAPI backend
- **iOS / Android binary** — provide your Apple Developer / Google Play credentials and Emergent generates the build

Alternatively, you can deploy backend (any container host: Render, Fly, Railway, etc.) and run `eas build` from `frontend/` for native binaries.

---

## Test Accounts

See [`memory/test_credentials.md`](memory/test_credentials.md). Defaults:

| Role | Email | Password |
|------|-------|----------|
| Officer | `test_officer@example.com` | `test1234` |
| Company | `test_company@example.com` | `test1234` |

---

## Roadmap

- [ ] Real Stripe key swap (placeholder currently in `.env`)
- [ ] Stripe webhook signature verification in production
- [ ] Push notifications (Expo + APNs/FCM)
- [ ] Chat read receipts & typing indicators
- [ ] Officer availability calendar
- [ ] Multi-officer per-shift split payouts (current is equal split)
- [ ] Map view on Browse tab
- [ ] Admin dashboard for FlexOfficers staff

---

## License

Proprietary © FlexOfficers. All rights reserved.

Built with [Emergent](https://emergent.sh) on Expo SDK 54.
