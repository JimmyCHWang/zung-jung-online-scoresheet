import { Container, Typography, Paper, FormControlLabel, Switch } from '@mui/material'

interface SettingsProps {
  darkMode: boolean;
  onThemeChange: (darkMode: boolean) => void;
}

export default function Settings({ darkMode, onThemeChange }: SettingsProps) {
  return (
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
  )
} 