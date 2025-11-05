import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grow from '@mui/material/Grow';

export default function MessageList({ safeMessages }) {
  return (
    <Box
      sx={{
        flex: 1,
        overflowY: 'auto',
        px: 2,
        py: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {safeMessages.map((msg, index) => (
        <Grow in={true} timeout={500} key={index}>
          <Box
            sx={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              mb: 1,
              ...(msg.role === 'user' ? {
                bgcolor: 'primary.main',
                color: 'white',
                px: 2,
                py: 1,
                borderRadius: 2,
              } : {
                bgcolor: 'transparent',
                color: 'text.primary',
                px: 0,
                py: 0,
              }),
              maxWidth: '75%',
            }}
          >
            <Typography variant="body1">{msg.content}</Typography>
          </Box>
        </Grow>
      ))}
      <Box sx={{ height: '86px' }} />
    </Box>
  );
}