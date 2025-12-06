import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';
import { useState, useEffect, useRef } from 'react';

export default function ProfileData({ animationTriggered, profileData, lastChatbotResponse }) {
  const [formattedData, setFormattedData] = useState({});
  const [isFormatting, setIsFormatting] = useState(false);
  const scrollRef = useRef(null);


  // FORMAT TEXT
  const textizer = async () => {
    if (Object.keys(profileData).length === 0) {
      return;
    }

    if (isFormatting) {
      return;
    }

    setIsFormatting(true);


    try {
      const response = await fetch('http://localhost:8000/textizer/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profileData: profileData,
          lastChatbotResponse: lastChatbotResponse,
          formattedContext: formattedData
        })
      });


      if (!response.ok) {
        throw new Error('Textizer API call failed.');
      }


      const textizerReturn = await response.json();
      setFormattedData(textizerReturn);
    }
    catch (error) {
      // FALL BACK FORMATTING IF THIS BREAKS
      console.error('Textizer API error:', error);
      const fallback = {};
      Object.entries(profileData).forEach(([key, value]) => {
        fallback[key] = value === false || value === null ? "" : String(value);
      });
      setFormattedData(fallback);
    }
    finally {
      setIsFormatting(false);
    }
  };



  // FORMAT ON RE-RENDER
  useEffect(() => {
    textizer();
  }, [profileData, lastChatbotResponse]);


  // Separate useEffect For Auto Scrolling When fromattedData Changes.
  useEffect(() => {
    if (scrollRef.current && Object.keys(formattedData).length > 0) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [formattedData]);



  return (
    <Box
      sx={{
        bgcolor: 'grey.50',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        padding: 2,
        height: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" sx={{
        mb: 0.01,
        textAlign: 'left',
        width: '100%',
        ml: '9px', // Pixel positioning control
        mt: '0px', // Pixel positioning control
      }}>

        Data For Your Plan
      </Typography>


      <Divider sx={{
        borderBottomWidth: 2,
        mb: 1,
        mt: 1,
        ml: '0px', // Pixel positioning control
      }} />


      <Box
        className="profile-data-scroll"
        ref={scrollRef}
        sx={{
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          flex: 1,
          minHeight: 0, // Enusring No Growth Of Box.         
          padding: 2,
          flexShrink: 0, // Prevents Shrinking.
        }}>

        {Object.keys(formattedData).length !== 0 ? (
          Object.entries(formattedData).map(([key, value], index) => (
            <Fade in={animationTriggered} timeout={2000 + (index * 200)} key={key}>
              <Box sx={{
                mb: 2,
                width: '80%',
                maxWidth: '200px',
                ml: '16px',
                mt: '0px',
              }}>
                <Typography
                  variant="body2"
                  sx={{
                    display: 'flex',
                    color: index > 4 ? '#c47c1eff' : 'text.secondary', // Red if index > 5
                    fontStyle: 'italic',
                    mb: 0.5,
                    ml: '0px',
                    '&::before': {
                      content: '"•"',
                      marginRight: '6px',
                    }
                  }}
                >
                  {key}:
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: index > 4 ? '#c47c1eff' : '#666', // Red if index > 5               
                    fontWeight: 'bold',
                    ml: '12px',
                    mt: '4px',
                  }}
                >
                  {value}
                </Typography>

                <Divider sx={{ mt: 0.5 }} /> {/* Reduced divider spacing */}
              </Box>
            </Fade>
          ))


        ) : (


          <Typography variant="body2" sx={{
            color: 'text.secondary',
            mt: 2,
            textAlign: 'center',
            width: '100%'
          }}>
            No data available yet.
          </Typography>


        )}

      </Box>

      <Typography variant="caption" sx={{
        color: 'text.secondary',
        fontSize: '0.7rem',
        textAlign: 'center',
        ml: '0px', // Pixel positioning control
        mt: 'auto', // Pixel positioning control
        mb: -1.5,
      }}>
        Tell chatbot if data is not accurate.
      </Typography>

    </Box >
  );
}