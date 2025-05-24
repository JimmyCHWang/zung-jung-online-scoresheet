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
import FanSelector from './components/FanSelector'
import { FanStates } from '@/types'

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
  onSubmit: (params: {
    winner: number
    loser: number
    score: number
    isDraw: boolean
    isTimeout: boolean
    fanStates: FanStates
  }) => void
}

const ScoreFormContent = ({ roundNumber, players, onBack }: Omit<ScoreFormProps, 'onSubmit'>) => {
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const { isDraw, isTimeout, score, winner, loser, handleSubmit } = useScoreForm()

  const handleBackClick = () => {
    setConfirmDialogOpen(true)
  }

  const handleConfirmBack = () => {
    setConfirmDialogOpen(false)
    onBack()
  }

  const handleConfirm = () => {
    // 如果是和局或超时，直接通过
    if (isDraw || isTimeout) {
      handleSubmit()
      return
    }

    // 检查是否选择了和牌者
    if (winner === -1) {
      alert('请选择和牌者')
      return
    }

    // 检查是否选择了点炮者（非自摸时）
    if (loser === -1) {
      alert('请选择点炮者')
      return
    }

    // 检查分数是否有效
    if (score <= 0) {
      alert('分数必须大于0')
      return
    }

    // 所有校验通过，提交数据
    handleSubmit()
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
        <FanSelector />
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
          onClick={handleConfirm}
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

const ScoreForm = (props: ScoreFormProps) => {
  return (
    <ScoreFormProvider onSubmit={props.onSubmit}>
      <ScoreFormContent {...props} />
    </ScoreFormProvider>
  )
}

export default ScoreForm 