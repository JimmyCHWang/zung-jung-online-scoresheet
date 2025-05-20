import { useState } from 'react'
import { 
  Container, 
  Box, 
  Paper,
  BottomNavigation,
  BottomNavigationAction,
  Typography,
  Switch,
  FormControlLabel,
  useTheme
} from '@mui/material'
import ScoreIcon from '@mui/icons-material/Score'
import CalculateIcon from '@mui/icons-material/Calculate'
import SettingsIcon from '@mui/icons-material/Settings'
import './App.css'

interface AppProps {
  darkMode: boolean;
  onThemeChange: (darkMode: boolean) => void;
}

function App({ darkMode, onThemeChange }: AppProps) {
  const [value, setValue] = useState(0)
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
        {value === 0 && (
          <Container maxWidth="sm" sx={{ mt: 2 }}>
            <Typography variant="h5" component="h1" gutterBottom>
              记分表
            </Typography>
            <Paper elevation={3} sx={{ p: 2 }}>
              {/* 这里将添加记分表的内容 */}
              <Typography>记分表内容将在这里显示</Typography>
            </Paper>
          </Container>
        )}
        {value === 1 && (
          <Container maxWidth="sm" sx={{ mt: 2 }}>
            <Typography variant="h5" component="h1" gutterBottom>
              计分器
            </Typography>
            <Paper elevation={3} sx={{ p: 2 }}>
              {/* 这里将添加计分器的内容 */}
              <Typography>计分器内容将在这里显示</Typography>
            </Paper>
          </Container>
        )}
        {value === 2 && (
          <Container maxWidth="sm" sx={{ mt: 2 }}>
            <Typography variant="h5" component="h1" gutterBottom>
              设置
            </Typography>
            <Paper elevation={3} sx={{ p: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={(e) => onThemeChange(e.target.checked)}
                  />
                }
                label="深色模式"
              />
            </Paper>
          </Container>
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
            setValue(newValue)
          }}
          showLabels
        >
          <BottomNavigationAction 
            label="记分表" 
            icon={<ScoreIcon />} 
          />
          <BottomNavigationAction 
            label="计分器" 
            icon={<CalculateIcon />} 
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
