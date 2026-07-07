
export const validateEmail = (email) => {
  if (!email) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};


export const validateEmailDetailed = (email) => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  if (!validateEmail(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }
  return { isValid: true, error: '' };
};


export const validatePassword = (password, options = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
  } = options;

  if (!password || password.length < minLength) return false;
  
  if (requireUppercase && !/[A-Z]/.test(password)) return false;
  if (requireLowercase && !/[a-z]/.test(password)) return false;
  if (requireNumbers && !/[0-9]/.test(password)) return false;
  if (requireSpecialChars && !/[^a-zA-Z0-9]/.test(password)) return false;
  
  return true;
};


export const validatePasswordDetailed = (password, options = {}) => {
  const {
    minLength = 8,
    requireUppercase = true,
    requireLowercase = true,
    requireNumbers = true,
    requireSpecialChars = true,
  } = options;

  const errors = [];

  if (!password || password.length === 0) {
    errors.push('Password is required');
    return { isValid: false, errors };
  }

  if (password.length < minLength) {
    errors.push(`Password must be at least ${minLength} characters long`);
  }
  if (requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (requireNumbers && !/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  if (requireSpecialChars && !/[^a-zA-Z0-9]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};



export const getPasswordStrength = (password) => {
  if (!password) return 0;
  
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  
  return Math.min(score, 5);
};


export const getPasswordStrengthLabel = (score) => {
  const strengthMap = {
    0: { label: 'Very Weak', color: '#e74c3c' },
    1: { label: 'Weak', color: '#e67e22' },
    2: { label: 'Fair', color: '#f39c12' },
    3: { label: 'Good', color: '#3498db' },
    4: { label: 'Strong', color: '#2ecc71' },
    5: { label: 'Very Strong', color: '#27ae60' },
  };
  return strengthMap[score] || strengthMap[0];
};


export const validatePhone = (phone) => {
  if (!phone) return false;
  // Supports: (123) 456-7890, 123-456-7890, 123.456.7890, 1234567890, +1234567890
  const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/;
  return phoneRegex.test(phone);
};


export const validatePhoneDetailed = (phone) => {
  if (!phone) {
    return { isValid: false, error: 'Phone number is required' };
  }
  if (!validatePhone(phone)) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }
  return { isValid: true, error: '' };
};


export const formatPhoneNumber = (phone) => {
  if (!phone) return '';
  // Remove all non-numeric characters
  const cleaned = phone.replace(/\D/g, '');
  // Format as (XXX) XXX-XXXX
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
  }
  return phone;
};


export const validateName = (name, options = {}) => {
  const { minLength = 2, maxLength = 50, allowSpaces = true } = options;
  
  if (!name) return false;
  if (name.length < minLength) return false;
  if (name.length > maxLength) return false;
  if (!allowSpaces && name.includes(' ')) return false;
  
  // Only allow letters, spaces, hyphens, and apostrophes
  const nameRegex = /^[a-zA-Z\s\-']+$/;
  return nameRegex.test(name);
};

/**
 * Validate name with detailed error
 * @param {string} name - Name to validate
 * @param {string} fieldName - Name of the field (for error message)
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateNameDetailed = (name, fieldName = 'Name') => {
  if (!name) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  if (name.length < 2) {
    return { isValid: false, error: `${fieldName} must be at least 2 characters` };
  }
  if (name.length > 50) {
    return { isValid: false, error: `${fieldName} must be less than 50 characters` };
  }
  if (!/^[a-zA-Z\s\-']+$/.test(name)) {
    return { isValid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }
  return { isValid: true, error: '' };
};

// ==================== URL VALIDATORS ====================

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

/**
 * Validate URL with detailed error
 * @param {string} url - URL to validate
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateUrlDetailed = (url) => {
  if (!url) {
    return { isValid: false, error: 'URL is required' };
  }
  if (!validateUrl(url)) {
    return { isValid: false, error: 'Please enter a valid URL (e.g., https://example.com)' };
  }
  return { isValid: true, error: '' };
};

// ==================== NUMBER VALIDATORS ====================

/**
 * Validate if value is a number
 * @param {*} value - Value to check
 * @returns {boolean} - True if number, false otherwise
 */
export const isNumber = (value) => {
  return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Validate number range
 * @param {number} value - Number to validate
 * @param {object} options - Range options
 * @returns {boolean} - True if within range, false otherwise
 */
export const validateNumberRange = (value, options = {}) => {
  const { min, max, allowDecimal = true } = options;
  
  if (!isNumber(value)) return false;
  
  const num = parseFloat(value);
  if (min !== undefined && num < min) return false;
  if (max !== undefined && num > max) return false;
  if (!allowDecimal && !Number.isInteger(num)) return false;
  
  return true;
};

/**
 * Validate number with detailed error
 * @param {*} value - Value to validate
 * @param {object} options - Validation options
 * @param {string} fieldName - Name of the field
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateNumberDetailed = (value, options = {}, fieldName = 'Value') => {
  const { min, max, allowDecimal = true, required = true } = options;
  
  if (required && (value === undefined || value === null || value === '')) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (!isNumber(value)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }
  
  const num = parseFloat(value);
  if (min !== undefined && num < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min}` };
  }
  if (max !== undefined && num > max) {
    return { isValid: false, error: `${fieldName} must be at most ${max}` };
  }
  if (!allowDecimal && !Number.isInteger(num)) {
    return { isValid: false, error: `${fieldName} must be a whole number` };
  }
  
  return { isValid: true, error: '' };
};

// ==================== DATE VALIDATORS ====================

/**
 * Validate date
 * @param {string|Date} date - Date to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateDate = (date) => {
  if (!date) return false;
  const d = new Date(date);
  return d instanceof Date && !isNaN(d);
};

/**
 * Validate date is in the future
 * @param {string|Date} date - Date to validate
 * @returns {boolean} - True if future, false otherwise
 */
export const isFutureDate = (date) => {
  if (!validateDate(date)) return false;
  return new Date(date) > new Date();
};

/**
 * Validate date is in the past
 * @param {string|Date} date - Date to validate
 * @returns {boolean} - True if past, false otherwise
 */
export const isPastDate = (date) => {
  if (!validateDate(date)) return false;
  return new Date(date) < new Date();
};

/**
 * Validate date with detailed error
 * @param {string|Date} date - Date to validate
 * @param {object} options - Validation options
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateDateDetailed = (date, options = {}) => {
  const { required = true, future = false, past = false } = options;
  
  if (required && !date) {
    return { isValid: false, error: 'Date is required' };
  }
  
  if (!validateDate(date)) {
    return { isValid: false, error: 'Please enter a valid date' };
  }
  
  if (future && !isFutureDate(date)) {
    return { isValid: false, error: 'Date must be in the future' };
  }
  
  if (past && !isPastDate(date)) {
    return { isValid: false, error: 'Date must be in the past' };
  }
  
  return { isValid: true, error: '' };
};

// ==================== FORM VALIDATORS ====================

/**
 * Validate required field
 * @param {*} value - Value to check
 * @returns {boolean} - True if not empty, false otherwise
 */
export const isRequired = (value) => {
  if (value === undefined || value === null || value === '') return false;
  if (typeof value === 'string' && value.trim() === '') return false;
  if (Array.isArray(value) && value.length === 0) return false;
  if (typeof value === 'object' && Object.keys(value).length === 0) return false;
  return true;
};

/**
 * Validate required field with error message
 * @param {*} value - Value to check
 * @param {string} fieldName - Name of the field
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateRequired = (value, fieldName = 'This field') => {
  if (!isRequired(value)) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  return { isValid: true, error: '' };
};

/**
 * Validate length constraints
 * @param {string} value - String to validate
 * @param {object} options - Length options
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateLength = (value, options = {}) => {
  const { min, max, exact } = options;
  
  if (!value) return !min && !exact;
  
  const length = value.length;
  if (exact !== undefined && length !== exact) return false;
  if (min !== undefined && length < min) return false;
  if (max !== undefined && length > max) return false;
  
  return true;
};

/**
 * Validate length with detailed error
 * @param {string} value - String to validate
 * @param {object} options - Length options
 * @param {string} fieldName - Name of the field
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateLengthDetailed = (value, options = {}, fieldName = 'This field') => {
  const { min, max, exact, required = true } = options;
  
  if (required && !value) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (!value) return { isValid: true, error: '' };
  
  const length = value.length;
  if (exact !== undefined && length !== exact) {
    return { isValid: false, error: `${fieldName} must be exactly ${exact} characters` };
  }
  if (min !== undefined && length < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min} characters` };
  }
  if (max !== undefined && length > max) {
    return { isValid: false, error: `${fieldName} must be at most ${max} characters` };
  }
  
  return { isValid: true, error: '' };
};

// ==================== CAMPAIGN VALIDATORS ====================

/**
 * Validate campaign goal amount
 * @param {number} goal - Goal amount to validate
 * @param {object} options - Validation options
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateCampaignGoal = (goal, options = {}) => {
  const { min = 100, max = 10000000 } = options;
  
  if (!isNumber(goal)) {
    return { isValid: false, error: 'Please enter a valid amount' };
  }
  
  const amount = parseFloat(goal);
  if (amount < min) {
    return { isValid: false, error: `Minimum goal amount is $${min.toLocaleString()}` };
  }
  if (amount > max) {
    return { isValid: false, error: `Maximum goal amount is $${max.toLocaleString()}` };
  }
  
  return { isValid: true, error: '' };
};

/**
 * Validate campaign deadline
 * @param {string|Date} deadline - Deadline date to validate
 * @param {number} minDays - Minimum days from now
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateCampaignDeadline = (deadline, minDays = 7) => {
  if (!validateDate(deadline)) {
    return { isValid: false, error: 'Please select a valid date' };
  }
  
  const date = new Date(deadline);
  const now = new Date();
  const minDate = new Date(now.setDate(now.getDate() + minDays));
  
  if (date < minDate) {
    return { isValid: false, error: `Deadline must be at least ${minDays} days from now` };
  }
  
  return { isValid: true, error: '' };
};

// ==================== DONATION VALIDATORS ====================

/**
 * Validate donation amount
 * @param {number} amount - Donation amount to validate
 * @param {object} options - Validation options
 * @returns {object} - { isValid: boolean, error: string }
 */
export const validateDonationAmount = (amount, options = {}) => {
  const { min = 1, max = 100000 } = options;
  
  if (!isNumber(amount)) {
    return { isValid: false, error: 'Please enter a valid amount' };
  }
  
  const value = parseFloat(amount);
  if (value < min) {
    return { isValid: false, error: `Minimum donation is $${min}` };
  }
  if (value > max) {
    return { isValid: false, error: `Maximum donation is $${max.toLocaleString()}` };
  }
  
  return { isValid: true, error: '' };
};

// ==================== OBJECT VALIDATORS ====================

/**
 * Validate object has required keys
 * @param {object} obj - Object to validate
 * @param {string[]} requiredKeys - Array of required keys
 * @returns {boolean} - True if all keys exist, false otherwise
 */
export const validateObjectKeys = (obj, requiredKeys) => {
  if (!obj || typeof obj !== 'object') return false;
  return requiredKeys.every(key => key in obj && obj[key] !== undefined && obj[key] !== null);
};

/**
 * Validate object with detailed error
 * @param {object} obj - Object to validate
 * @param {string[]} requiredKeys - Array of required keys
 * @returns {object} - { isValid: boolean, missingKeys: string[] }
 */
export const validateObjectKeysDetailed = (obj, requiredKeys) => {
  if (!obj || typeof obj !== 'object') {
    return { isValid: false, missingKeys: requiredKeys };
  }
  
  const missingKeys = requiredKeys.filter(key => !(key in obj) || obj[key] === undefined || obj[key] === null);
  return {
    isValid: missingKeys.length === 0,
    missingKeys,
  };
};

// ==================== REGEX PATTERNS ====================

export const patterns = {
  // Basic patterns
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,9}$/,
  url: /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
  name: /^[a-zA-Z\s\-']+$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
  
  // Specific patterns
  zipCode: /^\d{5}(-\d{4})?$/,
  creditCard: /^\d{4}-\d{4}-\d{4}-\d{4}$/,
  hexColor: /^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/,
  ipv4: /^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/,
};

// ==================== COMPOSITE VALIDATORS ====================

/**
 * Validate entire form object
 * @param {object} data - Form data object
 * @param {object} validationRules - Validation rules
 * @returns {object} - { isValid: boolean, errors: object }
 */
export const validateForm = (data, validationRules) => {
  const errors = {};
  let isValid = true;

  Object.keys(validationRules).forEach((field) => {
    const rules = validationRules[field];
    const value = data[field];
    
    // Check each rule for the field
    for (const rule of rules) {
      const result = rule(value);
      if (!result.isValid) {
        errors[field] = result.error;
        isValid = false;
        break;
      }
    }
  });

  return { isValid, errors };
};

// ==================== EXPORT ALL ====================

export default {
  validateEmail,
  validateEmailDetailed,
  validatePassword,
  validatePasswordDetailed,
  getPasswordStrength,
  getPasswordStrengthLabel,
  validatePhone,
  validatePhoneDetailed,
  formatPhoneNumber,
  validateName,
  validateNameDetailed,
  validateUrl,
  validateUrlDetailed,
  isNumber,
  validateNumberRange,
  validateNumberDetailed,
  validateDate,
  isFutureDate,
  isPastDate,
  validateDateDetailed,
  isRequired,
  validateRequired,
  validateLength,
  validateLengthDetailed,
  validateCampaignGoal,
  validateCampaignDeadline,
  validateDonationAmount,
  validateObjectKeys,
  validateObjectKeysDetailed,
  validateForm,
  patterns,
};