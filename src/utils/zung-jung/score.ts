/**
 * 计算中庸麻将的分数变动
 * @param params 参数对象
 * @param params.score 基础分数
 * @param params.winner 和牌者索引（0-3）
 * @param params.loser 点炮者索引（0-3），与winner相同时视为自摸
 * @returns 四名玩家的分数变动数组，正数表示得分，负数表示失分
 */
export function scoreCompute({ score, winner, loser }: { score: number; winner: number; loser: number }): number[] {
  // 初始化四名玩家的分数变动
  const scoreChanges = [0, 0, 0, 0]
  
  // 和牌者总是获得 score * 3 的分数
  scoreChanges[winner] = score * 3

  // 判断是否为自摸（loser 与 winner 相同）
  const isSelfDraw = loser === winner

  if (score <= 25 || isSelfDraw) {
    // 当分数小于等于25或自摸时，其他所有人都失去 score 分
    for (let i = 0; i < 4; i++) {
      if (i !== winner) {
        scoreChanges[i] = -score
      }
    }
  } else {
    // 当分数大于25且不是自摸时
    // 点炮者失去 score * 3 - 50 分
    scoreChanges[loser] = -(score * 3 - 50)
    // 其他两名玩家各失去25分
    for (let i = 0; i < 4; i++) {
      if (i !== winner && i !== loser) {
        scoreChanges[i] = -25
      }
    }
  }

  return scoreChanges
}

import { ZUNG_JUNG_FAN_ID, ZUNG_JUNG_FAN_SCORE, ZUNG_JUNG_FAN_CN } from '@/constants/zung-jung'
import { FanStates } from '@/types'

export const calculateTotalScore = (fanStates: FanStates): number => {
  return Object.entries(fanStates).reduce((total, [fanId, count]) => {
    if (count === undefined) return total
    const typedFanId = Number(fanId) as ZUNG_JUNG_FAN_ID
    return total + ZUNG_JUNG_FAN_SCORE[typedFanId] * count
  }, 0)
}

export function getFanText(fanStates: FanStates): string {
  // 如果没有番种，返回空字符串
  if (Object.keys(fanStates).length === 0) {
    return ''
  }

  // 找出最大的番值
  const maxValue = Math.max(...Object.entries(fanStates).map(([id, count]) => {
    const fanId = Number(id) as ZUNG_JUNG_FAN_ID
    return ZUNG_JUNG_FAN_SCORE[fanId] * count
  }))

  // 找出所有达到最大值的番种
  const maxFans = Object.entries(fanStates)
    .filter(([id, count]) => {
      const fanId = Number(id) as ZUNG_JUNG_FAN_ID
      return ZUNG_JUNG_FAN_SCORE[fanId] * count === maxValue
    })
    .map(([id]) => Number(id) as ZUNG_JUNG_FAN_ID)

  // 如果有多个最大番，返回枚举值最小的那个
  const minEnumFan = maxFans.reduce((min, current) => 
    current < min ? current : min
  )

  return ZUNG_JUNG_FAN_CN[minEnumFan]
} 