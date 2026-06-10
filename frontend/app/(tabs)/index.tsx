import React, { useCallback, useEffect, useState } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl,
  ActivityIndicator, ScrollView, Modal, Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { apiListShifts, apiListCities, Shift } from "@/src/api/client";
import { useAuth } from "@/src/context/AuthContext";
import { theme } from "@/src/theme";
import ShiftCard from "@/src/components/ShiftCard";
import { useUserLocation } from "@/src/hooks/use-user-location";

const FILTERS: { key: string; label: string }[] = [
  { key: "all", label: "All Shifts" },
  { key: "open", label: "Open" },
  { key: "filling_fast", label: "Filling Fast" },
];

export default function Browse() {
  const router = useRouter();
  const { user } = useAuth();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>("all");
  const [error, setError] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>(["All Cities"]);
  const [selectedCity, setSelectedCity] = useState<string>("All Cities");
  const [cityModal, setCityModal] = useState(false);
  const { coords, denied, request: requestLocation } = useUserLocation(true);

  const load = useCallback(
    async (f: string, city: string) => {
      setError(null);
      try {
        const data = await apiListShifts(f, city, coords?.lat ?? null, coords?.lng ?? null);
        setShifts(data);
      } catch (e: any) {
        setError(e.message || "Failed to load shifts");
      }
    },
    [coords]
  );

  useEffect(() => {
    (async () => {
      try {
        const cs = await apiListCities();
        setCities(cs);
      } catch {}
    })();
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      await load(filter, selectedCity);
      if (mounted) setLoading(false);
    })();
    return () => {
      mounted = false;
    };
  }, [filter, selectedCity, load]);

  useFocusEffect(
    useCallback(() => {
      load(filter, selectedCity);
    }, [filter, selectedCity, load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load(filter, selectedCity);
    setRefreshing(false);
  };

  const stickyHeader = (
    <View style={styles.headerWrap}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.locRow}
          onPress={() => setCityModal(true)}
          testID="location-selector-button"
          activeOpacity={0.7}
        >
          <Ionicons name="location" size={18} color={theme.colors.primary} />
          <Text style={styles.locText}>{selectedCity}</Text>
          <Ionicons name="chevron-down" size={16} color={theme.colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity testID="notifications-button" style={styles.bell}>
          <Ionicons name="notifications-outline" size={22} color={theme.colors.textPrimary} />
          <View style={styles.bellDot} />
        </TouchableOpacity>
      </View>

      <Text style={styles.heading}>
        {user?.role === "company" ? "Browse Talent Pool" : "Available Shifts"}
      </Text>
      <View style={styles.subRow}>
        <Text style={styles.sub}>
          {coords
            ? "Sorted by distance from you"
            : denied
            ? "Enable location for distance sort"
            : "Find your next paying shift"}
        </Text>
        {!coords && denied && (
          <TouchableOpacity onPress={requestLocation} testID="retry-location-button">
            <Text style={styles.subLink}>Enable</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.filterRow}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTERS.map((f) => {
            const active = filter === f.key;
            return (
              <TouchableOpacity
                key={f.key}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setFilter(f.key)}
                testID={`filter-chip-${f.key}`}
                activeOpacity={0.85}
              >
                <Text style={[styles.chipText, active && styles.chipTextActive]}>{f.label}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={shifts}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={stickyHeader}
          stickyHeaderIndices={[0]}
          renderItem={({ item, index }) => (
            <ShiftCard
              shift={item}
              onPress={() => router.push(`/shift/${item.id}`)}
              testID={`shift-card-${index}`}
            />
          )}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 24 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="search-outline" size={36} color={theme.colors.textTertiary} />
              <Text style={styles.emptyText}>
                {error ? error : "No shifts available right now."}
              </Text>
            </View>
          }
        />
      )}

      <Modal
        visible={cityModal}
        transparent
        animationType="slide"
        onRequestClose={() => setCityModal(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setCityModal(false)} />
        <View style={styles.modalSheet}>
          <View style={styles.modalHandle} />
          <Text style={styles.modalTitle}>Select Location</Text>
          <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
            {cities.map((c) => {
              const active = c === selectedCity;
              return (
                <TouchableOpacity
                  key={c}
                  style={[styles.cityRow, active && styles.cityRowActive]}
                  onPress={() => {
                    setSelectedCity(c);
                    setCityModal(false);
                  }}
                  testID={`city-option-${c}`}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={active ? "radio-button-on" : "radio-button-off"}
                    size={18}
                    color={active ? theme.colors.primary : theme.colors.textTertiary}
                  />
                  <Text style={[styles.cityText, active && { color: theme.colors.primary }]}>{c}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  headerWrap: { backgroundColor: theme.colors.bg, paddingTop: 8, paddingBottom: 12, marginHorizontal: -16, paddingHorizontal: 16 },
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  locRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  locText: { color: theme.colors.textPrimary, fontWeight: "700", fontSize: 15 },
  bell: { padding: 4 },
  bellDot: {
    position: "absolute", top: 4, right: 4,
    width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.danger,
  },
  heading: { color: theme.colors.textPrimary, fontSize: 26, fontWeight: "800", marginBottom: 4 },
  subRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 14 },
  sub: { color: theme.colors.textSecondary, fontSize: 13 },
  subLink: { color: theme.colors.primary, fontSize: 13, fontWeight: "700" },
  filterRow: { height: 44, marginHorizontal: -16 },
  filterScroll: { paddingHorizontal: 16, gap: 8, alignItems: "center" },
  chip: {
    height: 36, paddingHorizontal: 14, borderRadius: 18,
    backgroundColor: theme.colors.surface, alignItems: "center", justifyContent: "center",
    borderWidth: 1, borderColor: theme.colors.borderSubtle, flexShrink: 0,
  },
  chipActive: {
    backgroundColor: "rgba(44,123,255,0.15)",
    borderColor: theme.colors.primary,
  },
  chipText: { color: theme.colors.textSecondary, fontWeight: "600", fontSize: 13 },
  chipTextActive: { color: theme.colors.primary },
  empty: { alignItems: "center", justifyContent: "center", padding: 40 },
  emptyText: { color: theme.colors.textSecondary, marginTop: 10, fontSize: 14, textAlign: "center" },
  modalBackdrop: { flex: 1, backgroundColor: theme.colors.overlay },
  modalSheet: {
    backgroundColor: theme.colors.surface, borderTopLeftRadius: 20, borderTopRightRadius: 20,
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 30, maxHeight: "70%",
    borderTopWidth: 1, borderLeftWidth: 1, borderRightWidth: 1, borderColor: theme.colors.borderActive,
  },
  modalHandle: {
    alignSelf: "center", width: 40, height: 4, borderRadius: 2,
    backgroundColor: theme.colors.borderActive, marginBottom: 14,
  },
  modalTitle: { color: theme.colors.textPrimary, fontSize: 18, fontWeight: "800", marginBottom: 14 },
  cityRow: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingVertical: 14, paddingHorizontal: 8,
    borderBottomWidth: 1, borderBottomColor: theme.colors.borderSubtle,
  },
  cityRowActive: {},
  cityText: { color: theme.colors.textPrimary, fontSize: 15, fontWeight: "600" },
});
