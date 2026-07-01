#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
CHROME="${CHROME_PATH:-/Applications/Google Chrome.app/Contents/MacOS/Google Chrome}"
BASE_URL="${BASE_URL:-http://localhost:3001}"
OUT="$ROOT/public/landing/screenshots"

OFFICER_PROFILE="$ROOT/.landing-capture/officer-profile"
COMPANY_PROFILE="$ROOT/.landing-capture/company-profile"

mkdir -p "$OUT/officer" "$OUT/company" "$ROOT/.landing-capture"

capture_with_profile() {
  local profile="$1"
  local role="$2"
  local file="$3"
  local path="$4"

  echo "Capturing $BASE_URL$path -> $role/$file"
  "$CHROME" \
    --user-data-dir="$profile" \
    --headless=new \
    --disable-gpu \
    --hide-scrollbars \
    --screenshot="$OUT/$role/$file" \
    --window-size=390,844 \
    --force-device-scale-factor=2 \
    --virtual-time-budget=20000 \
    "$BASE_URL$path"
}

login_profile() {
  local profile="$1"
  local sign_in_url="$2"
  echo "Opening Chrome for sign-in: $sign_in_url"
  echo "Sign in, then close the browser window to continue."
  "$CHROME" \
    --user-data-dir="$profile" \
    --new-window \
    --window-size=430,932 \
    "$sign_in_url"
}

officer_captures() {
  capture_with_profile "$OFFICER_PROFILE" officer browse-shifts.png /shifts
  capture_with_profile "$OFFICER_PROFILE" officer company-invites.png /officer/invites
  capture_with_profile "$OFFICER_PROFILE" officer accepted-shifts.png /officer/accepted-shifts
  capture_with_profile "$OFFICER_PROFILE" officer profile.png /officer/profile
}

company_captures() {
  capture_with_profile "$COMPANY_PROFILE" company dashboard.png /dashboard
  capture_with_profile "$COMPANY_PROFILE" company my-shifts.png /company/shifts
  capture_with_profile "$COMPANY_PROFILE" company applicants.png /company/applications
  capture_with_profile "$COMPANY_PROFILE" company staff.png /company/staff
}

public_browse_capture() {
  echo "Capturing public browse page (no sign-in required)"
  "$CHROME" \
    --headless=new \
    --disable-gpu \
    --hide-scrollbars \
    --screenshot="$OUT/officer/browse-shifts.png" \
    --window-size=390,844 \
    --force-device-scale-factor=2 \
    --virtual-time-budget=20000 \
    "$BASE_URL/shifts"
}

usage() {
  cat <<EOF
Usage: $(basename "$0") <command>

Commands:
  public-browse     Capture /shifts only (no authentication)
  login-officer     Open Chrome to sign in as an officer
  capture-officer   Capture officer screenshots (requires login-officer)
  login-company     Open Chrome to sign in as a company
  capture-company   Capture company screenshots (requires login-company)
  all               Full workflow: public browse + guided officer/company capture

Environment:
  BASE_URL          App URL (default: http://localhost:3001)
  CHROME_PATH       Chrome binary path
EOF
}

cmd="${1:-all}"

case "$cmd" in
  public-browse)
    public_browse_capture
    ;;
  login-officer)
    login_profile "$OFFICER_PROFILE" "$BASE_URL/sign-in"
    ;;
  capture-officer)
    officer_captures
    ;;
  login-company)
    login_profile "$COMPANY_PROFILE" "$BASE_URL/sign-in"
    ;;
  capture-company)
    company_captures
    ;;
  all)
    public_browse_capture
    echo ""
    echo "Next: sign in as an OFFICER account"
    login_profile "$OFFICER_PROFILE" "$BASE_URL/sign-in"
    officer_captures
    echo ""
    echo "Next: sign in as a COMPANY account"
    login_profile "$COMPANY_PROFILE" "$BASE_URL/sign-in"
    company_captures
    echo "All landing screenshots captured."
    ;;
  *)
    usage
    exit 1
    ;;
esac
