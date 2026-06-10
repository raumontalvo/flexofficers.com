import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/src/theme";
import { Shift } from "@/src/api/client";

function formatTimeRange(start: string, end: string) {
  try {
    const s = new Date(start);
    const e = new Date(end);
    const opts: Intl.DateTimeFormatOptions = { hour: "numeric", minute: "2-digit" };
    return `${s.toLocaleTimeString([], opts)} – ${e.toLocaleTimeString([], opts)}`;
  } catch {
    return "";
  }
}

function formatDate(start: string) {
  try {
    const s = new Date(start);
    return s.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

type Props = {
  shift: Shift;
  onPress: () => void;
  testID?: string;
};

const ShiftCard: React.FC<Props> = ({ shift, onPress, testID }) => {
  const isFilling = shift.status === "filling_fast";
  const badgeText = isFilling ? "FILLING FAST" : shift.status === "closed" ? "CLOSED" : "OPEN";
  const badgeColor = isFilling ? theme.colors.fillingFast : theme.colors.open;

  return (
    <View style={styles.card} testID={testID}>
      <View style={styles.headerRow}>
        <View style={{ flex: 1, paddingRight: 12 }}>
          <Text style={styles.title} numberOfLines={1}>
            {shift.title}
          </Text>
          <Text style={styles.venue} numberOfLines={1}>
            {shift.venue}
          </Text>
          <View style={styles.locRow}>
            <Ionicons name="location-outline" size={14} color={theme.colors.textSecondary} />
            <Text style={styles.locText}>
              {shift.city}, {shift.state}
            </Text>
          </View>
        </View>
        <Text style={styles.pay}>${shift.pay_rate.toFixed(0)}/hr</Text>
      </View>

      <View style={styles.timeRow}>
        <View>
          <Text style={styles.time}>{formatTimeRange(shift.start_time, shift.end_time)}</Text>
          <Text style={styles.date}>{formatDate(shift.start_time)}</Text>
        </View>
        <View style={[styles.badge, { backgroundColor: `${badgeColor}1A` }]}>
          <Text style={[styles.badgeText, { color: badgeColor }]}>{badgeText}</Text>
        </View>
      </View>

      <View style={styles.metaRow}>
        <View style={styles.metaItem}>
          <Ionicons name="people-outline" size={14} color={theme.colors.textSecondary} />
          <Text style={styles.metaText}>
            {shift.officers_needed} Officer{shift.officers_needed > 1 ? "s" : ""} Needed
          </Text>
        </View>
        <Text style={styles.metaText}>{shift.distance_mi.toFixed(1)} mi away</Text>
      </View>

      <TouchableOpacity
        style={styles.cta}
        onPress={onPress}
        testID={`${testID || "shift"}-view-button`}
        activeOpacity={0.8}
      >
        <Text style={styles.ctaText}>View Shift</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.lg,
    borderWidth: 1,
    borderColor: theme.colors.borderSubtle,
    padding: 16,
    marginBottom: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  title: {
    color: theme.colors.textPrimary,
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 2,
  },
  venue: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },
  locRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  pay: {
    color: theme.colors.primary,
    fontSize: 18,
    fontWeight: "800",
  },
  timeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  time: {
    color: theme.colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },
  date: {
    color: theme.colors.textSecondary,
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 0.8,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    color: theme.colors.textSecondary,
    fontSize: 12,
  },
  cta: {
    backgroundColor: theme.colors.primary,
    borderRadius: theme.radii.md,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  ctaText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
});

export default ShiftCard;
