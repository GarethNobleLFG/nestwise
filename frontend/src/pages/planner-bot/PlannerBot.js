import * as React from 'react';
import { useState, useRef } from 'react';
import { validateToken } from '../../hooks/validateToken';
import InputArea from './components/InputArea';
import MessagesArea from './components/MessagesArea';
import Header from './components/Header';
import PlannerArea from './components/PlannerArea';


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
  const [generatedPlan, setGeneratedPlan] = useState(null); // Store plan from backend (formatted text)
  const [rawPlanJSON, setRawPlanJSON] = useState(null); // Store raw JSON for database



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

      // Debug: log the full response
      console.log("Full backend response:", data);
      console.log("from_planner flag:", data.from_planner);

      if (data.real_profile) {
        setProfileData(data.real_profile);
      }

      // Getting The Conversation Title Saved To A State To Be Used.
      if (data.conversation_title) {
        console.log("Convo Title: ", data.conversation_title);
        setConversationTitle(data.conversation_title);
      }

      // Check if response is from planner and extract plan
      const detectedPlan = detectAndExtractPlan(data.response, data.from_planner);
      if (detectedPlan) {
        setGeneratedPlan(detectedPlan);

        // Also try to parse and store the raw JSON for database
        try {
          const parsedJSON = JSON.parse(detectedPlan);
          setRawPlanJSON(parsedJSON);
          console.log("Raw plan JSON stored for database:", parsedJSON);
        } catch (e) {
          // If it's not JSON, that's ok - it might be formatted markdown already
          console.log("Plan is not JSON format, likely already formatted");
        }

        console.log("Plan from backend planner detected and set in state");

        // Show summary message instead of full plan
        removeThinkingMessage();
        await addBotMessage("✅ Your personalized retirement plan has been generated successfully! You can view the complete plan on the right side of the screen. \n\nDo you have any other questions about your plan or would you like to adjust any parameters?");
      } else {
        removeThinkingMessage();
        await addBotMessage(data.response);
      }


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

  // Function to extract plan if from_planner flag is true
  // The backend explicitly tells us when it's a plan response
  const detectAndExtractPlan = (response, fromPlannerFlag) => {
    if (!response) return null;

    // Check the explicit from_planner flag from backend
    console.log("Detecting plan in response. from_planner flag:", fromPlannerFlag);
    if (fromPlannerFlag === true) {
      return response;
    }

    return null;
  };






  // -----------------Implentation For Saving Chat State-----------------
  const saveToSessionStorage = (messages, sessionId, profileData, conversationTitle, generatedPlan, rawPlanJSON) => {
    const chatState = {
      messages,
      sessionId,
      profileData,
      conversationTitle,
      generatedPlan,
      rawPlanJSON,
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
        setGeneratedPlan(savedState.generatedPlan || null);
        setRawPlanJSON(savedState.rawPlanJSON || null);
        console.log('Restored chat state from session storage');
      }
    }
  }, []);



  // Add this useEffect to save state whenever it changes
  React.useEffect(() => {
    if (initialized.current && (messages.length > 0 || sessionId)) {
      saveToSessionStorage(messages, sessionId, profileData, conversationTitle, generatedPlan, rawPlanJSON);
    }
  }, [messages, sessionId, profileData, conversationTitle, generatedPlan, rawPlanJSON]);



  const clearChat = () => {
    setMessages([]);
    setInput('');
    setSending(false);
    setSessionId(null);
    setProfileData({});
    setConversationTitle('');
    setGeneratedPlan(null);
    setRawPlanJSON(null);

    sessionStorage.removeItem('plannerBotState');

    initialized.current = false;

    setTimeout(() => {
      initialized.current = true;
      startChatSession();
    }, 100);
  };
  // ---------------------------------------------------------------------


  // Check To See If There Are Chats Happening, Meaining The Plan Should Be Saved.
  //const isChatActive = safeMessages.length > 1 || sending;


  return (
    <div className="h-screen flex overflow-hidden pt-6">
      <div className="flex-1 flex">
        {/* Left side - takes half */}
        <div className="flex-1 flex flex-col pl-1 pr-8 h-full -mr-20">
          <div className="w-full flex flex-col h-full min-h-0">
            {/* Header */}
            <Header
              conversationTitle={conversationTitle}
              selectedPlan={selectedPlan}
              setSelectedPlan={setSelectedPlan}
              clearChat={clearChat}
            />

            {/* Messages Area */}
            <div className="flex-1 min-h-0">
              <MessagesArea safeMessages={safeMessages} />
            </div>

            {/* Input Area */}
            <div className="mb-3">
              <InputArea
                input={input}
                setInput={setInput}
                handleSend={handleSend}
                handleFileUpload={handleFileUpload}
                sending={sending}
              />
            </div>
          </div>
        </div>

        {/* Right side - takes half */}
        <div className="flex-1 flex flex-col px-8 h-full">
          <div className="w-full flex flex-col h-full min-h-0">
            <PlannerArea
              animationTriggered={animationTriggered}
              profileData={profileData}
              lastChatbotResponse={getLastChatbotResponse}
              conversationTitle={conversationTitle}
              generatedPlan={generatedPlan}
            />
          </div>
        </div>

        {/* Disclaimer */}
        <div className="absolute bottom-1 left-0 right-0 flex justify-center pt-1">
          <p className="text-xs text-gray-600 text-center font-medium">
            NestWise Agent can make mistakes. Always verify important financial information.
          </p>
        </div>
      </div>
    </div>
  );
}