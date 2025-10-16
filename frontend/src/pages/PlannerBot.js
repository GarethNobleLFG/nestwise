import * as React from 'react';
import { useEffect, useState } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import SendIcon from '@mui/icons-material/Send';
import Toolbar from '@mui/material/Toolbar';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import AppTheme from '../shared-theme/AppTheme';
import AppBar from '../app-bar/AppBar';

export default function PlannerBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [typingText, setTypingText] = useState(''); // for animated typing

  const initialMessage = 'Hello! I am your Planner Bot. How can I help you today?';





  // Ensure messages is always an array
  const safeMessages = Array.isArray(messages) ? messages : []; // If coming from props
  // OR
  // const [messages, setMessages] = useState([]); // If using state





  // Animate the initial bot message
  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypingText(initialMessage.slice(0, i));
      if (i >= initialMessage.length) {
        clearInterval(interval);
        setMessages([{ role: 'bot', content: initialMessage, initial: true }]);
        setTypingText('');
      }
    }, 50);
    return () => clearInterval(interval);
  }, []);







  const simulateTypingEffect = async (text, placeholderIndex, setMessages) => {
    let i = 0;

    return new Promise((resolve) => {
      const interval = setInterval(() => {
        i++;
        const partialText = text.slice(0, i);

        setMessages((prev) => {
          const safePrev = Array.isArray(prev) ? prev : [];
          const updated = [...safePrev];
          updated[placeholderIndex] = {
            ...updated[placeholderIndex],
            content: partialText,
            isTyping: true,
          };
          return updated;
        });

        if (i >= text.length) {
          clearInterval(interval);
          resolve();
        }
      }, 50);
    });
  };





  const handleSend = async () => {
    if (!input.trim() || sending) return;

    const userInput = input.trim();
    setInput('');
    setSending(true);



    // Add user message
    setMessages((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return safePrev
        .map((msg) => ({ ...msg, initial: false }))
        .concat({ role: 'user', content: userInput });
    });




    // Add bot placeholder
    const botPlaceholder = { role: 'bot', content: '...', isTyping: true };
    setMessages((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return [...safePrev, botPlaceholder];
    });



    
    try {
      const res = await fetch(`http://localhost:8000/`, { method: 'GET' });
      if (!res.ok) throw new Error(`Server returned ${res.status}`);

      const data = await res.json();
      const botText = data?.message ?? 'No response from server.';

      // Simulate typing effect
      const placeholderIndex = messages.length;
      await simulateTypingEffect(botText, placeholderIndex, setMessages);

      // Replace placeholder with actual response
      setMessages((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        const updated = [...safePrev];
        updated[placeholderIndex] = {
          ...updated[placeholderIndex],
          content: botText,
          isTyping: false,
        };
        return updated;
      });
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setSending(false);
    }
  };






  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files.length > 0) console.log('Uploaded files:', files);
  };






  const handleDeleteClick = (idx) => {
    setChatToDelete(idx);
    setOpenDeleteDialog(true);
  };







  const handleConfirmDelete = () => {
    if (chatToDelete !== null) {
      setMessages((prev) => prev.filter((_, i) => i !== chatToDelete));
      setChatToDelete(null);
      setOpenDeleteDialog(false);
    }
  };








  const handleCancelDelete = () => {
    setChatToDelete(null);
    setOpenDeleteDialog(false);
  };




  const handleNewChat = () => {
    setMessages([]);
    setTypingText('');

    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypingText(initialMessage.slice(0, i));
      if (i >= initialMessage.length) {
        clearInterval(interval);
        setMessages([{ role: 'bot', content: initialMessage, initial: true }]);
        setTypingText('');
      }
    }, 50);
  };




  return (
    <AppTheme>
      <CssBaseline />
      <AppBar />
      <Toolbar />

      <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Box sx={{ width: '100%', maxWidth: '1200px', px: 2 }}>
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
            {/* Left sidebar */}
            <Box
              sx={{
                width: '25%',
                bgcolor: 'grey.200',
                p: 1,
                borderRight: 1,
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h6" sx={{ mb: 1, textAlign: 'center', width: '100%' }}>
                Chat History
              </Typography>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5, mb: 1 }}>
                <Box
                  onClick={handleNewChat}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    cursor: 'pointer',
                    fontSize: '0.875rem',
                    mb: 1,
                    px: 0.5,
                    py: 0.5,
                    borderRadius: 1,
                    '&:hover': { bgcolor: 'grey.400' },
                  }}
                >
                  <AddCircleOutlineIcon fontSize="small" />
                  <Typography variant="body2" fontWeight="bold">
                    New Chat
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontSize: '0.875rem', px: 0.5 }}>
                  <SearchIcon fontSize="small" />
                  <TextField
                    size="small"
                    placeholder="Search chats..."
                    variant="standard"
                    fullWidth
                    sx={{ fontSize: '0.875rem' }}
                  />
                </Box>
              </Box>

              <Divider sx={{ borderBottomWidth: 2, mb: 1 }} />

              <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
                {safeMessages.map((msg, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      mb: 1,
                      p: 1,
                      borderRadius: 1,
                      bgcolor: 'grey.300',
                      color: 'black',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s ease',
                      '&:hover': { bgcolor: 'grey.400' },
                    }}
                  >
                    <Typography variant="body2" noWrap onClick={() => console.log('Clicked chat', idx)}>
                      {msg.content}
                    </Typography>
                    <IconButton size="small" onClick={() => handleDeleteClick(idx)}>
                      <DeleteIcon fontSize="small" sx={{ color: 'black' }} />
                    </IconButton>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Right chat area */}
            <Box
              sx={{
                flexGrow: 1,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                position: 'relative',
                p: 2,
                width: '75%',
                overflow: 'hidden',
              }}
            >
              {/* Messages container - scrollable */}
              <Box sx={{ flex: 1, overflowY: 'auto', px: 2 }}>
                {/* Initial bot message or typing */}
                {(safeMessages.length === 0 || safeMessages.some(msg => msg.initial)) && (
                  <Box
                    sx={{
                      bgcolor: 'white',
                      color: 'black',
                      px: 4,
                      py: 2,
                      borderRadius: 3,
                      maxWidth: '70%',
                      textAlign: 'center',
                      boxShadow: '0px 4px 16px rgba(0,0,0,0.1)',
                      fontWeight: 'bold',
                      mx: 'auto',
                      mt: 1,
                    }}
                  >
                    <Typography variant="body1">{typingText || safeMessages[0]?.content}</Typography>
                  </Box>
                )}

                {safeMessages.map((msg, idx) => (
                  <Box
                    key={idx}
                    sx={{
                      display: 'flex',
                      justifyContent: msg.initial ? 'center' : msg.role === 'user' ? 'flex-end' : 'flex-start',
                      mb: 2,
                    }}
                  >
                    {msg.role === 'user' ? (
                      <Box sx={{ position: 'relative', transform: 'translateY(-10px)', maxWidth: '70%' }}>
                        <Box
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            px: 3,
                            py: 2,
                            borderRadius: 3,
                            boxShadow: '0px 4px 16px rgba(0,0,0,0.15)',
                          }}
                        >
                          <Typography variant="body1">{msg.content}</Typography>
                        </Box>
                      </Box>
                    ) : (
                      !msg.initial && (
                        <Box
                          sx={{
                            bgcolor: 'transparent',
                            color: 'inherit',
                            px: 0,
                            py: 0,
                            borderRadius: 0,
                            fontWeight: 'normal',
                            maxWidth: '75%',
                            textAlign: 'left',
                          }}
                        >
                          <Typography variant="body1">{msg.content}</Typography>
                        </Box>
                      )
                    )}
                  </Box>
                ))}
                {/* Add some bottom padding so last message isn't hidden behind the input */}
                <Box sx={{ height: '86px' }} />
              </Box>

              {/* Input bubble - sits below the scrollable messages */}
              <Box
                sx={{
                  position: 'sticky',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  display: 'flex',
                  justifyContent: 'center',
                  py: 1.5,
                  background: 'transparent',
                }}
              >
                <Box sx={{ width: '90%', maxWidth: 800, display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    component="label"
                    sx={{ minWidth: '80px', height: '50px', borderRadius: 3, fontWeight: 'bold' }}
                  >
                    Upload
                    <input type="file" hidden multiple onChange={handleFileUpload} />
                  </Button>

                  <Box
                    sx={{
                      bgcolor: 'white',
                      borderRadius: 3,
                      boxShadow: '0px 4px 16px rgba(0,0,0,0.15)',
                      display: 'flex',
                      alignItems: 'center',
                      px: 2,
                      py: 1,
                      flexGrow: 1,
                    }}
                  >
                    <TextField
                      fullWidth
                      placeholder="Type a message..."
                      variant="standard"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSend();
                        }
                      }}
                      InputProps={{ disableUnderline: true }}
                    />
                    <IconButton
                      color="primary"
                      onClick={handleSend}
                      disabled={sending || !input.trim()}
                    >
                      <SendIcon />
                    </IconButton>
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Delete dialog */}
          <Dialog open={openDeleteDialog} onClose={handleCancelDelete}>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent><Typography>Are you sure you want to delete this chat?</Typography></DialogContent>
            <DialogActions>
              <Button onClick={handleCancelDelete}>Cancel</Button>
              <Button color="error" onClick={handleConfirmDelete}>Delete</Button>
            </DialogActions>
          </Dialog>
        </Box>
      </Box>
    </AppTheme>
  );
}