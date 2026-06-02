# Architecture Document

# FlexOfficers

Version: 0.1.0

Status: MVP Architecture

---

# System Overview

FlexOfficers is a web-based marketplace connecting licensed security officers with security companies that need staffing coverage.

The platform follows a modern full-stack architecture using Next.js, PostgreSQL, Prisma, and Clerk Authentication.

---

# High-Level Architecture

```text
User
  ↓

Next.js Frontend
  ↓

API Routes
  ↓

Business Logic Layer
  ↓

Prisma ORM
  ↓

PostgreSQL Database
```

---

# Technology Stack

## Frontend

Framework:

* Next.js 15+
* React
* TypeScript

Styling:

* Tailwind CSS

Benefits:

* Server Components
* Fast rendering
* SEO-friendly
* Modern developer experience

---

# Backend

Framework:

* Next.js API Routes

Responsibilities:

* Authentication validation
* Authorization
* Shift creation
* Applications
* Business rules

---

# Authentication

Provider:

* Clerk

Responsibilities:

* Registration
* Login
* Session management
* Protected routes

User Roles:

```text
OFFICER
COMPANY
ADMIN
```

Authorization handled inside middleware and API routes.

---

# Database

Provider:

* PostgreSQL

Responsibilities:

* User data
* Company data
* Officer profiles
* Shifts
* Applications

---

# ORM

Provider:

* Prisma

Responsibilities:

* Database schema
* Migrations
* Query generation
* Type-safe database access

Benefits:

* Strong TypeScript support
* Fast development
* Reduced SQL complexity

---

# Deployment

Frontend:

* Vercel

Database:

* Neon PostgreSQL (recommended)

Alternative:

* Supabase PostgreSQL

---

# Application Layers

## Presentation Layer

Purpose:

Display data to users.

Components:

* Home Page
* Login Page
* Dashboard
* Shift Listings
* Profile Pages

---

## API Layer

Purpose:

Handle requests.

Examples:

```text
POST /api/shifts

GET /api/shifts

POST /api/applications

GET /api/company/shifts
```

---

## Business Logic Layer

Purpose:

Enforce platform rules.

Examples:

* Officers can apply only once
* Companies can edit their own shifts
* Officers cannot approve themselves
* Closed shifts cannot receive applications

---

## Data Layer

Purpose:

Store and retrieve data.

Components:

* Prisma
* PostgreSQL

---

# MVP User Flow

## Officer Flow

```text
Register

Create Profile

Browse Shifts

Apply

Await Decision
```

---

## Company Flow

```text
Register

Create Company Profile

Post Shift

Review Applications

Accept Officer
```

---

# Folder Structure

```text
flexofficers/

app/
│
├── page.tsx
├── login/
├── register/
├── dashboard/
├── shifts/
├── profile/
│
components/
│
├── ui/
├── shifts/
├── officers/
├── companies/
│
lib/
│
├── prisma.ts
├── auth.ts
│
actions/
│
├── shifts/
├── applications/
│
prisma/
│
└── schema.prisma
│
public/
│
styles/
```

---

# Security Considerations

## Authentication

All protected pages require authentication.

---

## Authorization

Companies can:

* Create shifts
* Edit their shifts
* View applicants

Officers can:

* Apply for shifts
* Manage their profiles

Admins can:

* Manage platform content

---

## Validation

All user input must be validated.

Examples:

* Email validation
* Required fields
* Date validation
* License validation

---

# Scalability Plan

## MVP

Single application deployment.

---

## Growth Stage

Potential additions:

* Background jobs
* Queue processing
* Search indexing
* Caching

---

## Future Scale

Potential services:

* Notification Service
* Payment Service
* Messaging Service
* Matching Engine

---

# Monitoring

Recommended Tools:

* Vercel Analytics
* Sentry
* PostHog

Track:

* Registrations
* Shift postings
* Applications
* Filled shifts

---

# North Star Architecture Goal

Build the simplest architecture capable of supporting:

1. Companies posting shifts
2. Officers applying
3. Companies filling shifts

Everything else is secondary until marketplace demand is validated.
