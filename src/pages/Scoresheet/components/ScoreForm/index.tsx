import { 
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useState } from 'react'
import ScoreAndState from './components/ScoreAndState'
import PlayerStatus from './components/PlayerStatus'
import { ScoreFormProvider } from './context'

interface ScoreFormProps {
  roundNumber: number
  onBack: () => void
}

export default function ScoreForm({ roundNumber, onBack }: ScoreFormProps) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)

  const handleBackClick = () => {
    setConfirmDialogOpen(true)
  }

  const handleConfirmBack = () => {
    setConfirmDialogOpen(false)
    onBack()
  }

  return (
    <ScoreFormProvider>
      <Box sx={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        bgcolor: 'background.paper',
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column'
      }}>
        {/* 顶部导航栏 */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          p: 2,
          borderBottom: 1,
          borderColor: 'divider'
        }}>
          <IconButton 
            onClick={handleBackClick}
            sx={{ mr: 2 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1, textAlign: 'center' }}>
            第 {roundNumber} 局
          </Typography>
          <Box sx={{ width: 48 }} /> {/* 为了保持标题居中 */}
        </Box>

        {/* 表单内容区域 */}
        <Box sx={{ flex: 1, p: 2 }}>
          <ScoreAndState />
          <PlayerStatus />
        </Box>

        {/* 确认对话框 */}
        <Dialog
          open={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
        >
          <DialogTitle>确认退出</DialogTitle>
          <DialogContent>
            <DialogContentText>
              所有未保存的更改将会丢失，确定要退出吗？
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmDialogOpen(false)}>取消</Button>
            <Button onClick={handleConfirmBack} color="primary" autoFocus>
              确定
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </ScoreFormProvider>
  )
} 