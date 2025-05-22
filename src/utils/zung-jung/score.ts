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