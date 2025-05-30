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
import { useState, useEffect } from 'react'
import ChaseStrategy from './components/ChaseStrategy'
import EditGameSetting from './components/EditGameSetting'
import GameHeader from './components/GameHeader'
import ScoreForm from './components/ScoreForm'
import TimeDisplay from './components/TimeDisplay'
import { type GameStateRecord, type PlayerPositionType, type RoundStateType, GameState, NumberToPlayerPosition, RoundState } from '@/types/game-state'
import { INITIAL_GAME_STATE } from '@/constants/game-state'
import { cellStyle, actionCellStyle } from './styles'
import { scoreCompute, getFanText } from '@/utils/zung-jung/score'
import { type RoundRecord, type FanStates } from '@/types'

const STORAGE_KEY = 'zung-jung-game-state'

const WIND_NAMES = ['东', '南', '西', '北']

// 生成局数名称
const getRoundName = (index: number) => {
  const outerWind = WIND_NAMES[Math.floor(index / 4)]
  const innerWind = WIND_NAMES[index % 4]
  return `${outerWind}风${innerWind}`
}

export default function Scoresheet() {
  const [gameState, setGameState] = useState<GameStateRecord>(() => {
    // 从 localStorage 中读取状态，如果没有则使用初始状态
    const savedState = localStorage.getItem(STORAGE_KEY)
    return savedState ? JSON.parse(savedState) : INITIAL_GAME_STATE
  })
  const [chaseStrategyOpen, setChaseStrategyOpen] = useState(false)
  const [editGameSettingOpen, setEditGameSettingOpen] = useState(false)
  const [scoringRound, setScoringRound] = useState<number | null>(null)
  const [clearTableDialogOpen, setClearTableDialogOpen] = useState(false)
  const [editRoundDialogOpen, setEditRoundDialogOpen] = useState(false)
  const [selectedRound, setSelectedRound] = useState<number | null>(null)

  // 监听 gameState 的变化，同步到 localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(gameState))
  }, [gameState])

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
        loser: -1,
        fanStates: {}
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
    setEditGameSettingOpen(false)
  }

  const handleStartScoring = (roundIndex: number) => {
    setScoringRound(roundIndex)
  }

  const handleBackFromScoring = () => {
    setScoringRound(null)
  }

  const handleSubmit = (data: {
    winner: number
    loser: number
    score: number
    isDraw: boolean
    isTimeout: boolean
    fanStates: FanStates
  }) => {
    let roundState: RoundStateType = RoundState.WON
    if (data.isDraw) {
      roundState = RoundState.DRAW
    } else if (data.isTimeout) {
      roundState = RoundState.TIMEOUT
    }

    const record: RoundRecord = {
      roundState,
      score: scoreCompute({
        score: data.score,
        winner: data.winner,
        loser: data.loser
      }),
      winner: data.winner,
      loser: data.loser,
      fanStates: data.fanStates
    }

    const isEditing = scoringRound === gameState.currentState

    setGameState(prev => {
      const newRounds = [...prev.rounds]
      // 如果是编辑已有局，使用 scoringRound，否则使用 currentState - 1
      const targetRound = isEditing ? scoringRound : prev.currentState - 1
      newRounds[targetRound] = record
      // 只有在新增局时才更新 currentState
      const nextState = isEditing ? prev.currentState : prev.currentState + 1
      return {
        ...prev,
        rounds: newRounds,
        currentState: nextState > 16 ? GameState.FINISHED : nextState,
        endTime: nextState > 16 ? Date.now() : prev.endTime
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

  const handleForceEnd = () => {
    setGameState(prev => {
      const newRounds = prev.rounds.map(round => {
        if (round.roundState === RoundState.NOT_STARTED) {
          return {
            ...round,
            roundState: RoundState.TIMEOUT
          }
        }
        return round
      })

      return {
        ...prev,
        rounds: newRounds,
        endTime: Date.now(),
        currentState: GameState.FINISHED // 设置为结束
      }
    })
  }

  const handleRoundClick = (roundIndex: number) => {
    const round = gameState.rounds[roundIndex]
    if (round.roundState !== RoundState.NOT_STARTED) {
      setSelectedRound(roundIndex)
      setEditRoundDialogOpen(true)
    }
  }

  const handleEditRound = () => {
    if (selectedRound !== null) {
      setScoringRound(selectedRound)
      setEditRoundDialogOpen(false)
    }
  }

  if (scoringRound !== null) {
    const round = gameState.rounds[scoringRound]
    return (
      <ScoreForm
        roundNumber={scoringRound + 1}
        players={gameState.players}
        onBack={handleBackFromScoring}
        onSubmit={handleSubmit}
        initialData={{
          winner: round.winner,
          loser: round.loser,
          score: round.score[round.winner],
          isDraw: round.roundState === RoundState.DRAW,
          isTimeout: round.roundState === RoundState.TIMEOUT,
          fanStates: round.fanStates
        }}
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
        onForceEnd={handleForceEnd}
      />

      <TableContainer component={Paper} elevation={3}>
        <Table size="small" stickyHeader sx={{ tableLayout: 'fixed' }}>
          <TableBody>
            {gameState.rounds.map((round, i) => (
              <TableRow 
                key={i}
                onClick={() => handleRoundClick(i)}
                sx={{ 
                  cursor: round.roundState !== RoundState.NOT_STARTED ? 'pointer' : 'default',
                  '&:hover': {
                    backgroundColor: round.roundState !== RoundState.NOT_STARTED ? 'action.hover' : 'inherit'
                  }
                }}
              >
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
                  {gameState.currentState === i + 1 ? (
                    <Button
                      variant="text"
                      color="primary"
                      size="small"
                      onClick={() => handleStartScoring(i)}
                      sx={{ p: 0 }}
                    >
                      计分
                    </Button>
                  ) : round.roundState !== RoundState.NOT_STARTED && (
                    <Typography variant="body2" color="text.secondary">
                      {round.roundState === RoundState.DRAW ? '荒庄' :
                       round.roundState === RoundState.TIMEOUT ? '超时' :
                       getFanText(round.fanStates)}
                    </Typography>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TimeDisplay
        gameState={gameState.currentState}
        startTime={gameState.startTime}
        endTime={gameState.endTime}
      />

      <ChaseStrategy 
        open={chaseStrategyOpen}
        onClose={() => setChaseStrategyOpen(false)}
      />

      <EditGameSetting
        open={editGameSettingOpen}
        onClose={() => setEditGameSettingOpen(false)}
        onSave={handleEditGameSetting}
        initialTitle={gameState.title}
        initialPlayers={gameState.players}
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

      {/* 编辑已完成局的确认对话框 */}
      <Dialog
        open={editRoundDialogOpen}
        onClose={() => setEditRoundDialogOpen(false)}
      >
        <DialogTitle>
          {selectedRound !== null && getRoundName(selectedRound)} 详情
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {selectedRound !== null && (
              <>
                <Typography variant="body1" paragraph>
                  {(() => {
                    const round = gameState.rounds[selectedRound]
                    if (round.roundState === RoundState.TIMEOUT) {
                      return '超时。'
                    }
                    if (round.roundState === RoundState.DRAW) {
                      return '荒庄。'
                    }
                    const winnerName = gameState.players[NumberToPlayerPosition[round.winner as keyof typeof NumberToPlayerPosition] as PlayerPositionType]
                    const loserName = gameState.players[NumberToPlayerPosition[round.loser as keyof typeof NumberToPlayerPosition] as PlayerPositionType]
                    const fanText = getFanText(round.fanStates)
                    const totalScore = Math.round(round.score[round.winner] / 3)
                    const isSelfDraw = round.winner === round.loser
                    
                    if (isSelfDraw) {
                      return `${winnerName}自摸${fanText}，总计${totalScore}分。`
                    } else {
                      return `${winnerName}和${fanText}，总计${totalScore}分，${loserName}点炮。`
                    }
                  })()}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  点击"修改"按钮可以编辑此局的记录。
                </Typography>
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditRoundDialogOpen(false)}>取消</Button>
          <Button onClick={handleEditRound} variant="contained">
            修改
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  )
} 