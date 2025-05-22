import { 
  Box,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Paper
} from '@mui/material'
import { useScoreForm } from '../../context'

interface ScoreAndStateProps {
  onScoreChange?: (score: number) => void
  onStateChange?: (isDraw: boolean, isTimeout: boolean) => void
}

export default function ScoreAndState({ 
  onScoreChange,
  onStateChange 
}: ScoreAndStateProps) {
  const { 
    isDraw,
    isTimeout,
    score,
    isDrawOrTimeout,
    setScore,
    setIsDraw,
    setIsTimeout,
    handleScoreChange
  } = useScoreForm()

  const handleDrawChange = (checked: boolean) => {
    setIsDraw(checked)
    onStateChange?.(checked, isTimeout)
  }

  const handleTimeoutChange = (checked: boolean) => {
    setIsTimeout(checked)
    onStateChange?.(isDraw, checked)
  }

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ 
        display: 'flex',
        gap: 2,
        alignItems: 'start'
      }}>
        {/* 分数调整部分 (2/3) */}
        <Box sx={{ 
          flex: 2,
          display: 'flex',
          gap: 1,
          alignItems: 'center',
          height: '40px'
        }}>
          <Button 
            variant="outlined" 
            onClick={() => {
              handleScoreChange(-25)
              onScoreChange?.(score)
            }}
            sx={{ minWidth: '30px', width: '30px', p: 0 }}
            disabled={isDrawOrTimeout}
          >
            -25
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => {
              handleScoreChange(-5)
              onScoreChange?.(score)
            }}
            sx={{ minWidth: '30px', width: '30px', p: 0 }}
            disabled={isDrawOrTimeout}
          >
            -5
          </Button>
          <TextField
            type="number"
            value={score}
            onChange={(e) => {
              const newScore = Number(e.target.value)
              setScore(newScore)
              onScoreChange?.(newScore)
            }}
            inputProps={{ 
              style: {
                padding: '5px',
                textAlign: 'center'
              }
            }}
            sx={{ 
              width: '80px',
              '& input::-webkit-outer-spin-button, & input::-webkit-inner-spin-button': {
                display: 'none'
              },
              '& input[type=number]': {
                MozAppearance: 'textfield'
              }
            }}
            disabled={isDrawOrTimeout}
            size="small"
          />
          <Button 
            variant="outlined" 
            onClick={() => {
              handleScoreChange(5)
              onScoreChange?.(score)
            }}
            sx={{ minWidth: '30px', width: '30px', p: 0 }}
            disabled={isDrawOrTimeout}
          >
            +5
          </Button>
          <Button 
            variant="outlined" 
            onClick={() => {
              handleScoreChange(25)
              onScoreChange?.(score)
            }}
            sx={{ minWidth: '30px', width: '30px', p: 0 }}
            disabled={isDrawOrTimeout}
          >
            +25
          </Button>
        </Box>

        {/* 状态选择部分 (1/3) */}
        <Box sx={{ 
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          justifyContent: 'center',
          alignItems: 'end'
        }}>
          <FormControlLabel
            control={
              <Checkbox 
                checked={isDraw}
                onChange={(e) => handleDrawChange(e.target.checked)}
                disabled={isTimeout}
              />
            }
            label="荒庄"
            sx={{ mr: 0 }}
          />
          <FormControlLabel
            control={
              <Checkbox 
                checked={isTimeout}
                onChange={(e) => handleTimeoutChange(e.target.checked)}
                disabled={isDraw}
              />
            }
            label="超时"
            sx={{ mr: 0 }}
          />
        </Box>
      </Box>
    </Paper>
  )
} 