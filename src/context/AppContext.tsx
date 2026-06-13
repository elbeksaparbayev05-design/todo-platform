import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Todo {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  category: 'work' | 'study' | 'health' | 'personal' | 'other';
  completed: boolean;
  dueDate?: string;
  createdAt: string;
  order: number;
}

export interface Habit {
  id: string;
  name: string;
  icon: string;
  color: string;
  frequency: 'daily' | 'weekly';
  completedDates: string[];
  streak: number;
  category: string;
  createdAt: string;
}

export interface ScheduleBlock {
  id: string;
  title: string;
  startTime: string; // HH:MM
  endTime: string;   // HH:MM
  type: 'work' | 'study' | 'break' | 'exercise' | 'meal' | 'sleep' | 'personal';
  date: string;      // YYYY-MM-DD
  color: string;
}

export interface WaterLog {
  date: string;
  glasses: number; // out of 8
}

export interface SleepLog {
  date: string;
  hours: number;
  quality: 1 | 2 | 3 | 4 | 5;
  bedtime: string;
  wakeTime: string;
}

export interface ExerciseLog {
  id: string;
  date: string;
  type: string;
  duration: number; // minutes
  calories: number;
}

export interface StepsLog {
  date: string;
  steps: number;
  goal: number;
}

export interface MealItem {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DayMeals {
  date: string;
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
  snacks: MealItem[];
  waterGlasses: number;
}

export interface StudySubject {
  id: string;
  name: string;
  color: string;
  icon: string;
  examDate?: string;
  totalHours: number;
  studiedHours: number;
}

export interface StudySession {
  id: string;
  subjectId: string;
  date: string;
  duration: number; // minutes
  notes?: string;
}

export interface Settings {
  name: string;
  avatar?: string;
  darkMode: boolean;
  language: 'uz' | 'en';
  calorieGoal: number;
  waterGoal: number;
  stepsGoal: number;
  sleepGoal: number;
  notifications: boolean;
}

export interface AppState {
  todos: Todo[];
  habits: Habit[];
  scheduleBlocks: ScheduleBlock[];
  waterLogs: WaterLog[];
  sleepLogs: SleepLog[];
  exerciseLogs: ExerciseLog[];
  stepsLogs: StepsLog[];
  meals: DayMeals[];
  studySubjects: StudySubject[];
  studySessions: StudySession[];
  settings: Settings;
}

// ─── Initial State ────────────────────────────────────────────────────────────

const today = new Date().toISOString().split('T')[0];

const defaultSettings: Settings = {
  name: 'Alex',
  darkMode: false,
  language: 'uz',
  calorieGoal: 2000,
  waterGoal: 8,
  stepsGoal: 10000,
  sleepGoal: 8,
  notifications: true,
};

const initialState: AppState = {
  todos: [
    { id: '1', title: 'Complete project presentation', description: 'Prepare slides for Q4 review', priority: 'high', category: 'work', completed: false, dueDate: today, createdAt: today, order: 0 },
    { id: '2', title: 'Morning yoga session', priority: 'medium', category: 'health', completed: true, createdAt: today, order: 1 },
    { id: '3', title: 'Read 30 pages of book', priority: 'low', category: 'personal', completed: false, createdAt: today, order: 2 },
    { id: '4', title: 'Study TypeScript advanced types', priority: 'high', category: 'study', completed: false, createdAt: today, order: 3 },
    { id: '5', title: 'Drink 8 glasses of water', priority: 'medium', category: 'health', completed: false, createdAt: today, order: 4 },
  ],
  habits: [
    { id: 'h1', name: 'Morning Meditation', icon: '🧘', color: '#6366f1', frequency: 'daily', completedDates: [today], streak: 12, category: 'wellness', createdAt: today },
    { id: 'h2', name: 'Exercise 30min', icon: '💪', color: '#10b981', frequency: 'daily', completedDates: [today], streak: 7, category: 'fitness', createdAt: today },
    { id: 'h3', name: 'Read 20 pages', icon: '📚', color: '#f59e0b', frequency: 'daily', completedDates: [], streak: 5, category: 'learning', createdAt: today },
    { id: 'h4', name: 'Drink 8 glasses water', icon: '💧', color: '#0ea5e9', frequency: 'daily', completedDates: [today], streak: 21, category: 'health', createdAt: today },
    { id: 'h5', name: 'No social media before 9am', icon: '📵', color: '#f43f5e', frequency: 'daily', completedDates: [], streak: 3, category: 'digital wellness', createdAt: today },
    { id: 'h6', name: 'Weekly review', icon: '📋', color: '#8b5cf6', frequency: 'weekly', completedDates: [], streak: 8, category: 'productivity', createdAt: today },
  ],
  scheduleBlocks: [
    { id: 's1', title: 'Morning Routine', startTime: '06:00', endTime: '07:00', type: 'personal', date: today, color: '#6366f1' },
    { id: 's2', title: 'Deep Work Session', startTime: '09:00', endTime: '11:00', type: 'work', date: today, color: '#4f46e5' },
    { id: 's3', title: 'Lunch Break', startTime: '12:00', endTime: '13:00', type: 'meal', date: today, color: '#10b981' },
    { id: 's4', title: 'Study: TypeScript', startTime: '14:00', endTime: '16:00', type: 'study', date: today, color: '#f59e0b' },
    { id: 's5', title: 'Gym Session', startTime: '17:00', endTime: '18:00', type: 'exercise', date: today, color: '#f43f5e' },
    { id: 's6', title: 'Evening Wind Down', startTime: '21:00', endTime: '22:00', type: 'personal', date: today, color: '#8b5cf6' },
  ],
  waterLogs: [{ date: today, glasses: 4 }],
  sleepLogs: [
    { date: today, hours: 7.5, quality: 4, bedtime: '22:30', wakeTime: '06:00' },
  ],
  exerciseLogs: [
    { id: 'e1', date: today, type: 'Running', duration: 30, calories: 280 },
  ],
  stepsLogs: [{ date: today, steps: 6500, goal: 10000 }],
  meals: [
    {
      date: today,
      breakfast: [
        { id: 'm1', name: 'Oatmeal with berries', calories: 320, protein: 12, carbs: 58, fat: 6 },
        { id: 'm2', name: 'Green tea', calories: 5, protein: 0, carbs: 1, fat: 0 },
      ],
      lunch: [
        { id: 'm3', name: 'Grilled chicken salad', calories: 420, protein: 38, carbs: 22, fat: 14 },
      ],
      dinner: [],
      snacks: [
        { id: 'm4', name: 'Apple', calories: 80, protein: 0, carbs: 21, fat: 0 },
      ],
      waterGlasses: 4,
    }
  ],
  studySubjects: [
    { id: 'sub1', name: 'TypeScript', color: '#3178c6', icon: '⚡', examDate: '2024-03-15', totalHours: 40, studiedHours: 18 },
    { id: 'sub2', name: 'Mathematics', color: '#f59e0b', icon: '📐', examDate: '2024-03-20', totalHours: 60, studiedHours: 25 },
    { id: 'sub3', name: 'Physics', color: '#10b981', icon: '⚛️', examDate: '2024-03-25', totalHours: 50, studiedHours: 12 },
    { id: 'sub4', name: 'English', color: '#f43f5e', icon: '✍️', totalHours: 30, studiedHours: 20 },
  ],
  studySessions: [
    { id: 'ss1', subjectId: 'sub1', date: today, duration: 90, notes: 'Generics and utility types' },
    { id: 'ss2', subjectId: 'sub2', date: today, duration: 60, notes: 'Integration by parts' },
  ],
  settings: defaultSettings,
};

// ─── Actions ──────────────────────────────────────────────────────────────────

type Action =
  | { type: 'ADD_TODO'; payload: Todo }
  | { type: 'UPDATE_TODO'; payload: Todo }
  | { type: 'DELETE_TODO'; payload: string }
  | { type: 'TOGGLE_TODO'; payload: string }
  | { type: 'REORDER_TODOS'; payload: Todo[] }
  | { type: 'ADD_HABIT'; payload: Habit }
  | { type: 'TOGGLE_HABIT'; payload: { id: string; date: string } }
  | { type: 'DELETE_HABIT'; payload: string }
  | { type: 'ADD_SCHEDULE_BLOCK'; payload: ScheduleBlock }
  | { type: 'UPDATE_SCHEDULE_BLOCK'; payload: ScheduleBlock }
  | { type: 'DELETE_SCHEDULE_BLOCK'; payload: string }
  | { type: 'SET_WATER'; payload: { date: string; glasses: number } }
  | { type: 'ADD_SLEEP_LOG'; payload: SleepLog }
  | { type: 'ADD_EXERCISE_LOG'; payload: ExerciseLog }
  | { type: 'SET_STEPS'; payload: StepsLog }
  | { type: 'UPDATE_MEALS'; payload: DayMeals }
  | { type: 'ADD_STUDY_SUBJECT'; payload: StudySubject }
  | { type: 'UPDATE_STUDY_SUBJECT'; payload: StudySubject }
  | { type: 'ADD_STUDY_SESSION'; payload: StudySession }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> };

// ─── Reducer ──────────────────────────────────────────────────────────────────

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case 'ADD_TODO':
      return { ...state, todos: [...state.todos, action.payload] };
    case 'UPDATE_TODO':
      return { ...state, todos: state.todos.map(t => t.id === action.payload.id ? action.payload : t) };
    case 'DELETE_TODO':
      return { ...state, todos: state.todos.filter(t => t.id !== action.payload) };
    case 'TOGGLE_TODO':
      return { ...state, todos: state.todos.map(t => t.id === action.payload ? { ...t, completed: !t.completed } : t) };
    case 'REORDER_TODOS':
      return { ...state, todos: action.payload };
    case 'ADD_HABIT':
      return { ...state, habits: [...state.habits, action.payload] };
    case 'TOGGLE_HABIT': {
      const { id, date } = action.payload;
      return {
        ...state,
        habits: state.habits.map(h => {
          if (h.id !== id) return h;
          const completed = h.completedDates.includes(date);
          const completedDates = completed
            ? h.completedDates.filter(d => d !== date)
            : [...h.completedDates, date];
          return { ...h, completedDates, streak: completed ? Math.max(0, h.streak - 1) : h.streak + 1 };
        }),
      };
    }
    case 'DELETE_HABIT':
      return { ...state, habits: state.habits.filter(h => h.id !== action.payload) };
    case 'ADD_SCHEDULE_BLOCK':
      return { ...state, scheduleBlocks: [...state.scheduleBlocks, action.payload] };
    case 'UPDATE_SCHEDULE_BLOCK':
      return { ...state, scheduleBlocks: state.scheduleBlocks.map(b => b.id === action.payload.id ? action.payload : b) };
    case 'DELETE_SCHEDULE_BLOCK':
      return { ...state, scheduleBlocks: state.scheduleBlocks.filter(b => b.id !== action.payload) };
    case 'SET_WATER': {
      const { date, glasses } = action.payload;
      const exists = state.waterLogs.find(w => w.date === date);
      return {
        ...state,
        waterLogs: exists
          ? state.waterLogs.map(w => w.date === date ? { ...w, glasses } : w)
          : [...state.waterLogs, { date, glasses }],
      };
    }
    case 'ADD_SLEEP_LOG': {
      const exists = state.sleepLogs.find(s => s.date === action.payload.date);
      return {
        ...state,
        sleepLogs: exists
          ? state.sleepLogs.map(s => s.date === action.payload.date ? action.payload : s)
          : [...state.sleepLogs, action.payload],
      };
    }
    case 'ADD_EXERCISE_LOG':
      return { ...state, exerciseLogs: [...state.exerciseLogs, action.payload] };
    case 'SET_STEPS': {
      const exists = state.stepsLogs.find(s => s.date === action.payload.date);
      return {
        ...state,
        stepsLogs: exists
          ? state.stepsLogs.map(s => s.date === action.payload.date ? action.payload : s)
          : [...state.stepsLogs, action.payload],
      };
    }
    case 'UPDATE_MEALS': {
      const exists = state.meals.find(m => m.date === action.payload.date);
      return {
        ...state,
        meals: exists
          ? state.meals.map(m => m.date === action.payload.date ? action.payload : m)
          : [...state.meals, action.payload],
      };
    }
    case 'ADD_STUDY_SUBJECT':
      return { ...state, studySubjects: [...state.studySubjects, action.payload] };
    case 'UPDATE_STUDY_SUBJECT':
      return { ...state, studySubjects: state.studySubjects.map(s => s.id === action.payload.id ? action.payload : s) };
    case 'ADD_STUDY_SESSION':
      return { ...state, studySessions: [...state.studySessions, action.payload] };
    case 'UPDATE_SETTINGS':
      return { ...state, settings: { ...state.settings, ...action.payload } };
    default:
      return state;
  }
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<Action>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState, (init) => {
    try {
      const saved = localStorage.getItem('lifeflow-state');
      return saved ? { ...init, ...JSON.parse(saved) } : init;
    } catch {
      return init;
    }
  });

  // Persist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('lifeflow-state', JSON.stringify(state));
    } catch {}
  }, [state]);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

// ─── Dark Mode Context ────────────────────────────────────────────────────────

interface DarkModeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

export const DarkModeContext = createContext<DarkModeContextType>({ darkMode: false, toggleDarkMode: () => {} });

export function DarkModeProvider({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(() => {
    try {
      const saved = localStorage.getItem('lifeflow-dark');
      return saved === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('lifeflow-dark', String(darkMode));
  }, [darkMode]);

  return (
    <DarkModeContext.Provider value={{ darkMode, toggleDarkMode: () => setDarkMode(d => !d) }}>
      {children}
    </DarkModeContext.Provider>
  );
}

export function useDarkMode() {
  return useContext(DarkModeContext);
}

// ─── Language Context ─────────────────────────────────────────────────────────

export type Language = 'uz' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const LanguageContext = createContext<LanguageContextType>({ language: 'uz', setLanguage: () => {} });

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('lifeflow-language');
      return (saved === 'uz' || saved === 'en') ? saved : 'uz';
    } catch {
      return 'uz';
    }
  });

  useEffect(() => {
    localStorage.setItem('lifeflow-language', language);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
