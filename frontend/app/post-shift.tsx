import React, { useState } from "react";
import {
  View, Text, TextInput, StyleSheet, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { apiCreateShift } from "@/src/api/client";
import { theme } from "@/src/theme";

export default function PostShift() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("Miami");
  const [state, setState] = useState("FL");
  const [pay, setPay] = useState("25");
  const [needed, setNeeded] = useState("1");
  const [description, setDescription] = useState("");
  const [reqs, setReqs] = useState("Class D license, Background check");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async () => {
    setError(null);
    if (!title || !venue || !pay) {
      setError("Title, venue, and pay are required.");
      return;
    }
    const payNum = parseFloat(pay);
    const neededNum = parseInt(needed || "1", 10);
    if (isNaN(payNum) || payNum <= 0) {
      setError("Pay rate must be a positive number.");
      return;
    }
    setSubmitting(true);
    try {
      const now = new Date();
      const start = new Date(now.getTime() + 24 * 60 * 60 * 1000); // +1 day
      const end = new Date(start.getTime() + 6 * 60 * 60 * 1000); // +6 hrs
      await apiCreateShift({
        title: title.trim(),
        venue: venue.trim(),
        city: city.trim(),
        state: state.trim().toUpperCase(),
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        pay_rate: payNum,
        officers_needed: neededNum > 0 ? neededNum : 1,
        description: description.trim(),
        requirements: reqs.split(",").map((s) => s.trim()).filter(Boolean),
      });
      router.replace("/(tabs)/my-shifts");
    } catch (e: any) {
      setError(e.message || "Could not post shift");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} testID="post-back-button">
          <Ionicons name="chevron-back" size={26} color={theme.colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.topTitle}>Post a Shift</Text>
        <View style={{ width: 26 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
          <Field label="Job Title" value={title} onChange={setTitle} placeholder="Concert Security" testID="post-title-input" />
          <Field label="Venue" value={venue} onChange={setVenue} placeholder="Hard Rock Stadium" testID="post-venue-input" />
          <View style={styles.row2}>
            <View style={{ flex: 2, marginRight: 10 }}>
              <Field label="City" value={city} onChange={setCity} placeholder="Miami" testID="post-city-input" />
            </View>
            <View style={{ flex: 1 }}>
              <Field label="State" value={state} onChange={setState} placeholder="FL" testID="post-state-input" />
            </View>
          </View>
          <View style={styles.row2}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Field label="Pay ($/hr)" value={pay} onChange={setPay} placeholder="25" keyboardType="numeric" testID="post-pay-input" />
            </View>
            <View style={{ flex: 1 }}>
              <Field label="Officers Needed" value={needed} onChange={setNeeded} placeholder="1" keyboardType="numeric" testID="post-needed-input" />
            </View>
          </View>
          <Field
            label="Description"
            value={description}
            onChange={setDescription}
            placeholder="Brief description of the role and duties."
            multiline
            testID="post-description-input"
          />
          <Field
            label="Requirements (comma-separated)"
            value={reqs}
            onChange={setReqs}
            placeholder="Class D, Background check"
            testID="post-reqs-input"
          />

          {error && <Text style={styles.error}>{error}</Text>}

          <TouchableOpacity
            style={[styles.btn, submitting && { opacity: 0.7 }]}
            onPress={onSubmit}
            disabled={submitting}
            testID="post-submit-button"
            activeOpacity={0.85}
          >
            {submitting ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.btnText}>Post Shift</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const Field = ({
  label, value, onChange, placeholder, multiline, keyboardType, testID,
}: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder?: string; multiline?: boolean; keyboardType?: any; testID?: string;
}) => (
  <View style={styles.field}>
    <Text style={styles.label}>{label}</Text>
    <TextInput
      style={[styles.input, multiline && styles.inputMulti]}
      value={value}
      onChangeText={onChange}
      placeholder={placeholder}
      placeholderTextColor={theme.colors.textTertiary}
      multiline={multiline}
      numberOfLines={multiline ? 4 : 1}
      keyboardType={keyboardType}
      testID={testID}
    />
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  topBar: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: theme.colors.borderSubtle,
  },
  topTitle: { color: theme.colors.textPrimary, fontSize: 15, fontWeight: "700" },
  scroll: { padding: 20, paddingBottom: 60 },
  field: { marginBottom: 14 },
  label: { color: theme.colors.textSecondary, fontSize: 12, fontWeight: "700", marginBottom: 6, letterSpacing: 0.5 },
  input: {
    backgroundColor: theme.colors.surface, color: theme.colors.textPrimary,
    borderRadius: 12, paddingHorizontal: 14, paddingVertical: 12,
    fontSize: 15, borderWidth: 1, borderColor: theme.colors.borderSubtle,
  },
  inputMulti: { minHeight: 90, textAlignVertical: "top" },
  row2: { flexDirection: "row" },
  btn: {
    backgroundColor: theme.colors.primary, borderRadius: 12,
    paddingVertical: 16, alignItems: "center", marginTop: 10,
  },
  btnText: { color: "#FFFFFF", fontSize: 16, fontWeight: "800" },
  error: { color: theme.colors.danger, fontSize: 13, marginVertical: 8 },
});
