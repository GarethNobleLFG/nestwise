import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import InputLabel from '@mui/material/InputLabel';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Fade from '@mui/material/Fade';
import Slide from '@mui/material/Slide';
import Zoom from '@mui/material/Zoom';
import visuallyHidden from '@mui/utils/visuallyHidden';

export default function Hero() {
  const [checked, setChecked] = React.useState(false);

  // Trigger animations when component mounts
  React.useEffect(() => {
    setChecked(true);
  }, []);

  return (
    <Box
      id="hero"
      sx={(theme) => ({
        width: '100%',
        backgroundRepeat: 'no-repeat',
        backgroundImage:
          'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 90%), transparent)',
        ...theme.applyStyles('dark', {
          backgroundImage:
            'radial-gradient(ellipse 80% 50% at 50% -20%, hsl(210, 100%, 16%), transparent)',
        }),
      })}
    >
      <Container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: 14, sm: 20 },
          pb: { xs: 8, sm: 12 },
        }}
      >
        <Stack
          spacing={2}
          useFlexGap
          sx={{ alignItems: 'center', width: { xs: '100%', sm: '70%' } }}
        >
          {/* Large heading with slide animation */}
          <Slide direction="down" in={checked} timeout={1000}>
            <Typography
              variant="h1"
              sx={{
                fontSize: 'clamp(3rem, 10vw, 3.5rem)',
                textAlign: 'center',
                lineHeight: 1.2,
              }}
            >
              Welcome to{' '}
              <Typography
                variant="h1"
                component="span"
                sx={{
                  color: '#FFD700', // Gold for "Nest"
                }}
              >
                Nest
              </Typography>
              <Typography
                variant="h1"
                component="span"
                sx={{
                  color: '#c47c1eff', // Light Brown for "Wise"
                }}
              >
                Wise
              </Typography>
            </Typography>
          </Slide>

          {/* Subheading with fade animation */}
          <Fade in={checked} timeout={1500}>
            <Typography
              sx={{
                textAlign: 'center',
                color: 'text.secondary',
                width: { sm: '100%', md: '80%' },
              }}
            >
              Plan your retirement with confidence, building a secure future tailored to your goals. Get a personalized plan sent straight to your email!
            </Typography>
          </Fade>

          {/* Email input + button with zoom animation */}
          <Zoom in={checked} timeout={2000}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={1}
              useFlexGap
              sx={{ pt: 2, width: { xs: '100%', sm: '350px' } }}
            >
              <InputLabel htmlFor="email-hero" sx={visuallyHidden}>
                Email
              </InputLabel>
              <TextField
                id="email-hero"
                hiddenLabel
                size="small"
                variant="outlined"
                aria-label="Enter your email address"
                placeholder="Your email address"
                fullWidth
                slotProps={{
                  htmlInput: {
                    autoComplete: 'off',
                    'aria-label': 'Enter your email address',
                  },
                }}
              />
              <Button
                variant="contained"
                color="primary"
                size="small"
                sx={{ minWidth: 'fit-content' }}
              >
                Start now
              </Button>
            </Stack>
          </Zoom>

          {/* Terms and conditions with slide from bottom */}
          <Slide direction="up" in={checked} timeout={2500}>
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ textAlign: 'center' }}
            >
              By clicking &quot;Start now&quot; you agree to our&nbsp;
              <Link href="#" color="primary">
                Terms & Conditions
              </Link>
              .
            </Typography>
          </Slide>
        </Stack>
      </Container>
    </Box>
  );
}