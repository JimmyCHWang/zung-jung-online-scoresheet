import { FanStates } from './zung-jung'

// 玩家位置枚举
export const PlayerPosition = {
  EAST: 'east',
  SOUTH: 'south',
  WEST: 'west',
  NORTH: 'north'
} as const

export type PlayerPositionType = 'east' | 'south' | 'west' | 'north'

export const NumberToPlayerPosition = {
  0: 'east',
  1: 'south',
  2: 'west',
  3: 'north'
} as const

// 单局游戏状态枚举
export const RoundState = {
  NOT_STARTED: 0,
  WON: 1,
  DRAW: 2,  // 流局/荒庄
  TIMEOUT: 3
} as const

export type RoundStateType = 0 | 1 | 2 | 3

// 游戏整体状态
export const GameState = {
  NOT_STARTED: 0,
  FINISHED: 100
} as const

export type GameStateType = typeof GameState[keyof typeof GameState] | number

// 单局游戏记录类型
export interface RoundRecord {
  roundState: RoundStateType
  score: number[]  // 四名玩家的分数变动数组
  winner: number   // 和牌者索引（0-3）
  loser: number    // 点炮者索引（0-3），自摸时为-1
  fanStates: FanStates
}

// 游戏状态类型
export interface GameStateRecord {
  title: string
  players: Record<PlayerPositionType, string>
  startTime?: number
  endTime?: number
  currentState: GameStateType  // 0: 未开始, 1-99: 正在进行第x局, 100: 已结束
  rounds: RoundRecord[]
}
