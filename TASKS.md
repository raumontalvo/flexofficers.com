# TASKS

# FlexOfficers

Version: 0.1.0

Status: Development Plan

---

# Project Goal

Build a functional MVP that allows:

1. Companies to post shifts.
2. Officers to apply for shifts.
3. Companies to assign officers.
4. Shifts to be filled.

---

# Phase 1 — Project Setup

## Repository Setup

* [ ] Create GitHub repository
* [ ] Create Next.js project
* [ ] Configure TypeScript
* [ ] Configure Tailwind CSS
* [ ] Configure ESLint
* [ ] Configure Prettier
* [ ] Create GitHub project board

---

## Environment Setup

* [ ] Create `.env.local`
* [ ] Configure Clerk
* [ ] Configure PostgreSQL
* [ ] Configure Prisma
* [ ] Configure Vercel deployment

---

## Documentation

* [ ] README.md
* [ ] ROADMAP.md
* [ ] PRD.md
* [ ] DATABASE.md
* [ ] ARCHITECTURE.md
* [ ] USER-STORIES.md
* [ ] MVP.md
* [ ] TASKS.md

---

# Phase 2 — Authentication

## Clerk Setup

* [ ] Install Clerk
* [ ] Configure Sign In
* [ ] Configure Sign Up
* [ ] Configure Middleware
* [ ] Protect Routes

---

## User Roles

* [ ] Officer role
* [ ] Company role
* [ ] Admin role

---

## Authentication Testing

* [ ] Register officer
* [ ] Register company
* [ ] Login flow
* [ ] Logout flow

---

# Phase 3 — Database

## PostgreSQL

* [ ] Create database
* [ ] Connect Prisma

---

## Prisma Schema

### User

* [ ] Create model

### Officer

* [ ] Create model

### Company

* [ ] Create model

### License

* [ ] Create model

### Shift

* [ ] Create model

### Application

* [ ] Create model

---

## Database Migration

* [ ] Generate migration
* [ ] Run migration
* [ ] Verify tables

---

# Phase 4 — UI Foundation

## Layout

* [ ] Navigation
* [ ] Footer
* [ ] Responsive design

---

## Pages

* [ ] Home page
* [ ] Sign In page
* [ ] Sign Up page
* [ ] Dashboard page

---

# Phase 5 — Officer Features

## Officer Profile

* [ ] Create profile page
* [ ] Edit profile page
* [ ] Save profile data

---

## Licenses

* [ ] Add license form
* [ ] Edit license
* [ ] Delete license

---

## Officer Dashboard

* [ ] Available shifts
* [ ] Applied shifts
* [ ] Assigned shifts

---

# Phase 6 — Company Features

## Company Profile

* [ ] Create company profile
* [ ] Edit company profile

---

## Company Dashboard

* [ ] View shifts
* [ ] View applicants
* [ ] View assigned officers

---

# Phase 7 — Shift Management

## Create Shift

* [ ] Shift form
* [ ] Validation
* [ ] Database save

---

## Edit Shift

* [ ] Update shift
* [ ] Save changes

---

## Cancel Shift

* [ ] Cancel action
* [ ] Status update

---

## Browse Shifts

* [ ] Shift listings
* [ ] Shift details page

---

# Phase 8 — Applications

## Apply for Shift

* [ ] Apply button
* [ ] Create application record
* [ ] Prevent duplicate applications

---

## Application Status

* [ ] Pending
* [ ] Accepted
* [ ] Rejected
* [ ] Withdrawn

---

## Company Review

* [ ] View applicants
* [ ] Accept applicant
* [ ] Reject applicant

---

# Phase 9 — Admin

## Admin Dashboard

* [ ] View users
* [ ] View companies
* [ ] View officers
* [ ] View shifts

---

# Phase 10 — Testing

## Authentication

* [ ] Registration test
* [ ] Login test

---

## Officer Workflow

* [ ] Create profile
* [ ] Add license
* [ ] Apply to shift

---

## Company Workflow

* [ ] Create profile
* [ ] Post shift
* [ ] Review applicants
* [ ] Assign officer

---

## Full Marketplace Flow

* [ ] Company posts shift
* [ ] Officer applies
* [ ] Company accepts
* [ ] Shift status updates

---

# Phase 11 — Deployment

## Production

* [ ] Deploy to Vercel
* [ ] Configure production database
* [ ] Configure environment variables

---

## Final Validation

* [ ] Create company account
* [ ] Create officer account
* [ ] Post shift
* [ ] Submit application
* [ ] Accept application

---

# MVP Completion Criteria

The MVP is complete when:

✅ Companies can post shifts

✅ Officers can apply

✅ Companies can assign officers

✅ Shifts can be successfully filled

---

# Post-MVP Backlog

Future Features:

* Messaging
* Notifications
* Ratings
* Reviews
* Payments
* Mobile Apps
* AI Matching
* GPS Tracking
* Payroll
* Background Verification

These features must not be started until the MVP has been validated.

---

# North Star Metric

Filled Shifts

Every completed task should move the platform closer to helping companies fill open shifts with licensed security officers.
