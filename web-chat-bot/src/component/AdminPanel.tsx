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
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material'
import {
  getUnansweredQuestions,
  updateUnansweredBatch,
  deleteUnansweredBatch,
} from '../api/chatBot/postQuestion'
import { UnansweredQA } from '../types/chatbot'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ConfirmDialog from './ConfirmDiaLog'

const statusLabels: Record<UnansweredQA['status'], string> = {
  updated: 'Đã cập nhật vào data',
  answered: 'Đã trả lời câu hỏi',
  unanswered: 'Chưa trả lời câu hỏi',
}

const AdminPanel: React.FC = () => {
  const [data, setData] = useState<UnansweredQA[]>([])
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [loading, setLoading] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const fetchData = async (status?: string) => {
    setLoading(true)
    const res = await getUnansweredQuestions(status)
    setData(res)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleFilterChange = (e: SelectChangeEvent) => {
    const selectedStatus = e.target.value
    setFilterStatus(selectedStatus)
    fetchData(selectedStatus === 'all' ? undefined : selectedStatus)
  }

  const selectedIds = data
    .filter((item) => (item as any).selected)
    .map((i) => i.id)

  const handleCheckboxChange = (id: number) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, selected: !(item as any).selected } : item
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

  const handleSaveSelected = async () => {
    const updates = data
      .filter((item) => (item as any).selected)
      .map((item) => {
        const updatedStatus = item.answer?.trim() ? 'answered' : item.status
        return { ...item, status: updatedStatus }
      })

    if (updates.length === 0) return

    try {
      const res = await updateUnansweredBatch(updates)
      if (typeof res === 'string') {
        toast.success(res)
      } else {
        toast.success(
          `Đã cập nhật ${res.updated || 0} mục. Đã thêm ${
            res.added_to_training || 0
          } câu vào dữ liệu huấn luyện.`
        )
      }
      fetchData(filterStatus === 'all' ? undefined : filterStatus)
    } catch (err) {
      toast.error('Lỗi khi cập nhật!')
    }
  }

  const handleDeleteSelected = async () => {
    try {
      const message = await deleteUnansweredBatch(selectedIds)
      toast.success(message || 'Xoá thành công')
      fetchData(filterStatus === 'all' ? undefined : filterStatus)
    } catch {
      toast.error('Xoá thất bại')
    }
  }

  const handleTrainSelected = async () => {
    const selectedWithAnswer = data.filter(
      (item) => (item as any).selected && item.answer?.trim()
    )

    if (selectedWithAnswer.length === 0) {
      toast.warning('Không có câu trả lời nào hợp lệ để cập nhật.')
      return
    }

    try {
      const updated = selectedWithAnswer.map((item) => ({
        ...item,
        status: 'updated',
      }))

      const res = await updateUnansweredBatch(updated)
      if (typeof res === 'string') {
        toast.success(res)
      } else {
        toast.success(
          `✅ Đã cập nhật ${res.updated || 0} mục. Đã thêm ${
            res.added_to_training || 0
          } câu vào dữ liệu huấn luyện.`
        )
      }
      fetchData(filterStatus === 'all' ? undefined : filterStatus)
    } catch (err) {
      toast.error('Lỗi khi cập nhật vào data train!')
    }
  }

  return (
    <Box sx={{ p: 3, backgroundColor: '#121212', minHeight: '100vh' }}>
      <ToastContainer />
      <Typography variant="h5" gutterBottom color="white">
        Trang Quản Lý Câu Hỏi Chưa Trả Lời
      </Typography>

      <Stack direction="row" spacing={2} alignItems="center" mb={2}>
        <Typography color="white">Trạng thái:</Typography>
        <Select
          value={filterStatus}
          onChange={handleFilterChange}
          size="small"
          sx={{
            minWidth: 200,
            backgroundColor: '#1e1e1e',
            color: 'white',
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#555',
            },
          }}
        >
          <MenuItem value="all">Tất cả</MenuItem>
          <MenuItem value="unanswered">Chưa trả lời</MenuItem>
          <MenuItem value="answered">Đã trả lời</MenuItem>
          <MenuItem value="updated">Đã cập nhật vào data</MenuItem>
        </Select>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            onClick={handleSaveSelected}
            disabled={selectedIds.length === 0}
            sx={{ backgroundColor: '#1976d2' }}
          >
            Lưu các mục đã chọn ({selectedIds.length})
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={() => setConfirmOpen(true)}
            disabled={selectedIds.length === 0}
          >
            Xoá các mục đã chọn
          </Button>
          <Button
            variant="contained"
            color="success"
            onClick={handleTrainSelected}
            disabled={
              selectedIds.length === 0 ||
              data
                .filter((item) => (item as any).selected)
                .some((item) => !item.answer?.trim())
            }
          >
            Cập nhật vào dữ liệu train
          </Button>
        </Stack>
      </Stack>

      {loading ? (
        <Typography color="white">Đang tải dữ liệu...</Typography>
      ) : (
        <TableContainer component={Paper} sx={{ backgroundColor: '#1e1e1e' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: 'white' }} />
                <TableCell sx={{ color: 'white' }}>
                  <strong>Câu hỏi</strong>
                </TableCell>
                <TableCell sx={{ color: 'white' }}>
                  <strong>Câu trả lời</strong>
                </TableCell>
                <TableCell sx={{ color: 'white' }}>
                  <strong>Trạng thái</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>
                    <Checkbox
                      checked={!!(item as any).selected}
                      onChange={() => handleCheckboxChange(item.id)}
                      sx={{ color: 'white' }}
                      disabled={item.status === 'updated'}
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
                      sx={{
                        '& .MuiInputBase-root': {
                          color: 'white',
                          backgroundColor: '#2a2a2a',
                        },
                      }}
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
                      sx={{
                        '& .MuiInputBase-root': {
                          color: 'white',
                          backgroundColor: '#2a2a2a',
                        },
                      }}
                    />
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    {statusLabels[item.status]}
                  </TableCell>
                </TableRow>
              ))}

              {data.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ color: 'white' }}>
                    Không có dữ liệu
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <ConfirmDialog
        open={confirmOpen}
        content={`Bạn có chắc chắn muốn xoá ${selectedIds.length} mục này không?`}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => {
          setConfirmOpen(false)
          handleDeleteSelected()
        }}
      />
    </Box>
  )
}

export default AdminPanel
