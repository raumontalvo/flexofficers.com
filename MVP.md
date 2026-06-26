# MVP Definition

# FlexOfficers

Version: 1.0.0

Status: MVP Scope Lock

---

# Purpose

This document defines the exact scope of FlexOfficers Version 1.0.

FlexOfficers is a marketplace that connects security companies with licensed security officers for open shifts.

FlexOfficers is **not** responsible for verifying licenses, conducting background checks, hiring employees, payroll, messaging, GPS tracking, or time clocks.

The hiring company is responsible for verifying credentials before accepting an officer.

Every feature must support this objective:

> Help security companies fill shifts faster, or help FlexOfficers generate subscription revenue.

If the answer is no, it does not belong in Version 1.0.

---

# MVP Goal

Enable:

1. A security company to post a shift.
2. A security officer to apply.
3. A company to review the officer profile and verify credentials through its own hiring process.
4. A company to accept or reject the application.
5. A shift to be successfully filled.

If these actions work, the MVP is successful.

---

# Business Model

## Security Companies

Annual subscription only.

One subscription includes:

* Unlimited shift postings
* Unlimited officer applications
* Unlimited hires
* Unlimited usage

## Security Officers

Free forever.

Officers can:

* Create a profile
* Browse shifts
* Apply to unlimited shifts
* Track application status
* View accepted shifts

---

# User Roles

## Officer

Can:

* Register
* Login
* Create and edit profile
* Browse shifts
* Apply to shifts
* Track application status
* View accepted shifts and company contact details (after acceptance)

Cannot:

* Upload resumes, license photos, or background documents

---

## Company

Can:

* Register
* Login
* Create and edit company profile
* Post, edit, and cancel shifts
* Browse and filter officer profiles
* Review applicants
* Accept or reject applicants
* Verify officer credentials through its own hiring process

---

# Officer Profile

Fields:

* Profile Photo
* First Name
* Last Name
* Phone Number
* Email
* City
* Armed / Unarmed
* Years of Experience
* License Expiration Date
* Availability
* Certifications
* Experience Categories (multi-select)
* Short Introduction (max 300 characters)

## Experience Categories

Officers may select multiple:

* Apartment Communities
* Gated Communities
* Construction Sites
* Retail
* Shopping Mall
* Hospital
* School
* Hotel
* Event Security
* Bar / Nightclub
* Corporate Office
* Warehouse
* Fire Watch
* Patrol
* Executive Protection
* Loss Prevention

## Not Included on Officer Profile

* Resume upload
* License photo upload
* Background documents

---

# Company Profile

Fields:

* Company Name
* Contact Person
* Phone Number
* Email
* Address
* Website (optional)
* Company Logo (optional)

---

# Shift

Fields:

* Title
* Description
* Hourly Rate
* Date
* Time
* Location
* Officers Needed
* Special Requirements
* Reporting Instructions (shown to accepted officers)

---

# Application Flow

```text
Officer browses shift
        ↓
Officer applies
        ↓
Company reviews officer profile
        ↓
Company verifies credentials (outside FlexOfficers)
        ↓
Company accepts or rejects
        ↓
If accepted, officer sees:
  - Company phone number
  - Contact person
  - Company email
  - Company address
  - Reporting instructions
```

No messaging system.

Application statuses:

```text
PENDING
ACCEPTED
REJECTED
WITHDRAWN
```

---

# Company Search

Companies can filter officers by:

* City
* Armed / Unarmed
* Years of Experience
* Certifications
* Availability
* Experience Categories

---

# MVP Pages

## Public

* Home page (value proposition, sign up, login)

## Officer

* Dashboard
* Profile
* Available shifts
* My applications
* Accepted shifts (with company contact details)

## Company

* Dashboard
* Company profile
* Post shift
* Manage shifts
* Review applicants
* Search / filter officers

---

# Features NOT Included

Do **not** build:

* Messaging
* SMS
* Push notifications
* In-app notifications
* Email notifications
* AI matching
* GPS tracking
* Payroll
* Time clock
* Video uploads
* Resume upload
* License upload
* Background check system
* Admin license verification
* Admin company verification
* Ratings
* Reviews
* Mobile apps

These are future features and are out of scope for Version 1.0.

---

# Technical Requirements

Frontend:

* Next.js
* React
* TypeScript
* Tailwind CSS

Backend:

* Next.js API Routes

Database:

* PostgreSQL

ORM:

* Prisma

Authentication:

* Clerk

Deployment:

* Vercel

---

# Build Order

## Phase 1 — Documentation & Safe Removal Plan

* Lock MVP scope (this document)
* Update task tracker
* Create removal checklist for out-of-scope code
* Remove out-of-scope features without breaking core marketplace loop

## Phase 2 — Schema & Profile Realignment

* Reshape officer, company, and shift models
* Update profile forms to match Version 1.0 fields
* Remove license upload and verification data paths

## Phase 3 — Application & Contact Reveal

* Accepted-shift view for officers
* Reveal company contact details only after acceptance
* Reporting instructions on accepted applications

## Phase 4 — Company Officer Search

* Filter officers by city, armed status, experience, certifications, availability, categories

## Phase 5 — Subscription (Revenue)

* Annual company subscription gate
* Payment integration

## Phase 6 — Launch

* End-to-end manual validation
* Production deployment
* Bug fixes

---

# Scope Lock Rule

Before adding a new feature, ask:

> Does this help security companies fill shifts faster or help FlexOfficers generate revenue?

If the answer is no, do not build it.

Keep the application simple, fast, and inexpensive to operate.

---

# North Star Metric

Filled Shifts

Every decision should improve the platform's ability to connect companies with licensed officers and successfully fill open shifts.
