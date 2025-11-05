import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Grow from '@mui/material/Grow';
import Zoom from '@mui/material/Zoom';
import FolderIcon from '@mui/icons-material/Folder';

export default function PlanSelector({ animationTriggered, onPlanClick }) {
  const plans = ['Plan 1', 'Plan 2', 'Plan 3'];

  return (
    <Box
      sx={{
        bgcolor: 'grey.50',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        padding: 2,
        width: '100%',
        height: '100%', // Take full height of parent
        display: 'flex',
        flexDirection: 'column',
        minHeight: 'calc(100vh - 64px - 32px)', // Full sidebar height minus AppBar and padding
      }}
    >
      {/* My Plans Header with animation */}
      <Grow in={animationTriggered} timeout={1000}>
        <Typography
          variant="h6"
          component="h1"
          sx={{
            fontWeight: 600,
            color: '#333',
            marginBottom: 1,
            paddingLeft: 0.5, // Reduced padding for more left alignment
            fontSize: '1.1rem',
            textAlign: 'left',
            flexShrink: 0, // Don't shrink the header
          }}
        >
          My Plans
        </Typography>
      </Grow>

      {/* Divider under My Plans */}
      <Divider sx={{ borderBottomWidth: 2, mb: 1.5, mt: 0.5, flexShrink: 0 }} />

      {/* Plan Buttons - Aligned more to the left */}
      <Box 
        sx={{ 
          paddingLeft: 0.5, // Reduced from 2 to 0.5 for more left alignment
          flex: 1, // Take remaining space
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden', // Prevent overflow
        }}
      >
        {plans.map((plan, index) => (
          <Zoom
            key={index}
            in={animationTriggered}
            timeout={1200 + (index * 200)} // Staggered animation timing
            style={{ transitionDelay: animationTriggered ? `${index * 100}ms` : '0ms' }}
          >
            <Button
              onClick={() => onPlanClick && onPlanClick(plan)}
              startIcon={
                <FolderIcon 
                  sx={{ 
                    fontSize: '1rem', 
                    color: '#666' 
                  }} 
                />
              }
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-start',
                width: '95%', // Increased width to use more space
                marginBottom: 0.8,
                padding: '8px 8px', // Reduced left padding for more left alignment
                color: '#555',
                backgroundColor: 'transparent',
                border: '1px solid #ddd',
                borderRadius: 1,
                textTransform: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                minHeight: '36px',
                flexShrink: 0, // Don't shrink buttons
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  backgroundColor: '#e8e8e8',
                  borderColor: '#bbb',
                  transform: 'translateX(4px)',
                  '& .MuiSvgIcon-root': {
                    color: '#c47c1eff', // Change icon color on hover
                  },
                },
                '&:active': {
                  transform: 'translateX(2px) scale(0.98)',
                },
                '& .MuiButton-startIcon': {
                  marginRight: 0.8, // Reduced icon spacing
                  marginLeft: 0, // Ensure icon starts at the left
                },
              }}
            >
              {plan}
            </Button>
          </Zoom>
        ))}
        
        {/* Spacer to push content to top but fill remaining space */}
        <Box sx={{ flex: 1 }} />
      </Box>
    </Box>
  );
}