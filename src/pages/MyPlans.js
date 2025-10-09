import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Button from '@mui/material/Button';
import AppTheme from '../shared-theme/AppTheme';
import AppBar from '../app-bar/AppBar';

export default function MyPlans() {
  const plans = ['Plan 1', 'Plan 2', 'Plan 3'];

  const financialData = [
    { label: 'Total Balance', value: '$45,000' },
    { label: 'Monthly Income', value: '$5,000' },
    { label: 'Monthly Expenses', value: '$3,200' },
    { label: 'Savings Rate', value: '15%' },
    { label: 'Investments', value: '$20,000' },
    { label: 'Debt', value: '$5,000' },
  ];

  const handlePlanClick = (plan) => {
    console.log('Clicked plan:', plan);
    // Implement navigation or other actions
  };

  return (
    <AppTheme>
      <CssBaseline />
      <AppBar />

      <Box sx={{ mt: 8, px: 2, width: '100%', display: 'flex', justifyContent: 'center' }}>
        <Box sx={{ width: '100%', maxWidth: 1200, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {/* Top: User Profile + Financial Data */}
          <Box
            sx={{
              p: 4,
              borderRadius: 3,
              bgcolor: 'grey.100',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
          >
            <Typography variant="h5" sx={{ mb: 2, textDecoration: 'underline' }}>
              John Doe
            </Typography>

            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                gap: 3,
              }}
            >
              {financialData.map((item, idx) => (
                <Box key={idx} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                    • {item.label}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {item.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>

          {/* Bottom: Plans */}
          <Box
            sx={{
              p: 4,
              borderRadius: 3,
              bgcolor: 'grey.100',
              boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            }}
          >
            <Typography variant="h6" sx={{ mb: 3 }}>
              Your Plans
            </Typography>
            <Divider sx={{ mb: 4 }} />

            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-around',
                gap: 3,
                flexWrap: 'wrap',
              }}
            >
              {plans.map((plan, idx) => (
                <Button
                  key={idx}
                  onClick={() => handlePlanClick(plan)}
                  sx={{
                    flex: '1 1 30%',
                    minWidth: 200,
                    height: 150,
                    bgcolor: 'primary.light',
                    color: 'primary.contrastText',
                    fontSize: '1.25rem',
                    fontWeight: 'bold',
                    borderRadius: 3,
                    boxShadow: 3,
                    '&:hover': { bgcolor: 'primary.main' },
                  }}
                >
                  {plan}
                </Button>
              ))}
            </Box>
          </Box>
        </Box>
      </Box>
    </AppTheme>
  );
}
