import React from 'react'
import { Box, Container, Divider, Typography } from '@mui/material'

const Footer: React.FC = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#1e1e1e',
        color: '#f1f1f1',
        py: 4,
        borderTop: '1px solid #444',
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h6" fontWeight={600} gutterBottom color="white">
          Chatbot hỗ trợ người dùng
        </Typography>

        <Typography variant="body2" sx={{ color: '#ccc' }} gutterBottom>
          🔹 Chức năng: Tư vấn, hỗ trợ người dùng qua hội thoại thông minh.
        </Typography>
        <Typography variant="body2" sx={{ color: '#ccc' }} gutterBottom>
          🔹 Quy tắc sử dụng: Không sử dụng chatbot cho mục đích vi phạm pháp
          luật, truyền bá thông tin sai lệch hoặc spam.
        </Typography>
        <Typography variant="body2" sx={{ color: '#ccc' }} gutterBottom>
          🔹 Người thực hiện: Nguyễn Văn A
        </Typography>
        <Typography variant="body2" sx={{ color: '#ccc' }}>
          🔹 Đơn vị phát triển: Nhóm Nghiên cứu AI - Đại học XYZ
        </Typography>

        <Divider sx={{ my: 2, borderColor: '#555' }} />

        <Typography variant="caption" sx={{ color: '#aaa' }}>
          © {new Date().getFullYear()} Chatbot App. All rights reserved.
        </Typography>
      </Container>
    </Box>
  )
}

export default Footer
