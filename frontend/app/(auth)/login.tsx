import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import { theme } from "@/src/theme";

export default function Login() {
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await login(email.trim().toLowerCase(), password);
      router.replace("/(tabs)");
    } catch (e: any) {
      setError(e.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <TouchableOpacity onPress={() => router.back()} style={styles.back} testID="login-back-button">
            <Ionicons name="chevron-back" size={26} color={theme.colors.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Log in to manage your shifts.</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="you@example.com"
              placeholderTextColor={theme.colors.textTertiary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              testID="login-email-input"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="Enter password"
              placeholderTextColor={theme.colors.textTertiary}
              secureTextEntry
              testID="login-password-input"
            />
          </View>

          {error && (
            <Text style={styles.error} testID="login-error">
              {error}
            </Text>
          )}

          <TouchableOpacity
            style={[styles.btn, submitting && { opacity: 0.7 }]}
            onPress={onSubmit}
            disabled={submitting}
            testID="login-submit-button"
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.btnText}>Log In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/(auth)/welcome")}
            style={styles.altRow}
            testID="login-go-register"
          >
            <Text style={styles.altText}>New here?</Text>
            <Text style={styles.altLink}> Create an account</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  scroll: { padding: 20 },
  back: { width: 40, height: 40, alignItems: "flex-start", justifyContent: "center", marginBottom: 12 },
  title: { color: theme.colors.textPrimary, fontSize: 28, fontWeight: "800", marginBottom: 6 },
  subtitle: { color: theme.colors.textSecondary, fontSize: 14, marginBottom: 28 },
  field: { marginBottom: 16 },
  label: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: "700", marginBottom: 6, letterSpacing: 0.5 },
  input: {
    backgroundColor: theme.colors.surface,
    color: theme.colors.textPrimary,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14,
    fontSize: 15, borderWidth: 1, borderColor: theme.colors.borderSubtle,
  },
  btn: {
    backgroundColor: theme.colors.primary, borderRadius: 12,
    paddingVertical: 16, alignItems: "center", marginTop: 8,
  },
  btnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  error: { color: theme.colors.danger, fontSize: 13, marginBottom: 8 },
  altRow: { flexDirection: "row", justifyContent: "center", marginTop: 20 },
  altText: { color: theme.colors.textSecondary, fontSize: 14 },
  altLink: { color: theme.colors.primary, fontSize: 14, fontWeight: "700" },
});
