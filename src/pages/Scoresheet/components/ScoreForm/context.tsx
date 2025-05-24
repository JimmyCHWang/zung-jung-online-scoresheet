import { createContext, useContext, ReactNode, useState, useEffect } from 'react'
import { ZUNG_JUNG_FAN_ID, ZUNG_JUNG_STACKING } from '@/constants/zung-jung/fan'
import { calculateTotalScore } from '@/utils/zung-jung/score'
import { FanStates } from '@/types'

interface ScoreFormContextType {
  isDraw: boolean
  isTimeout: boolean
  score: number
  isDrawOrTimeout: boolean
  winner: number
  loser: number
  setScore: (score: number) => void
  setIsDraw: (isDraw: boolean) => void
  setIsTimeout: (isTimeout: boolean) => void
  setWinner: (winner: number) => void
  setLoser: (loser: number) => void
  handleScoreChange: (delta: number) => void
  fanStates: FanStates
  getFanState: (fanId: ZUNG_JUNG_FAN_ID) => number
  incrementFan: (fanId: ZUNG_JUNG_FAN_ID) => void
  handleSubmit: () => void
}

interface ScoreFormProviderProps {
  children: ReactNode
  onSubmit: (params: {
    winner: number
    loser: number
    score: number
    isDraw: boolean
    isTimeout: boolean
    fanStates: FanStates
  }) => void
}

const ScoreFormContext = createContext<ScoreFormContextType | null>(null)

export const useScoreForm = () => {
  const context = useContext(ScoreFormContext)
  if (!context) {
    throw new Error('useScoreForm must be used within a ScoreFormProvider')
  }
  return context
}

export function ScoreFormProvider({ 
  children,
  onSubmit
}: ScoreFormProviderProps) {
  const [score, setScore] = useState(0)
  const [isDraw, setIsDraw] = useState(false)
  const [isTimeout, setIsTimeout] = useState(false)
  const [winner, setWinner] = useState(-1)
  const [loser, setLoser] = useState(-1)
  const isDrawOrTimeout = isDraw || isTimeout
  const [fanStates, setFanStates] = useState<FanStates>({})

  const handleScoreChange = (delta: number) => {
    setScore(prev => {
      const newScore = prev + delta
      const mod5Score = Math.floor(newScore / 5) * 5
      return mod5Score < 1 ? 1 : mod5Score
    })
  }

  const getFanState = (fanId: ZUNG_JUNG_FAN_ID): number => {
    return fanStates[fanId] ?? 0
  }

  const incrementFan = (fanId: ZUNG_JUNG_FAN_ID) => {
    if (isDrawOrTimeout) return
    setFanStates(prev => {
      const currentValue = prev[fanId] ?? 0
      const maxStack = ZUNG_JUNG_STACKING[fanId] ?? 1

      return {
        ...prev,
        [fanId]: currentValue >= maxStack ? 0 : currentValue + 1
      }
    })
  }

  const handleSubmit = () => {
    if (isDraw || isTimeout) {
      onSubmit({
        winner: -1,
        loser: -1,
        score: 0,
        isDraw,
        isTimeout,
        fanStates: {}
      })
      return
    }

    onSubmit({
      winner,
      loser,
      score,
      isDraw,
      isTimeout,
      fanStates
    })
  }

  useEffect(() => {
    const newScore = calculateTotalScore(fanStates)
    setScore(newScore)
  }, [fanStates])

  return (
    <ScoreFormContext.Provider value={{ 
      isDraw, 
      isTimeout, 
      score, 
      isDrawOrTimeout,
      winner,
      loser,
      setScore,
      setIsDraw,
      setIsTimeout,
      setWinner,
      setLoser,
      handleScoreChange,
      fanStates,
      getFanState,
      incrementFan,
      handleSubmit
    }}>
      {children}
    </ScoreFormContext.Provider>
  )
} 