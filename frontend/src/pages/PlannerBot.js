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
import { useRef } from 'react';

export default function PlannerBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [chatToDelete, setChatToDelete] = useState(null);
  const [typingText, setTypingText] = useState('');
  const [sessionId, setSessionId] = useState(null);


  // Add this to your state declarations at the top
  const [profileData, setProfileData] = useState({});

  const initialMessage = 'Hello! I am NestWiseAI. How can I help you today?';


  const safeMessages = Array.isArray(messages) ? messages : []; // If coming from props








  // --- Start backend chat session ---
  const startChatSession = React.useCallback(async () => {
    await addBotMessage('Hello! I am NestWiseAI. How can I help you today?')

    try {
      const res = await fetch('http://localhost:8000/chatbot/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!res.ok) throw new Error('Failed to start session');
      const data = await res.json();
      setSessionId(data.session_id);
    } catch (err) {
      console.error(err);
      await addBotMessage('Error starting session.');
    }
  }, []);








  const addUserMessage = async (content) => {
    setMessages((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return [...safePrev, { role: 'user', content: content }];
    });
  };




  const addBotMessage = async (content) => {
    const simulateTypingEffect = (text) => {

      const chunkSize = Math.ceil(text.length / 10); // Larger chunk size for longer text
      let i = 0;

      return new Promise((resolve) => {
        const interval = setInterval(() => {
          i += chunkSize;
          const partialText = text.slice(0, i);

          setMessages((prev) => {
            const safePrev = Array.isArray(prev) ? prev : [];
            const updated = [...safePrev];
            const lastIndex = updated.length - 1;

            // Update the last bot message with the partial text
            if (lastIndex >= 0 && updated[lastIndex].role === 'bot' && updated[lastIndex].isTyping) {
              updated[lastIndex] = {
                ...updated[lastIndex],
                content: partialText,
              };
            } else {
              // Add a new bot message if none exists
              updated.push({ role: 'bot', content: partialText, isTyping: true });
            }

            return updated;
          });

          if (i >= text.length) {
            clearInterval(interval);
            resolve(text); // Resolve when all chunks are displayed
          }
        }, 100); // Adjust the interval time for chunk display speed
      });
    };

    // Simulate typing effect and finalize the bot message
    await simulateTypingEffect(content);

    // Finalize the bot message
    setMessages((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      const updated = [...safePrev];
      const lastIndex = updated.length - 1;

      if (lastIndex >= 0 && updated[lastIndex].role === 'bot') {
        updated[lastIndex] = {
          ...updated[lastIndex],
          content,
          isTyping: false,
        };
      }

      return updated;
    });
  };





  // --- Handle Send button ---
  const handleSend = async () => {
    if (!input.trim() || sending) return;

    const userInput = input.trim();
    setInput('');
    setSending(true);
    addUserMessage(userInput);

    try {
      if (!sessionId) throw new Error('Session not started');

      // Send user input to backend
      const res = await fetch('http://localhost:8000/chatbot/answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          message: userInput,
        }),
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      const data = await res.json();

      if (data.real_profile) {
        setProfileData(data.real_profile);
      }

      // Commented this out because it is saving all the chats.
      //setHistory(data.history);

      // Show backend’s response
      await addBotMessage(data.response);
    } catch (err) {
      console.error(err);
      await addBotMessage(`Error: ${err.message}`);
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






  const initialized = useRef(false); // Flag to ensure it runs only once

  if (!initialized.current) {
    initialized.current = true; // Set the flag to true
    startChatSession(); // Call the function directly
  }







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
                width: '20%',
                bgcolor: 'grey.200',
                p: 1,
                borderRight: 1,
                borderColor: 'divider',
                display: 'flex',
                flexDirection: 'column',
              }}
            >

              <Box
                sx={{
                  // Card styling
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  padding: 2,
                  // Fixed size - half of the chat history box
                  height: '155px',
                  width: '100%',
                  maxWidth: 'none',
                  minWidth: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >



                {/* Fixed Header */}
                <Typography variant="h6" sx={{ mb: 0.01, textAlign: 'left', width: '100%' }}>
                  Select Plan To Edit
                </Typography>



                <Divider sx={{ borderBottomWidth: 2, mb: 1, mt: 1 }} />



                {/* Scrollable Content */}
                <Box
                  sx={{
                    overflowY: 'auto',
                    flex: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%',
                      height: '40px',
                      border: '2px solid #c47c1eff', // Brownish gold outline
                      borderRadius: 1,
                      cursor: 'pointer',
                      backgroundColor: 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(196, 124, 30, 0.1)', // Light brownish gold background on hover
                      },
                    }}
                  >

                    <Typography
                      sx={{
                        fontSize: '24px',
                        color: '#c47c1eff', // Brownish gold plus symbol
                        fontWeight: 'bold',
                        lineHeight: 1,
                      }}
                    >
                      +
                    </Typography>



                  </Box>
                </Box>
              </Box>



              <Divider sx={{ borderBottomWidth: 2, mb: 1, mt: 1.5 }} />




              <Box
                sx={{
                  // Card styling
                  bgcolor: 'grey.50',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  padding: 2,
                  // Fixed size - half of the chat history box
                  height: '100%',
                  width: '100%',
                  maxWidth: 'none',
                  minWidth: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Fixed Header */}
                <Typography variant="h6" sx={{ mb: 0.01, textAlign: 'left', width: '100%' }}>
                  Data For Your Plan:
                </Typography>



                <Divider sx={{ borderBottomWidth: 2, mb: 1, mt: 1 }} />



                {/* Scrollable Content */}
                <Box
                  sx={{
                    overflowY: 'auto',
                    flex: 1,
                  }}
                >


                  {/* Display JSON data with formatted values */}
                  {Object.entries(profileData).length > 0 ? (
                    Object.entries(profileData).map(([key, value]) => (
                      <Box key={key} sx={{ mb: 1 }}>
                        <Typography variant="body2" sx={{ display: 'flex', justifyContent: 'space-between', color: 'text.secondary', fontStyle: 'italic' }}>
                          <span style={{}}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                          </span>
                          <span style={{ color: '#666' }}>
                            {typeof value === 'number' && key.toLowerCase().includes('savings')
                              ? `$${value.toLocaleString()}`
                              : value || 'N/A'
                            }
                          </span>
                        </Typography>
                      </Box>
                    ))
                  ) : (
                    <Typography variant="body2" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                      No profile data available
                    </Typography>
                  )}

                </Box>

                <Typography
                  variant="caption"
                  sx={{
                    textAlign: 'left',
                    color: 'text.secondary',
                    fontSize: '0.75rem',
                    mt: 'auto', // Pushes it to the bottom
                    pt: 1, // Small padding top
                  }}
                >
                  Tell chatbot if data is not accurate.
                </Typography>

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
                  display: 'left',
                  justifyContent: 'center',
                  py: 1.5,
                  background: 'transparent',
                }}
              >
                <Box sx={{ width: '95%', display: 'flex', gap: 1, justifyContent: 'flex-start' }}>


                  <Button
                    variant="outlined"
                    component="label"
                    sx={{
                      minWidth: '80px',
                      height: '50px',
                      borderRadius: 3,
                      fontWeight: 'bold',
                      alignSelf: 'flex-start', // Align button to the left
                      mr: 1, // Push button to the left edge
                    }}
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
                      minWidth: 0,
                    }}
                  >
                    <TextField
                      fullWidth
                      multiline
                      maxRows={4}
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