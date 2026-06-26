# TASKS

# FlexOfficers

Version: 1.0.0

Status: MVP Realignment — Phase 1 (Documentation)

---

# Project Goal

Build Version 1.0 of the FlexOfficers marketplace:

1. Companies post shifts.
2. Officers apply for shifts.
3. Companies review profiles and accept or reject applicants.
4. Accepted officers receive company contact details.
5. Shifts are successfully filled.

See `MVP.md` for the locked scope.

---

# Phase 1 — Documentation & Safe Removal Plan

## Documentation

* [x] MVP.md — locked to Version 1.0 vision
* [x] TASKS.md — updated to reflect new scope
* [x] REMOVAL-CHECKLIST.md — out-of-scope removal plan (do not delete blindly)

## Safe Removal (next step — see REMOVAL-CHECKLIST.md)

* [ ] Remove license document upload system (API, storage, UI)
* [ ] Remove admin license verification
* [ ] Remove admin company verification
* [ ] Remove in-app notifications (pages, APIs, dashboard links)
* [ ] Remove email notifications (Resend integration)
* [ ] Verify core marketplace loop still works after each removal batch

---

# Phase 2 — Core Marketplace (Keep — Already Built)

These features are **in scope** and must not be removed.

## Authentication

* [x] Clerk installed
* [x] Sign in / sign up pages
* [x] Route protection (`proxy.ts`)
* [x] Officer, company, and admin roles
* [x] Onboarding role selection
* [ ] Manual auth flow validation (officer + company register/login/logout)

## Database & Models

* [x] PostgreSQL + Prisma connected
* [x] User, Officer, Company, Shift, Application models
* [x] Migrations generated and applied
* [ ] Reshape schema for Version 1.0 profile and shift fields (see Phase 3)

## Shift Management

* [x] Create shift
* [x] Edit shift
* [x] Cancel shift
* [x] Browse shift listings
* [x] Shift details page
* [ ] Rename/replace `requiredLicense` → `specialRequirements`
* [ ] Add `reportingInstructions` field

## Applications

* [x] Apply button
* [x] Create application record
* [x] Prevent duplicate applications
* [x] Pending / accepted / rejected statuses
* [x] Company view applicants
* [x] Company accept / reject
* [x] Shift status updates to FILLED on accept
* [ ] Withdraw application (WITHDRAWN status)
* [ ] Reveal company contact details to officer on acceptance

---

# Phase 3 — Profile Realignment (Version 1.0 Fields)

## Officer Profile

* [x] Create profile page (needs reshape)
* [x] Edit profile page (needs reshape)
* [x] Save profile data (needs reshape)
* [ ] Profile photo
* [ ] Armed / unarmed
* [ ] License expiration date (single field — no upload)
* [ ] Availability
* [ ] Certifications
* [ ] Experience categories (multi-select)
* [ ] Short introduction (max 300 characters)
* [ ] Remove multi-license records and document upload UI

## Company Profile

* [x] Create company profile (needs reshape)
* [x] Edit company profile (needs reshape)
* [ ] Address field (replace city/state split)
* [ ] Email on profile
* [ ] Optional company logo
* [ ] Remove company license fields and verification requirements

---

# Phase 4 — Officer Experience

* [x] Available shifts (`/shifts`)
* [x] My applications (`/officer/applications`)
* [ ] Accepted shifts view (with company contact + reporting instructions)
* [ ] Separate applied vs accepted sections on dashboard

---

# Phase 5 — Company Officer Search

* [ ] Officer search page for companies
* [ ] Filter by city
* [ ] Filter by armed / unarmed
* [ ] Filter by years of experience
* [ ] Filter by certifications
* [ ] Filter by availability
* [ ] Filter by experience categories

---

# Phase 6 — UI Foundation

* [x] Home page with nav and footer
* [x] Sign in / sign up pages
* [x] Role-based dashboard
* [ ] Shared nav/footer on authenticated pages
* [ ] Privacy, Terms, Contact pages (home footer links are placeholders)

---

# Phase 7 — Subscription (Revenue)

* [ ] Annual subscription model for companies
* [ ] Payment integration (e.g. Stripe)
* [ ] Gate shift posting behind active subscription
* [ ] Officers remain free

---

# Phase 8 — Testing & Deployment

## Unit Tests

* [x] Validation and business-rule unit tests (12 files)
* [ ] Update tests after out-of-scope removal
* [ ] Add tests for Version 1.0 profile validation

## Manual / E2E

* [ ] Full marketplace happy path (post → apply → accept → contact reveal)
* [ ] Officer profile save with new fields
* [ ] Company officer search filters

## Production

* [ ] Deploy to Vercel
* [ ] Configure production database
* [ ] Configure production environment variables (Clerk only — no storage/email)
* [ ] Final launch validation

---

# Explicitly Out of Scope (Do Not Build)

* Messaging
* SMS
* Push notifications
* In-app notifications
* Email notifications
* AI matching
* GPS tracking
* Payroll
* Time clock
* Resume upload
* License upload
* Background checks
* Admin license verification
* Admin company verification
* Ratings
* Reviews
* Mobile apps

Removal tracking: `REMOVAL-CHECKLIST.md`

---

# MVP Completion Criteria

Version 1.0 is complete when:

* [ ] Companies can subscribe and post shifts
* [ ] Officers can create Version 1.0 profiles and apply
* [ ] Companies can search/filter officers and accept applicants
* [ ] Accepted officers see company contact details and reporting instructions
* [ ] Shifts can be successfully filled
* [ ] Out-of-scope features are removed
* [ ] Application is deployed to production

---

# North Star Metric

Filled Shifts

Every completed task should move the platform closer to helping companies fill open shifts with licensed security officers.
