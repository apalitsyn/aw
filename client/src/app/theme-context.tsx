import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material';
import { ReactNode } from 'react';

type ThemeMode = 'light' | 'dark';
interface ThemeContextType {
  mode: ThemeMode;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const getDesignTokens = (mode: ThemeMode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          background: { default: '#f7f7f7' },
        }
      : {
          background: { default: '#121212' },
        }),
  },
  typography: {
    fontFamily: ['Roboto', '"Playfair Display"', 'sans-serif'].join(','),
  },
});

export const ThemeAppProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState<ThemeMode>('light');

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    if (stored === 'dark' || stored === 'light') setMode(stored);
  }, []);

  useEffect(() => {
    localStorage.setItem('theme', mode);
  }, [mode]);

  const toggle = () => setMode(prev => (prev === 'light' ? 'dark' : 'light'));
  const theme = useMemo(() => createTheme(getDesignTokens(mode)), [mode]);

  return (
    <ThemeContext.Provider value={{ mode, toggle }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

export const useThemeMode = (): ThemeContextType => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useThemeMode must be used within ThemeAppProvider');
  return ctx;
};
