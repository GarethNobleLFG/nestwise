import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Zoom from '@mui/material/Zoom';

export default function PlanSelector({ animationTriggered }) {
  return (
    <Box
      sx={{
        bgcolor: 'grey.50',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        padding: 2,
        height: '125px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" sx={{ mb: 0.01, textAlign: 'left', width: '100%' }}>
        Select Plan To Edit
      </Typography>
      <Divider sx={{ borderBottomWidth: 2, mb: 1, mt: 1 }} />
      <Box sx={{ overflowY: 'auto', height: '50px' }}>
        <Zoom in={animationTriggered} timeout={1600}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '40px',
              border: '2px solid #c47c1eff',
              borderRadius: 1,
              cursor: 'pointer',
              backgroundColor: 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(196, 124, 30, 0.1)',
              },
            }}
          >
            <Typography
              sx={{
                fontSize: '24px',
                color: '#c47c1eff',
                fontWeight: 'bold',
                lineHeight: 1,
              }}
            >
              +
            </Typography>
          </Box>
        </Zoom>
      </Box>
    </Box>
  );
}