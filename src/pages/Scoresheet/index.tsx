import { 
  Container, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material'
import { useState } from 'react'
import ChaseStrategy from './components/ChaseStrategy'
import EditGameSetting from './components/EditGameSetting'
import GameHeader from './components/GameHeader'
import ScoreForm from './components/ScoreForm'
import { type GameStateRecord, type PlayerPositionType, RoundState } from '@/types/game-state'
import { INITIAL_GAME_STATE } from '@/constants/game-state'
import { cellStyle, actionCellStyle } from './styles'
import { scoreCompute } from '@/utils/zung-jung/score'

const WIND_NAMES = ['东', '南', '西', '北']

// 生成局数名称
const getRoundName = (index: number) => {
  const outerWind = WIND_NAMES[Math.floor(index / 4)]
  const innerWind = WIND_NAMES[index % 4]
  return `${outerWind}风${innerWind}`
}

export default function Scoresheet() {
  const [gameState, setGameState] = useState<GameStateRecord>(INITIAL_GAME_STATE)
  const [chaseStrategyOpen, setChaseStrategyOpen] = useState(false)
  const [editGameSettingOpen, setEditGameSettingOpen] = useState(false)
  const [scoringRound, setScoringRound] = useState<number | null>(null)
  const [clearTableDialogOpen, setClearTableDialogOpen] = useState(false)

  const handleClearTable = () => {
    // 如果游戏未开始，直接返回
    if (gameState.currentState === 0) {
      return
    }
    // 否则打开确认对话框
    setClearTableDialogOpen(true)
  }

  const handleConfirmClearTable = () => {
    // 保留游戏标题和玩家名称，重置其他状态
    setGameState(prev => ({
      ...prev,
      startTime: undefined,
      endTime: undefined,
      currentState: 0,
      rounds: Array.from({ length: 16 }, () => ({
        roundState: RoundState.NOT_STARTED,
        score: [0, 0, 0, 0],
        winner: -1,
        loser: -1
      }))
    }))
    setClearTableDialogOpen(false)
  }

  const handleStartGame = () => {
    setGameState(prev => ({
      ...prev,
      startTime: Date.now(),
      currentState: 1
    }))
  }

  const handleEditGameSetting = (title: string, players: Record<PlayerPositionType, string>) => {
    setGameState(prev => ({
      ...prev,
      title,
      players
    }))
  }

  const handleStartScoring = (roundIndex: number) => {
    setScoringRound(roundIndex)
  }

  const handleBackFromScoring = () => {
    setScoringRound(null)
  }

  const handleSubmitScore = (data: {
    isDraw: boolean
    isTimeout: boolean
    score: number
    winner: number
    loser: number
  }) => {
    setGameState(prev => {
      const newRounds = [...prev.rounds]
      const currentRound = newRounds[prev.currentState - 1]

      // 设置回合状态
      if (data.isDraw) {
        currentRound.roundState = RoundState.DRAW
      } else if (data.isTimeout) {
        currentRound.roundState = RoundState.TIMEOUT
      } else {
        currentRound.roundState = RoundState.WON
      }

      // 设置分数、和牌者和点炮者
      if (data.isDraw || data.isTimeout) {
        currentRound.score = [0, 0, 0, 0]
      } else {
        currentRound.score = scoreCompute({
          score: data.score,
          winner: data.winner,
          loser: data.loser
        })
      }
      currentRound.winner = data.winner
      currentRound.loser = data.loser

      // 更新游戏进度
      const nextState = prev.currentState + 1
      const newState = nextState > 16 ? 100 : nextState

      return {
        ...prev,
        rounds: newRounds,
        currentState: newState
      }
    })

    setScoringRound(null)
  }

  // 计算总分
  const calculateTotalScores = () => {
    const totalScores = [0, 0, 0, 0]
    gameState.rounds.forEach(round => {
      if (round.score) {
        round.score.forEach((score, index) => {
          totalScores[index] += score
        })
      }
    })
    return totalScores
  }

  // 计算排名
  const calculateRankings = (scores: number[]) => {
    // 创建带索引的分数数组
    const indexedScores = scores.map((score, index) => ({ score, index }))
    
    // 按分数降序排序
    indexedScores.sort((a, b) => b.score - a.score)
    
    // 计算排名（处理并列情况）
    const rankings = new Array(scores.length).fill(0)
    let currentRank = 0
    let currentScore = indexedScores[0].score
    let sameScoreCount = 0

    indexedScores.forEach((item) => {
      if (item.score === currentScore) {
        sameScoreCount++
      } else {
        currentRank += sameScoreCount
        currentScore = item.score
        sameScoreCount = 1
      }
      rankings[item.index] = currentRank
    })

    return rankings
  }

  if (scoringRound !== null) {
    return (
      <ScoreForm
        roundNumber={scoringRound + 1}
        players={gameState.players}
        onBack={handleBackFromScoring}
        onSubmit={handleSubmitScore}
      />
    )
  }

  const totalScores = calculateTotalScores()
  const rankings = calculateRankings(totalScores)

  return (
    <Container maxWidth="sm" sx={{ mt: 2, px: 0 }}>
      <GameHeader
        title={gameState.title}
        players={gameState.players}
        currentState={gameState.currentState}
        totalScores={totalScores}
        rankings={rankings}
        onStartGame={handleStartGame}
        onEditGameSetting={() => setEditGameSettingOpen(true)}
        onClearTable={handleClearTable}
        onOpenChaseStrategy={() => setChaseStrategyOpen(true)}
      />

      <TableContainer component={Paper} elevation={3}>
        <Table size="small" stickyHeader sx={{ tableLayout: 'fixed' }}>
          <TableBody>
            {gameState.rounds.map((round, i) => (
              <TableRow key={i}>
                <TableCell sx={cellStyle}>{getRoundName(i)}</TableCell>
                {round.roundState === RoundState.NOT_STARTED ? (
                  <>
                    <TableCell sx={cellStyle}></TableCell>
                    <TableCell sx={cellStyle}></TableCell>
                    <TableCell sx={cellStyle}></TableCell>
                    <TableCell sx={cellStyle}></TableCell>
                  </>
                ) : (
                  round.score.map((score, idx) => (
                    <TableCell key={idx} sx={cellStyle}>
                      <Typography
                        variant="body2"
                        color={score > 0 ? 'error' : score < 0 ? 'success.main' : 'text.disabled'}
                      >
                        {score >= 0 ? `+${score}` : score}
                      </Typography>
                    </TableCell>
                  ))
                )}
                <TableCell sx={actionCellStyle}>
                  {gameState.currentState === i + 1 && (
                    <Button
                      variant="text"
                      color="primary"
                      size="small"
                      onClick={() => handleStartScoring(i)}
                      sx={{ p: 0 }}
                    >
                      计分
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ChaseStrategy 
        open={chaseStrategyOpen}
        onClose={() => setChaseStrategyOpen(false)}
      />

      <EditGameSetting
        open={editGameSettingOpen}
        onClose={() => setEditGameSettingOpen(false)}
        setGameTitle={(title) => handleEditGameSetting(title, gameState.players)}
        setPlayers={(players) => handleEditGameSetting(gameState.title, players)}
        gameTitle={gameState.title}
        players={gameState.players}
      />

      {/* 清空表格确认对话框 */}
      <Dialog
        open={clearTableDialogOpen}
        onClose={() => setClearTableDialogOpen(false)}
      >
        <DialogTitle>确认清空表格</DialogTitle>
        <DialogContent>
          <DialogContentText>
            清空表格将会清除所有游戏记录，仅保留游戏标题和玩家名称。确定要继续吗？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearTableDialogOpen(false)}>取消</Button>
          <Button onClick={handleConfirmClearTable} color="warning" autoFocus>
            确定
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
} 