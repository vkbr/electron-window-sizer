export type SettingsStore<T> = {
  set: (data: T) => Promise<void>;
  get: () => Promise<T | null>;
};
