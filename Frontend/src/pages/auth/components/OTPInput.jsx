import React, { useState, useRef, useEffect } from 'react';
import { Box, TextField, InputAdornment } from '@mui/material';

const OTPInput = ({ length = 6, onComplete, disabled = false }) => {
  const [otp, setOtp] = useState(Array(length).fill(''));
  const inputRefs = useRef([]);

  useEffect(() => {
    if (otp.every(val => val !== '')) {
      onComplete(otp.join(''));
    }
  }, [otp, onComplete]);

  const handleChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    // Move to previous input on backspace if current is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    const pastedArray = pastedData.slice(0, length).split('');
    
    const newOtp = [...otp];
    pastedArray.forEach((char, index) => {
      if (index < length) {
        newOtp[index] = char;
      }
    });
    setOtp(newOtp);
    
    // Focus on last filled input
    const lastFilledIndex = Math.min(pastedArray.length, length - 1);
    inputRefs.current[lastFilledIndex].focus();
  };

  return (
    <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
      {otp.map((value, index) => (
        <TextField
          key={index}
          inputRef={el => inputRefs.current[index] = el}
          value={value}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          inputProps={{
            maxLength: 1,
            style: {
              textAlign: 'center',
              fontSize: '1.5rem',
              padding: '12px 8px',
            }
          }}
          sx={{
            width: 48,
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
            },
            '& .MuiOutlinedInput-input': {
              textAlign: 'center',
            }
          }}
        />
      ))}
    </Box>
  );
};

export default OTPInput;