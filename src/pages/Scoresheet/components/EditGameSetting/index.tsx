import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  IconButton, 
  TextField, 
  Button, 
  Stack, 
  Divider
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import { PlayerPosition, type PlayerPositionType } from '../../../../types/game-state'

interface EditGameSettingProps {
  open: boolean
  onClose: () => void
  setGameTitle: (title: string) => void
  setPlayers: (players: Record<PlayerPositionType, string>) => void
  gameTitle: string
  players: Record<PlayerPositionType, string>
}

export default function EditGameSetting({ 
  open, 
  onClose,
  setGameTitle,
  setPlayers,
  gameTitle,
  players
}: EditGameSettingProps) {
  const [formData, setFormData] = useState({
    title: gameTitle,
    [PlayerPosition.EAST]: players[PlayerPosition.EAST],
    [PlayerPosition.SOUTH]: players[PlayerPosition.SOUTH],
    [PlayerPosition.WEST]: players[PlayerPosition.WEST],
    [PlayerPosition.NORTH]: players[PlayerPosition.NORTH]
  })

  const handleSubmit = () => {
    // 验证所有字段都不为空
    if (Object.values(formData).every(value => value.trim() !== '')) {
      setGameTitle(formData.title)
      setPlayers({
        [PlayerPosition.EAST]: formData[PlayerPosition.EAST],
        [PlayerPosition.SOUTH]: formData[PlayerPosition.SOUTH],
        [PlayerPosition.WEST]: formData[PlayerPosition.WEST],
        [PlayerPosition.NORTH]: formData[PlayerPosition.NORTH]
      })
      onClose()
    }
  }

  return (
    <Dialog 
      open={open} 
      onClose={(_event, reason) => {
        if (reason === 'backdropClick') {
          return;
        }
        onClose();
      }}
      maxWidth="sm" 
      fullWidth
      disableEscapeKeyDown
    >
      <DialogTitle>
        编辑游戏信息
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={2} sx={{ mt: 2 }}>
          <TextField
            label="游戏标题"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            fullWidth
            required
            autoFocus
          />
          <Divider />
          <TextField
            label="东家名字"
            value={formData[PlayerPosition.EAST]}
            onChange={(e) => setFormData(prev => ({ ...prev, [PlayerPosition.EAST]: e.target.value }))}
            fullWidth
            required
          />
          <TextField
            label="南家名字"
            value={formData[PlayerPosition.SOUTH]}
            onChange={(e) => setFormData(prev => ({ ...prev, [PlayerPosition.SOUTH]: e.target.value }))}
            fullWidth
            required
          />
          <TextField
            label="西家名字"
            value={formData[PlayerPosition.WEST]}
            onChange={(e) => setFormData(prev => ({ ...prev, [PlayerPosition.WEST]: e.target.value }))}
            fullWidth
            required
          />
          <TextField
            label="北家名字"
            value={formData[PlayerPosition.NORTH]}
            onChange={(e) => setFormData(prev => ({ ...prev, [PlayerPosition.NORTH]: e.target.value }))}
            fullWidth
            required
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleSubmit} variant="contained">
          确认
        </Button>
      </DialogActions>
    </Dialog>
  )
} 