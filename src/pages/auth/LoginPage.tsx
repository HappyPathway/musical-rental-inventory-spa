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
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AxiosError } from 'axios';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import FormInput from '../../components/ui/FormInput';
import StyledButton from '../../components/ui/StyledButton';
import useAuth from '../../hooks/useAuth';
import { colors } from '../../styles/theme';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get redirect path from location state or default to home
  const from = location.state?.from?.pathname || '/';
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    
    try {
      await login(username, password);
      navigate(from, { replace: true });
    } catch (err) {
      const error = err as AxiosError;
      if (error.response?.status === 401) {
        setError('Invalid username or password');
      } else {
        setError('Login failed. Please try again later.');
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
            Login to Your Account
          </Typography>
          
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 3,
                backgroundColor: 'rgba(194, 59, 35, 0.1)',
                border: `1px solid ${colors.danger}`,
                color: colors.danger
              }}
            >
              {error}
            </Alert>
          )}
          
          <Box component="form" onSubmit={handleSubmit}>
            <FormInput
              label="Username"
              fullWidth
              margin="normal"
              id="username"
              name="username"
              autoComplete="username"
              autoFocus
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            
            <FormInput
              label="Password"
              fullWidth
              margin="normal"
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      sx={{ color: colors.charcoalBlack }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            
            <StyledButton
              type="submit"
              fullWidth
              buttonVariant="primary"
              disabled={isLoading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </StyledButton>
            
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                mt: 2
              }}
            >
              <Typography 
                variant="body2" 
                component="span"
                sx={{ color: colors.offWhite }}
              >
                Don't have an account?{' '}
                <Link 
                  to="/register" 
                  style={{ 
                    color: colors.vuYellow,
                    textDecoration: 'none',
                    fontWeight: 600
                  }}
                >
                  Register
                </Link>
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default LoginPage;