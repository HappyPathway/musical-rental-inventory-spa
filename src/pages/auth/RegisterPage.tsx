import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Card, 
  CardContent, 
  Alert,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AxiosError } from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import FormInput from '../../components/ui/FormInput';
import StyledButton from '../../components/ui/StyledButton';
import useAuth from '../../hooks/useAuth';
import { colors } from '../../styles/theme';

const RegisterPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await register({
        username,
        email,
        password,
        first_name: '',
        last_name: ''
      });
      navigate('/login', { state: { registered: true } });
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 400) {
        setError('Registration failed. Username or email may already be in use.');
      } else {
        setError('Registration failed. Please try again later.');
      }
      setIsLoading(false);
    }
  };
  
  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  return (
    <Container 
      maxWidth="sm" 
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        px: { xs: 2, sm: 3 },
        backgroundColor: colors.charcoalBlack
      }}
    >
      <Box 
        sx={{ 
          mb: 4, 
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Box 
          sx={{
            borderRadius: '50%',
            backgroundColor: colors.distressedRed,
            width: 60,
            height: 60,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mb: 2,
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)'
          }}
        >
          <MusicNoteIcon sx={{ fontSize: 40, color: colors.offWhite }} />
        </Box>
        <Typography 
          component="h1" 
          variant="h4" 
          sx={{ 
            fontWeight: 700, 
            color: colors.offWhite,
            mb: 1
          }}
        >
          ROKNSOUND
        </Typography>
        <Typography 
          component="p" 
          sx={{ 
            color: colors.vuYellow,
            fontWeight: 500
          }}
        >
          Musical Rental Inventory
        </Typography>
      </Box>

      <Card 
        sx={{ 
          width: '100%',
          borderRadius: 2,
          backgroundColor: colors.mutedGray,
          boxShadow: '0 8px 16px rgba(0,0,0,0.4)',
          position: 'relative',
          overflow: 'visible',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${colors.distressedRed}, ${colors.vuYellow})`,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
          },
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
          <Typography 
            variant="h5" 
            component="h2" 
            sx={{ 
              mb: 3, 
              textAlign: 'center',
              color: colors.offWhite,
              fontWeight: 600
            }}
          >
            Create an Account
          </Typography>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                backgroundColor: 'rgba(194, 59, 35, 0.1)',
                color: colors.distressedRed,
                '& .MuiAlert-icon': {
                  color: colors.distressedRed
                }
              }}
            >
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <FormInput
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
            />
            
            <FormInput
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              type="email"
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isLoading}
            />
            
            <FormInput
              required
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      sx={{ color: colors.offWhite }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <FormInput
              required
              fullWidth
              name="confirmPassword"
              label="Confirm Password"
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              margin="normal"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      sx={{ color: colors.offWhite }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
            
            <StyledButton
              type="submit"
              fullWidth
              buttonVariant="primary"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading ? 'Creating Account...' : 'Register'}
            </StyledButton>
            
            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: colors.offWhite,
                  '& a': {
                    color: colors.vuYellow,
                    textDecoration: 'none',
                    fontWeight: 500,
                    '&:hover': {
                      textDecoration: 'underline'
                    }
                  }
                }}
              >
                Already have an account?{' '}
                <Link to="/login">
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default RegisterPage;