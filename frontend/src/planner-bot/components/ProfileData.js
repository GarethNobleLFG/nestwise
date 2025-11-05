import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';

export default function ProfileData({ animationTriggered, profileData }) {
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
      <Typography variant="h6" sx={{ mb: 0.01, textAlign: 'left', width: '100%' }}>
        Data For Your Plan:
      </Typography>
      <Divider sx={{ borderBottomWidth: 2, mb: 1, mt: 1 }} />
      <Box sx={{ overflowY: 'auto', flex: 1 }}>
        {Object.entries(profileData).length > 0 ? (
          Object.entries(profileData).map(([key, value], index) => (
            <Fade in={animationTriggered} timeout={2000 + (index * 200)} key={key}>
              <Box sx={{ mb: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    color: 'text.secondary',
                    fontStyle: 'italic'
                  }}
                >
                  <span>
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
            </Fade>
          ))
        ) : (
          <Fade in={animationTriggered} timeout={2000}>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontStyle: 'italic' }}>
              No data available yet.
            </Typography>
          </Fade>
        )}
      </Box>


      <Typography variant="caption" sx={{ color: 'text.secondary',  fontSize: '0.7rem' }}>
        Tell chatbot if data is not accurate.
      </Typography>

    </Box>
  );
}