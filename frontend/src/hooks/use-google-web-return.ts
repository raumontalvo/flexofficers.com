// Web-side handler: detects ?session_id= or #session_id= in URL on app mount
// and completes Google sign-in via the AuthContext. No-op on native.

import { useEffect } from "react";
import { Platform } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import { Role } from "@/src/api/client";

export function useGoogleWebReturnHandler() {
  const { loginWithGoogle, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (Platform.OS !== "web") return;
    if (user) return; // already signed in
    if (typeof window === "undefined") return;

    const hashMatch = window.location.hash.match(/session_id=([^&]+)/);
    const queryMatch = window.location.search.match(/[?&]session_id=([^&]+)/);
    const sessionId =
      (hashMatch && decodeURIComponent(hashMatch[1])) ||
      (queryMatch && decodeURIComponent(queryMatch[1])) ||
      null;
    if (!sessionId) return;

    const pendingRole = (window.localStorage.getItem("pending_google_role") as Role) || "officer";

    (async () => {
      try {
        const res = await fetch(
          "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
          { headers: { "X-Session-ID": sessionId } }
        );
        if (!res.ok) throw new Error("Session lookup failed");
        const data = (await res.json()) as { session_token: string };
        await loginWithGoogle(data.session_token, pendingRole);
        window.localStorage.removeItem("pending_google_role");
        // Clean URL (remove session_id fragment / query)
        window.history.replaceState(null, "", window.location.pathname);
        router.replace("/(tabs)");
      } catch (e) {
        console.log("Google web return handler error:", e);
      }
    })();
  }, [user, loginWithGoogle, router]);
}
