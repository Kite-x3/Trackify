import { COLORS } from "@/constants/theme";
import { StyleSheet, View, ViewProps } from "react-native";

interface ModuleProps extends ViewProps {
  children: React.ReactNode;
}

export const Module: React.FC<ModuleProps> = ({
  children,
  style,
  ...props
}) => {
  return (
    <View style={[styles.module, style]} {...props}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  module: {
    backgroundColor: COLORS.MODULS_BACKGROUND,
    borderRadius: 20,
    paddingHorizontal: 24,
    paddingVertical: 18,
  },
});
