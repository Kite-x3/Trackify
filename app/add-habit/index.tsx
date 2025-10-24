import React, { useState } from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { StyledText } from "@/components/StyledText";
import { COLORS } from "@/constants/theme";
import { router } from "expo-router";
import { AddIcon, MinusIcon } from "@/assets/icons/button-icons";
import { WeekDay } from "@/types/habit";
import { BackIcon, TrashIcon } from "@/assets/icons/common-icons";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function AddHabitScreen() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [completionsNeed, setCompletionsNeed] = useState(1);
  const [selectedColor, setSelectedColor] = useState("rgba(54, 37, 92, 0.8)");
  const [reminderTime, setReminderTime] = useState<Date | null>(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [selectedDays, setSelectedDays] = useState<WeekDay[]>([]);

  const colorOptions = [
    "rgba(54, 37, 92, 0.8)",
    "rgba(202, 209, 131, 1)",
    "rgba(102, 152, 204, 1)",
    "rgba(201, 68, 114, 0.85)",
    "rgba(255, 209, 213, 1)",
    "rgba(90, 170, 132, 0.8)",
    "rgba(255, 217, 94, 1)",
    "rgba(34, 60, 99, 1)",
  ];

  const weekDays: { key: WeekDay; label: string }[] = [
    { key: "monday", label: "пн" },
    { key: "tuesday", label: "вт" },
    { key: "wednesday", label: "ср" },
    { key: "thursday", label: "чт" },
    { key: "friday", label: "пт" },
    { key: "saturday", label: "сб" },
    { key: "sunday", label: "вс" },
  ];

  const toggleDay = (day: WeekDay) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleDecrement = () => {
    if (completionsNeed > 1) {
      setCompletionsNeed((prev) => prev - 1);
    }
  };

  const handleIncrement = () => {
    setCompletionsNeed((prev) => prev + 1);
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    setShowTimePicker(false);
    if (selectedDate) {
      setReminderTime(selectedDate);
    }
  };

  const removeReminder = () => {
    setReminderTime(null);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <BackIcon color={COLORS.PRIMARY_BACKGROUND} />
        </TouchableOpacity>
        <StyledText style={styles.title}>Новая привычка</StyledText>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* Название привычки */}
        <View style={styles.section}>
          <StyledText style={styles.sectionTitle}>
            Название привычки
            <StyledText style={styles.requiredStar}>*</StyledText>
          </StyledText>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Введите название привычки"
            placeholderTextColor={COLORS.HINT_TEXT}
          />
        </View>

        {/* Описание */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <StyledText style={styles.sectionTitle}>Описание</StyledText>
            <StyledText style={styles.optionalText}>- Необязательно</StyledText>
          </View>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={description}
            onChangeText={setDescription}
            placeholder="Добавьте описание"
            placeholderTextColor={COLORS.HINT_TEXT}
            multiline
            numberOfLines={3}
          />
        </View>

        {/* Цвет */}
        <View style={styles.section}>
          <StyledText style={styles.sectionTitle}>
            Цвет<StyledText style={styles.requiredStar}>*</StyledText>
          </StyledText>
          <View style={styles.colorGrid}>
            {colorOptions.map((color, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.colorOption,
                  { backgroundColor: color },
                  selectedColor === color && styles.selectedColor,
                ]}
                onPress={() => setSelectedColor(color)}
              />
            ))}
          </View>
        </View>

        {/* Дни выполнения */}
        <View style={styles.section}>
          <StyledText style={styles.sectionTitle}>
            Дни выполнения<StyledText style={styles.requiredStar}>*</StyledText>
          </StyledText>
          <View style={styles.weekDaysContainer}>
            {weekDays.map((day) => (
              <TouchableOpacity
                key={day.key}
                style={[
                  styles.daySquare,
                  {
                    backgroundColor: selectedDays.includes(day.key)
                      ? COLORS.ADD_HABBIT_BUTTONS
                      : COLORS.BLOCKS_BACKGROUND,
                  },
                ]}
                onPress={() => toggleDay(day.key)}
              >
                <StyledText
                  style={[
                    styles.dayText,
                    {
                      color: selectedDays.includes(day.key)
                        ? COLORS.PRIMARY_BACKGROUND
                        : COLORS.PRIMARY_TEXT,
                    },
                  ]}
                >
                  {day.label}
                </StyledText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Количество выполнений */}
        <View style={styles.section}>
          <StyledText style={styles.sectionTitle}>
            Количество выполнений в день
          </StyledText>
          <View style={styles.completionsContainer}>
            <TouchableOpacity
              style={styles.completionButton}
              onPress={handleDecrement}
            >
              <MinusIcon color={COLORS.PRIMARY_TEXT} />
            </TouchableOpacity>

            <View style={styles.completionNumber}>
              <StyledText style={styles.completionValue}>
                {completionsNeed}
              </StyledText>
              <StyledText style={styles.completionLabel}>раз</StyledText>
            </View>

            <TouchableOpacity
              style={styles.completionButton}
              onPress={handleIncrement}
            >
              <AddIcon color={COLORS.PRIMARY_TEXT} size={16} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Время напоминания */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <StyledText style={styles.sectionTitle}>
              Время напоминания
            </StyledText>
            <StyledText style={styles.optionalText}>- Необязательно</StyledText>
          </View>

          {reminderTime ? (
            <View style={styles.reminderContainer}>
              <StyledText style={styles.reminderTime}>
                {formatTime(reminderTime)}
              </StyledText>
              <TouchableOpacity
                onPress={removeReminder}
                style={styles.removeReminderButton}
              >
                <TrashIcon size={20} color={COLORS.NECCESSARY_STAR}></TrashIcon>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addReminderButton}
              onPress={() => setShowTimePicker(true)}
            >
              <StyledText style={styles.addReminderText}>
                + Добавить напоминание
              </StyledText>
            </TouchableOpacity>
          )}

          {showTimePicker && (
            <DateTimePicker
              value={reminderTime || new Date()}
              mode="time"
              display="spinner"
              onChange={handleTimeChange}
            />
          )}
        </View>

        {/* Кнопки действий */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => router.back()}
          >
            <StyledText style={styles.cancelButtonText}>Отмена</StyledText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.createButton}
            onPress={() => {
              /* Логика создания */
            }}
          >
            <StyledText style={styles.createButtonText}>Создать</StyledText>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 20,
  },
  backButton: {
    width: 48,
    height: 48,
    borderRadius: 20,
    backgroundColor: COLORS.ADD_HABBIT_BUTTONS,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  title: {
    fontSize: 18,
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    marginBottom: 24,
    gap: 10,
  },
  sectionHeader: {
    alignItems: "center",
    flexDirection: "row",
  },
  sectionTitle: {
    fontSize: 12,
  },
  requiredStar: {
    color: COLORS.NECCESSARY_STAR,
  },
  input: {
    fontSize: 16,
    backgroundColor: COLORS.INPUT_BACKGROUND,
    borderRadius: 10,
    padding: 10,
  },
  textArea: {
    height: 80,
    textAlignVertical: "top",
  },
  colorGrid: {
    justifyContent: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    columnGap: 46,
    rowGap: 12,
  },
  colorOption: {
    width: 50,
    height: 50,
    borderRadius: 40,
    outlineWidth: 2,
    outlineStyle: "dashed",
    outlineColor: "transparent",
  },
  selectedColor: {
    outlineColor: COLORS.PRIMARY_TEXT,
  },
  weekDaysContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  daySquare: {
    width: 40,
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  dayText: {
    fontSize: 14,
  },
  completionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 50,
  },
  completionButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: COLORS.INPUT_BACKGROUND,
    justifyContent: "center",
    alignItems: "center",
  },
  completionNumber: {
    alignItems: "center",
  },
  completionValue: {
    fontSize: 24,
  },
  completionLabel: {
    fontSize: 12,
    color: COLORS.HINT_TEXT,
  },
  optionalText: {
    fontSize: 10,
    color: COLORS.HINT_TEXT,
  },
  actionsContainer: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 32,
  },
  cancelButton: {
    flex: 1,
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.INPUT_BACKGROUND,
    justifyContent: "center",
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: COLORS.PRIMARY_TEXT,
  },
  createButton: {
    flex: 2,
    height: 50,
    borderRadius: 12,
    backgroundColor: COLORS.ADD_HABBIT_BUTTONS,
    justifyContent: "center",
    alignItems: "center",
  },
  createButtonText: {
    fontSize: 16,
    color: COLORS.PRIMARY_BACKGROUND,
  },
  reminderContainer: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 8,
    gap: 20,
  },
  reminderText: {
    fontSize: 12,
    color: COLORS.HINT_TEXT,
    textAlign: "center",
  },
  addReminderButton: {
    backgroundColor: COLORS.INPUT_BACKGROUND,
    borderRadius: 10,
    padding: 16,
    alignItems: "center",
  },
  addReminderText: {
    fontSize: 16,
    color: COLORS.HINT_TEXT,
  },
  reminderTime: {
    fontSize: 16,
    color: COLORS.PRIMARY_TEXT,
  },
  removeReminderButton: {
    backgroundColor: COLORS.INPUT_BACKGROUND,
    borderRadius: 8,
    padding: 6,
  },
});
