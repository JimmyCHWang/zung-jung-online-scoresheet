import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  IconButton, 
  TextField, 
  Button, 
  Divider,
  Box
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import { PlayerPosition, type PlayerPositionType } from '../../../../types/game-state'

interface EditGameSettingProps {
  open: boolean
  onClose: () => void
  onSave: (title: string, players: Record<PlayerPositionType, string>) => void
  initialTitle: string
  initialPlayers: Record<PlayerPositionType, string>
}

export default function EditGameSetting({
  open,
  onClose,
  onSave,
  initialTitle,
  initialPlayers
}: EditGameSettingProps) {
  const [title, setTitle] = useState(initialTitle)
  const [players, setPlayers] = useState(initialPlayers)

  const handleSave = () => {
    onSave(title, players)
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
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
          <TextField
            label="游戏标题"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            fullWidth
            required
            autoFocus
          />
          <Divider />
          <TextField
            label="东家名字"
            value={players[PlayerPosition.EAST]}
            onChange={(e) => setPlayers(prev => ({ ...prev, [PlayerPosition.EAST]: e.target.value }))}
            fullWidth
            required
          />
          <TextField
            label="南家名字"
            value={players[PlayerPosition.SOUTH]}
            onChange={(e) => setPlayers(prev => ({ ...prev, [PlayerPosition.SOUTH]: e.target.value }))}
            fullWidth
            required
          />
          <TextField
            label="西家名字"
            value={players[PlayerPosition.WEST]}
            onChange={(e) => setPlayers(prev => ({ ...prev, [PlayerPosition.WEST]: e.target.value }))}
            fullWidth
            required
          />
          <TextField
            label="北家名字"
            value={players[PlayerPosition.NORTH]}
            onChange={(e) => setPlayers(prev => ({ ...prev, [PlayerPosition.NORTH]: e.target.value }))}
            fullWidth
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>取消</Button>
        <Button onClick={handleSave} variant="contained">
          保存
        </Button>
      </DialogActions>
    </Dialog>
  )
} 