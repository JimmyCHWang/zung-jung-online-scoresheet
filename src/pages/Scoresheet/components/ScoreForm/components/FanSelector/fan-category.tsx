import { Box, Typography } from '@mui/material'
import { ZUNG_JUNG_CATEGORY, ZUNG_JUNG_CATEGORY_FAN } from '@/constants/zung-jung/category'
import { ZUNG_JUNG_CATEGORY_CN } from '@/constants/zung-jung/i18n'
import { useScoreForm } from '../../context'
import FanButton from './fan-button'

interface FanCategoryProps {
  category: ZUNG_JUNG_CATEGORY
}

export const FanCategory = ({ category }: FanCategoryProps) => {
  const { getFanState, incrementFan } = useScoreForm()
  const fanIds = ZUNG_JUNG_CATEGORY_FAN[category]

  return (
    <Box sx={{ mb: 2 }}>
      <Typography 
        variant="subtitle1" 
        sx={{ 
          mb: 1,
          textAlign: 'left'
        }}
      >
        {ZUNG_JUNG_CATEGORY_CN[category]}
      </Typography>
      <Box sx={{ 
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 2,
        width: '100%'
      }}>
        {fanIds.map((fanId) => (
          <FanButton
            key={fanId}
            fanId={fanId}
            count={getFanState(fanId)}
            onClick={() => incrementFan(fanId)}
          />
        ))}
      </Box>
    </Box>
  )
}