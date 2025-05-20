import { StrictMode, useState, useMemo } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { getTheme } from './theme'
import './index.css'
import App from './App.tsx'

function Main() {
  const [darkMode, setDarkMode] = useState(true)
  const theme = useMemo(() => getTheme(darkMode ? 'dark' : 'light'), [darkMode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App darkMode={darkMode} onThemeChange={setDarkMode} />
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Main />
  </StrictMode>,
)
