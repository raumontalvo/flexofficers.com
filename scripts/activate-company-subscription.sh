#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Dev-only: activate a company subscription for local/testing.

Usage:
  npm run activate:company-subscription -- --secret <secret> --confirm [--company-id <id> | --email <email>]

Required:
  --secret      Must match SUBSCRIPTION_DEV_SECRET env var
  --confirm     Explicit safety confirmation flag
  --company-id  Target company ID (or use --email)
  --email       Target user email linked to the company (or use --company-id)

Environment:
  SUBSCRIPTION_DEV_SECRET
  DATABASE_URL
EOF
}

SECRET=""
CONFIRM=false
COMPANY_ID=""
EMAIL=""

sql_escape() {
  echo "$1" | sed "s/'/''/g"
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --secret)
      SECRET="${2:-}"
      shift 2
      ;;
    --confirm)
      CONFIRM=true
      shift
      ;;
    --company-id)
      COMPANY_ID="${2:-}"
      shift 2
      ;;
    --email)
      EMAIL="${2:-}"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Error: Unknown argument '$1'." >&2
      usage
      exit 1
      ;;
  esac
done

if [[ -z "${DATABASE_URL:-}" ]]; then
  echo "Error: DATABASE_URL is required." >&2
  exit 1
fi

if [[ -z "${SUBSCRIPTION_DEV_SECRET:-}" ]]; then
  echo "Error: SUBSCRIPTION_DEV_SECRET environment variable is required." >&2
  exit 1
fi

if [[ -z "$SECRET" ]]; then
  echo "Error: --secret flag is required." >&2
  exit 1
fi

if [[ "$SECRET" != "$SUBSCRIPTION_DEV_SECRET" ]]; then
  echo "Error: Provided --secret does not match SUBSCRIPTION_DEV_SECRET." >&2
  exit 1
fi

if [[ "$CONFIRM" != true ]]; then
  echo "Error: --confirm flag is required." >&2
  exit 1
fi

if [[ -z "$COMPANY_ID" && -z "$EMAIL" ]]; then
  echo "Error: You must provide either --company-id or --email." >&2
  exit 1
fi

if [[ -n "$COMPANY_ID" ]]; then
  ESCAPED_COMPANY_ID="$(sql_escape "$COMPANY_ID")"
  FILTER_SQL="c.\"id\" = '$ESCAPED_COMPANY_ID'"
elif [[ -n "$EMAIL" ]]; then
  ESCAPED_EMAIL="$(sql_escape "$EMAIL")"
  FILTER_SQL="u.\"email\" = '$ESCAPED_EMAIL'"
fi

MATCH_COUNT=$(psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -t -A -c "SELECT COUNT(*) FROM \"Company\" c JOIN \"User\" u ON c.\"userId\" = u.\"id\" WHERE $FILTER_SQL;")
MATCH_COUNT="$(echo "$MATCH_COUNT" | tr -d '[:space:]')"

if [[ "$MATCH_COUNT" == "0" ]]; then
  echo "Error: Target company does not exist." >&2
  exit 1
fi

if [[ "$MATCH_COUNT" != "1" ]]; then
  echo "Error: Expected exactly one matching company, found $MATCH_COUNT." >&2
  exit 1
fi

UPDATED_COUNT=$(psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -t -A -c "WITH updated AS (UPDATE \"Company\" c SET \"subscriptionStatus\" = 'ACTIVE', \"subscriptionCurrentPeriodEnd\" = NOW() + INTERVAL '1 year', \"updatedAt\" = NOW() FROM \"User\" u WHERE c.\"userId\" = u.\"id\" AND $FILTER_SQL RETURNING 1) SELECT COUNT(*) FROM updated;")
UPDATED_COUNT="$(echo "$UPDATED_COUNT" | tr -d '[:space:]')"

if [[ "$UPDATED_COUNT" != "1" ]]; then
  echo "Error: Expected to update exactly one row, updated $UPDATED_COUNT." >&2
  exit 1
fi

echo "Success: Activated company subscription for 1 year."
