import { create } from 'zustand';
import { DEFAULT_THEME_ID } from '../styles/themes';

/* =========================================================================
 * GLOBAL LEARNING STORE
 * -------------------------------------------------------------------------
 * - Backwards compatible with the original persisted schema
 * - Versioned persistence with forward-safe migration / default merging
 * - Cross-tab synchronisation
 * - XP economy, daily goals, streaks and level ladder
 * ========================================================================= */

export interface UserProgressState {
  /* --- Persisted learning progress --- */
  masteredWordIds: number[];
  favoriteWordIds: number[];
  totalXp: number;
  currentStreakDays: number;
  lastStudyDate: string;
  themeId: string;
  isDarkMode: boolean;
  audioPlaybackRate: number;
  geminiApiKey: string;

  /* --- Extended profile & preferences --- */
  xpToday: number;
  lastXpDate: string;
  dailyGoalXp: number;
  recentWordIds: number[];
  recentSearches: string[];
  soundEnabled: boolean;
  reduceMotion: boolean;
  compactMode: boolean;
  hasHydrated: boolean;
  schemaVersion: number;

  /* --- Actions --- */
  toggleMastered: (wordId: number) => void;
  toggleFavorite: (wordId: number) => void;
  addXp: (amount: number) => void;
  setThemeId: (id: string) => void;
  toggleDarkMode: () => void;
  setDarkMode: (value: boolean) => void;
  setAudioPlaybackRate: (rate: number) => void;
  setGeminiApiKey: (key: string) => void;
  recordStudyActivity: () => void;
  setDailyGoalXp: (goal: number) => void;
  recordWordView: (wordId: number) => void;
  recordSearch: (query: string) => void;
  clearRecentSearches: () => void;
  toggleSound: () => void;
  toggleReduceMotion: () => void;
  toggleCompactMode: () => void;
  resetProgress: () => void;
  hydrate: () => void;
}

const STORAGE_KEY = 'oxford_3000_enterprise_progress';
export const STORE_SCHEMA_VERSION = 2;

const today = () => new Date().toISOString().split('T')[0];

const DEFAULT_STATE = {
  masteredWordIds: [] as number[],
  favoriteWordIds: [] as number[],
  totalXp: 120,
  currentStreakDays: 1,
  lastStudyDate: today(),
  themeId: DEFAULT_THEME_ID,
  isDarkMode: false,
  audioPlaybackRate: 0.9,
  geminiApiKey: '',
  xpToday: 0,
  lastXpDate: today(),
  dailyGoalXp: 120,
  recentWordIds: [] as number[],
  recentSearches: [] as string[],
  soundEnabled: true,
  reduceMotion: false,
  compactMode: false,
  hasHydrated: false,
  schemaVersion: STORE_SCHEMA_VERSION,
};

/** Keys that are persisted to localStorage (actions/transient state excluded). */
const PERSISTED_KEYS: (keyof UserProgressState)[] = [
  'masteredWordIds',
  'favoriteWordIds',
  'totalXp',
  'currentStreakDays',
  'lastStudyDate',
  'themeId',
  'isDarkMode',
  'audioPlaybackRate',
  'geminiApiKey',
  'xpToday',
  'lastXpDate',
  'dailyGoalXp',
  'recentWordIds',
  'recentSearches',
  'soundEnabled',
  'reduceMotion',
  'compactMode',
  'schemaVersion',
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function asNumberArray(value: unknown, fallback: number[] = []): number[] {
  return Array.isArray(value) ? value.filter((v): v is number => typeof v === 'number') : fallback;
}

function asStringArray(value: unknown, fallback: string[] = []): string[] {
  return Array.isArray(value) ? value.filter((v): v is string => typeof v === 'string') : fallback;
}

/**
 * Merges a persisted payload (possibly from an older schema, possibly corrupt)
 * into a complete, type-safe state slice.
 */
export function mergePersistedProgress(raw: unknown): Partial<UserProgressState> {
  if (!isRecord(raw)) return {};

  const merged: Partial<UserProgressState> = {};

  if ('masteredWordIds' in raw) merged.masteredWordIds = asNumberArray(raw.masteredWordIds, []);
  if ('favoriteWordIds' in raw) merged.favoriteWordIds = asNumberArray(raw.favoriteWordIds, []);

  if (typeof raw.totalXp === 'number' && Number.isFinite(raw.totalXp)) {
    merged.totalXp = Math.max(0, Math.round(raw.totalXp));
  }
  if (typeof raw.currentStreakDays === 'number' && Number.isFinite(raw.currentStreakDays)) {
    merged.currentStreakDays = Math.max(1, Math.round(raw.currentStreakDays));
  }
  if (typeof raw.lastStudyDate === 'string') merged.lastStudyDate = raw.lastStudyDate;
  if (typeof raw.themeId === 'string' && raw.themeId) merged.themeId = raw.themeId;
  if (typeof raw.isDarkMode === 'boolean') merged.isDarkMode = raw.isDarkMode;
  if (typeof raw.audioPlaybackRate === 'number' && raw.audioPlaybackRate > 0) {
    merged.audioPlaybackRate = raw.audioPlaybackRate;
  }
  if (typeof raw.geminiApiKey === 'string') merged.geminiApiKey = raw.geminiApiKey;

  if (typeof raw.xpToday === 'number' && Number.isFinite(raw.xpToday)) {
    merged.xpToday = Math.max(0, Math.round(raw.xpToday));
  }
  if (typeof raw.lastXpDate === 'string') merged.lastXpDate = raw.lastXpDate;
  if (typeof raw.dailyGoalXp === 'number' && raw.dailyGoalXp > 0) {
    merged.dailyGoalXp = Math.round(raw.dailyGoalXp);
  }
  if ('recentWordIds' in raw) merged.recentWordIds = asNumberArray(raw.recentWordIds, []).slice(0, 24);
  if ('recentSearches' in raw) merged.recentSearches = asStringArray(raw.recentSearches, []).slice(0, 10);
  if (typeof raw.soundEnabled === 'boolean') merged.soundEnabled = raw.soundEnabled;
  if (typeof raw.reduceMotion === 'boolean') merged.reduceMotion = raw.reduceMotion;
  if (typeof raw.compactMode === 'boolean') merged.compactMode = raw.compactMode;

  // Daily XP counter rolls over automatically on a new day
  if (merged.lastXpDate && merged.lastXpDate !== today()) {
    merged.xpToday = 0;
    merged.lastXpDate = today();
  }

  merged.schemaVersion = STORE_SCHEMA_VERSION;
  return merged;
}

function readPersisted(): Partial<UserProgressState> {
  if (typeof window === 'undefined') return {};
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (!saved) return {};
    return mergePersistedProgress(JSON.parse(saved));
  } catch {
    return {};
  }
}

function persist(state: Partial<UserProgressState>) {
  if (typeof window === 'undefined') return;
  try {
    const source = state as Record<string, unknown>;
    const payload: Record<string, unknown> = {};
    for (const key of PERSISTED_KEYS) {
      if (key in source) payload[key] = source[key];
    }
    payload.schemaVersion = STORE_SCHEMA_VERSION;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  } catch (error) {
    console.error('Failed to persist Oxford progress:', error);
  }
}

export const useStore = create<UserProgressState>((set, get) => {
  const commit = (patch: Partial<UserProgressState>) => {
    set(patch as UserProgressState);
    persist({ ...get(), ...patch });
  };

  return {
    ...DEFAULT_STATE,

    hydrate: () => {
      const persisted = readPersisted();
      set({ ...persisted, hasHydrated: true } as UserProgressState);
    },

    toggleMastered: (wordId: number) => {
      const state = get();
      const isCurrentlyMastered = state.masteredWordIds.includes(wordId);
      const nextMastered = isCurrentlyMastered
        ? state.masteredWordIds.filter((id) => id !== wordId)
        : [...state.masteredWordIds, wordId];

      commit({
        masteredWordIds: nextMastered,
        totalXp: isCurrentlyMastered ? state.totalXp : state.totalXp + 25,
        xpToday: isCurrentlyMastered ? state.xpToday : state.xpToday + 25,
        lastXpDate: today(),
        recentWordIds: [wordId, ...state.recentWordIds.filter((id) => id !== wordId)].slice(0, 24),
      });
    },

    toggleFavorite: (wordId: number) => {
      const state = get();
      const isFavorite = state.favoriteWordIds.includes(wordId);
      commit({
        favoriteWordIds: isFavorite
          ? state.favoriteWordIds.filter((id) => id !== wordId)
          : [...state.favoriteWordIds, wordId],
      });
    },

    addXp: (amount: number) => {
      if (!Number.isFinite(amount) || amount === 0) return;
      const state = get();
      commit({
        totalXp: Math.max(0, state.totalXp + amount),
        xpToday: Math.max(0, state.xpToday + Math.max(0, amount)),
        lastXpDate: today(),
      });
    },

    setThemeId: (id: string) => {
      if (!id) return;
      commit({ themeId: id });
    },

    toggleDarkMode: () => {
      commit({ isDarkMode: !get().isDarkMode });
    },

    setDarkMode: (value: boolean) => {
      if (get().isDarkMode === value) return;
      commit({ isDarkMode: value });
    },

    setAudioPlaybackRate: (rate: number) => {
      if (!Number.isFinite(rate) || rate <= 0) return;
      commit({ audioPlaybackRate: rate });
    },

    setGeminiApiKey: (key: string) => {
      commit({ geminiApiKey: key });
    },

    recordStudyActivity: () => {
      const state = get();
      const now = today();
      if (state.lastStudyDate === now) {
        commit({ totalXp: state.totalXp + 5 });
        return;
      }

      const lastDate = new Date(state.lastStudyDate);
      const currentDate = new Date(now);
      const diffDays = Math.round(
        (currentDate.getTime() - lastDate.getTime()) / (1000 * 3600 * 24)
      );

      let streak = state.currentStreakDays;
      if (diffDays === 1) streak += 1;
      else if (diffDays > 1 || diffDays < 0) streak = 1;

      commit({
        lastStudyDate: now,
        currentStreakDays: streak,
        totalXp: state.totalXp + 50,
        xpToday: state.xpToday + 50,
        lastXpDate: now,
      });
    },

    setDailyGoalXp: (goal: number) => {
      if (!Number.isFinite(goal) || goal < 20) return;
      commit({ dailyGoalXp: Math.min(2000, Math.round(goal)) });
    },

    recordWordView: (wordId: number) => {
      const state = get();
      if (state.recentWordIds[0] === wordId) return;
      commit({
        recentWordIds: [wordId, ...state.recentWordIds.filter((id) => id !== wordId)].slice(0, 24),
      });
    },

    recordSearch: (query: string) => {
      const clean = query.trim();
      if (clean.length < 2) return;
      const state = get();
      commit({
        recentSearches: [clean, ...state.recentSearches.filter((q) => q !== clean)].slice(0, 10),
      });
    },

    clearRecentSearches: () => {
      commit({ recentSearches: [] });
    },

    toggleSound: () => {
      commit({ soundEnabled: !get().soundEnabled });
    },

    toggleReduceMotion: () => {
      commit({ reduceMotion: !get().reduceMotion });
    },

    toggleCompactMode: () => {
      commit({ compactMode: !get().compactMode });
    },

    resetProgress: () => {
      commit({
        ...DEFAULT_STATE,
        hasHydrated: true,
        themeId: get().themeId,
        isDarkMode: get().isDarkMode,
      });
    },
  };
});

/* ------------------------------------------------------------------ */
/* Cross-tab synchronisation                                          */
/* ------------------------------------------------------------------ */
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    try {
      const parsed = mergePersistedProgress(JSON.parse(event.newValue));
      useStore.setState({ ...parsed, hasHydrated: true } as Partial<UserProgressState>);
    } catch {
      /* ignore malformed cross-tab payloads */
    }
  });
}

/* ------------------------------------------------------------------ */
/* XP level ladder                                                    */
/* ------------------------------------------------------------------ */
export interface XpLevel {
  level: number;
  min: number;
  name: string;
  nameAr: string;
  icon: string;
}

export const XP_LEVELS: XpLevel[] = [
  { level: 1, min: 0, name: 'Novice Explorer', nameAr: 'مستكشف مبتدئ', icon: '🌱' },
  { level: 2, min: 250, name: 'Dedicated Lexicist', nameAr: 'معجمي مجتهد', icon: '📗' },
  { level: 3, min: 750, name: 'Fluency Practitioner', nameAr: 'ممارس الطلاقة', icon: '🎯' },
  { level: 4, min: 1500, name: 'Oxford Grand Scholar', nameAr: 'عالم أكسفورد', icon: '🎓' },
  { level: 5, min: 3000, name: 'Lexicon Laureate', nameAr: 'حائز وسام المعجم', icon: '🏛️' },
  { level: 6, min: 6000, name: 'Oxford Master', nameAr: 'سيد أكسفورد', icon: '👑' },
];

export interface LevelInfo extends XpLevel {
  nextLevel: XpLevel | null;
  xpIntoLevel: number;
  xpForNextLevel: number;
  progressPercent: number;
  remainingXp: number;
}

export function getLevelInfo(totalXp: number): LevelInfo {
  const xp = Math.max(0, Math.round(totalXp || 0));
  let current = XP_LEVELS[0];
  for (const level of XP_LEVELS) {
    if (xp >= level.min) current = level;
  }
  const nextLevel = XP_LEVELS.find((l) => l.min > current.min) || null;
  const span = nextLevel ? nextLevel.min - current.min : 1;
  const into = xp - current.min;
  const percent = nextLevel ? Math.min(100, Math.round((into / span) * 100)) : 100;

  return {
    ...current,
    nextLevel,
    xpIntoLevel: into,
    xpForNextLevel: span,
    progressPercent: percent,
    remainingXp: nextLevel ? Math.max(0, nextLevel.min - xp) : 0,
  };
}

export { STORAGE_KEY as PROGRESS_STORAGE_KEY };
