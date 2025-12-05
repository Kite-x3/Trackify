import { AuthApi } from "@/api/auth";
import { StyledText } from "@/components/StyledText";
import { COLORS } from "@/constants/theme";
import { storage, useHabits } from "@/contexts/HabitsContext";
import { useStats } from "@/contexts/StatsContext";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { moderateScale } from "react-native-size-matters";

export default function ProfileScreen() {
  const { resetHabits, syncWithServer } = useHabits();
  const { resetStats, refreshStats } = useStats();
  const [isRegister, setIsRegister] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await AuthApi.currentUser();
        setIsLoggedIn(!!user);
      } catch {
        setIsLoggedIn(false);
      }
    };
    checkAuth();
  }, []);

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);

      if (isRegister) {
        const registerResult = await AuthApi.register(login, email, password);

        if (!registerResult) {
          Alert.alert("Ошибка", "Ошибка при регистрации");
          return;
        }

        const user = await AuthApi.login(login, password);

        if (user) {
          Alert.alert("Успех", "Вы успешно зарегистрировались и вошли!");
          setIsLoggedIn(true);
          await syncWithServer();
          await refreshStats();
        } else {
          Alert.alert("Ошибка", "Ошибка при входе после регистрации");
        }
      } else {
        const user = await AuthApi.login(login, password);

        if (user) {
          Alert.alert("Успех", "Вы успешно вошли!");
          setIsLoggedIn(true);

          await syncWithServer();
          await refreshStats();
        } else {
          Alert.alert("Ошибка", "Неверный логин или пароль");
        }
      }
    } catch (e: any) {
      Alert.alert("Ошибка", e.message || "Что-то пошло не так");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AuthApi.logout();
      setIsLoggedIn(false);
      setLogin("");
      setPassword("");
      setEmail("");
      resetHabits();
      resetStats();

      storage.clearAll();
    } catch {
      Alert.alert("Ошибка", "Не удалось выйти");
    }
  };

  if (isLoggedIn) {
    return (
      <View style={styles.container}>
        <StyledText style={styles.title}>Вы вошли в аккаунт</StyledText>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <StyledText style={styles.buttonText}>Выйти</StyledText>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StyledText style={styles.title}>
        {isRegister ? "Регистрация" : "Вход"}
      </StyledText>

      <TextInput
        placeholder="Логин"
        placeholderTextColor={COLORS.HINT_TEXT}
        style={styles.input}
        value={login}
        onChangeText={setLogin}
      />

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

      <TextInput
        placeholder="Пароль"
        placeholderTextColor={COLORS.HINT_TEXT}
        style={styles.input}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={handleSubmit}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <StyledText style={styles.buttonText}>
            {isRegister ? "Зарегистрироваться" : "Войти"}
          </StyledText>
        )}
      </TouchableOpacity>

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
