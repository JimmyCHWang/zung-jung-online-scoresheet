import { Typography, Box } from '@mui/material'
import { GameState } from '@/types/game-state'

interface TimeDisplayProps {
  gameState: number
  startTime?: number
  endTime?: number
}

export default function TimeDisplay({ gameState, startTime, endTime }: TimeDisplayProps) {
  if (gameState === GameState.NOT_STARTED) {
    return null
  }

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp)
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`
  }

  const formatDuration = (start: number, end: number) => {
    const duration = end - start
    const hours = Math.floor(duration / (1000 * 60 * 60))
    const minutes = Math.floor((duration % (1000 * 60 * 60)) / (1000 * 60))
    return `${hours}小时${minutes}分钟`
  }

  return (
    <Box sx={{ mt: 2, textAlign: 'center' }}>
      {gameState === GameState.FINISHED ? (
        <>
          <Typography variant="body2" color="text.secondary">
            游戏时间：{formatTime(startTime!)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            结束时间：{formatTime(endTime!)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            持续时间：{formatDuration(startTime!, endTime!)}
          </Typography>
        </>
      ) : (
        <Typography variant="body2" color="text.secondary">
          开始时间：{formatTime(startTime!)}
        </Typography>
      )}
    </Box>
  )
} 