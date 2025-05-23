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
import { ScoreFormProvider, useScoreForm } from './context'
import { type PlayerPositionType } from '@/types/game-state'

const WIND_NAMES = ['东', '南', '西', '北']

// 生成局数名称
const getRoundName = (index: number) => {
  const outerWind = WIND_NAMES[Math.floor(index / 4)]
  const innerWind = WIND_NAMES[index % 4]
  return `${outerWind}风${innerWind}`
}

interface ScoreFormProps {
  roundNumber: number
  players: Record<PlayerPositionType, string>
  onBack: () => void
  onSubmit: (data: {
    isDraw: boolean
    isTimeout: boolean
    score: number
    winner: number
    loser: number
  }) => void
}

function ScoreFormContent({ roundNumber, players, onBack, onSubmit }: ScoreFormProps) {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const { isDraw, isTimeout, score, winner, loser } = useScoreForm()

  const handleBackClick = () => {
    setConfirmDialogOpen(true)
  }

  const handleConfirmBack = () => {
    setConfirmDialogOpen(false)
    onBack()
  }

  const handleSubmit = () => {
    // 1. 如果和局或超时，直接通过，并清理相关数据
    if (isDraw || isTimeout) {
      onSubmit({ 
        isDraw, 
        isTimeout, 
        score: 0, 
        winner: -1, 
        loser: -1 
      })
      return
    }

    // 2. 校验分数是否为正整数
    if (!Number.isInteger(score) || score <= 0) {
      alert('请输入正确的分数')
      return
    }

    // 3. 校验和牌者和点炮者是否都已选择
    if (winner === -1 || loser === -1) {
      alert('请选择和牌者和点炮者')
      return
    }

    // 所有校验通过，提交数据
    onSubmit({ isDraw, isTimeout, score, winner, loser })
  }

  return (
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
          {getRoundName(roundNumber - 1)}
        </Typography>
        <Box sx={{ width: 48 }} /> {/* 为了保持标题居中 */}
      </Box>

      {/* 表单内容区域 */}
      <Box sx={{ flex: 1, p: 2, overflow: 'auto' }}>
        <ScoreAndState />
        <PlayerStatus players={players} />
      </Box>

      {/* 底部提交按钮 */}
      <Box sx={{ 
        p: 2, 
        borderTop: 1, 
        borderColor: 'divider',
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Button 
          variant="contained" 
          size="large"
          onClick={handleSubmit}
          sx={{ minWidth: 200 }}
        >
          提交
        </Button>
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
  )
}

export default function ScoreForm(props: ScoreFormProps) {
  return (
    <ScoreFormProvider>
      <ScoreFormContent {...props} />
    </ScoreFormProvider>
  )
} 