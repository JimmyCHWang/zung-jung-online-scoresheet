import { Box, Typography } from '@mui/material'
import { ZUNG_JUNG_FAN_ID } from '@/constants/zung-jung/fan'
import { ZUNG_JUNG_FAN_CN } from '@/constants/zung-jung/i18n'
import { useScoreForm } from '../../context'

interface FanButtonProps {
  fanId: ZUNG_JUNG_FAN_ID
  count: number
  onClick: () => void
}

const FanButton = ({ fanId, count, onClick }: FanButtonProps) => {
  const { isDrawOrTimeout } = useScoreForm()

  return (
    <Box
      onClick={onClick}
      sx={{
        width: '100%',
        height: '36px',
        borderRadius: '8px',
        border: '1px solid',
        borderColor: 'divider',
        backgroundColor: count > 0 ? 'primary.main' : 'transparent',
        color: count > 0 ? 'primary.contrastText' : 'text.primary',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        cursor: isDrawOrTimeout ? 'not-allowed' : 'pointer',
        userSelect: 'none',
        transition: 'all 0.2s',
        opacity: isDrawOrTimeout ? 0.5 : 1,
        '&:hover': {
          backgroundColor: isDrawOrTimeout 
            ? (count > 0 ? 'primary.main' : 'transparent')
            : (count > 0 ? 'primary.dark' : 'action.hover'),
        }
      }}
    >
      <Typography variant="body2">
        {ZUNG_JUNG_FAN_CN[fanId]}
      </Typography>
      {count > 1 && (
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            right: 8,
            top: '50%',
            transform: 'translateY(-50%)',
            color: count > 0 ? 'primary.contrastText' : 'text.primary'
          }}
        >
          x{count}
        </Typography>
      )}
    </Box>
  )
}

export default FanButton