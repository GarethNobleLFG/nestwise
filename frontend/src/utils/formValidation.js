// Form validation utilities for SignIn and SignUp pages
export const validateInputs = (fields, options = {}) => {
  let isValid = true;
  const errors = {};

  // Email validation
  if (fields.includes('email')) {
    const email = document.getElementById('email') || document.getElementById('mobile-email');
    if (!email?.value || !/\S+@\S+\.\S+/.test(email.value)) {
      errors.email = {
        hasError: true,
        message: 'Please enter a valid email address.'
      };
      isValid = false;
    } 
    else {
      errors.email = {
        hasError: false,
        message: ''
      };
    }
  }

  // Password validation
  if (fields.includes('password')) {
    const password = document.getElementById('password') || document.getElementById('mobile-password');
    const requireSpecialChar = options.requireSpecialChar || false;
    
    let passwordValid = true;
    let passwordMessage = '';

    if (!password?.value || password.value.length < 6) {
      passwordValid = false;
      passwordMessage = 'Password must be at least 6 characters long';
    } 
    else if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(password.value)) {
      passwordValid = false;
      passwordMessage = 'Password must be at least 6 characters long and include at least one special character.';
    }

    if (!passwordValid) {
      errors.password = {
        hasError: true,
        message: passwordMessage
      };
      isValid = false;
    } 
    else {
      errors.password = {
        hasError: false,
        message: ''
      };
    }
  }

  // Name validation (for signup)
  if (fields.includes('name')) {
    const name = document.getElementById('name') || document.getElementById('mobile-name');
    if (!name?.value || name.value.length < 1) {
      errors.name = {
        hasError: true,
        message: 'Name is required.'
      };
      isValid = false;
    } 
    else {
      errors.name = {
        hasError: false,
        message: ''
      };
    }
  }

  return { isValid, errors };
};