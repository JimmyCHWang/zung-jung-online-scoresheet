export const AppTabs = {
  SCORESHEET: 0,
  CALCULATOR: 1,
  SETTINGS: 2
} as const;

export type AppTabType = typeof AppTabs[keyof typeof AppTabs]; 