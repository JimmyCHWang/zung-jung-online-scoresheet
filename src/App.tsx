import { useState } from 'react'
import { 
  Box, 
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  useTheme
} from '@mui/material'
import ScoreIcon from '@mui/icons-material/Score'
import SettingsIcon from '@mui/icons-material/Settings'
import { AppTabs, type AppTabType } from './types'
import Scoresheet from './pages/Scoresheet'
import Settings from './pages/Settings'
import './App.css'

interface AppProps {
  darkMode: boolean;
  onThemeChange: (darkMode: boolean) => void;
}

function App({ darkMode, onThemeChange }: AppProps) {
  const [value, setValue] = useState<AppTabType>(AppTabs.SCORESHEET)
  const theme = useTheme()

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      height: '100%',
      position: 'relative',
      bgcolor: theme.palette.background.default
    }}>
      {/* 主要内容区域 */}
      <Box sx={{ 
        flexGrow: 1, 
        overflow: 'auto',
        pb: 7 // 为底部导航栏留出空间
      }}>
        {value === AppTabs.SCORESHEET && <Scoresheet />}
        {value === AppTabs.SETTINGS && (
          <Settings darkMode={darkMode} onThemeChange={onThemeChange} />
        )}
      </Box>

      {/* 底部导航栏 */}
      <Paper 
        sx={{ 
          position: 'fixed', 
          bottom: 0, 
          left: 0, 
          right: 0,
          borderTop: 1,
          borderColor: 'divider'
        }} 
        elevation={3}
      >
        <BottomNavigation
          value={value}
          onChange={(_event, newValue) => {
            setValue(newValue as AppTabType)
          }}
          showLabels
        >
          <BottomNavigationAction 
            label="记分表" 
            icon={<ScoreIcon />} 
          />
          <BottomNavigationAction 
            label="设置" 
            icon={<SettingsIcon />} 
          />
        </BottomNavigation>
      </Paper>
    </Box>
  )
}

export default App
