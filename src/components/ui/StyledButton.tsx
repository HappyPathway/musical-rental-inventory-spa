import React from 'react';
import { Button, ButtonProps } from '@mui/material';
import { colors } from '../../styles/theme';
import { SxProps, Theme } from '@mui/system';

// Define button variant types
export type ButtonVariant = 'primary' | 'secondary' | 'outlined' | 'text';

// Props for our styled button component
export interface StyledButtonProps extends Omit<ButtonProps, 'variant'> {
  buttonVariant?: ButtonVariant;
}

// Create the styled button component
const StyledButton: React.FC<StyledButtonProps> = ({ 
  children, 
  buttonVariant = 'primary',
  sx,
  ...props 
}) => {
  // Base styles for all buttons
  const baseStyles: SxProps<Theme> = {
    borderRadius: (theme) => theme.shape.borderRadius,
    padding: '8px 20px',
    fontWeight: 600,
    position: 'relative',
    transition: 'all 0.3s ease',
    textTransform: 'none',
  };

  // Get variant-specific styles
  const getVariantStyles = (): SxProps<Theme> => {
    switch (buttonVariant) {
      case 'primary':
        return {
          bgcolor: colors.distressedRed,
          color: colors.offWhite,
          border: 'none',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          '&:hover': {
            bgcolor: '#A9331F', // Darker shade of distressed red
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          },
          '&.Mui-disabled': {
            bgcolor: 'rgba(194, 59, 35, 0.4)',
            color: 'rgba(240, 230, 210, 0.5)',
          },
        };
      case 'secondary':
        return {
          bgcolor: colors.vuYellow,
          color: colors.charcoalBlack,
          border: 'none',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
          '&:hover': {
            bgcolor: '#E6B84C', // Darker shade of VU yellow
            transform: 'translateY(-2px)',
            boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          },
          '&.Mui-disabled': {
            bgcolor: 'rgba(255, 206, 84, 0.4)',
            color: 'rgba(18, 18, 18, 0.5)',
          },
        };
      case 'outlined':
        return {
          bgcolor: 'transparent',
          color: colors.offWhite,
          border: 'none',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderRadius: (theme) => theme.shape.borderRadius,
            padding: 2, // Border thickness
            background: `linear-gradient(90deg, ${colors.distressedRed}, ${colors.vuYellow})`,
            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            pointerEvents: 'none',
          },
          '&:hover': {
            bgcolor: 'rgba(240, 230, 210, 0.05)',
            transform: 'translateY(-2px)',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
          },
          '&:active': {
            transform: 'translateY(0)',
            boxShadow: 'none',
          },
          '&.Mui-disabled': {
            color: 'rgba(240, 230, 210, 0.3)',
          },
        };
      case 'text':
        return {
          bgcolor: 'transparent',
          color: colors.offWhite,
          border: 'none',
          boxShadow: 'none',
          padding: '6px 12px',
          '&:hover': {
            bgcolor: 'rgba(240, 230, 210, 0.05)',
            color: colors.vuYellow,
          },
          '&:active': {
            bgcolor: 'rgba(240, 230, 210, 0.1)',
          },
          '&.Mui-disabled': {
            color: 'rgba(240, 230, 210, 0.3)',
          },
        };
      default:
        return {};
    }
  };

  // Combine all styles
  const combinedSx = {
    ...baseStyles,
    ...getVariantStyles(),
    ...sx, // Allow overrides through sx prop
  };

  return (
    <Button {...props} sx={combinedSx}>
      {children}
    </Button>
  );
};

export default StyledButton;