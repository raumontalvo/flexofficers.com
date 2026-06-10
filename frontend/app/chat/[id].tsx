import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, ActivityIndicator,
  KeyboardAvoidingView, Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  apiGetMessages,
  apiPostMessage,
  buildChatWsUrl,
  getAccessToken,
  ChatMessage,
} from "@/src/api/client";
import { useAuth } from "@/src/context/AuthContext";
import { theme } from "@/src/theme";

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const scrollToEnd = useCallback(() => {
    setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 50);
  }, []);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    (async () => {
      try {
        const history = await apiGetMessages(id);
        if (!cancelled) {
          setMessages(history);
          scrollToEnd();
        }
      } catch {}
      finally {
        if (!cancelled) setLoading(false);
      }

      // Connect WS
      const token = await getAccessToken();
      if (!token) return;
      const url = buildChatWsUrl(id, token);
      const ws = new WebSocket(url);
      wsRef.current = ws;
      ws.onmessage = (evt) => {
        try {
          const msg = JSON.parse(evt.data) as ChatMessage;
          setMessages((prev) => {
            if (prev.find((m) => m.id === msg.id)) return prev;
            return [...prev, msg];
          });
          scrollToEnd();
        } catch {}
      };
      ws.onerror = () => {};
      ws.onclose = () => {};
    })();

    return () => {
      cancelled = true;
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [id, scrollToEnd]);

  const onSend = async () => {
    const text = input.trim();
    if (!text || !id) return;
    setSending(true);
    try {
      // Prefer WS if open, fallback to REST
      const ws = wsRef.current;
      if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify({ text }));
      } else {
        const msg = await apiPostMessage(id, text);
        setMessages((p) => [...p, msg]);
      }
      setInput("");
      scrollToEnd();
    } finally {
      setSending(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} testID="chat-back-button">
          <Ionicons name="chevron-back" size={26} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topTitle} numberOfLines={1}>Shift Chat</Text>
        <View style={{ width: 26 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 0}
      >
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator color={theme.colors.primary} />
          </View>
        ) : (
          <FlatList
            ref={listRef}
            data={messages}
            keyExtractor={(m) => m.id}
            renderItem={({ item }) => {
              const mine = item.sender_id === user?.id;
              return (
                <View style={[styles.bubbleRow, mine ? styles.rowMine : styles.rowTheirs]}>
                  <View
                    style={[styles.bubble, mine ? styles.bubbleMine : styles.bubbleTheirs]}
                    testID={`message-${item.id}`}
                  >
                    {!mine && <Text style={styles.sender}>{item.sender_name}</Text>}
                    <Text style={mine ? styles.textMine : styles.textTheirs}>{item.text}</Text>
                  </View>
                </View>
              );
            }}
            contentContainerStyle={{ padding: 14, paddingBottom: 14 }}
            ListEmptyComponent={
              <View style={styles.empty}>
                <Text style={styles.emptyText}>
                  No messages yet. Say hello to start the conversation.
                </Text>
              </View>
            }
          />
        )}

        <View style={styles.composer}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Message…"
            placeholderTextColor={theme.colors.textTertiary}
            testID="chat-input"
          />
          <TouchableOpacity
            style={[styles.sendBtn, (!input.trim() || sending) && { opacity: 0.5 }]}
            onPress={onSend}
            disabled={!input.trim() || sending}
            testID="chat-send-button"
            activeOpacity={0.85}
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  topBar: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: theme.colors.borderSubtle,
  },
  topTitle: { color: theme.colors.textPrimary, fontSize: 15, fontWeight: "700" },
  center: { flex: 1, alignItems: "center", justifyContent: "center" },
  bubbleRow: { flexDirection: "row", marginVertical: 4 },
  rowMine: { justifyContent: "flex-end" },
  rowTheirs: { justifyContent: "flex-start" },
  bubble: {
    maxWidth: "78%", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 16,
  },
  bubbleMine: { backgroundColor: theme.colors.primary, borderBottomRightRadius: 4 },
  bubbleTheirs: {
    backgroundColor: theme.colors.surface,
    borderBottomLeftRadius: 4,
    borderWidth: 1, borderColor: theme.colors.borderSubtle,
  },
  sender: { color: theme.colors.textSecondary, fontSize: 11, fontWeight: "700", marginBottom: 2 },
  textMine: { color: "#FFFFFF", fontSize: 15 },
  textTheirs: { color: theme.colors.textPrimary, fontSize: 15 },
  composer: {
    flexDirection: "row", alignItems: "center", gap: 8,
    padding: 12, borderTopWidth: 1, borderTopColor: theme.colors.borderSubtle,
    backgroundColor: theme.colors.bg,
  },
  input: {
    flex: 1, color: theme.colors.textPrimary, fontSize: 15,
    backgroundColor: theme.colors.surface, paddingHorizontal: 14, paddingVertical: 10,
    borderRadius: 22, borderWidth: 1, borderColor: theme.colors.borderSubtle,
  },
  sendBtn: {
    width: 44, height: 44, borderRadius: 22,
    backgroundColor: theme.colors.primary, alignItems: "center", justifyContent: "center",
  },
  empty: { alignItems: "center", padding: 40 },
  emptyText: { color: theme.colors.textSecondary, textAlign: "center" },
});
