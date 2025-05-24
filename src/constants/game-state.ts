import { type GameStateRecord, RoundState, PlayerPosition } from '../types/game-state'

export const INITIAL_GAME_STATE: GameStateRecord = {
  title: '新游戏',
  players: {
    [PlayerPosition.EAST]: '东家',
    [PlayerPosition.SOUTH]: '南家',
    [PlayerPosition.WEST]: '西家',
    [PlayerPosition.NORTH]: '北家'
  },
  rounds: Array.from({ length: 16 }, () => ({
    roundState: RoundState.NOT_STARTED,
    score: [0, 0, 0, 0],
    winner: -1,
    loser: -1,
    fanStates: {}
  })),
  currentState: 0
}
