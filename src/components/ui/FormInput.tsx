import React from 'react';
import { TextField, TextFieldProps, styled } from '@mui/material';
import { colors } from '../../styles/theme';

// Styled TextField with ROKNSOUND design guidelines
const StyledTextField = styled(TextField)<TextFieldProps>(({ theme }) => ({
  '& .MuiInputBase-root': {
    backgroundColor: '#FFFFFF',
    borderRadius: theme.shape.borderRadius,
    color: colors.charcoalBlack,
    position: 'relative',
    overflow: 'hidden',
    transition: 'box-shadow 0.3s ease',
    
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      borderRadius: theme.shape.borderRadius,
      padding: 2, // Border thickness
      background: `linear-gradient(90deg, ${colors.distressedRed}, ${colors.vuYellow})`,
      WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
      WebkitMaskComposite: 'xor',
      maskComposite: 'exclude',
      pointerEvents: 'none',
    },
    
    '&:hover': {
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    },
    
    '&.Mui-focused': {
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
      
      '&::before': {
        background: `linear-gradient(90deg, ${colors.vuYellow}, ${colors.distressedRed})`,
      },
    },
  },
  
  '& .MuiInputBase-input': {
    padding: '12px 16px',
    '&::placeholder': {
      color: 'rgba(18, 18, 18, 0.6)',
      opacity: 1,
    },
  },
  
  '& .MuiInputLabel-root': {
    color: colors.offWhite,
    
    '&.Mui-focused': {
      color: colors.vuYellow,
    },
  },
  
  '& .MuiInputAdornment-root': {
    color: colors.charcoalBlack,
  },
  
  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none', // Remove default border as we're using the pseudo-element for border
  },
  
  '& .MuiFormHelperText-root': {
    marginLeft: 1,
    color: 'rgba(240, 230, 210, 0.6)',
    
    '&.Mui-error': {
      color: colors.danger,
    },
  },
  
  '&.Mui-error .MuiInputBase-root::before': {
    background: colors.danger,
  },
  
  '& .MuiSelect-select': {
    backgroundColor: '#FFFFFF',
  },
}));

// Form input component with ROKNSOUND styling
const FormInput: React.FC<TextFieldProps> = (props) => {
  return <StyledTextField {...props} />;
};

export default FormInput;