# MVP Definition

# FlexOfficers

Version: 0.1.0

Status: MVP Scope Lock

---

# Purpose

This document defines the exact scope of the first version of FlexOfficers.

The goal is not to build a complete platform.

The goal is to validate whether security companies and security officers will use the marketplace.

Every feature must support this objective.

---

# MVP Goal

Enable:

1. A security company to post a shift.
2. A security officer to apply.
3. A company to assign an officer.
4. A shift to be successfully filled.

If these four actions work, the MVP is successful.

---

# Success Criteria

The MVP is considered validated when:

* At least 5 companies create accounts
* At least 25 officers create accounts
* At least 10 shifts are posted
* At least 10 applications are submitted
* At least 5 shifts are successfully filled

---

# User Roles

## Officer

Can:

* Register
* Login
* Create profile
* Add license information
* Browse shifts
* Apply to shifts
* View application status

---

## Company

Can:

* Register
* Login
* Create company profile
* Post shifts
* Edit shifts
* View applicants
* Accept applicants

---

## Admin

Can:

* View users
* View shifts
* Manage platform records

---

# MVP Features

## Authentication

Included:

* Register
* Login
* Logout
* Session management

Provider:

* Clerk

---

## Officer Profiles

Included:

* Name
* Phone
* City
* State
* Experience
* Bio
* License information

---

## Company Profiles

Included:

* Company name
* Contact name
* Phone
* Website
* Description

---

## Shift Board

Included:

* Create shift
* Edit shift
* Cancel shift
* View open shifts

Shift Information:

* Title
* Description
* Location
* Start time
* End time
* Hourly rate
* Required license

---

## Applications

Included:

* Submit application
* View application status
* Accept application
* Reject application

Statuses:

```text
PENDING
ACCEPTED
REJECTED
WITHDRAWN
```

---

# MVP Pages

## Public

### Home Page

Purpose:

Explain platform value.

Actions:

* Sign Up
* Login

---

## Officer Pages

### Officer Dashboard

Displays:

* Available shifts
* Applied shifts
* Assigned shifts

---

### Officer Profile

Displays:

* Personal information
* License information

---

## Company Pages

### Company Dashboard

Displays:

* Posted shifts
* Applicants
* Assigned officers

---

### Post Shift Page

Allows companies to create shifts.

---

### Manage Shift Page

Allows companies to review applicants.

---

# Not Included

The following features are intentionally excluded.

## Payments

Reason:

Not required for validation.

---

## Messaging

Reason:

Can be handled manually.

---

## Mobile Apps

Reason:

Web platform first.

---

## Ratings

Reason:

Not required for early adoption.

---

## Reviews

Reason:

Not required for validation.

---

## GPS Tracking

Reason:

Adds complexity without validation.

---

## AI Matching

Reason:

Marketplace must work manually first.

---

## Payroll

Reason:

Not required for MVP.

---

## Notifications

Reason:

Can be added later.

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

## Phase 1

Authentication

* Register
* Login
* User roles

---

## Phase 2

Profiles

* Officer profiles
* Company profiles

---

## Phase 3

Shifts

* Create shifts
* Browse shifts

---

## Phase 4

Applications

* Apply
* Review applicants
* Accept applicant

---

## Phase 5

Testing

* End-to-end workflow
* Bug fixes
* Production deployment

---

# Scope Lock Rule

Before adding a new feature, ask:

Does this directly help a company fill a shift or help an officer get assigned?

If the answer is no, it does not belong in the MVP.

---

# North Star Metric

Filled Shifts

Every decision should improve the platform's ability to connect companies with licensed officers and successfully fill open shifts.
