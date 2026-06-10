import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { theme } from "@/src/theme";
import GoogleSignInButton from "@/src/components/GoogleSignInButton";
import { useGoogleWebReturnHandler } from "@/src/hooks/use-google-web-return";

export default function Welcome() {
  useGoogleWebReturnHandler();
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.brandRow}>
          <View style={styles.logo}>
            <Ionicons name="shield-checkmark" size={26} color={theme.colors.primary} />
          </View>
          <View>
            <Text style={styles.brand}>FlexOfficers</Text>
            <Text style={styles.brandSub}>America&apos;s #1 Security Staffing Platform</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.tag}>NATIONWIDE • REAL-TIME • RELIABLE</Text>
          <Text style={styles.title}>
            Fill Open Security Shifts in <Text style={styles.titleAccent}>Minutes</Text>, Not Days.
          </Text>
          <Text style={styles.subtitle}>
            Connect with verified, licensed security officers across the United States and fill shifts faster than ever.
          </Text>
        </View>

        <View style={styles.statsRow}>
          <Stat label="Active Officers" value="25,000+" />
          <Stat label="Companies" value="4,800+" />
          <Stat label="Fill Rate" value="98%" />
          <Stat label="Rating" value="4.9/5" />
        </View>

        <View style={styles.cards}>
          <TouchableOpacity
            style={[styles.roleCard, { backgroundColor: theme.colors.primary }]}
            activeOpacity={0.85}
            onPress={() => router.push({ pathname: "/(auth)/register", params: { role: "company" } })}
            testID="role-company-card"
          >
            <View style={styles.roleIcon}>
              <Ionicons name="briefcase" size={22} color="#FFFFFF" />
            </View>
            <Text style={styles.roleTitle}>I&apos;m Hiring Officers</Text>
            <Text style={styles.roleSub}>Post shifts and hire qualified officers fast.</Text>
            <View style={styles.roleCta}>
              <Text style={styles.roleCtaText}>Post a Shift</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.roleCard, { backgroundColor: theme.colors.secondary }]}
            activeOpacity={0.85}
            onPress={() => router.push({ pathname: "/(auth)/register", params: { role: "officer" } })}
            testID="role-officer-card"
          >
            <View style={styles.roleIcon}>
              <Ionicons name="person" size={22} color="#FFFFFF" />
            </View>
            <Text style={styles.roleTitle}>I&apos;m Looking for Work</Text>
            <Text style={styles.roleSub}>Find shifts that fit your schedule and get paid.</Text>
            <View style={styles.roleCta}>
              <Text style={styles.roleCtaText}>Find Shifts</Text>
              <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={styles.verifyRow}>
          <VerifyChip icon="checkmark-circle" label="Background Checked" />
          <VerifyChip icon="shield-checkmark" label="State Licensed" />
          <VerifyChip icon="id-card" label="ID Verified" />
          <VerifyChip icon="ribbon" label="Insured & Bonded" />
        </View>

        <View style={styles.dividerRow}>
          <View style={styles.divLine} />
          <Text style={styles.divText}>OR</Text>
          <View style={styles.divLine} />
        </View>

        <GoogleSignInButton role="officer" label="Continue with Google" testID="welcome-google-button" />

        <Link href="/(auth)/login" asChild>
          <TouchableOpacity style={styles.loginRow} testID="welcome-login-link">
            <Text style={styles.loginText}>Already have an account?</Text>
            <Text style={styles.loginLink}> Log In</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const Stat = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.stat}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const VerifyChip = ({ icon, label }: { icon: any; label: string }) => (
  <View style={styles.chip}>
    <Ionicons name={icon} size={14} color={theme.colors.secondary} />
    <Text style={styles.chipText}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  scroll: { padding: 20, paddingBottom: 40 },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 28 },
  logo: {
    width: 42, height: 42, borderRadius: 10,
    backgroundColor: "rgba(44,123,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  brand: { color: theme.colors.textPrimary, fontSize: 18, fontWeight: "800" },
  brandSub: { color: theme.colors.textSecondary, fontSize: 11 },
  hero: { marginBottom: 24 },
  tag: { color: theme.colors.primary, fontSize: 11, fontWeight: "700", letterSpacing: 1.5, marginBottom: 8 },
  title: { color: theme.colors.textPrimary, fontSize: 30, fontWeight: "900", lineHeight: 36, marginBottom: 12 },
  titleAccent: { color: theme.colors.primary },
  subtitle: { color: theme.colors.textSecondary, fontSize: 14, lineHeight: 20 },
  statsRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 28, gap: 8 },
  stat: { flex: 1, alignItems: "flex-start" },
  statValue: { color: theme.colors.textPrimary, fontSize: 16, fontWeight: "800" },
  statLabel: { color: theme.colors.textSecondary, fontSize: 10, marginTop: 2 },
  cards: { gap: 12, marginBottom: 24 },
  roleCard: { borderRadius: 16, padding: 20 },
  roleIcon: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center", justifyContent: "center", marginBottom: 12,
  },
  roleTitle: { color: "#FFFFFF", fontSize: 18, fontWeight: "800", marginBottom: 4 },
  roleSub: { color: "rgba(255,255,255,0.85)", fontSize: 13, marginBottom: 16 },
  roleCta: { flexDirection: "row", alignItems: "center", gap: 6 },
  roleCtaText: { color: "#FFFFFF", fontSize: 14, fontWeight: "700" },
  verifyRow: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 24, justifyContent: "center" },
  chip: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 10, paddingVertical: 6,
    backgroundColor: theme.colors.surface, borderRadius: 8,
    borderWidth: 1, borderColor: theme.colors.borderSubtle,
  },
  chipText: { color: theme.colors.textSecondary, fontSize: 11, fontWeight: "600" },
  loginRow: { flexDirection: "row", justifyContent: "center", marginTop: 8 },
  loginText: { color: theme.colors.textSecondary, fontSize: 14 },
  loginLink: { color: theme.colors.primary, fontSize: 14, fontWeight: "700" },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 10, marginVertical: 16 },
  divLine: { flex: 1, height: 1, backgroundColor: theme.colors.borderSubtle },
  divText: { color: theme.colors.textTertiary, fontSize: 11, fontWeight: "700", letterSpacing: 1 },
});
