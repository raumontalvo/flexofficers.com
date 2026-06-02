# Product Requirements Document (PRD)

# FlexOfficers

Version: 0.1.0

Status: MVP Planning

Owner: Raul Pedro Montalvo Vazquez

---

# Executive Summary

FlexOfficers is a marketplace that connects licensed security officers with security companies that need staffing coverage.

Security companies can post open shifts and quickly find qualified officers.

Security officers can browse available shifts, apply, and work flexible schedules.

The goal is to reduce staffing shortages while creating additional earning opportunities for security professionals.

---

# Problem Statement

## Security Companies

Security companies frequently experience:

* Last-minute callouts
* Open shifts
* Staffing shortages
* Overtime expenses
* Scheduling inefficiencies

Current solutions often involve:

* Phone calls
* Text message chains
* Internal officer lists
* Staffing agencies

These methods are slow and unreliable.

---

## Security Officers

Security officers often face:

* Limited access to extra work
* Inconsistent schedules
* Difficulty finding available shifts
* Lack of centralized opportunities

---

# Product Vision

Create the easiest way for security companies and licensed officers to connect and fill shifts.

Long-term vision:

Become the leading security staffing marketplace in the United States.

---

# Target Users

## User Type 1

### Security Companies

Responsibilities:

* Manage security operations
* Fill staffing requirements
* Schedule officers

Goals:

* Fill shifts quickly
* Reduce overtime
* Access qualified officers

Pain Points:

* Staffing shortages
* No-shows
* Last-minute scheduling issues

---

## User Type 2

### Security Officers

Responsibilities:

* Provide security services
* Maintain licenses
* Complete assigned shifts

Goals:

* Earn additional income
* Work flexible schedules
* Find local opportunities

Pain Points:

* Limited shift visibility
* Inconsistent work availability

---

# MVP Scope

## Included

### Authentication

Users can:

* Register
* Login
* Logout

Roles:

* Officer
* Company

---

### Officer Profiles

Officers can:

* Create profile
* Add experience
* Add license information
* Update profile

---

### Company Profiles

Companies can:

* Create company profile
* Manage company information

---

### Shift Management

Companies can:

* Post shifts
* Edit shifts
* Cancel shifts
* View applicants

Shift fields:

* Title
* Location
* Start Time
* End Time
* Hourly Rate
* License Requirements
* Description

---

### Applications

Officers can:

* Browse shifts
* Apply to shifts
* View application status

Companies can:

* Accept applicants
* Reject applicants

---

### Dashboards

Officer Dashboard:

* Available shifts
* Applied shifts
* Assigned shifts

Company Dashboard:

* Posted shifts
* Applicants
* Assigned officers

---

# Out of Scope (MVP)

Not included:

* Payments
* GPS tracking
* Messaging
* Mobile applications
* Ratings
* Reviews
* AI matching
* Payroll
* Time tracking
* Push notifications

---

# Functional Requirements

## FR-001

Users must be able to create an account.

---

## FR-002

Users must be able to authenticate securely.

---

## FR-003

Companies must be able to post shifts.

---

## FR-004

Officers must be able to browse shifts.

---

## FR-005

Officers must be able to apply for shifts.

---

## FR-006

Companies must be able to review applicants.

---

## FR-007

Companies must be able to assign officers.

---

## FR-008

Users must be able to manage profiles.

---

# Success Metrics

## Marketplace Metrics

Number of:

* Registered companies
* Registered officers
* Posted shifts
* Shift applications
* Filled shifts

---

## North Star Metric

Successfully filled shifts.

---

# Technical Stack

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

Hosting:

* Vercel

---

# Future Enhancements

## Phase 2

* Notifications
* Search filters
* Admin dashboard

## Phase 3

* Ratings
* Reviews
* Availability calendars

## Phase 4

* Payments
* Subscriptions
* Revenue generation

## Phase 5

* Smart matching
* Staffing recommendations
* Predictive staffing tools

---

# Launch Goal

Validate marketplace demand by enabling companies to post shifts and officers to successfully apply and be assigned through the platform.
