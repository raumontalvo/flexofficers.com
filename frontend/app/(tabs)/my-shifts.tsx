import React, { useCallback, useState } from "react";
import {
  View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { apiMyApplications, apiMyPostedShifts, Shift } from "@/src/api/client";
import { useAuth } from "@/src/context/AuthContext";
import { theme } from "@/src/theme";
import ShiftCard from "@/src/components/ShiftCard";

export default function MyShifts() {
  const router = useRouter();
  const { user } = useAuth();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const load = useCallback(async () => {
    try {
      const data =
        user?.role === "company" ? await apiMyPostedShifts() : await apiMyApplications();
      setShifts(data);
    } catch {
      setShifts([]);
    }
  }, [user?.role]);

  useFocusEffect(
    useCallback(() => {
      let mounted = true;
      (async () => {
        setLoading(true);
        await load();
        if (mounted) setLoading(false);
      })();
      return () => {
        mounted = false;
      };
    }, [load])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>My Shifts</Text>
          <Text style={styles.sub}>
            {user?.role === "company" ? "Shifts you've posted." : "Shifts you've applied to."}
          </Text>
        </View>
        {user?.role === "company" && (
          <TouchableOpacity
            style={styles.postBtn}
            onPress={() => router.push("/post-shift")}
            testID="post-shift-fab"
          >
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={shifts}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => (
            <ShiftCard
              shift={item}
              onPress={() => router.push(`/shift/${item.id}`)}
              testID={`my-shift-${index}`}
            />
          )}
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={theme.colors.primary}
            />
          }
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="briefcase-outline" size={36} color={theme.colors.textTertiary} />
              <Text style={styles.emptyText}>
                {user?.role === "company"
                  ? "You haven't posted any shifts yet. Tap + to post one."
                  : "You haven't applied to any shifts yet. Browse and apply!"}
              </Text>
              {user?.role === "officer" && (
                <TouchableOpacity
                  style={styles.emptyBtn}
                  onPress={() => router.push("/(tabs)")}
                  testID="empty-browse-button"
                >
                  <Text style={styles.emptyBtnText}>Browse Shifts</Text>
                </TouchableOpacity>
              )}
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  header: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16,
  },
  title: { color: theme.colors.textPrimary, fontSize: 26, fontWeight: "800" },
  sub: { color: theme.colors.textSecondary, fontSize: 13, marginTop: 2 },
  postBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: theme.colors.primary,
    alignItems: "center", justifyContent: "center",
  },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  empty: { alignItems: "center", padding: 40 },
  emptyText: { color: theme.colors.textSecondary, marginTop: 12, fontSize: 14, textAlign: "center" },
  emptyBtn: {
    marginTop: 18, backgroundColor: theme.colors.primary,
    paddingHorizontal: 20, paddingVertical: 12, borderRadius: 10,
  },
  emptyBtnText: { color: "#FFFFFF", fontWeight: "700" },
});
