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

## Known Limitations / Future Work
- Messages tab is stubbed (no real-time chat)
- No payment integration yet (pay rate display only)
- No location selector — defaults to Miami, FL
- No push notifications
- No officer ratings/reviews
