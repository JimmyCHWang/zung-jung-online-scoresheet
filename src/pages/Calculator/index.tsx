import { Container, Typography, Paper } from '@mui/material'

export default function Calculator() {
  return (
    <Container maxWidth="sm" sx={{ mt: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom>
        计分器
      </Typography>
      <Paper elevation={3} sx={{ p: 2 }}>
        {/* 这里将添加计分器的内容 */}
        <Typography>计分器内容将在这里显示</Typography>
      </Paper>
    </Container>
  )
} 