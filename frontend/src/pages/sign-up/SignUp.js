import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sitemark from './components/SitemarkIcon';
import { validateInputs } from '../../utils/formValidation';

export default function SignUp() {
  const [emailError, setEmailError] = React.useState(false);
  const [emailErrorMessage, setEmailErrorMessage] = React.useState('');
  const [passwordError, setPasswordError] = React.useState(false);
  const [passwordErrorMessage, setPasswordErrorMessage] = React.useState('');
  const [nameError, setNameError] = React.useState(false);
  const [nameErrorMessage, setNameErrorMessage] = React.useState('');
  const [isLoading, setIsLoading] = React.useState(false);
  const [isSuccess, setIsSuccess] = React.useState(false);
  const [allowEmails, setAllowEmails] = React.useState(false);
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_USER_AUTH_URL;

  React.useEffect(() => {
    document.title = "NestWise - Sign Up";
  }, []);

  const handleValidation = () => {
    const { isValid, errors } = validateInputs(['name', 'email', 'password'], {
      requireSpecialChar: true
    });

    setNameError(errors.name?.hasError || false);
    setNameErrorMessage(errors.name?.message || '');
    setEmailError(errors.email?.hasError || false);
    setEmailErrorMessage(errors.email?.message || '');
    setPasswordError(errors.password?.hasError || false);
    setPasswordErrorMessage(errors.password?.message || '');

    return isValid;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!handleValidation()) return;

    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const userData = {
      name: formData.get('name'),
      email: formData.get('email'),
      password: formData.get('password'),
    };

    try {
      const response = await fetch(`${API_BASE_URL}/userauth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to sign up');
      }

      const result = await response.json();
      console.log('Sign up successful:', result);

      setIsLoading(false);
      setIsSuccess(true);

      setTimeout(() => {
        navigate('/signin');
      }, 1500);

    } catch (error) {
      setIsLoading(false);
      console.error('Error during sign up:', error.message);
      alert(`Sign up failed: ${error.message}`);
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
              <h3 className="!text-xl !font-bold !text-gray-900 !mb-2">Account Created Successfully!</h3>
              <p className="!text-gray-600">Redirecting to Sign In...</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Sign Up Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="!w-full !max-w-md lg:!max-w-5xl !bg-white !rounded-2xl !shadow-2xl !overflow-hidden"
      >

        {/* Desktop Layout */}
        <div className="!hidden lg:!flex !min-h-[85vh]">
          {/* Left Panel - Form */}
          <div className="!w-1/2 !p-8 xl:!p-12 !flex !flex-col !justify-center">
            <div className="!max-w-sm !mx-auto !w-full">

              {/* Header */}
              <div className="!mb-8">
                <Sitemark />
                <div className="!w-full !h-px !bg-gray-200 !my-6"></div>
                <h1 className="!text-3xl !font-bold !text-gray-900 !mb-2">Create your account</h1>
                <p className="!text-gray-600">Start your financial journey with NestWise</p>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="!space-y-5">
                <div>
                  <label htmlFor="name" className="!block !text-sm !font-medium !text-gray-700 !mb-2">
                    Full name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    required
                    placeholder="Jon Snow"
                    className={`!w-full !px-4 !py-3 !border !rounded-xl !text-gray-900 !placeholder-gray-500 !transition-colors !duration-200 focus:!outline-none focus:!ring-2 focus:!border-transparent ${nameError ? '!border-red-500 focus:!ring-red-500' : '!border-gray-300 focus:!ring-yellow-500'
                      }`}
                    style={{
                      '--tw-ring-color': nameError ? 'rgb(239 68 68)' : '#FFD700'
                    }}
                  />
                  {nameError && <p className="!mt-2 !text-sm !text-red-600">{nameErrorMessage}</p>}
                </div>

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
                    className={`!w-full !px-4 !py-3 !border !rounded-xl !text-gray-900 !placeholder-gray-500 !transition-colors !duration-200 focus:!outline-none focus:!ring-2 focus:!border-transparent ${emailError ? '!border-red-500 focus:!ring-red-500' : '!border-gray-300 focus:!ring-yellow-500'
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
                    autoComplete="new-password"
                    required
                    placeholder="••••••••"
                    className={`!w-full !px-4 !py-3 !border !rounded-xl !text-gray-900 !placeholder-gray-500 !transition-colors !duration-200 focus:!outline-none focus:!ring-2 focus:!border-transparent ${passwordError ? '!border-red-500 focus:!ring-red-500' : '!border-gray-300 focus:!ring-yellow-500'
                      }`}
                    style={{
                      '--tw-ring-color': passwordError ? 'rgb(239 68 68)' : '#FFD700'
                    }}
                  />
                  {passwordError && <p className="!mt-2 !text-sm !text-red-600">{passwordErrorMessage}</p>}
                  <p className="!mt-1 !text-xs !text-gray-500">Must include at least one special character</p>
                </div>

                <div className="!flex !items-start">
                  <input
                    type="checkbox"
                    checked={allowEmails}
                    onChange={(e) => setAllowEmails(e.target.checked)}
                    className="!w-4 !h-4 !mt-1 !border-gray-300 !rounded focus:!ring-2"
                    style={{
                      accentColor: '#FFD700',
                      '--tw-ring-color': '#FFD700'
                    }}
                  />
                  <span className="!ml-2 !text-sm !text-gray-700">I want to receive updates via email</span>
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
                  {isLoading ? 'Creating account...' : 'Sign up'}
                </button>
              </form>

              {/* Footer */}
              <div className="!mt-8 !text-center">
                <p className="!text-sm !text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => navigate('/signin')}
                    className="!font-medium !transition-colors !duration-200"
                    style={{ color: '#c47c1eff' }}
                    onMouseEnter={(e) => e.target.style.color = '#FFD700'}
                    onMouseLeave={(e) => e.target.style.color = '#c47c1eff'}
                  >
                    Sign in
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
            <div className="!absolute !top-1/3 !left-8 !w-3 !h-3 !bg-white !bg-opacity-25 !rounded-full !animate-ping"></div>

            <div className="!text-center !relative !z-10">
              <h2 className="!text-4xl !font-bold !mb-6">Join NestWise Today</h2>
              <p className="!text-xl !text-white !text-opacity-90 !leading-relaxed !mb-8">
                Take control of your financial future with personalized retirement planning powered by AI.
              </p>
              <div className="!space-y-4">
                <div className="!flex !items-center !justify-center !space-x-3">
                  <div className="!w-2 !h-2 !bg-white !rounded-full"></div>
                  <span className="!text-white !text-opacity-90">Free to get started</span>
                </div>
                <div className="!flex !items-center !justify-center !space-x-3">
                  <div className="!w-2 !h-2 !bg-white !rounded-full"></div>
                  <span className="!text-white !text-opacity-90">Secure & private data</span>
                </div>
                <div className="!flex !items-center !justify-center !space-x-3">
                  <div className="!w-2 !h-2 !bg-white !rounded-full"></div>
                  <span className="!text-white !text-opacity-90">Expert guidance & insights</span>
                </div>
                <div className="!flex !items-center !justify-center !space-x-3">
                  <div className="!w-2 !h-2 !bg-white !rounded-full"></div>
                  <span className="!text-white !text-opacity-90">Download your plans as PDFs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Layout */}
        <div className="!block lg:!hidden !p-6 !min-h-[95vh] !flex !flex-col !justify-center">

          {/* Header */}
          <div className="!mb-8 !text-center">
            <div className="!flex !justify-center !mb-6">
              <Sitemark />
            </div>
            <h1 className="!text-2xl sm:!text-3xl !font-bold !text-gray-900 !mb-2">Create your account</h1>
            <p className="!text-gray-600">Start your financial journey today</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="!space-y-4">
            <div>
              <label htmlFor="mobile-name" className="!block !text-sm !font-medium !text-gray-700 !mb-2">
                Full name
              </label>
              <input
                id="mobile-name"
                name="name"
                type="text"
                autoComplete="name"
                required
                placeholder="Jon Snow"
                className={`!w-full !px-4 !py-3 !border !rounded-xl !text-gray-900 !placeholder-gray-500 !text-base !transition-colors !duration-200 focus:!outline-none focus:!ring-2 focus:!border-transparent ${nameError ? '!border-red-500 focus:!ring-red-500' : '!border-gray-300 focus:!ring-yellow-500'
                  }`}
                style={{
                  '--tw-ring-color': nameError ? 'rgb(239 68 68)' : '#FFD700'
                }}
              />
              {nameError && <p className="!mt-2 !text-sm !text-red-600">{nameErrorMessage}</p>}
            </div>

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
                className={`!w-full !px-4 !py-3 !border !rounded-xl !text-gray-900 !placeholder-gray-500 !text-base !transition-colors !duration-200 focus:!outline-none focus:!ring-2 focus:!border-transparent ${emailError ? '!border-red-500 focus:!ring-red-500' : '!border-gray-300 focus:!ring-yellow-500'
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
                autoComplete="new-password"
                required
                placeholder="••••••••"
                className={`!w-full !px-4 !py-3 !border !rounded-xl !text-gray-900 !placeholder-gray-500 !text-base !transition-colors !duration-200 focus:!outline-none focus:!ring-2 focus:!border-transparent ${passwordError ? '!border-red-500 focus:!ring-red-500' : '!border-gray-300 focus:!ring-yellow-500'
                  }`}
                style={{
                  '--tw-ring-color': passwordError ? 'rgb(239 68 68)' : '#FFD700'
                }}
              />
              {passwordError && <p className="!mt-2 !text-sm !text-red-600">{passwordErrorMessage}</p>}
              <p className="!mt-1 !text-xs !text-gray-500">Must include at least one special character</p>
            </div>

            <div className="!flex !items-start !pt-2">
              <input
                type="checkbox"
                checked={allowEmails}
                onChange={(e) => setAllowEmails(e.target.checked)}
                className="!w-4 !h-4 !mt-1 !border-gray-300 !rounded focus:!ring-2"
                style={{
                  accentColor: '#FFD700',
                  '--tw-ring-color': '#FFD700'
                }}
              />
              <span className="!ml-2 !text-sm !text-gray-700">I want to receive updates via email</span>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="!w-full !py-4 !px-4 !text-white !font-medium !rounded-xl !text-base !transition-all !duration-200 !disabled:opacity-50 !disabled:cursor-not-allowed !shadow-lg hover:!shadow-xl !mt-6"
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
              {isLoading ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          {/* Footer */}
          <div className="!mt-8 !text-center">
            <p className="!text-sm !text-gray-600">
              Already have an account?{' '}
              <button
                onClick={() => navigate('/signin')}
                className="!font-medium !transition-colors !duration-200"
                style={{ color: '#c47c1eff' }}
                onMouseEnter={(e) => e.target.style.color = '#FFD700'}
                onMouseLeave={(e) => e.target.style.color = '#c47c1eff'}
              >
                Sign in
              </button>
            </p>
          </div>

        </div>
      </motion.div>
    </div>
  );
}