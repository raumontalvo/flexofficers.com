#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Promote exactly one existing user to ADMIN.

Usage:
  npm run bootstrap:admin -- --secret <secret> --confirm [--clerk-id <id> | --email <email>]

Required:
  --secret      Must match ADMIN_BOOTSTRAP_SECRET env var
  --confirm     Explicit safety confirmation flag
  --clerk-id    Target user Clerk ID (or use --email)
  --email       Target user email (or use --clerk-id)

Environment:
  ADMIN_BOOTSTRAP_SECRET
  DATABASE_URL
EOF
}

SECRET=""
CONFIRM=false
CLERK_ID=""
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
    --clerk-id)
      CLERK_ID="${2:-}"
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

if [[ -z "${ADMIN_BOOTSTRAP_SECRET:-}" ]]; then
  echo "Error: ADMIN_BOOTSTRAP_SECRET environment variable is required." >&2
  exit 1
fi

if [[ -z "$SECRET" ]]; then
  echo "Error: --secret flag is required." >&2
  exit 1
fi

if [[ "$SECRET" != "$ADMIN_BOOTSTRAP_SECRET" ]]; then
  echo "Error: Provided --secret does not match ADMIN_BOOTSTRAP_SECRET." >&2
  exit 1
fi

if [[ "$CONFIRM" != true ]]; then
  echo "Error: --confirm flag is required." >&2
  exit 1
fi

if [[ -z "$CLERK_ID" && -z "$EMAIL" ]]; then
  echo "Error: You must provide either --clerk-id or --email." >&2
  exit 1
fi

ESCAPED_CLERK_ID="$(sql_escape "$CLERK_ID")"
ESCAPED_EMAIL="$(sql_escape "$EMAIL")"

if [[ -n "$CLERK_ID" && -n "$EMAIL" ]]; then
  FILTER_SQL="(\"clerkId\" = '$ESCAPED_CLERK_ID' OR \"email\" = '$ESCAPED_EMAIL')"
elif [[ -n "$CLERK_ID" ]]; then
  FILTER_SQL="\"clerkId\" = '$ESCAPED_CLERK_ID'"
else
  FILTER_SQL="\"email\" = '$ESCAPED_EMAIL'"
fi

MATCH_COUNT=$(psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -t -A -c "SELECT COUNT(*) FROM \"User\" WHERE $FILTER_SQL;")
MATCH_COUNT="$(echo "$MATCH_COUNT" | tr -d '[:space:]')"

if [[ "$MATCH_COUNT" == "0" ]]; then
  echo "Error: Target user does not exist." >&2
  exit 1
fi

if [[ "$MATCH_COUNT" != "1" ]]; then
  echo "Error: Expected exactly one matching user, found $MATCH_COUNT." >&2
  exit 1
fi

UPDATED_COUNT=$(psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -t -A -c "WITH updated AS (UPDATE \"User\" SET \"role\" = 'ADMIN', \"updatedAt\" = NOW() WHERE $FILTER_SQL RETURNING 1) SELECT COUNT(*) FROM updated;")
UPDATED_COUNT="$(echo "$UPDATED_COUNT" | tr -d '[:space:]')"

if [[ "$UPDATED_COUNT" != "1" ]]; then
  echo "Error: Expected to update exactly one row, updated $UPDATED_COUNT." >&2
  exit 1
fi

echo "Success: Promoted exactly one user to ADMIN."
