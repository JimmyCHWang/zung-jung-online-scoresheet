import { 
  Container, 
  Typography, 
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Stack
} from '@mui/material'
import { useState } from 'react'
import ChaseStrategy from './components/ChaseStrategy'
import EditGameSetting from './components/EditGameSetting'

export default function Scoresheet() {
  const [gameTitle, setGameTitle] = useState('新游戏')
  const [players, setPlayers] = useState({
    east: '东家',
    south: '南家',
    west: '西家',
    north: '北家'
  })
  const [timeStart, setTimeStart] = useState<number | null>(null)

  const [chaseStrategyOpen, setChaseStrategyOpen] = useState(false)
  const [editGameSettingOpen, setEditGameSettingOpen] = useState(false)

  const handleClearTable = () => {
    // 清空表格的功能将在后续实现
    console.log('清空表格')
  }

  const handleStartGame = () => {
    setTimeStart(Date.now())
  }

  const getFontSize = (text: string) => {
    const length = text.length
    if (length <= 3) return '1rem'
    return `${1 - (length - 3) * 0.15}rem`
  }

  const cellStyle = {
    borderRight: '1px solid rgba(224, 224, 224, 1)',
    '&:last-child': {
      borderRight: 'none'
    },
    textAlign: 'center',
    width: '16.666%',
    px: 0
  }

  const headerCellStyle = (text: string) => ({
    ...cellStyle,
    fontSize: getFontSize(text),
    fontWeight: 'bold',
    py: 0.5
  })

  const firstColumnStyle = (text: string) => ({
    ...cellStyle,
    fontSize: getFontSize(text),
    py: 0.5
  })

  const actionCellStyle = {
    ...cellStyle,
    p: 0
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 2, px: 0 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        {gameTitle}
      </Typography>
      
      <Stack 
        direction="row" 
        spacing={2} 
        sx={{ 
          mb: 2,
          justifyContent: 'space-between',
          width: '100%',
          px: 2,
        }}
      >
        <Button 
          variant="contained" 
          onClick={() => setChaseStrategyOpen(true)}
        >
          追分策略
        </Button>
        <Button 
          variant="contained" 
          color="warning"
          onClick={handleClearTable}
        >
          清空表格
        </Button>
        <Button 
          variant="contained" 
          color="secondary"
          onClick={() => setEditGameSettingOpen(true)}
        >
          编辑信息
        </Button>
      </Stack>

      <TableContainer component={Paper} elevation={3}>
        <Table size="small" stickyHeader sx={{ tableLayout: 'fixed' }}>
          <TableHead>
            <TableRow>
              <TableCell sx={headerCellStyle('选手姓名')}>选手姓名</TableCell>
              <TableCell sx={headerCellStyle(players.east)}>{players.east}</TableCell>
              <TableCell sx={headerCellStyle(players.south)}>{players.south}</TableCell>
              <TableCell sx={headerCellStyle(players.west)}>{players.west}</TableCell>
              <TableCell sx={headerCellStyle(players.north)}>{players.north}</TableCell>
              <TableCell sx={actionCellStyle}>操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {/* 开局座位显示行 */}
            <TableRow>
              <TableCell sx={firstColumnStyle('开局座位')}>开局座位</TableCell>
              <TableCell sx={cellStyle}>东</TableCell>
              <TableCell sx={cellStyle}>南</TableCell>
              <TableCell sx={cellStyle}>西</TableCell>
              <TableCell sx={cellStyle}>北</TableCell>
              <TableCell sx={actionCellStyle}></TableCell>
            </TableRow>

            {/* 总分显示行 */}
            <TableRow>
              <TableCell sx={firstColumnStyle('总分')}>总分</TableCell>
              <TableCell sx={cellStyle}>0</TableCell>
              <TableCell sx={cellStyle}>0</TableCell>
              <TableCell sx={cellStyle}>0</TableCell>
              <TableCell sx={cellStyle}>0</TableCell>
              <TableCell sx={actionCellStyle}></TableCell>
            </TableRow>

            {/* 排名显示行 */}
            <TableRow>
              <TableCell sx={firstColumnStyle('排名')}>排名</TableCell>
              <TableCell sx={cellStyle}>-</TableCell>
              <TableCell sx={cellStyle}>-</TableCell>
              <TableCell sx={cellStyle}>-</TableCell>
              <TableCell sx={cellStyle}>-</TableCell>
              <TableCell sx={actionCellStyle}>
                {!timeStart && (
                  <Button
                    variant="text"
                    color="primary"
                    size="small"
                    onClick={handleStartGame}
                    sx={{
                      p: 0
                    }}
                  >
                    开始
                  </Button>
                )}
              </TableCell>
            </TableRow>

            {/* 16局游戏记录 */}
            {Array.from({ length: 16 }, (_, i) => (
              <TableRow key={i}>
                <TableCell sx={cellStyle}>{i + 1}</TableCell>
                <TableCell sx={cellStyle}></TableCell>
                <TableCell sx={cellStyle}></TableCell>
                <TableCell sx={cellStyle}></TableCell>
                <TableCell sx={cellStyle}></TableCell>
                <TableCell sx={actionCellStyle}></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <ChaseStrategy 
        open={chaseStrategyOpen}
        onClose={() => setChaseStrategyOpen(false)}
      />

      <EditGameSetting
        open={editGameSettingOpen}
        onClose={() => setEditGameSettingOpen(false)}
        setGameTitle={setGameTitle}
        setPlayers={setPlayers}
      />
    </Container>
  )
} 