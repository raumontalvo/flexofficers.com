import React, { useEffect, useState } from "react";
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { apiListMessages, Conversation } from "@/src/api/client";
import { theme } from "@/src/theme";

export default function Messages() {
  const [items, setItems] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await apiListMessages();
        if (mounted) setItems(data);
      } catch {
        if (mounted) setItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Messages</Text>
        <Text style={styles.sub}>Stay in touch with dispatch and site leads.</Text>
      </View>
      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(i) => i.id}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              style={styles.row}
              testID={`conv-${index}`}
              activeOpacity={0.8}
            >
              <View style={styles.avatar}>
                <Ionicons name="chatbubble-ellipses" size={20} color={theme.colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.rowTop}>
                  <Text style={styles.name} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <Text style={styles.time}>{item.time}</Text>
                </View>
                <View style={styles.rowBottom}>
                  <Text style={styles.preview} numberOfLines={1}>
                    {item.last_message}
                  </Text>
                  {item.unread > 0 && (
                    <View style={styles.unread}>
                      <Text style={styles.unreadText}>{item.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ padding: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
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
  rowBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 4 },
  name: { color: theme.colors.textPrimary, fontWeight: "700", fontSize: 14, flex: 1, marginRight: 8 },
  time: { color: theme.colors.textTertiary, fontSize: 11 },
  preview: { color: theme.colors.textSecondary, fontSize: 13, flex: 1, marginRight: 8 },
  unread: {
    minWidth: 20, height: 20, borderRadius: 10, paddingHorizontal: 6,
    backgroundColor: theme.colors.primary, alignItems: "center", justifyContent: "center",
  },
  unreadText: { color: "#FFFFFF", fontSize: 11, fontWeight: "800" },
});
