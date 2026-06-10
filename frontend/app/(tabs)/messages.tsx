import React, { useCallback, useState } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useFocusEffect } from "expo-router";
import { apiListConversations, Conversation } from "@/src/api/client";
import { theme } from "@/src/theme";

function fmtTime(iso?: string | null) {
  if (!iso) return "";
  try {
    const d = new Date(iso);
    const now = new Date();
    if (d.toDateString() === now.toDateString()) {
      return d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
    }
    return d.toLocaleDateString([], { month: "short", day: "numeric" });
  } catch {
    return "";
  }
}

export default function Messages() {
  const router = useRouter();
  const [items, setItems] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const data = await apiListConversations();
      setItems(data);
    } catch {
      setItems([]);
    }
  }, []);

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

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.sub}>Per-shift chat — talk to your team in real time.</Text>
      </View>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.shift_id}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.row}
              testID={`conv-${index}`}
              onPress={() => router.push(`/chat/${item.shift_id}`)}
              activeOpacity={0.8}
            >
              <View style={styles.avatar}>
                <Ionicons name="chatbubble-ellipses" size={20} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.rowTop}>
                  <Text style={styles.name} numberOfLines={1}>
                    {item.shift_title} · {item.venue}
                  </Text>
                  <Text style={styles.time}>{fmtTime(item.last_time)}</Text>
                </View>
                <Text style={styles.preview} numberOfLines={1}>
                  {item.last_message || `Start a conversation with ${item.other_party_name}.`}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ padding: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="chatbubbles-outline" size={36} color={theme.colors.textTertiary} />
              <Text style={styles.emptyText}>
                No conversations yet. Apply to a shift (or post one) to start chatting.
              </Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 12 },
  title: { color: theme.colors.textPrimary, fontSize: 26, fontWeight: "800" },
  sub: { color: theme.colors.textSecondary, fontSize: 13, marginTop: 2 },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  row: {
    flexDirection: "row", alignItems: "center", gap: 12,
    padding: 14, backgroundColor: theme.colors.surface, borderRadius: 12,
    borderWidth: 1, borderColor: theme.colors.borderSubtle,
  },
  avatar: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: "rgba(44,123,255,0.15)",
    alignItems: "center", justifyContent: "center",
  },
  rowTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  name: { color: theme.colors.textPrimary, fontWeight: "700", fontSize: 14, flex: 1, marginRight: 8 },
  time: { color: theme.colors.textTertiary, fontSize: 11 },
  preview: { color: theme.colors.textSecondary, fontSize: 13, marginTop: 4 },
  empty: { alignItems: "center", padding: 40 },
  emptyText: { color: theme.colors.textSecondary, marginTop: 10, fontSize: 14, textAlign: "center" },
});
