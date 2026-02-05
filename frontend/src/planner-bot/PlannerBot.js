import * as React from 'react';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { validateToken } from '../validateToken';
import NavBar from '../nav-bar/NavBar';
import { Button } from '../shadcn/components/ui/button';
import { Card, CardContent } from '../shadcn/components/ui/card';
import { cn } from '../shadcn/lib/utils';
import SendIcon from '@mui/icons-material/Send';
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
import PersonIcon from '@mui/icons-material/Person';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import InputArea from './components/InputArea';
import MessagesArea from './components/MessagesArea';


export default function PlannerBot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [sessionId, setSessionId] = useState(null);
  const [profileData, setProfileData] = useState({});
  const [animationTriggered, setAnimationTriggered] = useState(false);
  const initialized = useRef(false);
  const [conversationTitle, setConversationTitle] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);



  const safeMessages = Array.isArray(messages) ? messages : [];



  React.useEffect(() => {
    document.title = "NestWise - Planner Bot";

    const timer = setTimeout(() => {
      setAnimationTriggered(true);
    }, 50);
    return () => clearTimeout(timer);
  }, []);



  const startChatSession = React.useCallback(async () => {
    const tokenCheck = await validateToken();

    if (!tokenCheck.valid) {
      alert("Your session has expired. Please log in again.");
      localStorage.removeItem("token");
      return;
    }

    // Check To See If There Is An Existing Chat State.
    const savedState = loadFromSessionStorage();
    if (savedState && savedState.sessionId) {
      console.log('Using existing session from storage');
      return; // Don't start a new session if we have one
    }



    await addBotMessage('Hello! I am NestWiseAI. How can I help you today?')
    const token = localStorage.getItem('token');

    try {
      const res = await fetch('http://localhost:8000/chatbot/start', {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });

      if (res.status === 401) {
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        return;
      }

      if (!res.ok) throw new Error('Failed to start session');
      const data = await res.json();
      setSessionId(data.session_id);
    } catch (err) {
      console.error(err);
      await addBotMessage('Error starting session.');
    }
  }, []);




  // Start chat session only after animation completes
  React.useEffect(() => {
    if (animationTriggered && !initialized.current) {
      initialized.current = true;

      const chatSessionTimer = setTimeout(() => {
        startChatSession();
      }, 800); // Reduced from 1600 to 800

      return () => clearTimeout(chatSessionTimer);
    }
  }, [animationTriggered, startChatSession]);






  const addUserMessage = async (content) => {
    setMessages((prev) => {
      const safePrev = Array.isArray(prev) ? prev : [];
      return [...safePrev, { role: 'user', content: content }];
    });
  };







  const addBotMessage = async (content) => {
    const simulateTypingEffect = (text) => {
      const chunkSize = Math.ceil(text.length / 10);
      let i = 0;

      return new Promise((resolve) => {
        const interval = setInterval(() => {
          i += chunkSize;
          const partialText = text.slice(0, i);

          setMessages((prev) => {
            const safePrev = Array.isArray(prev) ? prev : [];
            const updated = [...safePrev];
            const lastIndex = updated.length - 1;

            if (lastIndex >= 0 && updated[lastIndex].role === 'bot' && updated[lastIndex].isTyping) {
              updated[lastIndex] = {
                ...updated[lastIndex],
                content: partialText,
              };
            } else {
              updated.push({ role: 'bot', content: partialText, isTyping: true });
            }

            return updated;
          });

          if (i >= text.length) {
            clearInterval(interval);
            resolve(text);
          }
        }, 100);
      });
    };

    await simulateTypingEffect(content);

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








  const handleSend = async () => {
    const tokenCheck = await validateToken();

    if (!tokenCheck.valid) {
      alert("Your session has expired. Please log in again.");
      localStorage.removeItem("token");
      window.location.href = "/signin";
      return;
    }
    if (!input.trim() || sending) return;

    const userInput = input.trim();
    setInput('');
    setSending(true);
    addUserMessage(userInput);

    // Add thinking animation before the API call
    const addThinkingMessage = () => {
      setMessages((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        return [...safePrev, {
          role: 'bot',
          content: '',
          isThinking: true,
          id: Date.now() // unique ID for the thinking message
        }];
      });
    };

    const removeThinkingMessage = () => {
      setMessages((prev) => {
        const safePrev = Array.isArray(prev) ? prev : [];
        return safePrev.filter(msg => !msg.isThinking);
      });
    };

    // Show thinking animation
    addThinkingMessage();
    const token = localStorage.getItem('token');

    try {
      if (!sessionId) throw new Error('Session not started');

      const res = await fetch('http://localhost:8000/chatbot/answer', {
        method: 'POST',
        headers: {
          "Authorization": `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          session_id: sessionId,
          message: userInput,
        }),
      });

      if (res.status === 401) {
        removeThinkingMessage();
        alert("Your session has expired. Please log in again.");
        localStorage.removeItem("token");
        return;
      }

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`);
      }

      const data = await res.json();

      if (data.real_profile) {
        setProfileData(data.real_profile);
      }

      // Getting The Conversation Title Saved To A State To Be Used.
      if (data.conversation_title) {
        console.log("Convo Title: ", data.conversation_title);
        setConversationTitle(data.conversation_title);
      }

      removeThinkingMessage();
      await addBotMessage(data.response);


    }
    catch (err) {

      console.error(err);
      removeThinkingMessage();
      await addBotMessage(`Error: ${err.message}`);


    }
    finally {
      setSending(false);
    }
  };









  const handleFileUpload = (event) => {
    const files = event.target.files;
    if (files.length > 0) console.log('Uploaded files:', files);
  };



  //  GET LAST CHAT RESPONSE FOR CONTEXT IN OTHER FUNCTIONS
  const getLastChatbotResponse = () => {
    const lastBotMessage = safeMessages
      .filter(msg => msg.role === 'bot' && !msg.isThinking)
      .slice(-1)[0];
    return lastBotMessage ? lastBotMessage.content : '';
  };






  // -----------------Implentation For Saving Chat State-----------------
  const saveToSessionStorage = (messages, sessionId, profileData, conversationTitle) => {
    const chatState = {
      messages,
      sessionId,
      profileData,
      conversationTitle,
      timestamp: Date.now()
    };
    sessionStorage.setItem('plannerBotState', JSON.stringify(chatState));
  };


  const loadFromSessionStorage = () => {
    const saved = sessionStorage.getItem('plannerBotState');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (error) {
        console.error('Error parsing saved chat state:', error);
        return null;
      }
    }
    return null;
  };



  React.useEffect(() => {
    if (!initialized.current) {
      const savedState = loadFromSessionStorage();
      if (savedState) {
        setMessages(savedState.messages || []);
        setSessionId(savedState.sessionId || null);
        setProfileData(savedState.profileData || {});
        setConversationTitle(savedState.conversationTitle || '');
        console.log('Restored chat state from session storage');
      }
    }
  }, []);



  // Add this useEffect to save state whenever it changes
  React.useEffect(() => {
    if (initialized.current && (messages.length > 0 || sessionId)) {
      saveToSessionStorage(messages, sessionId, profileData, conversationTitle);
    }
  }, [messages, sessionId, profileData, conversationTitle]);



  const clearChat = () => {
    setMessages([]);
    setInput('');
    setSending(false);
    setSessionId(null);
    setProfileData({});
    setConversationTitle('');

    sessionStorage.removeItem('plannerBotState');

    initialized.current = false;

    setTimeout(() => {
      initialized.current = true;
      startChatSession();
    }, 100);
  };
  // ---------------------------------------------------------------------


  // Check To See If There Are Chats Happening, Meaining The Plan Should Be Saved.
  const isChatActive = safeMessages.length > 1 || sending;


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100 relative overflow-hidden">
      <NavBar page='planner-bot' />

      {/* Background decoration */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-amber-600/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-amber-700/20 to-yellow-500/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen pt-12 flex flex-col">

        {/* Header */}
        <div className="px-8 py-6">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div>
                <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                  {conversationTitle || 'NestWise AI Assistant'}
                </h2>
              </div>
              <div className="bg-white/40 backdrop-blur-sm rounded-2xl shadow-lg">
                <select
                  className="px-4 py-3 bg-transparent border-0 rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-yellow-400/50 appearance-none cursor-pointer"
                  value={selectedPlan || ''}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                >
                  <option value="">🎯 Select plan to edit</option>
                  <option value="retirement">🏡 Retirement Plan</option>
                  <option value="investment">📈 Investment Plan</option>
                  <option value="emergency">💰 Emergency Fund</option>
                </select>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={clearChat}
              className="bg-white/40 backdrop-blur-sm hover:bg-red-50/80 border-0 rounded-2xl shadow-lg transition-all duration-300 px-4 py-3"
            >
              <ClearIcon className="h-4 w-4 mr-2" />
              <span>Clear Chat</span>
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <MessagesArea safeMessages={safeMessages} />

        {/* Input Area */}
        <InputArea
          input={input}
          setInput={setInput}
          handleSend={handleSend}
          handleFileUpload={handleFileUpload}
          sending={sending}
        />
      </div>
    </div>
  );
}