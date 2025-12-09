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
    <Box sx={{
      width: '100%',
      maxWidth: 'none',
      margin: '0 auto',
      px: 2, // Increased padding for better spacing
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      height: '100%',
      overflow: 'hidden',
      alignItems: 'center',
      paddingRight: '5%', // Center all content
    }}>

      {/* Scrollable Messages Area */}
      <Fade in={animationTriggered} timeout={1600}>
        <Box sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflowY: 'auto',
          overflowX: 'hidden',
          width: '100%',
          maxWidth: '900px', // Slightly increased max width
          paddingBottom: '120px',
          height: 'calc(100% - 120px)',
          '&::-webkit-scrollbar': {
            display: 'none'
          },
          '-ms-overflow-style': 'none',
          'scrollbar-width': 'none',
        }}>

          <MessageList safeMessages={safeMessages} />

        </Box>
      </Fade>

      {/* Sticky Chat Input */}
      <Slide direction="up" in={animationTriggered} timeout={2000}>
        <Box sx={{
          position: 'absolute',
          bottom: 30,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '100%',
          maxWidth: '900px',
          px: 2,
          zIndex: 1000,
          backgroundColor: 'rgba(247, 247, 248, 0.95)',
          paddingTop: '10px',
          paddingRight: '5%', // Center all content

        }}>
          <ChatInput
            input={input}
            setInput={setInput}
            handleSend={handleSend}
            handleFileUpload={handleFileUpload}
            sending={sending}
          />
        </Box>
      </Slide>

      {/* Text under chat bar */}
      <Fade in={animationTriggered} timeout={2200}>
        <Typography
          variant="caption"
          sx={{
            position: 'absolute',
            bottom: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100%',
            maxWidth: '900px',
            px: 2,
            textAlign: 'center',
            color: 'text.secondary',
            fontSize: '0.75rem',
            zIndex: 1000,
            backgroundColor: 'rgba(247, 247, 248, 0.95)',
            paddingTop: '5px',
            paddingBottom: '5px',
            paddingRight: '5%', // Center all content

          }}
        >
          NestWise can make mistakes. Check important info.
        </Typography>
      </Fade>
    </Box>
  );
}