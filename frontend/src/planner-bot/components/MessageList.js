import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grow from '@mui/material/Grow';

// Add the ThinkingAnimation component
const ThinkingAnimation = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 0.5,
      padding: 1,
      color: '#666',
      backgroundColor: 'transparent',
    }}
  >
    <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
      NestWise Bot is thinking
    </Typography>
    <Box sx={{ display: 'flex', gap: 0.25 }}>
      {[0, 1, 2].map((i) => (
        <Box
          key={i}
          sx={{
            width: 4,
            height: 4,
            borderRadius: '50%',
            backgroundColor: '#666',
            animation: 'thinking 1.4s infinite',
            animationDelay: `${i * 0.2}s`,
            '@keyframes thinking': {
              '0%, 60%, 100%': {
                transform: 'translateY(0)',
                opacity: 0.5,
              },
              '30%': {
                transform: 'translateY(-10px)',
                opacity: 1,
              },
            },
          }}
        />
      ))}
    </Box>
  </Box>
);





export default function MessageList({ safeMessages }) {
  return (
    <Box
      sx={{
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
            {/* Check if it's a thinking message */}
            {msg.isThinking ? (
              <ThinkingAnimation />
            ) : (
              <Typography variant="body1">{msg.content}</Typography>
            )}
          </Box>
        </Grow>
      ))}
    </Box>
  );
}