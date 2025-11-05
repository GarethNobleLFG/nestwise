import * as React from 'react';
import Box from '@mui/material/Box';
import Zoom from '@mui/material/Zoom';
import Slide from '@mui/material/Slide';
import Sidebar from './Sidebar';
import ChatArea from './ChatArea';

export default function ChatContainer({
  animationTriggered,
  profileData,
  safeMessages,
  input,
  setInput,
  handleSend,
  handleFileUpload,
  sending
}) {
  return (
    <Box sx={{ width: '100%', maxWidth: '1200px', px: 2 }}>
      <Zoom in={animationTriggered} timeout={1000}>
        <Box
          sx={{
            display: 'flex',
            height: '80vh',
            border: 1,
            borderColor: 'divider',
            borderRadius: 3,
            overflow: 'hidden',
            position: 'relative',
            bgcolor: '#f7f7f8',
            boxShadow: '0 4px 16px rgba(0,0,0,0.1)',
          }}
        >
          <Slide direction="right" in={animationTriggered} timeout={1200}>
            <Box sx={{ width: '20%', display: 'flex' }}>
              <Sidebar
                animationTriggered={animationTriggered}
                profileData={profileData}
              />
            </Box>
          </Slide>

          <Slide direction="left" in={animationTriggered} timeout={1200}>
            <Box sx={{ flex: 1, display: 'flex' }}>
              <ChatArea
                animationTriggered={animationTriggered}
                safeMessages={safeMessages}
                input={input}
                setInput={setInput}
                handleSend={handleSend}
                handleFileUpload={handleFileUpload}
                sending={sending}
              />
            </Box>
          </Slide>
        </Box>
      </Zoom>
    </Box>
  );
}