# Database Design

# FlexOfficers

Version: 0.1.0

Status: MVP Database Schema

---

# Overview

The FlexOfficers database is designed to support a two-sided marketplace:

* Security Companies
* Security Officers

The system allows companies to post shifts and officers to apply for them.

---

# Core Relationships

```text
User
├── Company Profile
└── Officer Profile

Company
└── Shifts

Shift
└── Applications

Officer
└── Applications
```

---

# Users Table

Purpose:

Store authentication and account information.

## Fields

| Field         | Type      |
| ------------- | --------- |
| id            | UUID      |
| email         | String    |
| password_hash | String    |
| role          | Enum      |
| created_at    | Timestamp |
| updated_at    | Timestamp |

## Role Enum

```text
OFFICER
COMPANY
ADMIN
```

---

# Officers Table

Purpose:

Store security officer information.

## Fields

| Field            | Type      |
| ---------------- | --------- |
| id               | UUID      |
| user_id          | UUID      |
| first_name       | String    |
| last_name        | String    |
| phone            | String    |
| city             | String    |
| state            | String    |
| experience_years | Integer   |
| bio              | Text      |
| created_at       | Timestamp |
| updated_at       | Timestamp |

---

# Licenses Table

Purpose:

Store officer license information.

## Fields

| Field                | Type      |
| -------------------- | --------- |
| id                   | UUID      |
| officer_id           | UUID      |
| license_type         | String    |
| license_number       | String    |
| expiration_date      | Date      |
| issuing_state        | String    |
| verified             | Boolean   |
| verification_status  | Enum      |
| verification_notes   | String    |
| verified_at          | Timestamp |
| verified_by_user_id  | UUID      |
| document_key         | String    |
| document_file_name   | String    |
| document_mime_type   | String    |
| document_size_bytes  | Integer   |
| document_uploaded_at | Timestamp |

## License Verification Status Enum

```text
PENDING
VERIFIED
REJECTED
```

Meaning:

* `PENDING`: License document was uploaded and is awaiting admin review, or was re-uploaded and reset for review.
* `VERIFIED`: Admin approved the license after review.
* `REJECTED`: Admin rejected the license; review notes may explain the reason.

## Examples

```text
Florida D License
Florida G License
Texas Level III
Texas Level IV
```

---

# Companies Table

Purpose:

Store company information.

## Fields

| Field        | Type      |
| ------------ | --------- |
| id           | UUID      |
| user_id      | UUID      |
| company_name | String    |
| contact_name | String    |
| phone        | String    |
| website      | String    |
| city         | String    |
| state        | String    |
| description  | Text      |
| created_at   | Timestamp |
| updated_at   | Timestamp |

---

# Shifts Table

Purpose:

Store available job opportunities.

## Fields

| Field            | Type      |
| ---------------- | --------- |
| id               | UUID      |
| company_id       | UUID      |
| title            | String    |
| description      | Text      |
| location         | String    |
| city             | String    |
| state            | String    |
| hourly_rate      | Decimal   |
| start_time       | Timestamp |
| end_time         | Timestamp |
| required_license | String    |
| status           | Enum      |
| created_at       | Timestamp |
| updated_at       | Timestamp |

---

# Shift Status Enum

```text
OPEN
FILLED
COMPLETED
CANCELLED
```

---

# Applications Table

Purpose:

Store officer applications.

## Fields

| Field      | Type      |
| ---------- | --------- |
| id         | UUID      |
| shift_id   | UUID      |
| officer_id | UUID      |
| status     | Enum      |
| applied_at | Timestamp |

---

# Application Status Enum

```text
PENDING
ACCEPTED
REJECTED
WITHDRAWN
```

---

# Future Tables

Not included in MVP.

## Messages

Officer ↔ Company communication.

## Reviews

Officer ratings and company ratings.

## Payments

Stripe transactions and payouts.

## Notifications

Email, SMS, and push notifications.

## Availability

Officer work schedules and availability preferences.

## Audit Logs

System activity tracking.

---

# Database Indexes

Recommended indexes:

```text
users.email

officers.state

companies.state

shifts.status

shifts.start_time

shifts.city

applications.shift_id

applications.officer_id
```

---

# MVP Database Summary

Tables:

1. Users
2. Officers
3. Licenses
4. Companies
5. Shifts
6. Applications

These six tables are sufficient to support the first production-ready MVP of FlexOfficers.
