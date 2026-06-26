# Out-of-Scope Removal Checklist

# FlexOfficers Version 1.0

Status: Planning — **do not delete blindly**

This checklist maps out-of-scope features to files, dependencies, and safe removal order.

## Protected — Do NOT Remove

These are core to the marketplace loop and must remain intact:

| Area | Files / routes |
|------|----------------|
| Clerk auth | `proxy.ts`, `app/sign-in/`, `app/sign-up/`, `app/layout.tsx` (ClerkProvider) |
| Roles & onboarding | `app/onboarding/`, `app/api/onboarding/role/route.ts`, `lib/page-rbac.ts` |
| Dashboards | `app/dashboard/page.tsx`, `app/admin/page.tsx` (reshape later, do not delete auth shell) |
| Officer profile (core) | `app/officer/profile/page.tsx`, `app/api/officer/profile/route.ts`, `app/api/officer/profile/validation.ts` |
| Company profile (core) | `app/company/profile/`, `app/api/company/profile/` |
| Shifts | `app/shifts/`, `app/company/shifts/`, `app/api/shifts/` |
| Applications | `app/api/applications/`, `app/company/applications/`, `app/officer/applications/`, `app/shifts/ApplyButton.tsx` |
| Shared libs (keep) | `lib/prisma.ts`, `lib/rate-limit.ts` |
| Admin bootstrap | `scripts/bootstrap-first-admin.sh`, `npm run bootstrap:admin` (admin role may still be needed for ops/subscription) |

---

## Batch 1 — License Document Upload System

**Why remove:** Version 1.0 explicitly excludes license upload, resume upload, and document storage.

### Pages & UI

| File | Notes |
|------|-------|
| `app/officer/profile/OfficerProfileForm.tsx` | Remove upload UI only — keep profile save form (will be reshaped in Phase 3) |
| `app/officer/profile/page.tsx` | Remove document field mapping from license records |

### API Routes (delete entire directories)

| Route | File |
|-------|------|
| `POST /api/uploads/license/presign` | `app/api/uploads/license/presign/route.ts` |
| `POST /api/uploads/license/complete` | `app/api/uploads/license/complete/route.ts` |
| `GET /api/uploads/license/download` | `app/api/uploads/license/download/route.ts` |

### Supporting API files

| File | Notes |
|------|-------|
| `app/api/uploads/license/validation.ts` | Only used by upload routes |
| `app/api/uploads/license/complete/rules.ts` | Only used by complete route |
| `app/api/uploads/license/download/rules.ts` | Only used by download route |

### Libraries

| File | Notes |
|------|-------|
| `lib/storage.ts` | Only used by upload/download routes |
| `lib/license-documents.ts` | Only used by upload validation and key generation |

### Unit Tests (delete)

| File |
|------|
| `tests/unit/storage.config.test.ts` |
| `tests/unit/license-upload.validation.test.ts` |
| `tests/unit/license-upload.payload-parser.test.ts` |
| `tests/unit/license-upload.keygen.test.ts` |
| `tests/unit/license-upload-complete.rules.test.ts` |
| `tests/unit/license-download.rules.test.ts` |

### npm Dependencies (remove after code deletion)

| Package | Used by |
|---------|---------|
| `@aws-sdk/client-s3` | upload complete, download |
| `@aws-sdk/s3-request-presigner` | presign, download |

### Environment Variables (remove from docs / `.env` after deletion)

* `STORAGE_PROVIDER`, `STORAGE_BUCKET`, `STORAGE_REGION`
* `STORAGE_ACCESS_KEY_ID`, `STORAGE_SECRET_ACCESS_KEY`
* `STORAGE_ENDPOINT`, `STORAGE_FORCE_PATH_STYLE`
* `LICENSE_UPLOAD_PREFIX`, `LICENSE_UPLOAD_MAX_BYTES`
* `LICENSE_UPLOAD_ALLOWED_MIME`, `LICENSE_UPLOAD_PRESIGN_TTL_SECONDS`
* `LICENSE_DOWNLOAD_PRESIGN_TTL_SECONDS`

### Prisma / DB (later migration — not Batch 1)

Remove from `License` model when reshaping officer profile:

* `documentKey`, `documentFileName`, `documentMimeType`, `documentSizeBytes`, `documentUploadedAt`
* `verificationStatus`, `verificationNotes`, `verifiedAt`, `verifiedByUserId`, `verified`
* Entire `License` model may be replaced by officer-level `licenseExpirationDate`

Migration file (historical, do not delete): `prisma/migrations/20260608212000_license_document_upload/`

### Breakage if removed without updating consumers

| Consumer | Risk |
|----------|------|
| `OfficerProfileForm.tsx` | `fetch("/api/uploads/license/presign")` and complete calls will 404 — **must strip upload UI first or in same PR** |
| `app/officer/profile/page.tsx` | Passes document fields to form — harmless if form ignores them |
| `app/api/admin/licenses/review/route.ts` | References `documentKey` — remove in Batch 2 with admin review |

---

## Batch 2 — Admin License Verification

**Why remove:** FlexOfficers does not verify licenses. Companies verify credentials themselves.

### Pages & UI

| File | Notes |
|------|-------|
| `app/admin/licenses/page.tsx` | Delete |
| `app/admin/licenses/ReviewLicenseButton.tsx` | Delete |
| `app/admin/page.tsx` | Remove "Review Licenses" card and `pendingLicenses` query — keep admin dashboard shell |

### API Routes

| Route | File |
|-------|------|
| `POST /api/admin/licenses/review` | `app/api/admin/licenses/review/route.ts` |
| — | `app/api/admin/licenses/review/rules.ts` |

### Unit Tests

| File |
|------|
| `tests/unit/admin-license-review.rules.test.ts` |

### Breakage if removed without updating consumers

| Consumer | Risk |
|----------|------|
| `app/admin/page.tsx` | Links to `/admin/licenses` — update in same PR |
| `User.reviewedLicenses` relation | Prisma schema — remove in later migration |
| `README.md` | "Manual License Review Test Flow" section — update docs |

---

## Batch 3 — Admin Company Verification

**Why remove:** FlexOfficers does not verify companies.

### Pages & UI

| File | Notes |
|------|-------|
| `app/admin/companies/page.tsx` | Delete |
| `app/admin/companies/VerifyCompanyButton.tsx` | Delete |
| `app/admin/page.tsx` | Remove "Verify Companies" card and `pendingCompanies` query |

### API Routes

| Route | File |
|-------|------|
| `POST /api/admin/companies/verify` | `app/api/admin/companies/verify/route.ts` |

### Dashboard / onboarding side effects

| File | Field / logic to remove later |
|------|-------------------------------|
| `app/dashboard/page.tsx` | Company profile checklist references `licenseType`, `licenseNumber`, `licenseState` |
| `app/company/profile/CompanyProfileForm.tsx` | Company license fields |
| `app/api/company/profile/validation.ts` | License field validation |
| `prisma/schema.prisma` | `Company.verified`, `licenseType`, `licenseNumber`, `licenseState` |

### Breakage if removed without updating consumers

| Consumer | Risk |
|----------|------|
| `app/admin/page.tsx` | Links to `/admin/companies` |
| Company profile forms | Still collect license fields until Phase 3 reshape |

---

## Batch 4 — In-App Notifications

**Why remove:** Version 1.0 excludes push notifications and in-app notifications.

### Pages & UI

| File | Notes |
|------|-------|
| `app/notifications/page.tsx` | Delete |
| `app/notifications/NotificationActions.tsx` | Delete |
| `app/dashboard/page.tsx` | Remove notification links, unread count query |

### API Routes

| Route | File |
|-------|------|
| `POST /api/notifications/read` | `app/api/notifications/read/route.ts` |
| `POST /api/notifications/delete` | `app/api/notifications/delete/route.ts` |

### Route protection

| File | Change |
|------|--------|
| `proxy.ts` | Remove `"/notifications(.*)"` from `isPrivatePage` matcher |

### Prisma (later migration)

* `Notification` model
* `User.notifications` relation

### Breakage if removed without updating consumers

| Consumer | Risk |
|----------|------|
| `app/api/applications/route.ts` | Calls `prisma.notification.create` — **must remove create calls in same PR** |
| `app/api/applications/status/route.ts` | Calls `prisma.notification.create` |
| `app/api/shifts/cancel/route.ts` | Calls `prisma.notification.createMany` |
| `app/api/admin/licenses/review/route.ts` | Calls `prisma.notification.create` (gone if Batch 2 done first) |
| `app/dashboard/page.tsx` | Includes `notifications` in Prisma query |

---

## Batch 5 — Email Notifications

**Why remove:** Version 1.0 excludes email notifications.

### Library

| File | Notes |
|------|-------|
| `lib/email.ts` | Delete entire file |

### Consumers (strip `sendNotificationEmail` calls — do not delete these files)

| File | Import to remove |
|------|------------------|
| `app/api/applications/route.ts` | `sendNotificationEmail` + try/catch block |
| `app/api/applications/status/route.ts` | `sendNotificationEmail` + try/catch blocks |
| `app/api/shifts/cancel/route.ts` | `sendNotificationEmail` + try/catch block |

### npm Dependencies

| Package |
|---------|
| `resend` |

### Environment Variables

* `RESEND_API_KEY`

### Breakage if removed without updating consumers

| Consumer | Risk |
|----------|------|
| Files above | Build fails on missing `@/lib/email` import — update imports in same PR |

**Recommended:** Combine Batch 4 and Batch 5 in one PR since the same three API routes create both in-app notifications and send emails.

---

## Batch 6 — Documentation Cleanup (after code removal)

| File | Section to update |
|------|-------------------|
| `README.md` | Remove license document storage config, S3/R2 setup, manual license review flow |
| `DATABASE.md` | Remove `LicenseVerificationStatus`, document fields, `Notification` model |
| `ARCHITECTURE.md` | Remove storage and notification architecture references |
| `PRD.md` | Align with Version 1.0 (optional, lower priority) |
| `USER-STORIES.md` | Align with Version 1.0 (optional, lower priority) |

---

## Recommended Removal Order

```text
1. Batch 4 + 5 together — notifications + email
   (strip prisma.notification.create + sendNotificationEmail from 3 API routes first)

2. Batch 2 — admin license verification
   (after upload UI removed or orphaned)

3. Batch 1 — license upload system
   (strip OfficerProfileForm upload UI, then delete API routes + libs + tests)

4. Batch 3 — admin company verification
   (independent of upload system)

5. Batch 6 — documentation cleanup

6. Prisma migration — drop Notification model, simplify License/Company models
   (only after all code references are gone)
```

---

## Verification After Each Batch

Run after every batch:

```bash
npm test
npm run build
```

Manual smoke test:

1. Sign in as company → post shift
2. Sign in as officer → apply
3. Company accepts application
4. Shift status becomes FILLED

---

## Items Explicitly NOT in Removal Scope

These are out of scope for Version 1.0 but **were never built** — nothing to remove:

* Messaging, SMS, push notifications (mobile)
* AI matching, GPS, payroll, time clock
* Resume upload (separate from license upload)
* Ratings, reviews, mobile apps
