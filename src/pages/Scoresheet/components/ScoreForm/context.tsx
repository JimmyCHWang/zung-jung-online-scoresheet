import { createContext, useContext, ReactNode, useState } from 'react'

export type Player = 'east' | 'south' | 'west' | 'north'

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
}

const ScoreFormContext = createContext<ScoreFormContextType | null>(null)

interface ScoreFormProviderProps {
  children: ReactNode
  initialScore?: number
}

export function ScoreFormProvider({ 
  children,
  initialScore = 5
}: ScoreFormProviderProps) {
  const [score, setScore] = useState(initialScore)
  const [isDraw, setIsDraw] = useState(false)
  const [isTimeout, setIsTimeout] = useState(false)
  const [winner, setWinner] = useState(-1)
  const [loser, setLoser] = useState(-1)
  const isDrawOrTimeout = isDraw || isTimeout

  const handleScoreChange = (delta: number) => {
    setScore(prev => {
      const newScore = prev + delta
      const mod5Score = Math.floor(newScore / 5) * 5
      return mod5Score < 1 ? 1 : mod5Score
    })
  }

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
      handleScoreChange
    }}>
      {children}
    </ScoreFormContext.Provider>
  )
}

export function useScoreForm() {
  const context = useContext(ScoreFormContext)
  if (!context) {
    throw new Error('useScoreForm must be used within a ScoreFormProvider')
  }
  return context
} 