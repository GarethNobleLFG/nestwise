import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import FolderIcon from '@mui/icons-material/Folder';
import DownloadIcon from '@mui/icons-material/Download';
import IconButton from '@mui/material/IconButton';
import AddIcon from '@mui/icons-material/Add';
import { useEffect } from 'react';

export default function PlanSelector({
  animationTriggered,
  selectedPlan,
  setSelectedPlan,
  onPlanClick,
  conversationTitle,
  clearChat,
  isChatActive,
}) {


  const [plans, setPlans] = React.useState(['Plan 1']);

  useEffect(() => {

    if (conversationTitle && conversationTitle !== 'None') {

      const cleanTitle = conversationTitle.replace(/['"]/g, '').trim();
      setPlans(prev => [cleanTitle, ...prev.slice(1)]);

    }
    else {
      setPlans(prev => prev.length === 1 ? ['Plan 1'] : prev);
    }

  }, [conversationTitle]);


  // useEffect To Auto Select First Plan In List.
  useEffect(() => {
    if (plans.length > 0 && setSelectedPlan && (!selectedPlan || !plans.includes(selectedPlan))) {
      setSelectedPlan(plans[0]);
    }
  }, [plans, selectedPlan, setSelectedPlan]);


  return (
    <Box
      sx={{
        bgcolor: 'grey.50',
        borderRadius: 2,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        padding: 2,
        height: '225px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <Typography variant="h6" sx={{ mb: 0.01, textAlign: 'left', width: '100%' }}>
        Select Plan To Edit
      </Typography>

      {/* Start New Plan Button */}
      <Box sx={{ mb: -1 }}>
        <Button
          startIcon={<AddIcon />}
          onClick={() => {
            const newPlanName = `Plan ${plans.length + 1}`;
            setPlans(prev => [...prev, newPlanName]);

            if (setSelectedPlan) {
              setSelectedPlan(newPlanName);
            }

            if (clearChat) {
              clearChat();
            }
          }}
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-start',
            width: '95%',
            padding: '6px 10px',
            color: '#888',
            backgroundColor: '#f5f5f5',
            border: 'none',
            borderRadius: 1,
            textTransform: 'none',
            fontSize: '0.75rem',
            fontWeight: 400,
            boxShadow: 'none',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: '#e8e8e8',
              color: '#555',
              transform: 'translateX(2px)',
              boxShadow: 'none',
              '& .MuiSvgIcon-root': {
                color: '#555',
              },
            },
          }}
        >
          Start New Plan
        </Button>
      </Box>

      <Divider sx={{ borderBottomWidth: 2, mb: 1, mt: 1 }} />

      {/* Plan Buttons */}
      <Box sx={{ overflowY: 'auto', maxHeight: '100%', mb: 1 }}>
        {plans.map((plan, index) => (
          <Box
            key={index}
            onClick={() => {
              setSelectedPlan(plan);
              onPlanClick && onPlanClick(plan);
            }}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              width: '95%',
              marginBottom: 0.8,
              padding: '8px 8px',
              color: '#555',
              backgroundColor: selectedPlan === plan ? '#fff3e0' : 'transparent',
              border: selectedPlan === plan ? '2px solid #c47c1eff' : '1px solid #ddd',
              borderRadius: 1,
              flexShrink: 0,
              cursor: 'pointer',
              opacity: animationTriggered ? 1 : 0,
              transform: animationTriggered ? 'translateY(0)' : 'translateY(10px)',
              transition: `all 0.3s ease-in-out ${index * 100}ms`,
              '&:hover': {
                backgroundColor: selectedPlan === plan ? '#ffe0b3' : '#e8e8e8',
                borderColor: selectedPlan === plan ? '#c47c1eff' : '#bbb',
                transform: 'translateX(4px)',
              },
            }}
          >
            {/* Plan title row */}
            <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
              <Button
                startIcon={
                  <FolderIcon
                    sx={{
                      fontSize: '1rem',
                      color: selectedPlan === plan ? '#c47c1eff' : '#666'
                    }}
                  />
                }
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  flex: 1,
                  padding: 0,
                  color: selectedPlan === plan ? '#c47c1eff' : 'inherit',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: 0,
                  textTransform: 'none',
                  fontSize: '0.875rem',
                  fontWeight: selectedPlan === plan ? 600 : 500,
                  minHeight: 'auto',
                  boxShadow: 'none',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    backgroundColor: 'transparent',
                    boxShadow: 'none',
                    '& .MuiSvgIcon-root': {
                      color: '#c47c1eff',
                    },
                  },
                  '& .MuiButton-startIcon': {
                    marginRight: 0.8,
                    marginLeft: 0,
                    flexShrink: 0,
                  },
                }}
              >
                {plan}
              </Button>
            </Box>

            {/* Action buttons row */}
            <Box
              sx={{
                display: 'flex',
                gap: 0.5,
                mt: 0.5,
                ml: '8px',
              }}
            >
              <Button
                onClick={e => {
                  e.stopPropagation();
                  console.log(`Save to plan: ${plan}`);
                }}
                sx={{
                  minWidth: 'auto',
                  padding: '3px 8px',
                  fontSize: '0.6rem',
                  backgroundColor: (isChatActive && selectedPlan === plan) ? '#c47c1eff' : '#ddd',
                  color: (isChatActive && selectedPlan === plan) ? 'white' : '#999',
                  border: 'none',
                  borderRadius: 1,
                  textTransform: 'none',
                  cursor: (isChatActive && selectedPlan === plan) ? 'pointer' : 'not-allowed',
                  '&:hover': {
                    backgroundColor: (isChatActive && selectedPlan === plan) ? '#b8691eff' : '#ddd',
                  },
                }}
                disabled={!isChatActive || selectedPlan !== plan}
              >
                Save
              </Button>

              <Button
                onClick={e => {
                  e.stopPropagation();
                  // Remove this plan from the list
                  setPlans(prev => prev.filter((_, i) => i !== index));
                }}
                sx={{
                  minWidth: 'auto',
                  padding: '3px 8px',
                  fontSize: '0.6rem',
                  backgroundColor: selectedPlan === plan ? '#d32f2f' : '#ddd',
                  color: selectedPlan === plan ? 'white' : '#999',
                  border: 'none',
                  borderRadius: 1,
                  textTransform: 'none',
                  cursor: selectedPlan === plan ? 'pointer' : 'not-allowed',
                  '&:hover': {
                    backgroundColor: selectedPlan === plan ? '#b71c1c' : '#ddd',
                  },
                }}
                disabled={selectedPlan !== plan}
              >
                Delete
              </Button>


            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}