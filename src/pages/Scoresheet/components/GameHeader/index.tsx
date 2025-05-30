import { 
  Typography, 
  Button, 
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material'
import { PlayerPosition } from '@/types/game-state'
import { headerCellStyle, cellStyle, firstColumnStyle, actionCellStyle } from '../../styles'
import { useState } from 'react'

const RANK_NAMES = ['一', '二', '三', '四']

interface GameHeaderProps {
  title: string
  players: Record<string, string>
  currentState: number
  totalScores: number[]
  rankings: number[]
  onStartGame: () => void
  onEditGameSetting: () => void
  onClearTable: () => void
  onOpenChaseStrategy: () => void
  onForceEnd: () => void
}

export default function GameHeader({
  title,
  players,
  currentState,
  totalScores,
  rankings,
  onStartGame,
  onEditGameSetting,
  onClearTable,
  onOpenChaseStrategy,
  onForceEnd
}: GameHeaderProps) {
  const [forceEndDialogOpen, setForceEndDialogOpen] = useState(false)

  const handleForceEnd = () => {
    setForceEndDialogOpen(true)
  }

  const handleConfirmForceEnd = () => {
    onForceEnd()
    setForceEndDialogOpen(false)
  }

  return (
    <>
      <Typography variant="h5" component="h1" gutterBottom>
        {title}
      </Typography>
      
      <Stack 
        direction="row" 
        spacing={2} 
        sx={{ 
          mb: 2,
          justifyContent: 'space-between',
          width: '100%',
          px: 2,
        }}
      >
        <Button 
          variant="contained" 
          onClick={onOpenChaseStrategy}
        >
          追分策略
        </Button>
        <Button 
          variant="contained" 
          color="warning"
          onClick={onClearTable}
        >
          清空表格
        </Button>
        <Button 
          variant="contained" 
          color="secondary"
          onClick={onEditGameSetting}
        >
          编辑信息
        </Button>
      </Stack>

      <Table size="small" stickyHeader sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            <TableCell sx={headerCellStyle('选手姓名')}>选手姓名</TableCell>
            <TableCell sx={headerCellStyle(players[PlayerPosition.EAST])}>{players[PlayerPosition.EAST]}</TableCell>
            <TableCell sx={headerCellStyle(players[PlayerPosition.SOUTH])}>{players[PlayerPosition.SOUTH]}</TableCell>
            <TableCell sx={headerCellStyle(players[PlayerPosition.WEST])}>{players[PlayerPosition.WEST]}</TableCell>
            <TableCell sx={headerCellStyle(players[PlayerPosition.NORTH])}>{players[PlayerPosition.NORTH]}</TableCell>
            <TableCell sx={actionCellStyle}>操作</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {/* 开局座位显示行 */}
          <TableRow>
            <TableCell sx={firstColumnStyle('开局座位')}>开局座位</TableCell>
            <TableCell sx={cellStyle}>东</TableCell>
            <TableCell sx={cellStyle}>南</TableCell>
            <TableCell sx={cellStyle}>西</TableCell>
            <TableCell sx={cellStyle}>北</TableCell>
            <TableCell sx={actionCellStyle}></TableCell>
          </TableRow>

          {/* 总分显示行 */}
          <TableRow>
            <TableCell sx={firstColumnStyle('总分')}>总分</TableCell>
            {totalScores.map((score, index) => (
              <TableCell key={index} sx={cellStyle}>
                <Typography
                  variant="body2"
                  color={score > 0 ? 'error' : score < 0 ? 'success.main' : 'text.primary'}
                >
                  {score >= 0 ? `+${score}` : score}
                </Typography>
              </TableCell>
            ))}
            <TableCell sx={actionCellStyle}></TableCell>
          </TableRow>

          {/* 排名显示行 */}
          <TableRow>
            <TableCell sx={firstColumnStyle('排名')}>排名</TableCell>
            {rankings.map((rank, index) => (
              <TableCell key={index} sx={cellStyle}>
                {currentState > 1 ? RANK_NAMES[rank] : ''}
              </TableCell>
            ))}
            <TableCell sx={actionCellStyle}>
              {currentState === 0 ? (
                <Button
                  variant="text"
                  color="primary"
                  size="small"
                  onClick={onStartGame}
                  sx={{
                    p: 0
                  }}
                >
                  开始
                </Button>
              ) : currentState < 17 && (
                <Button
                  variant="text"
                  color="warning"
                  size="small"
                  onClick={handleForceEnd}
                  sx={{
                    p: 0
                  }}
                >
                  强制结束
                </Button>
              )}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* 强制结束确认对话框 */}
      <Dialog
        open={forceEndDialogOpen}
        onClose={() => setForceEndDialogOpen(false)}
      >
        <DialogTitle>确认强制结束</DialogTitle>
        <DialogContent>
          <DialogContentText>
            强制结束将会把所有未开始的局设置为超时状态，并结束当前游戏。确定要继续吗？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setForceEndDialogOpen(false)}>取消</Button>
          <Button onClick={handleConfirmForceEnd} color="warning" autoFocus>
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
} 