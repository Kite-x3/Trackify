export interface Habit {
  id: string;
  name: string;
  description?: string;
  completionsToday: number;
  color: string;
  streak: number;
  completionDays: WeekDay[];
  type: HabitType;
  reminderTime?: string;
  createdAt: Date;
  completionsNeed: number;
  notificationsTime: string[];
  allCompletions: number;
}

export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type HabitType = 'sport' | 'reading' | 'food' | 'health' | 'education' | 'productivity' | 'personal_care' | 'social' | 'other';