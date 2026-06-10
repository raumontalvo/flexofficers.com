import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { apiGetShift, apiApplyShift, Shift } from "@/src/api/client";
import { useAuth } from "@/src/context/AuthContext";
import { theme } from "@/src/theme";

function fmtDateTime(iso: string) {
  try {
    return new Date(iso).toLocaleString([], {
      weekday: "short", month: "short", day: "numeric",
      hour: "numeric", minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export default function ShiftDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();

  const [shift, setShift] = useState<Shift | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    (async () => {
      try {
        const s = await apiGetShift(id);
        setShift(s);
        if (user && s.applicants.includes(user.id)) setApplied(true);
      } catch (e: any) {
        setToast(e.message || "Failed to load shift");
      } finally {
        setLoading(false);
      }
    })();
  }, [id, user]);

  const onApply = async () => {
    if (!shift) return;
    setApplying(true);
    try {
      const res = await apiApplyShift(shift.id);
      setApplied(true);
      setToast(res.already_applied ? "You've already applied." : "Application sent!");
      setTimeout(() => setToast(null), 2200);
    } catch (e: any) {
      setToast(e.message || "Could not apply.");
      setTimeout(() => setToast(null), 2200);
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.center}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      </SafeAreaView>
    );
  }

  if (!shift) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <Text style={styles.errorText}>Shift not found.</Text>
      </SafeAreaView>
    );
  }

  const isFilling = shift.status === "filling_fast";
  const badgeText = isFilling ? "FILLING FAST" : shift.status === "closed" ? "CLOSED" : "OPEN";
  const badgeColor = isFilling ? theme.colors.fillingFast : theme.colors.open;

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} testID="shift-back-button">
          <Ionicons name="chevron-back" size={26} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Shift Detail</Text>
        <View style={{ width: 26 }} />
      </View>

      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 120 }}>
        <View style={styles.headerBlock}>
          <View style={styles.headerTop}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={styles.title}>{shift.title}</Text>
              <Text style={styles.venue}>{shift.venue}</Text>
            </View>
            <Text style={styles.pay}>${shift.pay_rate.toFixed(0)}/hr</Text>
          </View>
          <View style={[styles.badge, { backgroundColor: `${badgeColor}1A`, alignSelf: "flex-start" }]}>
            <Text style={[styles.badgeText, { color: badgeColor }]}>{badgeText}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <Row icon="location" label="Location" value={`${shift.city}, ${shift.state}`} />
          <Row icon="navigate" label="Distance" value={`${shift.distance_mi.toFixed(1)} mi away`} />
          <Row icon="time-outline" label="Start" value={fmtDateTime(shift.start_time)} />
          <Row icon="time-outline" label="End" value={fmtDateTime(shift.end_time)} />
          <Row icon="people-outline" label="Officers Needed" value={String(shift.officers_needed)} />
          {shift.posted_by_company && (
            <Row icon="business-outline" label="Posted By" value={shift.posted_by_company} />
          )}
        </View>

        <Text style={styles.sectionTitle}>Description</Text>
        <View style={styles.cardSimple}>
          <Text style={styles.body}>{shift.description}</Text>
        </View>

        <Text style={styles.sectionTitle}>Requirements</Text>
        <View style={styles.cardSimple}>
          {shift.requirements.map((r, i) => (
            <View key={i} style={styles.reqRow}>
              <Ionicons name="checkmark-circle" size={16} color={theme.colors.secondary} />
              <Text style={styles.reqText}>{r}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {user?.role === "officer" && (
        <View style={styles.footerBar}>
          <TouchableOpacity
            style={[
              styles.applyBtn,
              (applied || applying) && { backgroundColor: theme.colors.secondary },
            ]}
            onPress={onApply}
            disabled={applying || applied}
            testID="shift-apply-button"
            activeOpacity={0.85}
          >
            {applying ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.applyText}>
                {applied ? "Applied ✓" : "Apply Now"}
              </Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {toast && (
        <View style={styles.toast} testID="shift-toast">
          <Text style={styles.toastText}>{toast}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const Row = ({ icon, label, value }: { icon: any; label: string; value: string }) => (
  <View style={styles.row}>
    <View style={styles.rowLeft}>
      <Ionicons name={icon} size={16} color={theme.colors.textSecondary} />
      <Text style={styles.rowLabel}>{label}</Text>
    </View>
    <Text style={styles.rowValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  errorText: { color: theme.colors.textSecondary, textAlign: "center", marginTop: 40 },
  topBar: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: theme.colors.borderSubtle,
  },
  topTitle: { color: theme.colors.textPrimary, fontSize: 15, fontWeight: "700" },
  headerBlock: { marginBottom: 20 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  title: { color: theme.colors.textPrimary, fontSize: 24, fontWeight: "800", marginBottom: 4 },
  venue: { color: theme.colors.textSecondary, fontSize: 15 },
  pay: { color: theme.colors.primary, fontSize: 22, fontWeight: "900" },
  badge: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  badgeText: { fontSize: 10, fontWeight: "800", letterSpacing: 0.8 },
  card: {
    backgroundColor: theme.colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: theme.colors.borderSubtle,
    padding: 4,
  },
  cardSimple: {
    backgroundColor: theme.colors.surface, borderRadius: 14,
    borderWidth: 1, borderColor: theme.colors.borderSubtle,
    padding: 14,
  },
  sectionTitle: {
    color: theme.colors.textTertiary, fontSize: 11, fontWeight: "800",
    letterSpacing: 1, marginTop: 22, marginBottom: 10, textTransform: "uppercase",
  },
  body: { color: theme.colors.textPrimary, fontSize: 14, lineHeight: 20 },
  reqRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 6 },
  reqText: { color: theme.colors.textPrimary, fontSize: 14 },
  row: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 12, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: theme.colors.borderSubtle,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  rowLabel: { color: theme.colors.textSecondary, fontSize: 13 },
  rowValue: { color: theme.colors.textPrimary, fontSize: 13, fontWeight: "600" },
  footerBar: {
    position: "absolute", left: 0, right: 0, bottom: 0,
    backgroundColor: theme.colors.bg,
    borderTopWidth: 1, borderTopColor: theme.colors.borderSubtle,
    padding: 16,
  },
  applyBtn: {
    backgroundColor: theme.colors.primary, borderRadius: 12,
    paddingVertical: 16, alignItems: "center",
  },
  applyText: { color: "#FFFFFF", fontWeight: "800", fontSize: 16 },
  toast: {
    position: "absolute", left: 20, right: 20, bottom: 100,
    backgroundColor: theme.colors.surfaceElevated, borderRadius: 12,
    paddingHorizontal: 16, paddingVertical: 12,
    borderWidth: 1, borderColor: theme.colors.borderActive,
  },
  toastText: { color: theme.colors.textPrimary, fontSize: 14, textAlign: "center" },
});
