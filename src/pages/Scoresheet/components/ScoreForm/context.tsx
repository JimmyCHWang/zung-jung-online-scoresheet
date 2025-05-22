import { createContext, useContext, ReactNode, useState } from 'react'

interface ScoreFormContextType {
  isDraw: boolean
  isTimeout: boolean
  score: number
  isDrawOrTimeout: boolean
  setScore: (score: number) => void
  setIsDraw: (isDraw: boolean) => void
  setIsTimeout: (isTimeout: boolean) => void
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
  const isDrawOrTimeout = isDraw || isTimeout

  const handleScoreChange = (delta: number) => {
    setScore(prev => {
      const newScore = prev + delta
      return newScore < 1 ? 1 : newScore
    })
  }

  return (
    <ScoreFormContext.Provider value={{ 
      isDraw, 
      isTimeout, 
      score, 
      isDrawOrTimeout,
      setScore,
      setIsDraw,
      setIsTimeout,
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