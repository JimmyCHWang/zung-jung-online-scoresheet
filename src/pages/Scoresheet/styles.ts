import { type SxProps, type Theme } from '@mui/material'

export const getFontSize = (text: string) => {
  const length = text.length
  if (length <= 3) return '1rem'
  return `${1 - (length - 3) * 0.15}rem`
}

export const cellStyle: SxProps<Theme> = {
  borderRight: '1px solid rgba(224, 224, 224, 1)',
  '&:last-child': {
    borderRight: 'none'
  },
  textAlign: 'center',
  width: '16.666%',
  px: 0
}

export const headerCellStyle = (text: string): SxProps<Theme> => ({
  ...cellStyle,
  fontSize: getFontSize(text),
  fontWeight: 'bold',
  py: 0.5
})

export const firstColumnStyle = (text: string): SxProps<Theme> => ({
  ...cellStyle,
  fontSize: getFontSize(text),
  py: 0.5
})

export const actionCellStyle: SxProps<Theme> = {
  ...cellStyle,
  p: 0
} 