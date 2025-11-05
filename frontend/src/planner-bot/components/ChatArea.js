import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
import MessageList from './MessageList';
import ChatInput from './ChatInput';

export default function ChatArea({
  animationTriggered,
  safeMessages,
  input,
  setInput,
  handleSend,
  handleFileUpload,
  sending
}) {
  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <Fade in={animationTriggered} timeout={1600}>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <MessageList safeMessages={safeMessages} />
        </Box>
      </Fade>

      <Slide direction="up" in={animationTriggered} timeout={2000}>
        <Box>
          <ChatInput
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            handleFileUpload={handleFileUpload}
            sending={sending}
          />
        </Box>
      </Slide>

      <Fade in={animationTriggered} timeout={2200}>
        <Typography
          variant="caption"
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            fontSize: '0.75rem',
            mt: 'auto',
            pt: 0.05,
            pb: 0.05,
          }}
        >
          NestWise can make mistakes. Check important info.
        </Typography>
      </Fade>
    </Box>
  );
}