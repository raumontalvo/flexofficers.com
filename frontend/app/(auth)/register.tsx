import React, { useState } from "react";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import { theme } from "@/src/theme";
import { Role } from "@/src/api/client";

export default function Register() {
  const router = useRouter();
  const { register } = useAuth();
  const params = useLocalSearchParams<{ role?: string }>();
  const initialRole: Role = (params.role === "company" ? "company" : "officer") as Role;

  const [role, setRole] = useState<Role>(initialRole);
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    if (!fullName.trim() || !email.trim() || !password) {
      setError("All fields are required.");
      return;
    }
    if (role === "company" && !companyName.trim()) {
      setError("Company name is required.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    try {
      await register({
        email: email.trim().toLowerCase(),
        password,
        full_name: fullName.trim(),
        role,
        company_name: role === "company" ? companyName.trim() : undefined,
      });
      router.replace("/(tabs)");
    } catch (e: any) {
      setError(e.message || "Registration failed");
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
          <TouchableOpacity onPress={() => router.back()} style={styles.back} testID="register-back-button">
            <Ionicons name="chevron-back" size={26} color={theme.colors.textPrimary} />
          </TouchableOpacity>

          <Text style={styles.title}>Create your account</Text>
          <Text style={styles.subtitle}>Join FlexOfficers to staff or work shifts.</Text>

          <View style={styles.roleSwitch}>
            <RoleTab
              label="Officer"
              icon="person"
              active={role === "officer"}
              onPress={() => setRole("officer")}
              testID="role-tab-officer"
            />
            <RoleTab
              label="Company"
              icon="briefcase"
              active={role === "company"}
              onPress={() => setRole("company")}
              testID="role-tab-company"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={fullName}
              onChangeText={setFullName}
              placeholder="Jane Doe"
              placeholderTextColor={theme.colors.textTertiary}
              testID="register-name-input"
            />
          </View>

          {role === "company" && (
            <View style={styles.field}>
              <Text style={styles.label}>Company Name</Text>
              <TextInput
                style={styles.input}
                value={companyName}
                onChangeText={setCompanyName}
                placeholder="Acme Security Corp"
                placeholderTextColor={theme.colors.textTertiary}
                testID="register-company-input"
              />
            </View>
          )}

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
              testID="register-email-input"
            />
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={setPassword}
              placeholder="At least 6 characters"
              placeholderTextColor={theme.colors.textTertiary}
              secureTextEntry
              testID="register-password-input"
            />
          </View>

          {error && (
            <Text style={styles.error} testID="register-error">
              {error}
            </Text>
          )}

          <TouchableOpacity
            style={[styles.btn, submitting && { opacity: 0.7 }]}
            onPress={onSubmit}
            disabled={submitting}
            testID="register-submit-button"
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.btnText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/(auth)/login")}
            style={styles.altRow}
            testID="register-go-login"
          >
            <Text style={styles.altText}>Already have an account?</Text>
            <Text style={styles.altLink}> Log In</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const RoleTab = ({
  label, icon, active, onPress, testID,
}: {
  label: string; icon: any; active: boolean; onPress: () => void; testID: string;
}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.roleTab, active && styles.roleTabActive]}
    testID={testID}
    activeOpacity={0.85}
  >
    <Ionicons name={icon} size={16} color={active ? "#FFFFFF" : theme.colors.textSecondary} />
    <Text style={[styles.roleTabText, active && styles.roleTabTextActive]}>{label}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  scroll: { padding: 20, paddingBottom: 40 },
  back: { width: 40, height: 40, alignItems: "flex-start", justifyContent: "center", marginBottom: 12 },
  title: { color: theme.colors.textPrimary, fontSize: 28, fontWeight: "800", marginBottom: 6 },
  subtitle: { color: theme.colors.textSecondary, fontSize: 14, marginBottom: 20 },
  roleSwitch: {
    flexDirection: "row", backgroundColor: theme.colors.surface,
    borderRadius: 12, padding: 4, marginBottom: 20,
    borderWidth: 1, borderColor: theme.colors.borderSubtle,
  },
  roleTab: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    paddingVertical: 10, borderRadius: 8, gap: 6,
  },
  roleTabActive: { backgroundColor: theme.colors.primary },
  roleTabText: { color: theme.colors.textSecondary, fontWeight: "700", fontSize: 14 },
  roleTabTextActive: { color: "#FFFFFF" },
  field: { marginBottom: 14 },
  label: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: "700", marginBottom: 6, letterSpacing: 0.5 },
  input: {
    backgroundColor: theme.colors.surface, color: theme.colors.textPrimary,
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
