import { createTheme } from '@mui/material/styles';
import type { ThemeOptions } from '@mui/material/styles';

const getThemeOptions = (mode: 'light' | 'dark'): ThemeOptions => ({
  palette: {
    mode,
    ...(mode === 'dark' ? {
      background: {
        default: '#121212',
        paper: '#1e1e1e',
      },
    } : {
      background: {
        default: '#f5f5f5',
        paper: '#ffffff',
      },
    }),
  },
  typography: {
    fontFamily: [
      'Noto Sans SC',
      'Inter',
      'system-ui',
      'Avenir',
      'Helvetica',
      'Arial',
      'sans-serif',
    ].join(','),
  },
});

export const getTheme = (mode: 'light' | 'dark') => createTheme(getThemeOptions(mode)); 