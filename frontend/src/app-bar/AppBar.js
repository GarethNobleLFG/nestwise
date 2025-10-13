import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Drawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import ColorModeIconDropdown from '../shared-theme/ColorModeIconDropdown';
import Sitemark from './SitemarkIcon';
import { useNavigate } from 'react-router-dom';

const StyledToolbar = styled(Toolbar)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  borderRadius: `calc(${theme.shape.borderRadius}px + 8px)`,
  backdropFilter: 'blur(24px)',
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  backgroundColor: theme.vars
    ? `rgba(${theme.vars.palette.background.defaultChannel} / 0.4)`
    : alpha(theme.palette.background.default, 0.4),
  boxShadow: (theme.vars || theme).shadows[1],
  padding: '8px 12px',
}));

export default function AppBarComponent() {
  const [open, setOpen] = React.useState(false);
  const navigate = useNavigate();

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      enableColorOnDark
      sx={{
        boxShadow: 0,
        bgcolor: 'transparent',
        backgroundImage: 'none',
      }}
    >
      <Container maxWidth="lg">
        <StyledToolbar variant="dense" disableGutters>
          {/* Left side: Sitemark + buttons */}
          <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', px: 0 }}>
            <Sitemark />

            {/* Desktop navigation buttons evenly spaced */}
            <Box sx={{ display: { xs: 'none', md: 'flex' }, width: '100%' }}>
              <Button sx={{ flex: 1 }} variant="text" color="info" size="small" onClick={() => navigate('/plannerbot')}>
                Planner Bot
              </Button>
              <Button sx={{ flex: 1 }} variant="text" color="info" size="small" onClick={() => navigate('/myplans')}>
                My Plans
              </Button>
              <Button sx={{ flex: 1 }} variant="text" color="info" size="small" onClick={() => navigate('/testimonials')}>
                Testimonials
              </Button>
              <Button sx={{ flex: 1 }} variant="text" color="info" size="small" onClick={() => navigate('/faq')}>
                FAQ
              </Button>
            </Box>
          </Box>

          {/* Desktop buttons (commented out) */}
          {/*
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
            <Button color="primary" variant="text" size="small" onClick={() => navigate('/signin')}>
              Sign in
            </Button>
            <Button color="primary" variant="contained" size="small" onClick={() => navigate('/signup')}>
              Sign up
            </Button>
            <ColorModeIconDropdown />
          </Box>
          */}

          {/* Mobile drawer */}
          <Box sx={{ display: { xs: 'flex', md: 'none' }, gap: 1 }}>
            <ColorModeIconDropdown size="medium" />
            <IconButton aria-label="Menu button" onClick={toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>

            <Drawer
              anchor="top"
              open={open}
              onClose={toggleDrawer(false)}
              PaperProps={{ sx: { top: 0 } }} // drawer starts at top
            >
              <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <IconButton onClick={toggleDrawer(false)}>
                    <CloseRoundedIcon />
                  </IconButton>
                </Box>

                {/* Mobile menu items */}
                <MenuItem onClick={() => { navigate('/plannerbot'); setOpen(false); }}>Planner Bot</MenuItem>
                <MenuItem onClick={() => { navigate('/myplans'); setOpen(false); }}>My Plans</MenuItem>
                <MenuItem onClick={() => { navigate('/testimonials'); setOpen(false); }}>Testimonials</MenuItem>
                <MenuItem onClick={() => { navigate('/highlights'); setOpen(false); }}>Highlights</MenuItem>
                <MenuItem onClick={() => { navigate('/pricing'); setOpen(false); }}>Pricing</MenuItem>
                <MenuItem onClick={() => { navigate('/faq'); setOpen(false); }}>FAQ</MenuItem>
                <MenuItem onClick={() => { navigate('/blog'); setOpen(false); }}>Blog</MenuItem>

                <Divider sx={{ my: 3 }} />

                <MenuItem>
                  <Button
                    color="primary"
                    variant="contained"
                    fullWidth
                    onClick={() => { navigate('/signup'); setOpen(false); }}
                  >
                    Sign up
                  </Button>
                </MenuItem>
                <MenuItem>
                  <Button
                    color="primary"
                    variant="outlined"
                    fullWidth
                    onClick={() => { navigate('/signin'); setOpen(false); }}
                  >
                    Sign in
                  </Button>
                </MenuItem>
              </Box>
            </Drawer>
          </Box>
        </StyledToolbar>
      </Container>
    </AppBar>
  );
}
