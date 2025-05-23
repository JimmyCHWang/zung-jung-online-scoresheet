import { Box, Typography, Radio, RadioGroup, FormControlLabel, Paper } from '@mui/material'
import { useScoreForm } from '../../context'
import { scoreCompute } from '@/utils/zung-jung/score'
import { type PlayerPositionType } from '@/types/game-state'

interface PlayerStatusProps {
  players: Record<PlayerPositionType, string>
}

export default function PlayerStatus({ players }: PlayerStatusProps) {
  const { winner, loser, setWinner, setLoser, isDrawOrTimeout, score } = useScoreForm()

  // 计算分数变动
  const scoreChanges = winner !== -1 && loser !== -1 && score > 0
    ? scoreCompute({ score, winner, loser })
    : [0, 0, 0, 0]

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      {/* 玩家名字 */}
      <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
        {Object.values(players).map((name) => (
          <Box key={name} sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="subtitle1">{name}</Typography>
          </Box>
        ))}
      </Box>
      {/* 得失分 */}
      <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
        {scoreChanges.map((change, idx) => (
          <Box key={idx} sx={{ flex: 1, textAlign: 'center' }}>
            <Typography 
              variant="body2" 
              color={change > 0 ? 'error' : change < 0 ? 'success.main' : 'text.disabled'}
            >
              {change > 0 ? `+${change}` : change}
            </Typography>
          </Box>
        ))}
      </Box>
      {/* 和牌/自摸单选 */}
      <RadioGroup
        row
        value={winner}
        onChange={(_, value) => setWinner(Number(value))}
        sx={{ justifyContent: 'center', mb: 1 }}
      >
        {Object.values(players).map((_, idx) => (
          <FormControlLabel
            key={idx}
            value={idx}
            control={<Radio disabled={isDrawOrTimeout} />}
            label={'和牌'}
            sx={{ flex: 1, mx: 0.5 }}
          />
        ))}
      </RadioGroup>
      {/* 点炮/自摸单选 */}
      <RadioGroup
        row
        value={loser}
        onChange={(_, value) => setLoser(Number(value))}
        sx={{ justifyContent: 'center' }}
      >
        {Object.values(players).map((_, idx) => (
          <FormControlLabel
            key={idx}
            value={idx}
            control={<Radio disabled={isDrawOrTimeout} />}
            label={'点炮'}
            sx={{ flex: 1, mx: 0.5 }}
          />
        ))}
      </RadioGroup>
    </Paper>
  )
} 