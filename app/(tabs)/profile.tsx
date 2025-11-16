import { StyledText } from "@/components/StyledText";
import { COLORS } from "@/constants/theme";
import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { moderateScale } from "react-native-size-matters";

export default function ProfileScreen() {
  const [isRegister, setIsRegister] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = () => {
    if (isRegister) {
      console.log("Регистрация:", { login, password, email });
    } else {
      console.log("Вход:", { login, password });
    }
  };

  return (
    <View style={styles.container}>
      <StyledText style={styles.title}>
        {isRegister ? "Регистрация" : "Вход"}
      </StyledText>

      {/* Логин */}
      <TextInput
        placeholder="Логин"
        placeholderTextColor={COLORS.HINT_TEXT}
        style={styles.input}
        value={login}
        onChangeText={setLogin}
      />

      {/* Email (только при регистрации) */}
      {isRegister && (
        <TextInput
          placeholder="Email"
          placeholderTextColor={COLORS.HINT_TEXT}
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      )}

      {/* Пароль */}
      <TextInput
        placeholder="Пароль"
        placeholderTextColor={COLORS.HINT_TEXT}
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      {/* Кнопка Вход / Регистрация */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <StyledText style={styles.buttonText}>
          {isRegister ? "Зарегистрироваться" : "Войти"}
        </StyledText>
      </TouchableOpacity>

      {/* Переключатель */}
      <TouchableOpacity onPress={() => setIsRegister(!isRegister)}>
        <StyledText style={styles.switchText}>
          {isRegister
            ? "Уже есть аккаунт? Войти"
            : "Нет аккаунта? Зарегистрироваться"}
        </StyledText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: moderateScale(20),
  },
  title: {
    fontSize: moderateScale(22),
    marginBottom: moderateScale(20),
    color: COLORS.PRIMARY_TEXT,
  },
  input: {
    width: "100%",
    backgroundColor: COLORS.CALENDAR_ELSE,
    borderRadius: moderateScale(20),
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(16),
    color: COLORS.PRIMARY_TEXT,
    marginBottom: moderateScale(20),
    fontSize: moderateScale(14),
  },
  button: {
    backgroundColor: COLORS.BUTTON_BACKGROUND,
    borderRadius: moderateScale(20),
    paddingVertical: moderateScale(12),
    paddingHorizontal: moderateScale(30),
    marginTop: moderateScale(10),
    marginBottom: moderateScale(10),
  },
  buttonText: {
    color: COLORS.PRIMARY_BACKGROUND,
    fontSize: moderateScale(14),
  },
  switchText: {
    fontSize: moderateScale(12),
    color: COLORS.HINT_TEXT,
    marginTop: moderateScale(4),
  },
});
