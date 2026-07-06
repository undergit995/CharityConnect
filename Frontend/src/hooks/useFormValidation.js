// hooks/useFormValidation.js
import { useState, useCallback } from 'react';

export const useFormValidation = (initialValues, validate) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    
    setValues(prev => ({
      ...prev,
      [name]: val,
    }));

    // Clear error for this field when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  }, [errors]);

  const handleBlur = useCallback((e) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true,
    }));

    // Validate on blur
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
    }
  }, [validate, values]);

  const handleSubmit = useCallback((callback) => (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);

    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      
      if (Object.keys(validationErrors).length === 0) {
        callback(values);
      }
    } else {
      callback(values);
    }
  }, [validate, values]);

  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);

  const setFieldValue = useCallback((name, value) => {
    setValues(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const setFieldError = useCallback((name, error) => {
    setErrors(prev => ({
      ...prev,
      [name]: error,
    }));
  }, []);

  const setFieldTouched = useCallback((name, isTouched = true) => {
    setTouched(prev => ({
      ...prev,
      [name]: isTouched,
    }));
  }, []);

  const validateField = useCallback((name) => {
    if (validate) {
      const validationErrors = validate(values);
      setErrors(validationErrors);
      return validationErrors[name] || '';
    }
    return '';
  }, [validate, values]);

  const getFieldError = useCallback((name) => {
    return errors[name] || '';
  }, [errors]);

  const isFieldTouched = useCallback((name) => {
    return touched[name] || false;
  }, [touched]);

  const isFieldValid = useCallback((name) => {
    return !errors[name];
  }, [errors]);

  const isFormValid = useCallback(() => {
    if (validate) {
      const validationErrors = validate(values);
      return Object.keys(validationErrors).length === 0;
    }
    return true;
  }, [validate, values]);

  const isFormDirty = useCallback(() => {
    return Object.keys(touched).length > 0;
  }, [touched]);

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldError,
    setFieldTouched,
    validateField,
    getFieldError,
    isFieldTouched,
    isFieldValid,
    isFormValid,
    isFormDirty,
    setValues,
    setErrors,
    setTouched,
  };
};

export default useFormValidation;