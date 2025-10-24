import { COLORS, FONT } from "@/constants/theme";
import { StyleSheet, Text, TextProps } from "react-native";
import { useFonts } from "@/contexts/FontContext";

type CustomTextProps = TextProps;

export const StyledText: React.FC<CustomTextProps> = ({ style, ...props }) => {
  const { fontsLoaded } = useFonts();

  return (
    <Text
      style={[
        styles.base,
        fontsLoaded ? styles.customFont : styles.fallbackFont,
        style,
      ]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  base: {
    color: COLORS.PRIMARY_TEXT,
    fontSize: 16,
  },
  customFont: {
    fontFamily: FONT.FAMILY.REGULAR,
  },
  fallbackFont: {
    // Можно оставить системный шрифт или добавить другой fallback
    fontFamily: "System", // для iOS
    // fontWeight: '400', // обычный вес
  },
});
