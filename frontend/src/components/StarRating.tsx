import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme } from "@/src/theme";

type Props = {
  value: number;
  onChange?: (v: number) => void;
  size?: number;
  testIDPrefix?: string;
};

export default function StarRating({ value, onChange, size = 28, testIDPrefix = "star" }: Props) {
  const stars = [1, 2, 3, 4, 5];
  const interactive = !!onChange;
  return (
    <View style={styles.row}>
      {stars.map((s) => {
        const filled = s <= Math.round(value);
        const node = (
          <Ionicons
            name={filled ? "star" : "star-outline"}
            size={size}
            color={filled ? "#F59E0B" : theme.colors.textTertiary}
          />
        );
        if (!interactive) return <View key={s} style={{ paddingHorizontal: 2 }}>{node}</View>;
        return (
          <TouchableOpacity
            key={s}
            onPress={() => onChange!(s)}
            style={{ paddingHorizontal: 2 }}
            testID={`${testIDPrefix}-${s}`}
            activeOpacity={0.7}
          >
            {node}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center" },
});
