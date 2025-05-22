import { Box, Typography, Radio, RadioGroup, FormControlLabel, Paper } from '@mui/material'
import { useState } from 'react'

const PLAYER_NAMES = ['东', '南', '西', '北']

export default function PlayerStatus() {
  // 和牌人（只能选一个，-1表示未选）
  const [winner, setWinner] = useState(-1)
  // 点炮人（只能选一个，-1表示未选）
  const [loser, setLoser] = useState(-1)

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      {/* 玩家名字 */}
      <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
        {PLAYER_NAMES.map((name) => (
          <Box key={name} sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="subtitle1">{name}</Typography>
          </Box>
        ))}
      </Box>
      {/* 得失分 */}
      <Box sx={{ display: 'flex', gap: 2, mb: 1 }}>
        {PLAYER_NAMES.map((_, idx) => (
          <Box key={idx} sx={{ flex: 1, textAlign: 'center' }}>
            <Typography variant="body2" color="text.disabled">+0</Typography>
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
        {PLAYER_NAMES.map((_, idx) => (
          <FormControlLabel
            key={idx}
            value={idx}
            control={<Radio />}
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
        {PLAYER_NAMES.map((_, idx) => (
          <FormControlLabel
            key={idx}
            value={idx}
            control={<Radio />}
            label={winner === idx ? '自摸' : '点炮'}
            sx={{ flex: 1, mx: 0.5 }}
          />
        ))}
      </RadioGroup>
    </Paper>
  )
} 