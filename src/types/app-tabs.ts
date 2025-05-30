export const AppTabs = {
  SCORESHEET: 0,
  SETTINGS: 1
} as const;

export type AppTabType = typeof AppTabs[keyof typeof AppTabs]; 