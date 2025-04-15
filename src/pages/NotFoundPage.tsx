import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { colors } from '../styles/theme';

const NotFoundPage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '80vh',
          textAlign: 'center',
          padding: 3,
        }}
      >
        <ErrorOutlineIcon 
          sx={{ 
            fontSize: 100, 
            color: colors.vuYellow,
            mb: 3
          }}
        />
        
        <Typography 
          variant="h1" 
          component="h1"
          sx={{
            fontSize: { xs: '4rem', md: '6rem' },
            fontWeight: 700,
            color: colors.offWhite,
            mb: 2
          }}
        >
          404
        </Typography>
        
        <Typography 
          variant="h4" 
          component="h2"
          sx={{
            mb: 2,
            color: colors.offWhite,
          }}
        >
          Page Not Found
        </Typography>
        
        <Typography 
          variant="body1"
          sx={{
            mb: 4,
            color: 'rgba(240, 230, 210, 0.7)',
            maxWidth: '600px'
          }}
        >
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </Typography>
        
        <Box 
          component={Link} 
          to="/"
          sx={{
            textDecoration: 'none',
            bgcolor: colors.distressedRed,
            color: colors.offWhite,
            px: 4,
            py: 1.5,
            borderRadius: 1,
            fontWeight: 'bold',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
            '&:hover': {
              bgcolor: '#a32e1c',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
              transition: 'all 0.3s ease'
            }
          }}
        >
          Return to Home
        </Box>
      </Box>
    </Container>
  );
};

export default NotFoundPage;