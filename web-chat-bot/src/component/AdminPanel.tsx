import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TextField,
  Button,
  Stack,
} from '@mui/material'

interface QAItem {
  id: number
  question: string
  answer: string
  status: 'updated' | 'answered' | 'unanswered'
  selected?: boolean
}

const statusLabels: Record<QAItem['status'], string> = {
  updated: 'Đã cập nhật vào data',
  answered: 'Đã trả lời câu hỏi',
  unanswered: 'Chưa trả lời câu hỏi',
}

const AdminPanel: React.FC = () => {
  const [data, setData] = useState<QAItem[]>([])

  useEffect(() => {
    const fakeData: QAItem[] = [
      {
        id: 1,
        question: 'Chatbot hoạt động như thế nào?',
        answer: 'Chatbot sử dụng AI để trả lời.',
        status: 'answered',
      },
      {
        id: 2,
        question: 'Làm sao để cập nhật dữ liệu?',
        answer: '',
        status: 'unanswered',
      },
    ]
    setData(fakeData)
  }, [])

  // Danh sách các ID được chọn
  const selectedIds = data
    .filter((item) => item.selected)
    .map((item) => item.id)

  const handleCheckboxChange = (id: number) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    )
  }

  const handleFieldChange = (
    id: number,
    field: 'question' | 'answer',
    value: string
  ) => {
    setData((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    )
  }

  const handleDeleteSelected = () => {
    setData((prev) => prev.filter((item) => !item.selected))
  }

  const handleUpdateToMainData = () => {
    // Chức năng giả lập - bạn có thể gọi API ở đây
    const updatedItems = data.filter((item) => item.selected)
    console.log('Cập nhật vào data chính:', updatedItems)
    alert('Đã cập nhật vào data chính!')
  }

  const handleSaveSelected = () => {
    const selectedItems = data.filter((item) => item.selected)
    console.log('Lưu các mục đã chọn:', selectedItems)
    alert('Đã lưu các mục đã chọn!')
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#121212', height: '100vh' }}>
      <Typography variant="h5" gutterBottom>
        Trang Quản Lý
      </Typography>

      {/* Nút chức năng khi có hàng được chọn */}
      <Stack direction="row" spacing={2} mb={2}>
        <Button
          variant="contained"
          color="error"
          onClick={handleDeleteSelected}
        >
          Xoá ({selectedIds.length})
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={handleUpdateToMainData}
        >
          Cập nhật vào data chính
        </Button>
        <Button variant="contained" onClick={handleSaveSelected}>
          Lưu
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>
                <strong>Câu hỏi</strong>
              </TableCell>
              <TableCell>
                <strong>Câu trả lời</strong>
              </TableCell>
              <TableCell>
                <strong>Trạng thái</strong>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Checkbox
                    checked={!!item.selected}
                    onChange={() => handleCheckboxChange(item.id)}
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    multiline
                    fullWidth
                    minRows={2}
                    value={item.question}
                    onChange={(e) =>
                      handleFieldChange(item.id, 'question', e.target.value)
                    }
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    multiline
                    fullWidth
                    minRows={2}
                    value={item.answer}
                    onChange={(e) =>
                      handleFieldChange(item.id, 'answer', e.target.value)
                    }
                  />
                </TableCell>

                <TableCell>{statusLabels[item.status]}</TableCell>
              </TableRow>
            ))}

            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  Không có dữ liệu
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  )
}

export default AdminPanel
