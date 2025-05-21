import { Dialog, DialogTitle, DialogContent, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

interface ChaseStrategyProps {
  open: boolean
  onClose: () => void
}

export default function ChaseStrategy({ open, onClose }: ChaseStrategyProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        追分策略
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