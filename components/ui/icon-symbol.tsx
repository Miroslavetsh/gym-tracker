import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { SymbolWeight } from "expo-symbols";
import { ComponentProps } from "react";
import { OpaqueColorValue, type StyleProp, type TextStyle } from "react-native";

type IconMapping = Record<string, ComponentProps<typeof MaterialIcons>["name"]>;
type IconSymbolName = keyof typeof MAPPING;

const MAPPING: IconMapping = {
  "house.fill": "home",
  "paperplane.fill": "send",
  "chevron.left.forwardslash.chevron.right": "code",
  "chevron.right": "chevron-right",
  "chevron.up": "keyboard-arrow-up",
  "chevron.down": "keyboard-arrow-down",
  calendar: "event",
  "figure.strengthtraining.traditional": "fitness-center",
  "plus.circle.fill": "add-circle",
  "arrow.clockwise": "refresh",
  trash: "delete",
  plus: "add",
  link: "link",
  "checkmark.circle.fill": "check-circle",
  "xmark.circle.fill": "cancel",
  person: "person",
  "chart.bar": "bar-chart",
};

export function IconSymbol({
  name,
  size = 24,
  color,
  style,
}: {
  name: IconSymbolName;
  size?: number;
  color: string | OpaqueColorValue;
  style?: StyleProp<TextStyle>;
  weight?: SymbolWeight;
}) {
  const iconName = MAPPING[name] || "help-outline";
  return (
    <MaterialIcons color={color} size={size} name={iconName} style={style} />
  );
}
