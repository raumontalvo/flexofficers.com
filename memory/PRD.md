# FlexOfficers Mobile App — PRD

## Overview
A native React Native (Expo) mobile app for FlexOfficers — a security staffing platform connecting verified officers with companies needing shift coverage. Inspired by www.flexofficers.com.

## Stack
- **Frontend:** Expo (SDK 54), Expo Router, React Native, TypeScript
- **Backend:** FastAPI + Motor (MongoDB async)
- **Auth:** JWT (email/password), bcrypt password hashing
- **Storage:** MongoDB with UUID-based ids
- **Secure token storage:** `expo-secure-store` via `@/src/utils/storage`

## Roles
1. **Officer** — browse and apply to shifts.
2. **Company** — post shifts and view applicants.

## Screens
- **Welcome** (`/(auth)/welcome`) — role selection landing
- **Login** (`/(auth)/login`)
- **Register** (`/(auth)/register`) — supports both roles
- **Browse** (`/(tabs)`) — Available shifts feed with filter chips (All / Open / Filling Fast)
- **My Shifts** (`/(tabs)/my-shifts`) — applications (officer) or posted shifts (company)
- **Messages** (`/(tabs)/messages`) — conversation list (stubbed)
- **Profile** (`/(tabs)/profile`) — verification badges, account info, logout
- **Shift Detail** (`/shift/[id]`) — full description, requirements, apply button
- **Post Shift** (`/post-shift`) — company-only form

## API Endpoints
- `POST /api/auth/register` — create account, returns JWT + user
- `POST /api/auth/login` — login, returns JWT + user
- `GET  /api/auth/me` — current user (auth)
- `POST /api/auth/logout` — stateless logout (auth)
- `GET  /api/shifts?status_filter=...` — list shifts
- `GET  /api/shifts/{id}` — get one shift
- `POST /api/shifts` — create shift (company, auth)
- `POST /api/shifts/{id}/apply` — apply to shift (officer, auth)
- `GET  /api/applications/me` — officer's applied shifts (auth)
- `GET  /api/shifts/mine` — company's posted shifts (auth)
- `GET  /api/messages` — conversation list (stubbed, auth)

## Seed Data
10 shifts across Miami area on startup if shifts collection is empty.

## Design
- Dark navy theme (`#0A0E1A` background, `#111827` surface)
- Brand blue `#2C7BFF`, neon green `#10B981`
- Inspired by FlexOfficers website reference screenshot
- Shield logo, "America's #1 Security Staffing Platform" tagline

## Phase 1 Additions (Feb 2026)
- **Emergent Google sign-in** — `POST /api/auth/google` exchanges session_token for app JWT; UI button on Welcome + Login screens
- **Geo-based distance sorting** — `GET /api/shifts?lat=&lng=` returns shifts sorted by Haversine distance; Browse screen auto-requests location on mount
- **City/state location selector** — `GET /api/shifts/cities` lists available cities; Browse header opens a bottom-sheet modal to switch
- **Officer/Company ratings** — `POST /api/ratings`, `GET /api/users/{id}/ratings`; star UI on shift detail (officer rates company after applying) and rating pill on profile

## API Endpoints (Phase 1 additions)
- `POST /api/auth/google` — exchange Emergent session_token for JWT
- `GET  /api/shifts/cities` — distinct city list with "All Cities" prefix
- `GET  /api/shifts?lat=&lng=&city=&status_filter=` — geo distance, city filter
- `POST /api/ratings` — create rating (auth, role-aware)
- `GET  /api/users/{user_id}/ratings` — public ratings summary + list

## Phase 2 Additions (Feb 2026)
- **Real-time WebSocket chat** — `WS /api/ws/chat/{shift_id}?token=` with JWT-via-query authentication. Per-shift conversation threads accessible to the poster + all applicants. Falls back to REST `POST /api/conversations/{shift_id}/messages` if WS not connected. New screens: `/(tabs)/messages` (conversation list) and `/chat/[id]` (chat bubbles).
- **Stripe Connect + Checkout (escrow + $5 platform fee)** — Companies pay via Stripe Checkout at shift post (`POST /api/shifts/{id}/checkout`), funds held until officer marks shift complete (`POST /api/shifts/{id}/complete`) which triggers `stripe.Transfer.create()` to the officer's Connect Express account. Officers onboard via `POST /api/officers/stripe/onboard` returning an AccountLink URL. Webhook handler at `POST /api/webhooks/stripe` updates `payment_status` on `checkout.session.completed` and refreshes `payouts_enabled` on `account.updated`.
- **Company rating stars on Browse cards** — Each shift response now includes aggregated `posted_by_rating` and `posted_by_rating_count` (via mongo aggregation); card replaces distance with rating when available.
- **Native Apple Sign-In (iOS)** — `POST /api/auth/apple` accepts Apple identity_token, decodes `sub` and `email`, upserts user by `apple_sub` or email. Frontend button only renders on iOS via `expo-apple-authentication`.
- **Permanent location override** — `PATCH /api/users/me/location` updates user.location/lat/lng. Profile screen has inline edit with pencil icon.

## Phase 2 API Endpoints
- `GET  /api/conversations` — list user's shift conversations
- `GET  /api/conversations/{shift_id}/messages` — message history (auth, role-aware)
- `POST /api/conversations/{shift_id}/messages` — send message (REST fallback)
- `WS   /api/ws/chat/{shift_id}?token=` — real-time chat
- `POST /api/shifts/{shift_id}/checkout` — Stripe Checkout (company)
- `GET  /api/shifts/{shift_id}/payment-status` — current payment_status, refreshes from Stripe if pending
- `POST /api/officers/stripe/onboard` — Stripe Connect Express onboarding link
- `GET  /api/officers/stripe/status` — payouts_enabled status
- `POST /api/shifts/{shift_id}/complete` — officer marks complete, triggers Transfer
- `POST /api/webhooks/stripe` — Stripe webhook receiver
- `PATCH /api/users/me/location` — update location
- `POST /api/auth/apple` — Apple sign-in

## Stripe Configuration
- `STRIPE_API_KEY` in `/app/backend/.env` — currently `sk_test_emergent` (placeholder). To exercise the live Stripe Checkout / Connect / Transfer flows end-to-end, replace with a real `sk_test_...` key from your Stripe dashboard.
- `STRIPE_WEBHOOK_SECRET` (optional) — set for signed webhook verification in production. In dev, webhook accepts unsigned JSON payloads for testing.
- Platform fee: `$5.00` per shift (constant `PLATFORM_FEE_CENTS=500`)

## Known Limitations / Future Work
- Messages tab is stubbed (no real-time chat)
- No payment integration yet (pay rate display only)
- No location selector — defaults to Miami, FL
- No push notifications
- No officer ratings/reviews
