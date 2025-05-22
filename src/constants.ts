import { type GameStateRecordType, RoundState, PlayerPosition } from './types/game-state'

export const INITIAL_GAME_STATE: GameStateRecordType = {
  title: '新游戏',
  players: {
    [PlayerPosition.EAST]: '东家',
    [PlayerPosition.SOUTH]: '南家',
    [PlayerPosition.WEST]: '西家',
    [PlayerPosition.NORTH]: '北家'
  },
  startTime: null,
  endTime: null,
  rounds: Array.from({ length: 16 }, () => ({
    state: RoundState.NOT_STARTED
  })),
  currentState: 0
}
 