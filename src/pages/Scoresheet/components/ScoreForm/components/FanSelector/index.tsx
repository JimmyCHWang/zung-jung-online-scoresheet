import { Box } from '@mui/material'
import { ZUNG_JUNG_CATEGORY } from '@/constants/zung-jung/category'
import { FanCategory } from './fan-category'

const FanSelector = () => {
  return (
    <Box sx={{ mt: 2 }}>
      {Object.values(ZUNG_JUNG_CATEGORY)
        .filter((value): value is ZUNG_JUNG_CATEGORY => typeof value === 'number')
        .map((category) => (
          <FanCategory key={category} category={category} />
        ))}
    </Box>
  )
}

export default FanSelector
