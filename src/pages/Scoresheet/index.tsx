import { 
  Container, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Button,
  Typography
} from '@mui/material'
import { useState } from 'react'
import ChaseStrategy from './components/ChaseStrategy'
import EditGameSetting from './components/EditGameSetting'
import GameHeader from './components/GameHeader'
import ScoreForm from './components/ScoreForm'
import { type GameStateRecord, type PlayerPositionType, RoundState } from '@/types/game-state'
import { INITIAL_GAME_STATE } from '@/constants'
import { cellStyle, actionCellStyle } from './styles'
import { scoreCompute } from '@/utils/zung-jung/score'

export default function Scoresheet() {
  const [gameState, setGameState] = useState<GameStateRecord>(INITIAL_GAME_STATE)
  const [chaseStrategyOpen, setChaseStrategyOpen] = useState(false)
  const [editGameSettingOpen, setEditGameSettingOpen] = useState(false)
  const [scoringRound, setScoringRound] = useState<number | null>(null)

  const handleClearTable = () => {
    setGameState(INITIAL_GAME_STATE)
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
    const indexedScores = scores.map((score, index) => ({ score, index }))
    indexedScores.sort((a, b) => b.score - a.score)
    return indexedScores.map(item => item.index)
  }

  if (scoringRound !== null) {
    return (
      <ScoreForm
        roundNumber={scoringRound + 1}
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
                <TableCell sx={cellStyle}>{i + 1}</TableCell>
                {round.score ? (
                  round.score.map((score, idx) => (
                    <TableCell key={idx} sx={cellStyle}>
                      <Typography
                        variant="body2"
                        color={score > 0 ? 'error' : score < 0 ? 'success.main' : 'text.disabled'}
                      >
                        {score > 0 ? `+${score}` : score}
                      </Typography>
                    </TableCell>
                  ))
                ) : (
                  <>
                    <TableCell sx={cellStyle}></TableCell>
                    <TableCell sx={cellStyle}></TableCell>
                    <TableCell sx={cellStyle}></TableCell>
                    <TableCell sx={cellStyle}></TableCell>
                  </>
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
    </Container>
  )
} 