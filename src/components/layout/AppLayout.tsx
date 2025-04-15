import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { 
  AppBar, 
  Box, 
  Drawer, 
  IconButton, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Toolbar, 
  Typography,
  useMediaQuery,
  useTheme 
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { colors } from '../../styles/theme';

// Navigation items for different user roles
const publicNavItems = [
  { name: 'Home', path: '/', icon: <HomeIcon /> },
  { name: 'Login', path: '/login', icon: <PersonIcon /> },
];

const customerNavItems = [
  { name: 'Home', path: '/', icon: <HomeIcon /> },
  { name: 'Browse Equipment', path: '/inventory', icon: <InventoryIcon /> },
  { name: 'Profile', path: '/profile', icon: <PersonIcon /> },
];

const staffNavItems = [
  { name: 'Home', path: '/', icon: <HomeIcon /> },
  { name: 'Inventory', path: '/inventory', icon: <InventoryIcon /> },
  { name: 'Rentals', path: '/rentals', icon: <ShoppingCartIcon /> },
  { name: 'Payments', path: '/payments', icon: <PaymentIcon /> },
];

const AppLayout: React.FC = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { isAuthenticated, isStaff, logout } = useAuth();
  
  // Determine which navigation items to show based on user role
  let navItems = publicNavItems;
  if (isAuthenticated) {
    navItems = isStaff ? staffNavItems : customerNavItems;
    // Add logout for all authenticated users
    navItems = [...navItems, { name: 'Logout', path: '/logout', icon: <LogoutIcon /> }];
  }
  
  const handleNavItemClick = (path: string) => {
    if (path === '/logout') {
      logout();
    } else {
      navigate(path);
    }
    setDrawerOpen(false);
  };
  
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };
  
  const drawer = (
    <Box
      role="presentation"
      sx={{ 
        width: 250, 
        bgcolor: colors.charcoalBlack,
        height: '100%'
      }}
    >
      <Box
        sx={{
          height: 80,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: `1px solid ${colors.mutedGray}`,
        }}
      >
        <Typography 
          variant="h6" 
          component="div" 
          sx={{ 
            fontWeight: 'bold',
            color: colors.offWhite,
            textAlign: 'center' 
          }}
        >
          ROKNSOUND
        </Typography>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.name} disablePadding>
            <ListItemButton 
              onClick={() => handleNavItemClick(item.path)}
              sx={{
                '&:hover': {
                  backgroundColor: colors.mutedGray,
                  '& .MuiListItemIcon-root': {
                    color: colors.vuYellow,
                  },
                },
              }}
            >
              <ListItemIcon sx={{ color: colors.offWhite }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.name} 
                sx={{ color: colors.offWhite }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: theme.zIndex.drawer + 1,
          backgroundColor: colors.charcoalBlack,
          boxShadow: `0 2px 4px rgba(0,0,0,0.3)`,
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={toggleDrawer}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            ROKNSOUND Rental
          </Typography>
        </Toolbar>
      </AppBar>
      
      <Box component="nav">
        <Drawer
          variant={isMobile ? 'temporary' : 'permanent'}
          open={isMobile ? drawerOpen : true}
          onClose={toggleDrawer}
          ModalProps={{
            keepMounted: true, // Better mobile performance
          }}
          sx={{
            '& .MuiDrawer-paper': { 
              width: 250,
              boxSizing: 'border-box',
              backgroundColor: colors.charcoalBlack,
              borderRight: `1px solid ${colors.mutedGray}`,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          backgroundColor: colors.charcoalBlack,
          ml: isMobile ? 0 : '250px',
          pt: { xs: 9, sm: 9 }, // Top padding to account for AppBar
          overflow: 'auto',
          minHeight: 'calc(100vh - 64px)',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default AppLayout;