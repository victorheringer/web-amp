import { AppSettings } from "./types";

const SETTINGS_STORAGE_KEY = "web-amp-settings";

const getSettings = (): AppSettings => {
  const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
  if (!stored) return {};
  try {
    return JSON.parse(stored);
  } catch (error) {
    console.error("Failed to parse settings from localStorage", error);
    return {};
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
