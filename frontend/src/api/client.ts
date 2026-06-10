import { storage } from "@/src/utils/storage";

const BACKEND_URL = process.env.EXPO_PUBLIC_BACKEND_URL;
const API_BASE = `${BACKEND_URL}/api`;

const TOKEN_KEY = "flexofficers_token";

export async function getToken(): Promise<string | null> {
  return await storage.secureGet<string>(TOKEN_KEY, "");
}

export async function setToken(token: string): Promise<void> {
  await storage.secureSet(TOKEN_KEY, token);
}

export async function clearToken(): Promise<void> {
  await storage.secureRemove(TOKEN_KEY);
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  auth?: boolean;
};

async function request<T>(path: string, opts: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, auth = true } = opts;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (auth) {
    const token = await getToken();
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let detail = `Request failed (${res.status})`;
    try {
      const err = await res.json();
      detail = err.detail || JSON.stringify(err);
    } catch {}
    throw new Error(detail);
  }
  if (res.status === 204) return undefined as T;
  return (await res.json()) as T;
}

// ============== TYPES ==============

export type Role = "officer" | "company";

export type User = {
  id: string;
  email: string;
  full_name: string;
  role: Role;
  company_name?: string | null;
  location?: string;
  verified: {
    background: boolean;
    licensed: boolean;
    id_verified: boolean;
    insured: boolean;
  };
};

export type Shift = {
  id: string;
  title: string;
  venue: string;
  city: string;
  state: string;
  start_time: string;
  end_time: string;
  pay_rate: number;
  officers_needed: number;
  description: string;
  requirements: string[];
  status: "open" | "filling_fast" | "closed";
  distance_mi: number;
  posted_by?: string | null;
  posted_by_company?: string | null;
  applicants: string[];
  created_at: string;
  payment_status?: "unpaid" | "pending" | "paid" | "paid_out";
  stripe_checkout_session_id?: string | null;
  completed_by_officer?: string | null;
  posted_by_rating?: number | null;
  posted_by_rating_count?: number | null;
};

export type Conversation = {
  shift_id: string;
  shift_title: string;
  venue: string;
  other_party_name: string;
  last_message?: string | null;
  last_time?: string | null;
  unread: number;
};

export type ChatMessage = {
  id: string;
  shift_id: string;
  sender_id: string;
  sender_name: string;
  text: string;
  created_at: string;
};

// ============== AUTH ==============

export async function apiRegister(body: {
  email: string;
  password: string;
  full_name: string;
  role: Role;
  company_name?: string;
}) {
  return request<{ access_token: string; token_type: string; user: User }>(
    "/auth/register",
    { method: "POST", body, auth: false }
  );
}

export async function apiLogin(email: string, password: string) {
  return request<{ access_token: string; token_type: string; user: User }>(
    "/auth/login",
    { method: "POST", body: { email, password }, auth: false }
  );
}

export async function apiGoogleAuth(session_token: string, role: Role = "officer") {
  return request<{ access_token: string; token_type: string; user: User }>(
    "/auth/google",
    { method: "POST", body: { session_token, role }, auth: false }
  );
}

export async function apiMe() {
  return request<User>("/auth/me");
}

export async function apiLogout() {
  try {
    await request("/auth/logout", { method: "POST" });
  } catch {}
  await clearToken();
}

// ============== SHIFTS ==============

export async function apiListShifts(
  statusFilter?: string,
  city?: string,
  lat?: number | null,
  lng?: number | null,
) {
  const params = new URLSearchParams();
  if (statusFilter && statusFilter !== "all") params.set("status_filter", statusFilter);
  if (city && city !== "All Cities") params.set("city", city);
  if (lat != null && lng != null) {
    params.set("lat", String(lat));
    params.set("lng", String(lng));
  }
  const q = params.toString() ? `?${params.toString()}` : "";
  return request<Shift[]>(`/shifts${q}`, { auth: false });
}

export async function apiListCities() {
  return request<string[]>("/shifts/cities", { auth: false });
}

export async function apiGetShift(id: string) {
  return request<Shift>(`/shifts/${id}`, { auth: false });
}

export async function apiApplyShift(id: string) {
  return request<{ ok: boolean; already_applied: boolean }>(`/shifts/${id}/apply`, {
    method: "POST",
  });
}

export async function apiMyApplications() {
  return request<Shift[]>("/applications/me");
}

export async function apiMyPostedShifts() {
  return request<Shift[]>("/shifts/mine");
}

export async function apiCreateShift(body: {
  title: string;
  venue: string;
  city: string;
  state: string;
  start_time: string;
  end_time: string;
  pay_rate: number;
  officers_needed: number;
  description: string;
  requirements: string[];
}) {
  return request<Shift>("/shifts", { method: "POST", body });
}

// ============== MESSAGES / CHAT ==============

export async function apiListConversations() {
  return request<Conversation[]>("/conversations");
}

export async function apiGetMessages(shiftId: string) {
  return request<ChatMessage[]>(`/conversations/${shiftId}/messages`);
}

export async function apiPostMessage(shiftId: string, text: string) {
  return request<ChatMessage>(`/conversations/${shiftId}/messages`, {
    method: "POST",
    body: { text },
  });
}

export function buildChatWsUrl(shiftId: string, token: string): string {
  const base = (process.env.EXPO_PUBLIC_BACKEND_URL || "").replace(/^http/, "ws");
  return `${base}/api/ws/chat/${shiftId}?token=${encodeURIComponent(token)}`;
}

// ============== STRIPE ==============

export async function apiStartCheckout(shiftId: string) {
  return request<{ checkout_url: string; session_id: string; shift_id: string }>(
    `/shifts/${shiftId}/checkout`,
    { method: "POST" }
  );
}

export async function apiShiftPaymentStatus(shiftId: string) {
  return request<{ payment_status: string; shift_id: string }>(
    `/shifts/${shiftId}/payment-status`,
    { auth: false }
  );
}

export async function apiOfficerOnboard() {
  return request<{ url: string; account_id: string }>("/officers/stripe/onboard", {
    method: "POST",
  });
}

export async function apiOfficerStripeStatus() {
  return request<{ payouts_enabled: boolean; details_submitted?: boolean; account_id: string | null }>(
    "/officers/stripe/status"
  );
}

export async function apiCompleteShift(shiftId: string) {
  return request<{ ok: boolean; transfer_id?: string; amount_cents?: number; already_paid_out?: boolean }>(
    `/shifts/${shiftId}/complete`,
    { method: "POST" }
  );
}

// ============== USER LOCATION ==============

export async function apiUpdateLocation(body: { location?: string; lat?: number; lng?: number }) {
  return request<User>("/users/me/location", { method: "PATCH", body });
}

// ============== APPLE AUTH ==============

export async function apiAppleAuth(body: {
  identity_token: string;
  email?: string;
  full_name?: string;
  role?: Role;
}) {
  return request<{ access_token: string; token_type: string; user: User }>(
    "/auth/apple",
    { method: "POST", body, auth: false }
  );
}

// ============== RATINGS ==============

export type Rating = {
  id: string;
  shift_id: string;
  rater_id: string;
  ratee_id: string;
  stars: number;
  comment: string;
  created_at: string;
};

export type RatingsSummary = {
  user_id: string;
  average: number;
  count: number;
  ratings: Rating[];
};

export async function apiCreateRating(body: {
  shift_id: string;
  ratee_id: string;
  stars: number;
  comment?: string;
}) {
  return request<Rating>("/ratings", { method: "POST", body });
}

// Re-export Token utility
export { getToken as getAccessToken };
