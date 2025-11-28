import { AppSettings, KeyboardShortcuts } from "./types";

const SETTINGS_STORAGE_KEY = "web-amp-settings";

const DEFAULT_SHORTCUTS: KeyboardShortcuts = {
  playPause: " ",
  next: "ArrowRight",
  previous: "ArrowLeft",
  shuffle: "a",
  repeat: "r",
};

const getSettings = (): AppSettings => {
  const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (!stored) return { shortcuts: DEFAULT_SHORTCUTS };
  try {
    const parsed = JSON.parse(stored);
    return {
      ...parsed,
      shortcuts: { ...DEFAULT_SHORTCUTS, ...parsed.shortcuts },
    };
  } catch (error) {
    console.error("Failed to parse settings from localStorage", error);
    return { shortcuts: DEFAULT_SHORTCUTS };
  }
};

const saveSettings = (settings: AppSettings) => {
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
};

export const settingsService = {
  get: (): AppSettings => {
    return getSettings();
  },

  getToken: (): string | undefined => {
    const settings = getSettings();
    return settings.token;
  },

  setToken: (token: string): void => {
    const settings = getSettings();
    settings.token = token;
    saveSettings(settings);
  },

  removeToken: (): void => {
    const settings = getSettings();
    delete settings.token;
    saveSettings(settings);
  },

  getViewMode: (): "grid" | "list" => {
    const settings = getSettings();
    return settings.viewMode || "grid";
  },

  setViewMode: (viewMode: "grid" | "list"): void => {
    const settings = getSettings();
    settings.viewMode = viewMode;
    saveSettings(settings);
  },

  getSearchProvider: (): "youtube" => {
    const settings = getSettings();
    return settings.searchProvider || "youtube";
  },

  setSearchProvider: (provider: "youtube"): void => {
    const settings = getSettings();
    settings.searchProvider = provider;
    saveSettings(settings);
  },

  getShortcuts: (): KeyboardShortcuts => {
    const settings = getSettings();
    return settings.shortcuts || DEFAULT_SHORTCUTS;
  },

  setShortcuts: (shortcuts: KeyboardShortcuts): void => {
    const settings = getSettings();
    settings.shortcuts = shortcuts;
    saveSettings(settings);
  },

  update: (updates: Partial<AppSettings>): AppSettings => {
    const settings = getSettings();
    const updatedSettings = { ...settings, ...updates };
    saveSettings(updatedSettings);
    return updatedSettings;
  },

  clear: (): void => {
    localStorage.removeItem(SETTINGS_STORAGE_KEY);
  },
};
