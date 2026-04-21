// Form validation utilities for SignIn and SignUp pages
export const validateInputs = (formData, fields, options = {}) => {
  let isValid = true;
  const errors = {};

  // Email validation
  if (fields.includes('email')) {
    const emailValue = formData.get('email');
    if (!emailValue || !/\S+@\S+\.\S+/.test(emailValue)) {
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
    const passwordValue = formData.get('password');
    const requireSpecialChar = options.requireSpecialChar || false;
    
    let passwordValid = true;
    let passwordMessage = '';

    if (!passwordValue || passwordValue.length < 6) {
      passwordValid = false;
      passwordMessage = 'Password must be at least 6 characters long';
    } 
    else if (requireSpecialChar && !/[!@#$%^&*(),.?":{}|<>]/.test(passwordValue)) {
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
    const nameValue = formData.get('name');
    if (!nameValue || nameValue.length < 1) {
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