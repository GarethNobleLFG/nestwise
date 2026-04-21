import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ForgotPassword from './components/ForgotPassword';
import Sitemark from './components/SitemarkIcon';

export default function SignIn() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [rememberMe, setRememberMe] = React.useState(false);
  const navigate = useNavigate();

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const API_BASE_URL = process.env.REACT_APP_USER_AUTH_URL;

  React.useEffect(() => {
    document.title = "NestWise - Sign In";
  }, []);

  const validateInputs = () => {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    let isValid = true;

    if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
      setEmailError(true);
      setEmailErrorMessage('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(false);
      setEmailErrorMessage('');
    }

    if (!password.value || password.value.length < 6) {
      setPasswordError(true);
      setPasswordErrorMessage('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(false);
      setPasswordErrorMessage('');
    }

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateInputs()) return;

    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const userData = {
      name: 'NestWise User',
      email: formData.get('email'),
      password: formData.get('password'),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/userauth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to sign in');
      }

      const data = await response.json();
      localStorage.setItem('token', data.access_token);

      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        navigate('/');
      }, 1500);

    } catch (error) {
      setIsLoading(false);
      console.error('Error signing in:', error.message);
      setEmailError(true);
      setEmailErrorMessage('Invalid email or password.');
    }
  };

  return (
    <div className="!min-h-screen !bg-gradient-to-br !from-slate-50 !to-gray-100 !flex !items-center !justify-center !p-4">
      
      {/* Success Overlay */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="!fixed !inset-0 !bg-black !bg-opacity-50 !flex !items-center !justify-center !z-50"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="!bg-white !rounded-2xl !p-8 !text-center !shadow-2xl"
            >
              <div className="!w-16 !h-16 !mx-auto !mb-4 !border-4 !border-t-transparent !rounded-full !animate-spin"
                   style={{ borderColor: '#FFD700 transparent transparent transparent' }}></div>
              <h3 className="!text-xl !font-bold !text-gray-900 !mb-2">Logging you in</h3>
              <p className="!text-gray-600">Redirecting to home page...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Sign In Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="!w-full !max-w-md lg:!max-w-4xl !bg-white !rounded-2xl !shadow-2xl !overflow-hidden"
      >
        
        {/* Desktop Layout */}
        <div className="!hidden lg:!flex !min-h-[80vh]">
          {/* Left Panel - Form */}
          <div className="!w-1/2 !p-8 xl:!p-12 !flex !flex-col !justify-center">
            <div className="!max-w-sm !mx-auto !w-full">
              
              {/* Header */}
              <div className="!mb-8">
                <Sitemark />
                <div className="!w-full !h-px !bg-gray-200 !my-6"></div>
                <h1 className="!text-3xl !font-bold !text-gray-900 !mb-2">Welcome back</h1>
                <p className="!text-gray-600">Sign in to your NestWise account</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="!space-y-6">
                <div>
                  <label htmlFor="email" className="!block !text-sm !font-medium !text-gray-700 !mb-2">
                    Email address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    placeholder="your@email.com"
                    className={`!w-full !px-4 !py-3 !border !rounded-xl !text-gray-900 !placeholder-gray-500 !transition-colors !duration-200 focus:!outline-none focus:!ring-2 focus:!border-transparent ${
                      emailError ? '!border-red-500 focus:!ring-red-500' : '!border-gray-300 focus:!ring-yellow-500'
                    }`}
                    style={{ 
                      '--tw-ring-color': emailError ? 'rgb(239 68 68)' : '#FFD700'
                    }}
                  />
                  {emailError && <p className="!mt-2 !text-sm !text-red-600">{emailErrorMessage}</p>}
                </div>

                <div>
                  <label htmlFor="password" className="!block !text-sm !font-medium !text-gray-700 !mb-2">
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    placeholder="••••••••"
                    className={`!w-full !px-4 !py-3 !border !rounded-xl !text-gray-900 !placeholder-gray-500 !transition-colors !duration-200 focus:!outline-none focus:!ring-2 focus:!border-transparent ${
                      passwordError ? '!border-red-500 focus:!ring-red-500' : '!border-gray-300 focus:!ring-yellow-500'
                    }`}
                    style={{ 
                      '--tw-ring-color': passwordError ? 'rgb(239 68 68)' : '#FFD700'
                    }}
                  />
                  {passwordError && <p className="!mt-2 !text-sm !text-red-600">{passwordErrorMessage}</p>}
                </div>

                <div className="!flex !items-center !justify-between">
                  <label className="!flex !items-center">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="!w-4 !h-4 !border-gray-300 !rounded focus:!ring-2"
                      style={{ 
                        accentColor: '#FFD700',
                        '--tw-ring-color': '#FFD700'
                      }}
                    />
                    <span className="!ml-2 !text-sm !text-gray-700">Remember me</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleClickOpen}
                    className="!text-sm !font-medium !transition-colors !duration-200"
                    style={{ color: '#c47c1eff' }}
                    onMouseEnter={(e) => e.target.style.color = '#FFD700'}
                    onMouseLeave={(e) => e.target.style.color = '#c47c1eff'}
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="!w-full !py-3 !px-4 !text-white !font-medium !rounded-xl !transition-all !duration-200 !disabled:opacity-50 !disabled:cursor-not-allowed !shadow-lg hover:!shadow-xl"
                  style={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #c47c1eff 100%)'
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading) {
                      e.target.style.background = 'linear-gradient(135deg, #FFA500 0%, #8B4513 100%)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.target.style.background = 'linear-gradient(135deg, #FFD700 0%, #c47c1eff 100%)';
                    }
                  }}
                >
                  {isLoading ? 'Signing in...' : 'Sign in'}
                </button>
              </form>

              {/* Footer */}
              <div className="!mt-8 !text-center">
                <p className="!text-sm !text-gray-600">
                  Don't have an account?{' '}
                  <button
                    onClick={() => navigate('/signup')}
                    className="!font-medium !transition-colors !duration-200"
                    style={{ color: '#c47c1eff' }}
                    onMouseEnter={(e) => e.target.style.color = '#FFD700'}
                    onMouseLeave={(e) => e.target.style.color = '#c47c1eff'}
                  >
                    Sign up
                  </button>
                </p>
              </div>

            </div>
          </div>

          {/* Right Panel - Branding */}
          <div className="!w-1/2 !p-8 xl:!p-12 !flex !flex-col !justify-center !items-center !text-white !relative !overflow-hidden"
               style={{
                 background: 'linear-gradient(145deg, #FFD700 0%, #FFA500 50%, #c47c1eff 100%)'
               }}>
            
            {/* Floating background elements */}
            <div className="!absolute !top-10 !right-10 !w-6 !h-6 !bg-white !bg-opacity-20 !rounded-full !animate-pulse"></div>
            <div className="!absolute !bottom-20 !left-10 !w-4 !h-4 !bg-white !bg-opacity-30 !rounded-full !animate-bounce"></div>
            
            <div className="!text-center !relative !z-10">
              <h2 className="!text-4xl !font-bold !mb-6">Start Your Financial Journey</h2>
              <p className="!text-xl !text-white !text-opacity-90 !leading-relaxed !mb-8">
                Join thousands of users who trust NestWise to secure their retirement future with AI-powered planning.
              </p>
              <div className="!space-y-4">
                <div className="!flex !items-center !justify-center !space-x-3">
                  <div className="!w-2 !h-2 !bg-white !rounded-full"></div>
                  <span className="!text-white !text-opacity-90">Personalized retirement strategies</span>
                </div>
                <div className="!flex !items-center !justify-center !space-x-3">
                  <div className="!w-2 !h-2 !bg-white !rounded-full"></div>
                  <span className="!text-white !text-opacity-90">AI-powered financial insights</span>
                </div>
                <div className="!flex !items-center !justify-center !space-x-3">
                  <div className="!w-2 !h-2 !bg-white !rounded-full"></div>
                  <span className="!text-white !text-opacity-90">Secure & private planning</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="!block lg:!hidden !p-6 !min-h-[90vh] !flex !flex-col !justify-center">
          
          {/* Header */}
          <div className="!mb-8 !text-center">
            <div className="!flex !justify-center !mb-6">
              <Sitemark />
            </div>
            <h1 className="!text-2xl sm:!text-3xl !font-bold !text-gray-900 !mb-2">Welcome back</h1>
            <p className="!text-gray-600">Sign in to continue your journey</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="!space-y-5">
            <div>
              <label htmlFor="mobile-email" className="!block !text-sm !font-medium !text-gray-700 !mb-2">
                Email address
              </label>
              <input
                id="mobile-email"
                name="email"
                type="email"
                autoComplete="email"
                required
                placeholder="your@email.com"
                className={`!w-full !px-4 !py-3 !border !rounded-xl !text-gray-900 !placeholder-gray-500 !text-base !transition-colors !duration-200 focus:!outline-none focus:!ring-2 focus:!border-transparent ${
                  emailError ? '!border-red-500 focus:!ring-red-500' : '!border-gray-300 focus:!ring-yellow-500'
                }`}
                style={{ 
                  '--tw-ring-color': emailError ? 'rgb(239 68 68)' : '#FFD700'
                }}
              />
              {emailError && <p className="!mt-2 !text-sm !text-red-600">{emailErrorMessage}</p>}
            </div>

            <div>
              <label htmlFor="mobile-password" className="!block !text-sm !font-medium !text-gray-700 !mb-2">
                Password
              </label>
              <input
                id="mobile-password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                placeholder="••••••••"
                className={`!w-full !px-4 !py-3 !border !rounded-xl !text-gray-900 !placeholder-gray-500 !text-base !transition-colors !duration-200 focus:!outline-none focus:!ring-2 focus:!border-transparent ${
                  passwordError ? '!border-red-500 focus:!ring-red-500' : '!border-gray-300 focus:!ring-yellow-500'
                }`}
                style={{ 
                  '--tw-ring-color': passwordError ? 'rgb(239 68 68)' : '#FFD700'
                }}
              />
              {passwordError && <p className="!mt-2 !text-sm !text-red-600">{passwordErrorMessage}</p>}
            </div>

            <div className="!flex !items-center !justify-between !text-sm">
              <label className="!flex !items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="!w-4 !h-4 !border-gray-300 !rounded focus:!ring-2"
                  style={{ 
                    accentColor: '#FFD700',
                    '--tw-ring-color': '#FFD700'
                  }}
                />
                <span className="!ml-2 !text-gray-700">Remember me</span>
              </label>
              <button
                type="button"
                onClick={handleClickOpen}
                className="!font-medium !transition-colors !duration-200"
                style={{ color: '#c47c1eff' }}
                onMouseEnter={(e) => e.target.style.color = '#FFD700'}
                onMouseLeave={(e) => e.target.style.color = '#c47c1eff'}
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="!w-full !py-4 !px-4 !text-white !font-medium !rounded-xl !text-base !transition-all !duration-200 !disabled:opacity-50 !disabled:cursor-not-allowed !shadow-lg hover:!shadow-xl"
              style={{
                background: 'linear-gradient(135deg, #FFD700 0%, #c47c1eff 100%)'
              }}
              onMouseEnter={(e) => {
                if (!isLoading) {
                  e.target.style.background = 'linear-gradient(135deg, #FFA500 0%, #8B4513 100%)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isLoading) {
                  e.target.style.background = 'linear-gradient(135deg, #FFD700 0%, #c47c1eff 100%)';
                }
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {/* Footer */}
          <div className="!mt-8 !text-center">
            <p className="!text-sm !text-gray-600">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/signup')}
                className="!font-medium !transition-colors !duration-200"
                style={{ color: '#c47c1eff' }}
                onMouseEnter={(e) => e.target.style.color = '#FFD700'}
                onMouseLeave={(e) => e.target.style.color = '#c47c1eff'}
              >
                Sign up
              </button>
            </p>
          </div>

        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <ForgotPassword open={open} handleClose={handleClose} />
    </div>
  );
}