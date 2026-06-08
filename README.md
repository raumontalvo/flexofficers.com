# FlexOfficers

## Overview

FlexOfficers is a marketplace that connects licensed security officers with security companies that need coverage.

Companies can post open shifts and find qualified officers quickly. Officers can browse available shifts, claim assignments, and work on a flexible schedule.

Our mission is to make security staffing faster, easier, and more reliable.

---

## Problem

Security companies regularly face staffing challenges:

* Last-minute call-outs
* Open shifts that need immediate coverage
* Time-consuming phone calls and scheduling
* Limited access to qualified backup officers

At the same time, licensed security officers often want additional work opportunities but have difficulty finding available shifts.

FlexOfficers bridges this gap.

---

## Solution

FlexOfficers provides a platform where:

### Security Companies

* Post available shifts
* Specify requirements
* Find qualified officers
* Fill positions quickly

### Security Officers

* Create a professional profile
* Upload licenses and certifications
* Browse available shifts
* Accept assignments
* Build work history and reputation

---

## MVP Features

### Company Features

* Create company account
* Post shifts
* View applicants
* Assign officers

### Officer Features

* Create officer profile
* Upload licenses
* Browse available shifts
* Apply for shifts
* View scheduled assignments

### Platform Features

* Authentication
* Shift management
* Role-based access
* Responsive design

---

## Future Features

* Real-time notifications
* In-app messaging
* Digital check-in/check-out
* GPS verification
* Ratings and reviews
* Automated payments
* AI-powered officer matching
* Background verification integrations
* Mobile applications

---

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Next.js API Routes
* PostgreSQL
* Prisma ORM

### Authentication

* Clerk or NextAuth

### Deployment

* Vercel

---

## Vision

Become the leading marketplace for licensed security professionals by making security staffing as simple as requesting a ride or booking a service online.

---

## Status

Current Phase: MVP Development

Version: 0.1.0

Founder: Raul Pedro Montalvo Vazquez

---

## First Admin Bootstrap

Use the one-time admin bootstrap command to promote exactly one existing user to ADMIN.

Requirements:

* `DATABASE_URL` must be set
* `ADMIN_BOOTSTRAP_SECRET` must be set
* Use `--secret` with the same value as `ADMIN_BOOTSTRAP_SECRET`
* Provide either `--clerk-id` or `--email`
* Include `--confirm`

Command:

```bash
ADMIN_BOOTSTRAP_SECRET="your-secret" npm run bootstrap:admin -- --secret "your-secret" --confirm --clerk-id "clerk_user_id"
```

Or by email:

```bash
ADMIN_BOOTSTRAP_SECRET="your-secret" npm run bootstrap:admin -- --secret "your-secret" --confirm --email "user@example.com"
```

