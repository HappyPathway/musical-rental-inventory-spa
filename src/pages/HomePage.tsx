import React from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  useMediaQuery,
  useTheme,
  IconButton,
  Divider
} from '@mui/material';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import InventoryIcon from '@mui/icons-material/Inventory';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import PaymentIcon from '@mui/icons-material/Payment';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { getEquipment, Equipment } from '../api/inventory';
import EquipmentCard from '../components/ui/EquipmentCard';
import StyledButton from '../components/ui/StyledButton';
import useAuth from '../hooks/useAuth';
import { colors } from '../styles/theme';

// Interface for the EquipmentCard component's expected format
interface EquipmentItem {
  id: number;
  name: string;
  daily_rate: number;
  image_url: string | null;
  status: string;
  category: {
    id: number;
    name: string;
  };
  brand: string;
  model: string;
  in_stock: number;
}

const HomePage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { isAuthenticated, isStaff } = useAuth();
  
  // Get featured equipment (newest items or items marked as featured)
  const { data: equipment } = useQuery('featuredEquipment', () => 
    getEquipment({ limit: 8 })
  );

  // Convert API Equipment objects to EquipmentItem format expected by EquipmentCard
  const mapEquipmentToCardFormat = (item: Equipment): EquipmentItem => {
    return {
      id: item.id,
      name: item.name,
      daily_rate: item.rental_price_daily,
      image_url: null, // API doesn't provide image URL, use default
      status: item.status,
      category: {
        id: item.category_id,
        name: item.category_id.toString(), // We don't have category name in the API response
      },
      brand: item.brand,
      model: item.model_number || '',
      in_stock: item.quantity,
    };
  };

  // Extract items from PaginatedResponse, map to EquipmentItem format, and limit to first 4
  const featuredEquipment = equipment?.items?.slice(0, 4).map(mapEquipmentToCardFormat);
  
  // Navigation cards based on user role
  const getNavigationCards = () => {
    if (isStaff) {
      return [
        {
          title: 'Manage Inventory',
          description: 'Add, update, or remove equipment from inventory.',
          icon: <InventoryIcon fontSize="large" sx={{ color: colors.vuYellow }} />,
          path: '/inventory'
        },
        {
          title: 'Process Rentals',
          description: 'Create new rentals or manage existing ones.',
          icon: <ShoppingCartIcon fontSize="large" sx={{ color: colors.vuYellow }} />,
          path: '/rentals'
        },
        {
          title: 'Handle Payments',
          description: 'Process payments and manage transactions.',
          icon: <PaymentIcon fontSize="large" sx={{ color: colors.vuYellow }} />,
          path: '/payments'
        }
      ];
    }
    
    return [
      {
        title: 'Browse Equipment',
        description: 'Explore our wide range of musical equipment.',
        icon: <InventoryIcon fontSize="large" sx={{ color: colors.vuYellow }} />,
        path: '/inventory'
      },
      {
        title: 'My Rentals',
        description: 'View your active and past rental history.',
        icon: <ShoppingCartIcon fontSize="large" sx={{ color: colors.vuYellow }} />,
        path: isAuthenticated ? '/rentals' : '/login'
      },
      {
        title: 'My Account',
        description: 'Manage your account settings and profile.',
        icon: <PaymentIcon fontSize="large" sx={{ color: colors.vuYellow }} />,
        path: isAuthenticated ? '/profile' : '/login'
      }
    ];
  };

  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{
          py: { xs: 6, md: 10 },
          px: { xs: 2, md: 4 },
          mb: 6,
          backgroundColor: colors.charcoalBlack,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 2,
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${colors.distressedRed}, ${colors.vuYellow})`,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '100px',
            background: 'linear-gradient(to top, rgba(18, 18, 18, 0.8), rgba(18, 18, 18, 0))',
            zIndex: 1,
          }
        }}
      >
        <Container maxWidth="md">
          <Typography 
            variant="h2" 
            component="h1"
            sx={{ 
              color: colors.offWhite,
              fontWeight: 700,
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' }
            }}
          >
            ROKNSOUND
          </Typography>
          
          <Typography 
            variant="h5"
            sx={{ 
              color: colors.vuYellow,
              fontWeight: 500,
              mb: 3,
              fontSize: { xs: '1.25rem', md: '1.5rem' }
            }}
          >
            Musical Rental Inventory System
          </Typography>
          
          <Typography 
            variant="body1"
            sx={{ 
              color: colors.offWhite,
              mb: 4,
              maxWidth: '700px',
              mx: 'auto',
              opacity: 0.8
            }}
          >
            Browse our extensive collection of high-quality musical equipment available for rent.
            From guitars and amps to professional sound systems, we've got everything you need.
          </Typography>
          
          <Box 
            sx={{
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              flexWrap: 'wrap',
              position: 'relative',
              zIndex: 2
            }}
          >
            <StyledButton 
              buttonVariant="primary" 
              size="large"
              onClick={() => navigate('/inventory')}
            >
              Browse Equipment
            </StyledButton>
            
            {!isAuthenticated && (
              <StyledButton 
                buttonVariant="outlined" 
                size="large"
                onClick={() => navigate('/login')}
              >
                Login / Register
              </StyledButton>
            )}
          </Box>
        </Container>
      </Box>
      
      {/* Quick Navigation Cards */}
      <Container maxWidth="lg">
        <Typography 
          variant="h4" 
          component="h2"
          sx={{ 
            mb: 3, 
            color: colors.offWhite,
            fontWeight: 600
          }}
        >
          Quick Navigation
        </Typography>
        
        <Grid container spacing={3} mb={6}>
          {getNavigationCards().map((card, index) => (
            <Grid item key={index} xs={12} sm={4}>
              <Card 
                sx={{ 
                  bgcolor: colors.mutedGray,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.3)',
                    '& .arrow-icon': {
                      transform: 'translateX(4px)',
                    }
                  },
                  cursor: 'pointer'
                }}
                onClick={() => navigate(card.path)}
              >
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      mb: 2
                    }}
                  >
                    <Box 
                      sx={{
                        backgroundColor: 'rgba(194, 59, 35, 0.1)',
                        borderRadius: '50%',
                        width: 60,
                        height: 60,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center'
                      }}
                    >
                      {card.icon}
                    </Box>
                    <IconButton 
                      className="arrow-icon"
                      sx={{ 
                        color: colors.vuYellow,
                        transition: 'transform 0.3s ease'
                      }}
                    >
                      <ArrowForwardIcon />
                    </IconButton>
                  </Box>
                  
                  <Typography 
                    variant="h6" 
                    component="h3"
                    sx={{ 
                      color: colors.offWhite,
                      mb: 1,
                      fontWeight: 600
                    }}
                  >
                    {card.title}
                  </Typography>
                  
                  <Typography 
                    variant="body2"
                    sx={{ 
                      color: 'rgba(240, 230, 210, 0.7)',
                    }}
                  >
                    {card.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        
        {/* Featured Equipment */}
        {featuredEquipment && featuredEquipment.length > 0 && (
          <>
            <Box 
              sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 3
              }}
            >
              <Typography 
                variant="h4" 
                component="h2"
                sx={{ 
                  color: colors.offWhite,
                  fontWeight: 600
                }}
              >
                Featured Equipment
              </Typography>
              
              <StyledButton 
                buttonVariant="text" 
                endIcon={<ArrowForwardIcon />}
                onClick={() => navigate('/inventory')}
              >
                View All
              </StyledButton>
            </Box>
            
            {isMobile ? (
              <Swiper
                modules={[Pagination, Autoplay]}
                spaceBetween={16}
                slidesPerView={1}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000 }}
                style={{ paddingBottom: '40px' }}
              >
                {featuredEquipment.map((item: EquipmentItem) => (
                  <SwiperSlide key={item.id}>
                    <EquipmentCard equipment={item} />
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <Grid container spacing={3} mb={6}>
                {featuredEquipment.map((item: EquipmentItem) => (
                  <Grid item key={item.id} xs={12} sm={6} md={3}>
                    <EquipmentCard equipment={item} />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
        
        {/* Features Section */}
        <Box sx={{ mt: 8, mb: 6 }}>
          <Divider 
            sx={{ 
              mb: 6, 
              bgcolor: 'rgba(240, 230, 210, 0.1)',
              '&::before, &::after': {
                borderColor: 'rgba(240, 230, 210, 0.1)',
              }
            }}
          >
            <Typography 
              variant="h6" 
              component="span"
              sx={{ 
                color: colors.vuYellow,
                px: 2
              }}
            >
              Why Choose Us
            </Typography>
          </Divider>
          
          <Grid container spacing={4}>
            {[
              { 
                title: 'Quality Equipment', 
                description: 'All our rental equipment is regularly maintained and tested to ensure you get the best quality.' 
              },
              { 
                title: 'Flexible Rentals', 
                description: 'Rent for a day, a week, or a month - we offer competitive rates for all durations.' 
              },
              { 
                title: 'Expert Support', 
                description: 'Our team of music professionals is always ready to help you choose the right equipment.' 
              },
              { 
                title: 'Easy Pickup & Return', 
                description: 'Convenient pickup and return process with optional delivery for larger equipment.' 
              },
            ].map((feature, index) => (
              <Grid item key={index} xs={12} sm={6}>
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'flex-start',
                    mb: 2
                  }}
                >
                  <CheckCircleIcon 
                    sx={{ 
                      color: colors.distressedRed, 
                      mr: 2,
                      fontSize: '1.5rem'
                    }} 
                  />
                  <Box>
                    <Typography 
                      variant="h6" 
                      component="h3"
                      sx={{ 
                        color: colors.offWhite,
                        mb: 1,
                        fontWeight: 600
                      }}
                    >
                      {feature.title}
                    </Typography>
                    
                    <Typography 
                      variant="body2"
                      sx={{ 
                        color: 'rgba(240, 230, 210, 0.7)',
                      }}
                    >
                      {feature.description}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default HomePage;