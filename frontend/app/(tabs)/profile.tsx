import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, TouchableOpacity, ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "@/src/context/AuthContext";
import { theme } from "@/src/theme";
import { apiGetUserRatings, RatingsSummary } from "@/src/api/client";
import StarRating from "@/src/components/StarRating";

export default function Profile() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [ratings, setRatings] = useState<RatingsSummary | null>(null);

  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const r = await apiGetUserRatings(user.id);
        setRatings(r);
      } catch {}
    })();
  }, [user]);

  const onLogout = async () => {
    await logout();
    router.replace("/(auth)/welcome");
  };

  if (!user) return null;

  const verifyItems: { key: keyof typeof user.verified; label: string; icon: any }[] = [
    { key: "background", label: "Background Checked", icon: "checkmark-circle" },
    { key: "licensed", label: "State Licensed", icon: "shield-checkmark" },
    { key: "id_verified", label: "ID Verified", icon: "id-card" },
    { key: "insured", label: "Insured & Bonded", icon: "ribbon" },
  ];

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {user.full_name.split(" ").map((s) => s[0]).slice(0, 2).join("").toUpperCase()}
            </Text>
          </View>
          <Text style={styles.name}>{user.full_name}</Text>
          <Text style={styles.email}>{user.email}</Text>
          <View style={styles.roleBadge}>
            <Ionicons
              name={user.role === "company" ? "briefcase" : "person"}
              size={12}
              color={theme.colors.primary}
            />
            <Text style={styles.roleBadgeText}>
              {user.role === "company" ? "Company" : "Officer"}
            </Text>
          </View>
          {user.company_name && (
            <Text style={styles.company}>{user.company_name}</Text>
          )}
          {ratings && ratings.count > 0 && (
            <View style={styles.ratingPill} testID="profile-rating-pill">
              <StarRating value={ratings.average} size={14} />
              <Text style={styles.ratingPillText}>
                {ratings.average.toFixed(1)} ({ratings.count})
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.sectionTitle}>Verifications</Text>
        <View style={styles.card}>
          {verifyItems.map((v, idx) => (
            <View
              key={v.key}
              style={[styles.verifyRow, idx < verifyItems.length - 1 && styles.verifyDivider]}
            >
              <View style={styles.verifyLeft}>
                <Ionicons name={v.icon} size={18} color={theme.colors.secondary} />
                <Text style={styles.verifyLabel}>{v.label}</Text>
              </View>
              <Ionicons
                name={user.verified[v.key] ? "checkmark-circle" : "close-circle"}
                size={20}
                color={user.verified[v.key] ? theme.colors.secondary : theme.colors.textTertiary}
              />
            </View>
          ))}
        </View>

        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <Row icon="location" label="Location" value={user.location || "Miami, FL"} />
          <View style={styles.divider} />
          <Row icon="notifications-outline" label="Notifications" value="On" />
          <View style={styles.divider} />
          <Row icon="help-circle-outline" label="Help & Support" value="" chevron />
        </View>

        <TouchableOpacity
          style={styles.logoutBtn}
          onPress={onLogout}
          testID="profile-logout-button"
          activeOpacity={0.85}
        >
          <Ionicons name="log-out-outline" size={18} color={theme.colors.danger} />
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>

        <Text style={styles.brandFooter}>FlexOfficers &middot; America&apos;s #1 Security Staffing Platform</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const Row = ({
  icon, label, value, chevron,
}: {
  icon: any; label: string; value?: string; chevron?: boolean;
}) => (
  <View style={styles.row}>
    <View style={styles.rowLeft}>
      <Ionicons name={icon} size={18} color={theme.colors.textSecondary} />
      <Text style={styles.rowLabel}>{label}</Text>
    </View>
    <View style={styles.rowRight}>
      {value ? <Text style={styles.rowValue}>{value}</Text> : null}
      {chevron && <Ionicons name="chevron-forward" size={16} color={theme.colors.textTertiary} />}
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  header: { alignItems: "center", paddingVertical: 20 },
  avatar: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "rgba(44,123,255,0.15)",
    borderWidth: 2, borderColor: theme.colors.primary,
    alignItems: "center", justifyContent: "center", marginBottom: 12,
  },
  avatarText: { color: theme.colors.primary, fontSize: 26, fontWeight: "900" },
  name: { color: theme.colors.textPrimary, fontSize: 22, fontWeight: "800" },
  email: { color: theme.colors.textSecondary, fontSize: 13, marginTop: 4 },
  roleBadge: {
    flexDirection: "row", alignItems: "center", gap: 5, marginTop: 10,
    paddingHorizontal: 10, paddingVertical: 5,
    backgroundColor: "rgba(44,123,255,0.15)", borderRadius: 8,
  },
  roleBadgeText: { color: theme.colors.primary, fontSize: 11, fontWeight: "700", letterSpacing: 0.5 },
  company: { color: theme.colors.textSecondary, marginTop: 6, fontSize: 13 },
  ratingPill: {
    flexDirection: "row", alignItems: "center", gap: 6, marginTop: 10,
    paddingHorizontal: 10, paddingVertical: 5,
    backgroundColor: "rgba(245,158,11,0.12)", borderRadius: 8,
  },
  ratingPillText: { color: "#F59E0B", fontSize: 12, fontWeight: "700" },
  sectionTitle: {
    color: theme.colors.textTertiary, fontSize: 11, fontWeight: "800",
    letterSpacing: 1, marginTop: 24, marginBottom: 10, textTransform: "uppercase",
  },
  card: {
    backgroundColor: theme.colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: theme.colors.borderSubtle, padding: 4,
  },
  verifyRow: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 14, paddingVertical: 14,
  },
  verifyDivider: { borderBottomWidth: 1, borderBottomColor: theme.colors.borderSubtle },
  verifyLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  verifyLabel: { color: theme.colors.textPrimary, fontSize: 14, fontWeight: "600" },
  row: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 14, paddingVertical: 14,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  rowRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  rowLabel: { color: theme.colors.textPrimary, fontSize: 14 },
  rowValue: { color: theme.colors.textSecondary, fontSize: 13 },
  divider: { height: 1, backgroundColor: theme.colors.borderSubtle, marginLeft: 14 },
  logoutBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8,
    marginTop: 22, paddingVertical: 14, borderRadius: 12,
    backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.borderSubtle,
  },
  logoutText: { color: theme.colors.danger, fontWeight: "700", fontSize: 14 },
  brandFooter: {
    textAlign: "center", color: theme.colors.textTertiary,
    fontSize: 11, marginTop: 28,
  },
});
