import * as React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';

export default function ChatInput({
  input,
  setInput,
  handleSend,
  handleFileUpload,
  sending
}) {
  return (
    <Box
      sx={{
        position: 'sticky',
        bottom: 0,
        display: 'flex',
        justifyContent: 'stretch',
        py: 1.5,
        background: 'transparent',
        width: '100%'
      }}
    >
      <Box sx={{
        width: '100%',
        display: 'flex',
        gap: 1,
      }}>
        <Box
          sx={{
            bgcolor: 'white',
            borderRadius: 3,
            boxShadow: '0px 4px 16px rgba(0,0,0,0.15)',
            display: 'flex',
            alignItems: 'center',
            px: 2,
            py: 0.1,
            flexGrow: 1,
            width: '100%', // Fill the full width
          }}
        >
          {/* Upload button as plus icon */}
          <IconButton
            component="label"
            sx={{
              color: '#666',
              border: 'none',
              boxShadow: 'none',
              '&:hover': {
                color: 'primary.main',
                backgroundColor: 'transparent',
              },
            }}
          >
            <AddIcon sx={{ fontSize: '1.5rem' }} />
            <input type="file" hidden multiple onChange={handleFileUpload} />
          </IconButton>

          <TextField
            fullWidth
            multiline
            maxRows={4}
            placeholder="Type a message..."
            variant="standard"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            InputProps={{ disableUnderline: true }}
            sx={{ mx: 1 }}
          />

          <IconButton
            color="primary"
            onClick={handleSend}
            disabled={sending || !input.trim()}
            sx={{
              border: 'none',
              boxShadow: 'none',
              '&:hover': {
                backgroundColor: 'transparent',
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
}