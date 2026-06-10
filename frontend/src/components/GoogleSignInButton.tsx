import React, { useState } from "react";
import { TouchableOpacity, Text, StyleSheet, Platform, ActivityIndicator } from "react-native";
import * as WebBrowser from "expo-web-browser";
import * as Linking from "expo-linking";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import { theme } from "@/src/theme";
import { Role } from "@/src/api/client";

const EMERGENT_AUTH_URL = "https://auth.emergentagent.com";

type Props = {
  role?: Role;
  label?: string;
  testID?: string;
};

export default function GoogleSignInButton({
  role = "officer",
  label = "Continue with Google",
  testID = "google-signin-button",
}: Props) {
  const { loginWithGoogle } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handlePress = async () => {
    setLoading(true);
    try {
      if (Platform.OS === "web") {
        // Web flow: hard redirect; AuthContext bootstrap reads session_id on return.
        const redirect = window.location.origin + "/";
        window.localStorage.setItem("pending_google_role", role);
        window.location.href = `${EMERGENT_AUTH_URL}/?redirect=${encodeURIComponent(redirect)}`;
        return;
      }

      const redirectUrl = Linking.createURL("auth");
      const authUrl = `${EMERGENT_AUTH_URL}/?redirect=${encodeURIComponent(redirectUrl)}`;
      const result = await WebBrowser.openAuthSessionAsync(authUrl, redirectUrl);

      if (result.type !== "success" || !result.url) {
        setLoading(false);
        return;
      }

      const parsed = Linking.parse(result.url);
      // session_id may come back as hash fragment (#session_id=...) — Linking.parse drops fragments,
      // so also inspect raw URL.
      let sessionId = (parsed.queryParams?.session_id as string) || null;
      if (!sessionId) {
        const m = result.url.match(/[#?&]session_id=([^&]+)/);
        if (m) sessionId = decodeURIComponent(m[1]);
      }
      if (!sessionId) {
        setLoading(false);
        return;
      }

      const data = await fetchSessionData(sessionId);
      await loginWithGoogle(data.session_token, role);
      router.replace("/(tabs)");
    } catch (e) {
      // swallow — user can retry. Console-log only.
      console.log("Google sign-in failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity
      style={styles.btn}
      onPress={handlePress}
      disabled={loading}
      testID={testID}
      activeOpacity={0.85}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <>
          <Text style={styles.g}>G</Text>
          <Text style={styles.label}>{label}</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

async function fetchSessionData(sessionId: string) {
  const res = await fetch(
    "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
    { headers: { "X-Session-ID": sessionId } }
  );
  if (!res.ok) throw new Error("Session lookup failed");
  return (await res.json()) as {
    id: string;
    email: string;
    name: string;
    picture: string;
    session_token: string;
  };
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderRadius: 12,
    paddingVertical: 14,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  g: {
    color: "#4285F4",
    fontWeight: "900",
    fontSize: 18,
  },
  label: {
    color: "#1F2937",
    fontWeight: "700",
    fontSize: 15,
  },
});
