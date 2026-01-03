/**
 * Form validation utilities for Haki Yetu application
 */

/**
 * Email validation
 * @param {string} email - Email to validate
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, message: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    return { isValid: false, message: 'Please enter a valid email address' };
  }

  return { isValid: true, message: '' };
};

/**
 * Password validation
 * @param {string} password - Password to validate
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validatePassword = (password) => {
  if (!password || typeof password !== 'string') {
    return { isValid: false, message: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }

  // Check for at least one uppercase letter, one lowercase letter, and one number
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);

  if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
    return {
      isValid: false,
      message: 'Password must contain at least one uppercase letter, one lowercase letter, and one number'
    };
  }

  return { isValid: true, message: '' };
};

/**
 * Phone number validation (Kenyan format)
 * @param {string} phone - Phone number to validate
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, message: 'Phone number is required' };
  }

  // Remove spaces, hyphens, and parentheses
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, '');

  // Kenyan phone number patterns
  const kenyaRegex = /^(\+254|254|0)(7|1)[0-9]{8}$/;

  if (!kenyaRegex.test(cleanPhone)) {
    return { isValid: false, message: 'Please enter a valid Kenyan phone number' };
  }

  return { isValid: true, message: '' };
};

/**
 * Required field validation
 * @param {any} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (value === null || value === undefined || value === '') {
    return { isValid: false, message: `${fieldName} is required` };
  }

  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, message: `${fieldName} is required` };
  }

  if (Array.isArray(value) && value.length === 0) {
    return { isValid: false, message: `${fieldName} is required` };
  }

  return { isValid: true, message: '' };
};

/**
 * Name validation
 * @param {string} name - Name to validate
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validateName = (name) => {
  const required = validateRequired(name, 'Name');
  if (!required.isValid) return required;

  if (name.trim().length < 2) {
    return { isValid: false, message: 'Name must be at least 2 characters long' };
  }

  if (name.trim().length > 50) {
    return { isValid: false, message: 'Name must be less than 50 characters' };
  }

  // Allow only letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  if (!nameRegex.test(name.trim())) {
    return { isValid: false, message: 'Name can only contain letters, spaces, hyphens, and apostrophes' };
  }

  return { isValid: true, message: '' };
};

/**
 * Date of birth validation
 * @param {string|Date} dob - Date of birth to validate
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validateDateOfBirth = (dob) => {
  const required = validateRequired(dob, 'Date of birth');
  if (!required.isValid) return required;

  const dobDate = new Date(dob);
  if (isNaN(dobDate.getTime())) {
    return { isValid: false, message: 'Please enter a valid date' };
  }

  const today = new Date();
  const age = today.getFullYear() - dobDate.getFullYear();

  if (age < 18) {
    return { isValid: false, message: 'You must be at least 18 years old' };
  }

  if (age > 120) {
    return { isValid: false, message: 'Please enter a valid date of birth' };
  }

  return { isValid: true, message: '' };
};

/**
 * File validation
 * @param {File} file - File to validate
 * @param {Object} options - Validation options
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 5 * 1024 * 1024, // 5MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'],
    required = false
  } = options;

  if (!required && !file) {
    return { isValid: true, message: '' };
  }

  if (required && !file) {
    return { isValid: false, message: 'File is required' };
  }

  if (file.size > maxSize) {
    return { isValid: false, message: `File size must be less than ${maxSize / (1024 * 1024)}MB` };
  }

  if (!allowedTypes.includes(file.type)) {
    return { isValid: false, message: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}` };
  }

  return { isValid: true, message: '' };
};

/**
 * Form validation helper
 * @param {Object} formData - Form data object
 * @param {Object} validationRules - Validation rules object
 * @returns {Object} { isValid: boolean, errors: Object }
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach(field => {
    const rule = validationRules[field];
    const value = formData[field];

    if (typeof rule === 'function') {
      const result = rule(value);
      if (!result.isValid) {
        errors[field] = result.message;
        isValid = false;
      }
    }
  });

  return { isValid, errors };
};

/**
 * LSK Number validation (Law Society of Kenya)
 * @param {string} lskNumber - LSK number to validate
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validateLSKNumber = (lskNumber) => {
  const required = validateRequired(lskNumber, 'LSK Number');
  if (!required.isValid) return required;

  // LSK numbers typically follow format like P.105/1234/2023
  const lskRegex = /^P\.\d{1,3}\/\d{1,4}\/\d{4}$/;
  if (!lskRegex.test(lskNumber.trim())) {
    return { isValid: false, message: 'Please enter a valid LSK number (format: P.XXX/YYYY/ZZZZ)' };
  }

  return { isValid: true, message: '' };
};

/**
 * Kenyan ID Number validation
 * @param {string} idNumber - ID number to validate
 * @returns {Object} { isValid: boolean, message: string }
 */
export const validateKenyanID = (idNumber) => {
  const required = validateRequired(idNumber, 'ID Number');
  if (!required.isValid) return required;

  // Remove spaces
  const cleanId = idNumber.replace(/\s/g, '');

  // Kenyan ID is typically 8 digits
  if (!/^\d{8}$/.test(cleanId)) {
    return { isValid: false, message: 'Kenyan ID must be 8 digits' };
  }

  return { isValid: true, message: '' };
};
