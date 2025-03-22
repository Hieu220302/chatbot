// components/ConfirmDialog.tsx
import React from 'react'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
} from '@mui/material'

type ConfirmDialogProps = {
  open: boolean
  title?: string
  content: string
  onConfirm: () => void
  onCancel: () => void
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  title = 'Xác nhận',
  content,
  onConfirm,
  onCancel,
}) => {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Typography>{content}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Huỷ</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Đồng ý
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default ConfirmDialog
