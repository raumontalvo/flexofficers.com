import React, { useEffect, useState } from "react";
import { TouchableOpacity, Text, StyleSheet, Platform, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { Role, apiAppleAuth, setToken } from "@/src/api/client";
import { useAuth } from "@/src/context/AuthContext";

type Props = { role?: Role; testID?: string };

export default function AppleSignInButton({ role = "officer", testID = "apple-signin-button" }: Props) {
  const { refresh } = useAuth();
  const router = useRouter();
  const [available, setAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (Platform.OS !== "ios") {
      setAvailable(false);
      return;
    }
    (async () => {
      try {
        const Apple = await import("expo-apple-authentication");
        const ok = await Apple.isAvailableAsync();
        setAvailable(ok);
      } catch {
        setAvailable(false);
      }
    })();
  }, []);

  if (!available) return null;

  const onPress = async () => {
    setLoading(true);
    try {
      const Apple = await import("expo-apple-authentication");
      const creds = await Apple.signInAsync({
        requestedScopes: [
          Apple.AppleAuthenticationScope.FULL_NAME,
          Apple.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (!creds.identityToken) return;
      const fullName = creds.fullName
        ? [creds.fullName.givenName, creds.fullName.familyName].filter(Boolean).join(" ")
        : undefined;
      const res = await apiAppleAuth({
        identity_token: creds.identityToken,
        email: creds.email || undefined,
        full_name: fullName,
        role,
      });
      await setToken(res.access_token);
      await refresh();
      router.replace("/(tabs)");
    } catch (e) {
      console.log("Apple sign-in failed:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity style={styles.btn} onPress={onPress} disabled={loading} testID={testID} activeOpacity={0.85}>
      {loading ? (
        <ActivityIndicator color="#FFFFFF" />
      ) : (
        <>
          <Text style={styles.logo}>{""}</Text>
          <Text style={styles.label}>Continue with Apple</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  btn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10,
    borderRadius: 12, paddingVertical: 14, backgroundColor: "#000000", marginTop: 10,
  },
  logo: { color: "#FFFFFF", fontSize: 18, fontWeight: "900" },
  label: { color: "#FFFFFF", fontWeight: "700", fontSize: 15 },
});
