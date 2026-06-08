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

## License Document Storage Configuration

Set the following environment variables before using license upload and download endpoints.

Required:

* `STORAGE_PROVIDER` (`s3` or `r2`)
* `STORAGE_BUCKET`
* `STORAGE_REGION`
* `STORAGE_ACCESS_KEY_ID`
* `STORAGE_SECRET_ACCESS_KEY`

Conditionally required:

* `STORAGE_ENDPOINT` (required when `STORAGE_PROVIDER=r2`)

Optional with defaults:

* `STORAGE_FORCE_PATH_STYLE` (default: `false` for S3, `true` for R2)
* `LICENSE_UPLOAD_PREFIX` (default: `licenses`)
* `LICENSE_UPLOAD_MAX_BYTES` (default: `5242880`)
* `LICENSE_UPLOAD_ALLOWED_MIME` (default: `application/pdf,image/jpeg,image/png`)
* `LICENSE_UPLOAD_PRESIGN_TTL_SECONDS` (default: `300`)
* `LICENSE_DOWNLOAD_PRESIGN_TTL_SECONDS` (default: `120`)

### AWS S3 Setup Notes

1. Create an S3 bucket for license documents.
2. Create an IAM user (or role) with least-privilege access to that bucket.
3. Configure CORS on the bucket to allow browser `PUT` uploads from your app origin.
4. Set environment variables:

```bash
STORAGE_PROVIDER=s3
STORAGE_BUCKET=your-s3-bucket
STORAGE_REGION=us-east-1
STORAGE_ACCESS_KEY_ID=...
STORAGE_SECRET_ACCESS_KEY=...
# Optional
STORAGE_FORCE_PATH_STYLE=false
LICENSE_UPLOAD_PREFIX=licenses
```

### Cloudflare R2 Setup Notes

1. Create an R2 bucket for license documents.
2. Create an R2 API token with object read/write for that bucket.
3. Use your account-specific S3 endpoint.
4. Configure CORS on the bucket to allow browser `PUT` uploads from your app origin.
5. Set environment variables:

```bash
STORAGE_PROVIDER=r2
STORAGE_BUCKET=your-r2-bucket
STORAGE_REGION=auto
STORAGE_ENDPOINT=https://<accountid>.r2.cloudflarestorage.com
STORAGE_ACCESS_KEY_ID=...
STORAGE_SECRET_ACCESS_KEY=...
# Optional
STORAGE_FORCE_PATH_STYLE=true
LICENSE_UPLOAD_PREFIX=licenses
```

## Manual License Review Test Flow

Use this manual flow to validate upload and admin review end-to-end.

1. Sign in as an officer and open the officer profile page.
2. Add or update a license and save the profile (license record must exist first).
3. Upload a document for that license (PDF/JPEG/PNG).
4. Sign in as an admin and open `/admin/licenses`.
5. Confirm the queue row shows officer info, license info, uploaded file name, and status.
6. Click Open Document and confirm the file opens from a signed URL.
7. Click Verify and confirm status updates to `VERIFIED`.
8. Repeat with Reject and optional notes, then confirm status is `REJECTED` and notes are saved.

