import React from 'react';
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Typography,
  Tooltip,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { colors } from '../../styles/theme';

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

interface EquipmentCardProps {
  equipment: EquipmentItem;
  compact?: boolean;
}

const EquipmentCard: React.FC<EquipmentCardProps> = ({ equipment, compact = false }) => {
  const navigate = useNavigate();
  
  // Handle navigation to equipment detail
  const handleClick = () => {
    navigate(`/inventory/${equipment.id}`);
  };
  
  // Get status color based on equipment status
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'available':
        return colors.success;
      case 'rented':
        return colors.vuYellow;
      case 'maintenance':
        return colors.danger;
      default:
        return colors.mutedGray;
    }
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Card
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        backgroundColor: colors.charcoalBlack,
        borderRadius: 2,
        overflow: 'hidden',
        position: 'relative',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        boxShadow: '0 6px 12px rgba(0, 0, 0, 0.4)',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 20px rgba(0, 0, 0, 0.6)',
          '&::before': {
            opacity: 1,
          }
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          borderRadius: 2,
          padding: '2px',
          background: `linear-gradient(45deg, ${colors.distressedRed}, ${colors.vuYellow})`,
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'xor',
          maskComposite: 'exclude',
          pointerEvents: 'none',
          opacity: 0.7,
          transition: 'opacity 0.2s ease-in-out',
        },
      }}
    >
      <CardActionArea onClick={handleClick} sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
        {/* Equipment Image */}
        <Box sx={{ position: 'relative', paddingTop: '56.25%', overflow: 'hidden' }}>
          <CardMedia
            component="img"
            image={equipment.image_url || '/static/images/equipment-placeholder.jpg'}
            alt={equipment.name}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          
          {/* Status Badge */}
          <Chip
            label={equipment.status}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: getStatusColor(equipment.status),
              color: equipment.status.toLowerCase() === 'available' ? colors.charcoalBlack : colors.offWhite,
              fontWeight: 'bold',
              fontSize: '0.75rem',
              height: '24px',
            }}
          />
          
          {/* Category Badge */}
          <Chip
            label={equipment.category.name}
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              left: 8,
              backgroundColor: 'rgba(18, 18, 18, 0.7)',
              backdropFilter: 'blur(4px)',
              color: colors.offWhite,
              fontSize: '0.75rem',
              height: '24px',
            }}
          />
        </Box>

        <CardContent sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          p: compact ? 1.5 : 2,
        }}>
          {/* Brand & Model */}
          <Typography 
            variant="caption" 
            sx={{ 
              color: 'rgba(240, 230, 210, 0.7)',
              mb: 0.5,
              fontSize: compact ? '0.7rem' : '0.75rem',
            }}
          >
            {equipment.brand} {equipment.model}
          </Typography>
          
          {/* Equipment Name */}
          <Tooltip title={equipment.name} placement="top">
            <Typography 
              variant="h6" 
              component="h3"
              gutterBottom
              noWrap={compact}
              sx={{
                fontWeight: 'bold',
                color: colors.offWhite,
                mb: compact ? 0.5 : 1,
                fontSize: compact ? '1rem' : '1.25rem',
                lineHeight: 1.2,
              }}
            >
              {equipment.name}
            </Typography>
          </Tooltip>
          
          {/* Availability Info */}
          <Box sx={{ mt: 'auto' }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(240, 230, 210, 0.7)',
                fontSize: compact ? '0.8rem' : '0.875rem',
              }}
            >
              {equipment.in_stock > 0 
                ? `${equipment.in_stock} in stock` 
                : "Currently unavailable"}
            </Typography>
            
            {/* Price */}
            <Typography 
              variant="h6" 
              component="p" 
              sx={{
                mt: compact ? 0.5 : 1,
                color: colors.vuYellow,
                fontWeight: 'bold',
                fontSize: compact ? '1.1rem' : '1.25rem',
              }}
            >
              {formatCurrency(equipment.daily_rate)}<span style={{ 
                fontSize: compact ? '0.7rem' : '0.8rem', 
                color: 'rgba(255, 206, 84, 0.7)',
                marginLeft: 4,
              }}>/ day</span>
            </Typography>
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default EquipmentCard;