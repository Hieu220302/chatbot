import React from 'react'
import Typography from '@mui/material/Typography'
import { Box, Button } from '@mui/material'

const Header: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        backgroundColor: 'black',
        color: 'white',
        padding: '10px 20px',
        alignItems: 'center',
      }}
    >
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Chat Bot
      </Typography>
      <Box>
        <Button
          color="inherit"
          variant="outlined"
          sx={{
            borderRadius: '20px',
            borderColor: 'white',
            color: 'white',
            textTransform: 'none',
            px: 3,
            py: 1,
            backgroundColor: 'black',
            fontWeight: 500,
            '&:hover': {
              backgroundColor: 'gray',
              borderColor: 'white',
            },
          }}
        >
          Đăng nhập
        </Button>
      </Box>
    </Box>
  )
}

export default Header
