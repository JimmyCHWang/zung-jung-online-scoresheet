import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface EditGameSettingProps {
  open: boolean
  onClose: () => void
  setGameTitle: (title: string) => void
  setPlayers: (players: {
    east: string
    south: string
    west: string
    north: string
  }) => void
}

export default function EditGameSetting({ 
  open, 
  onClose,
  setGameTitle,
  setPlayers
}: EditGameSettingProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
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
        {/* 内容将在后续添加 */}
      </DialogContent>
    </Dialog>
  )
} 