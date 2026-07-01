# Landing page phone screenshots

Real mobile screenshots from the FlexOfficers app. Replace PNG files here to update the landing hero.

## Paths

### Security Officer (`officer/`)
- `browse-shifts.png` — `/shifts`
- `company-invites.png` — `/officer/invites`
- `accepted-shifts.png` — `/officer/accepted-shifts`
- `profile.png` — `/officer/profile`

### Security Company (`company/`)
- `dashboard.png` — `/dashboard`
- `my-shifts.png` — `/company/shifts`
- `applicants.png` — `/company/applications`
- `staff.png` — `/company/staff`

## Capture (recommended)

1. Start the app: `npm run dev`
2. Run: `npm run capture:landing-screenshots`
3. Sign in as an **officer** when Chrome opens, close the window, then sign in as a **company** when prompted.

Screenshots are saved at iPhone 14 dimensions (390×844 CSS pixels at 2×).

## Config

Screenshot list and carousel timing live in `lib/landing-phone-screenshots.ts`.
