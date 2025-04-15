import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Avatar, 
  Grid,
  TextField,
  Alert,
  Divider,
  CircularProgress
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import { useQuery } from 'react-query';
import useAuth from '../../hooks/useAuth';
import { colors } from '../../styles/theme';

const ProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // You would typically fetch more detailed user data here
  const { data: userDetails, isLoading } = useQuery(
    ['userProfile', user?.id],
    // This is a placeholder for the actual API call
    async () => {
      if (!user) return null;
      // Mock response for now
      return {
        ...user,
        phoneNumber: '555-123-4567',
        address: '123 Main Street',
        city: 'Music City',
        state: 'TN',
        zipCode: '37203',
        date_joined: new Date().toISOString() // Adding date_joined to match the User schema
      };
    },
    {
      enabled: !!user,
    }
  );

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress sx={{ color: colors.distressedRed }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          color: colors.offWhite,
          fontWeight: 'bold',
          mb: 4 
        }}
      >
        My Profile
      </Typography>

      {updateSuccess && (
        <Alert 
          severity="success" 
          sx={{ 
            mb: 3,
            backgroundColor: 'rgba(72, 207, 173, 0.1)',
            border: `1px solid ${colors.success}`,
            color: colors.success
          }}
          onClose={() => setUpdateSuccess(false)}
        >
          Profile updated successfully
        </Alert>
      )}

      {updateError && (
        <Alert 
          severity="error" 
          sx={{ 
            mb: 3,
            backgroundColor: 'rgba(194, 59, 35, 0.1)',
            border: `1px solid ${colors.danger}`,
            color: colors.danger
          }}
          onClose={() => setUpdateError(null)}
        >
          {updateError}
        </Alert>
      )}

      <Paper 
        elevation={3}
        sx={{ 
          p: 4, 
          bgcolor: colors.mutedGray,
          borderRadius: 2,
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${colors.distressedRed}, ${colors.vuYellow})`,
          },
        }}
      >
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            alignItems: { xs: 'center', sm: 'flex-start' },
            gap: 3,
            mb: 4
          }}
        >
          <Avatar 
            sx={{ 
              width: 100, 
              height: 100, 
              bgcolor: colors.distressedRed,
              boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
            }}
          >
            <PersonIcon sx={{ fontSize: 60 }} />
          </Avatar>
          
          <Box>
            <Typography 
              variant="h5" 
              component="h2" 
              sx={{ 
                color: colors.offWhite,
                fontWeight: 'bold' 
              }}
            >
              {userDetails?.first_name} {userDetails?.last_name}
            </Typography>
            
            <Typography 
              sx={{ 
                color: colors.vuYellow,
                fontWeight: 'medium',
                mb: 1
              }}
            >
              {userDetails?.is_staff ? 'Staff' : 'Customer'}
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(240, 230, 210, 0.7)'
              }}
            >
              Member since: {userDetails?.date_joined ? new Date(userDetails?.date_joined).toLocaleDateString() : 'N/A'}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 3, bgcolor: 'rgba(240, 230, 210, 0.1)' }} />
        
        <Box component="form" noValidate>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 2,
              color: colors.offWhite
            }}
          >
            Personal Information
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={userDetails?.first_name || ''}
                InputProps={{
                  readOnly: true,
                  sx: {
                    backgroundColor: '#FFFFFF',
                    color: colors.charcoalBlack,
                  }
                }}
                InputLabelProps={{
                  shrink: true,
                  sx: { color: colors.offWhite }
                }}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={userDetails?.last_name || ''}
                InputProps={{
                  readOnly: true,
                  sx: {
                    backgroundColor: '#FFFFFF',
                    color: colors.charcoalBlack,
                  }
                }}
                InputLabelProps={{
                  shrink: true,
                  sx: { color: colors.offWhite }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={userDetails?.email || ''}
                InputProps={{
                  readOnly: true,
                  sx: {
                    backgroundColor: '#FFFFFF',
                    color: colors.charcoalBlack,
                  }
                }}
                InputLabelProps={{
                  shrink: true,
                  sx: { color: colors.offWhite }
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phoneNumber"
                value={userDetails?.phoneNumber || ''}
                InputProps={{
                  readOnly: true,
                  sx: {
                    backgroundColor: '#FFFFFF',
                    color: colors.charcoalBlack,
                  }
                }}
                InputLabelProps={{
                  shrink: true,
                  sx: { color: colors.offWhite }
                }}
              />
            </Grid>
          </Grid>
          
          <Typography 
            variant="h6" 
            sx={{ 
              mt: 4,
              mb: 2,
              color: colors.offWhite
            }}
          >
            Address
          </Typography>
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                name="address"
                value={userDetails?.address || ''}
                InputProps={{
                  readOnly: true,
                  sx: {
                    backgroundColor: '#FFFFFF',
                    color: colors.charcoalBlack,
                  }
                }}
                InputLabelProps={{
                  shrink: true,
                  sx: { color: colors.offWhite }
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={userDetails?.city || ''}
                InputProps={{
                  readOnly: true,
                  sx: {
                    backgroundColor: '#FFFFFF',
                    color: colors.charcoalBlack,
                  }
                }}
                InputLabelProps={{
                  shrink: true,
                  sx: { color: colors.offWhite }
                }}
              />
            </Grid>
            
            <Grid item xs={6} md={4}>
              <TextField
                fullWidth
                label="State"
                name="state"
                value={userDetails?.state || ''}
                InputProps={{
                  readOnly: true,
                  sx: {
                    backgroundColor: '#FFFFFF',
                    color: colors.charcoalBlack,
                  }
                }}
                InputLabelProps={{
                  shrink: true,
                  sx: { color: colors.offWhite }
                }}
              />
            </Grid>
            
            <Grid item xs={6} md={4}>
              <TextField
                fullWidth
                label="ZIP Code"
                name="zipCode"
                value={userDetails?.zipCode || ''}
                InputProps={{
                  readOnly: true,
                  sx: {
                    backgroundColor: '#FFFFFF',
                    color: colors.charcoalBlack,
                  }
                }}
                InputLabelProps={{
                  shrink: true,
                  sx: { color: colors.offWhite }
                }}
              />
            </Grid>
          </Grid>

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Box
              component="button"
              type="button"
              sx={{
                border: 'none',
                cursor: 'pointer',
                px: 4, 
                py: 1.5,
                borderRadius: 1,
                backgroundColor: colors.distressedRed,
                color: colors.offWhite,
                fontWeight: 'bold',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  backgroundColor: '#a32e1c',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
                },
                '&:active': {
                  transform: 'translateY(0)',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                }
              }}
              onClick={() => {
                // In a real app, this would call an API endpoint
                alert('This feature is not implemented in the demo');
              }}
            >
              Edit Profile
            </Box>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProfilePage;