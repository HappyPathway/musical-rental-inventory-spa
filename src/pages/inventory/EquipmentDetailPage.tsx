import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { 
  Box, 
  Typography, 
  Grid, 
  Divider, 
  Chip,
  CircularProgress, 
  Alert,
  Container,
  Paper,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import InventoryIcon from '@mui/icons-material/Inventory';
import PriceCheckIcon from '@mui/icons-material/PriceCheck';
import BuildIcon from '@mui/icons-material/Build';
import DescriptionIcon from '@mui/icons-material/Description';

import { getEquipmentItem, getEquipmentAttachments, getMaintenanceRecords } from '../../api/inventory';
import StyledButton from '../../components/ui/StyledButton';
import { colors } from '../../styles/theme';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`equipment-tabpanel-${index}`}
      aria-labelledby={`equipment-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `equipment-tab-${index}`,
    'aria-controls': `equipment-tabpanel-${index}`,
  };
}

const EquipmentDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [tabValue, setTabValue] = useState(0);
  
  const equipmentId = id ? parseInt(id) : 0;
  
  // Fetch equipment details
  const { 
    data: equipment, 
    isLoading: isLoadingEquipment,
    error: equipmentError
  } = useQuery(
    ['equipment', equipmentId], 
    () => getEquipmentItem(equipmentId),
    {
      enabled: !!equipmentId,
    }
  );
  
  // Fetch equipment attachments
  const { 
    data: attachments,
    isLoading: isLoadingAttachments
  } = useQuery(
    ['equipment-attachments', equipmentId],
    () => getEquipmentAttachments(equipmentId),
    {
      enabled: !!equipmentId,
    }
  );
  
  // Fetch maintenance records
  const { 
    data: maintenanceRecords,
    isLoading: isLoadingMaintenance
  } = useQuery(
    ['equipment-maintenance', equipmentId],
    () => getMaintenanceRecords(equipmentId),
    {
      enabled: !!equipmentId,
    }
  );
  
  const handleChangeTab = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };
  
  const handleRent = () => {
    navigate(`/rentals/new?equipment=${equipmentId}`);
  };
  
  // Placeholder image URL (replace with actual image path from backend or default)
  const imageUrl = equipment ? 
    `https://source.unsplash.com/random/800x600/?${equipment.name.replace(' ', '-')}-music-${equipment.category_id}` :
    '';
  
  if (isLoadingEquipment) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress size={60} sx={{ color: colors.distressedRed }} />
      </Box>
    );
  }
  
  if (equipmentError || !equipment) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert 
          severity="error"
          sx={{ 
            mb: 3,
            backgroundColor: 'rgba(194, 59, 35, 0.1)',
            border: `1px solid ${colors.danger}`,
            color: colors.danger
          }}
        >
          Failed to load equipment details. The item might not exist or there was a server error.
        </Alert>
        <StyledButton
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/inventory')}
          buttonVariant="outlined"
        >
          Back to Inventory
        </StyledButton>
      </Container>
    );
  }
  
  // Status badge color
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
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

  return (
    <Container maxWidth="lg">
      <Box mb={3}>
        <StyledButton
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/inventory')}
          buttonVariant="text"
          sx={{ mb: 2 }}
        >
          Back to Inventory
        </StyledButton>
        
        <Grid container spacing={4}>
          {/* Left column - Image */}
          <Grid item xs={12} md={5}>
            <Box 
              sx={{
                borderRadius: 2,
                overflow: 'hidden',
                height: { xs: '300px', md: '400px' },
                position: 'relative',
                boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)',
              }}
            >
              <Box 
                component="img"
                src={imageUrl}
                alt={equipment.name}
                sx={{ 
                  width: '100%', 
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
              <Chip
                label={equipment.status.toUpperCase()}
                sx={{
                  position: 'absolute',
                  top: 16,
                  right: 16,
                  backgroundColor: getStatusColor(equipment.status),
                  color: '#FFFFFF',
                  fontWeight: 'bold',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
                }}
              />
            </Box>
            
            <Box mt={3}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Box 
                    sx={{
                      p: 2, 
                      bgcolor: colors.mutedGray, 
                      borderRadius: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body2" color={colors.vuYellow}>Daily Rate</Typography>
                    <Typography variant="h6" color={colors.offWhite} fontWeight="bold">
                      ${equipment.rental_price_daily}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box 
                    sx={{
                      p: 2, 
                      bgcolor: colors.mutedGray, 
                      borderRadius: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body2" color={colors.vuYellow}>Weekly Rate</Typography>
                    <Typography variant="h6" color={colors.offWhite} fontWeight="bold">
                      ${equipment.rental_price_weekly}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={4}>
                  <Box 
                    sx={{
                      p: 2, 
                      bgcolor: colors.mutedGray, 
                      borderRadius: 2,
                      textAlign: 'center',
                    }}
                  >
                    <Typography variant="body2" color={colors.vuYellow}>Monthly Rate</Typography>
                    <Typography variant="h6" color={colors.offWhite} fontWeight="bold">
                      ${equipment.rental_price_monthly}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
            
            <Box mt={3}>
              <StyledButton
                buttonVariant="primary"
                fullWidth
                size="large"
                disabled={equipment.status !== 'available'}
                onClick={handleRent}
                sx={{ py: 1.5 }}
              >
                {equipment.status === 'available' ? 'Rent Now' : 'Currently Unavailable'}
              </StyledButton>
            </Box>
          </Grid>
          
          {/* Right column - Details */}
          <Grid item xs={12} md={7}>
            <Typography variant="h4" component="h1" fontWeight="bold" mb={1} color={colors.offWhite}>
              {equipment.name}
            </Typography>
            
            <Box display="flex" alignItems="center" mb={3} gap={2} flexWrap="wrap">
              <Typography variant="body1" color={colors.vuYellow} fontWeight="500">
                {equipment.brand}
              </Typography>
              
              {equipment.model_number && (
                <>
                  <Divider orientation="vertical" flexItem sx={{ bgcolor: colors.mutedGray }} />
                  <Typography variant="body1" color={colors.offWhite}>
                    Model: {equipment.model_number}
                  </Typography>
                </>
              )}
              
              {equipment.serial_number && (
                <>
                  <Divider orientation="vertical" flexItem sx={{ bgcolor: colors.mutedGray }} />
                  <Typography variant="body1" color={colors.offWhite}>
                    Serial: {equipment.serial_number}
                  </Typography>
                </>
              )}
            </Box>
            
            <Paper 
              sx={{ 
                bgcolor: colors.mutedGray,
                borderRadius: 2,
                overflow: 'hidden',
                mb: 3,
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleChangeTab}
                variant={isMobile ? "fullWidth" : "standard"}
                sx={{
                  borderBottom: `1px solid ${colors.charcoalBlack}`,
                  '& .MuiTab-root': {
                    color: colors.offWhite,
                    '&.Mui-selected': {
                      color: colors.vuYellow,
                    }
                  },
                  '& .MuiTabs-indicator': {
                    backgroundColor: colors.distressedRed,
                  },
                }}
              >
                <Tab icon={<DescriptionIcon />} label="Description" {...a11yProps(0)} />
                <Tab icon={<InventoryIcon />} label="Specifications" {...a11yProps(1)} />
                <Tab icon={<PriceCheckIcon />} label="Rental Info" {...a11yProps(2)} />
                <Tab icon={<BuildIcon />} label="Maintenance" {...a11yProps(3)} />
              </Tabs>
              
              <TabPanel value={tabValue} index={0}>
                <Typography variant="body1" color={colors.offWhite} whiteSpace="pre-line">
                  {equipment.description}
                </Typography>
              </TabPanel>
              
              <TabPanel value={tabValue} index={1}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box mb={2}>
                      <Typography variant="subtitle2" color={colors.vuYellow} mb={1}>
                        General Information
                      </Typography>
                      
                      <List disablePadding dense>
                        <ListItem disableGutters>
                          <ListItemText 
                            primary="Brand" 
                            secondary={equipment.brand}
                            primaryTypographyProps={{ 
                              variant: 'body2',
                              color: 'rgba(240, 230, 210, 0.7)',
                            }}
                            secondaryTypographyProps={{ 
                              variant: 'body1',
                              color: colors.offWhite,
                            }}
                          />
                        </ListItem>
                        
                        {equipment.model_number && (
                          <ListItem disableGutters>
                            <ListItemText 
                              primary="Model Number" 
                              secondary={equipment.model_number}
                              primaryTypographyProps={{ 
                                variant: 'body2',
                                color: 'rgba(240, 230, 210, 0.7)',
                              }}
                              secondaryTypographyProps={{ 
                                variant: 'body1',
                                color: colors.offWhite,
                              }}
                            />
                          </ListItem>
                        )}
                        
                        {equipment.serial_number && (
                          <ListItem disableGutters>
                            <ListItemText 
                              primary="Serial Number" 
                              secondary={equipment.serial_number}
                              primaryTypographyProps={{ 
                                variant: 'body2',
                                color: 'rgba(240, 230, 210, 0.7)',
                              }}
                              secondaryTypographyProps={{ 
                                variant: 'body1',
                                color: colors.offWhite,
                              }}
                            />
                          </ListItem>
                        )}
                        
                        <ListItem disableGutters>
                          <ListItemText 
                            primary="Condition" 
                            secondary={equipment.condition || 'Good'}
                            primaryTypographyProps={{ 
                              variant: 'body2',
                              color: 'rgba(240, 230, 210, 0.7)',
                            }}
                            secondaryTypographyProps={{ 
                              variant: 'body1',
                              color: colors.offWhite,
                            }}
                          />
                        </ListItem>
                      </List>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box mb={2}>
                      <Typography variant="subtitle2" color={colors.vuYellow} mb={1}>
                        Inventory Details
                      </Typography>
                      
                      <List disablePadding dense>
                        <ListItem disableGutters>
                          <ListItemText 
                            primary="Quantity Available" 
                            secondary={equipment.quantity}
                            primaryTypographyProps={{ 
                              variant: 'body2',
                              color: 'rgba(240, 230, 210, 0.7)',
                            }}
                            secondaryTypographyProps={{ 
                              variant: 'body1',
                              color: colors.offWhite,
                            }}
                          />
                        </ListItem>
                        
                        <ListItem disableGutters>
                          <ListItemText 
                            primary="Status" 
                            secondary={equipment.status}
                            primaryTypographyProps={{ 
                              variant: 'body2',
                              color: 'rgba(240, 230, 210, 0.7)',
                            }}
                            secondaryTypographyProps={{ 
                              variant: 'body1',
                              color: colors.offWhite,
                              textTransform: 'capitalize'
                            }}
                          />
                        </ListItem>
                        
                        {equipment.manual_title && (
                          <ListItem disableGutters>
                            <ListItemText 
                              primary="Manual" 
                              secondary={equipment.manual_title}
                              primaryTypographyProps={{ 
                                variant: 'body2',
                                color: 'rgba(240, 230, 210, 0.7)',
                              }}
                              secondaryTypographyProps={{ 
                                variant: 'body1',
                                color: colors.offWhite,
                              }}
                            />
                          </ListItem>
                        )}
                      </List>
                    </Box>
                  </Grid>
                </Grid>
                
                {attachments && attachments.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="subtitle2" color={colors.vuYellow} mb={1}>
                      Attachments
                    </Typography>
                    
                    <List>
                      {attachments.map(attachment => (
                        <ListItem key={attachment.id} disableGutters>
                          <ListItemText 
                            primary={attachment.title}
                            secondary={attachment.description}
                            primaryTypographyProps={{ color: colors.offWhite }}
                            secondaryTypographyProps={{ color: 'rgba(240, 230, 210, 0.7)' }}
                          />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </TabPanel>
              
              <TabPanel value={tabValue} index={2}>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <Box 
                      sx={{
                        p: 2, 
                        bgcolor: colors.charcoalBlack, 
                        borderRadius: 2,
                        mb: 2,
                        border: '1px solid rgba(194, 59, 35, 0.3)',
                      }}
                    >
                      <Typography variant="subtitle2" color={colors.vuYellow} mb={1}>
                        Daily Rental
                      </Typography>
                      <Typography variant="h5" fontWeight="bold" color={colors.offWhite}>
                        ${equipment.rental_price_daily}
                      </Typography>
                      <Typography variant="body2" color="rgba(240, 230, 210, 0.5)" mt={0.5}>
                        For 1-6 days
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box 
                      sx={{
                        p: 2, 
                        bgcolor: colors.charcoalBlack, 
                        borderRadius: 2,
                        mb: 2,
                        border: '1px solid rgba(194, 59, 35, 0.3)',
                      }}
                    >
                      <Typography variant="subtitle2" color={colors.vuYellow} mb={1}>
                        Weekly Rental
                      </Typography>
                      <Typography variant="h5" fontWeight="bold" color={colors.offWhite}>
                        ${equipment.rental_price_weekly}
                      </Typography>
                      <Typography variant="body2" color="rgba(240, 230, 210, 0.5)" mt={0.5}>
                        For 7-29 days
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box 
                      sx={{
                        p: 2, 
                        bgcolor: colors.charcoalBlack, 
                        borderRadius: 2,
                        border: '1px solid rgba(194, 59, 35, 0.3)',
                      }}
                    >
                      <Typography variant="subtitle2" color={colors.vuYellow} mb={1}>
                        Monthly Rental
                      </Typography>
                      <Typography variant="h5" fontWeight="bold" color={colors.offWhite}>
                        ${equipment.rental_price_monthly}
                      </Typography>
                      <Typography variant="body2" color="rgba(240, 230, 210, 0.5)" mt={0.5}>
                        For 30+ days
                      </Typography>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Box 
                      sx={{
                        p: 2, 
                        bgcolor: colors.charcoalBlack, 
                        borderRadius: 2,
                        border: '1px solid rgba(194, 59, 35, 0.3)',
                      }}
                    >
                      <Typography variant="subtitle2" color={colors.vuYellow} mb={1}>
                        Deposit Required
                      </Typography>
                      <Typography variant="h5" fontWeight="bold" color={colors.offWhite}>
                        ${equipment.deposit_amount}
                      </Typography>
                      <Typography variant="body2" color="rgba(240, 230, 210, 0.5)" mt={0.5}>
                        Refundable upon return
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box mt={3}>
                  <Typography variant="subtitle2" color={colors.vuYellow} mb={2}>
                    Rental Terms
                  </Typography>
                  <Typography variant="body2" color={colors.offWhite} paragraph>
                    • Equipment must be returned in the same condition it was rented.
                  </Typography>
                  <Typography variant="body2" color={colors.offWhite} paragraph>
                    • Late returns are subject to additional daily charges.
                  </Typography>
                  <Typography variant="body2" color={colors.offWhite} paragraph>
                    • Damage beyond normal wear and tear may result in additional fees.
                  </Typography>
                  <Typography variant="body2" color={colors.offWhite} paragraph>
                    • Valid ID and deposit required for all rentals.
                  </Typography>
                </Box>
              </TabPanel>
              
              <TabPanel value={tabValue} index={3}>
                {isLoadingMaintenance ? (
                  <Box display="flex" justifyContent="center" py={4}>
                    <CircularProgress size={40} sx={{ color: colors.distressedRed }} />
                  </Box>
                ) : maintenanceRecords && maintenanceRecords.length > 0 ? (
                  <List>
                    {maintenanceRecords.map(record => (
                      <ListItem 
                        key={record.id} 
                        divider
                        sx={{ 
                          mb: 1, 
                          pb: 1,
                          borderBottom: `1px solid ${colors.charcoalBlack}`
                        }}
                      >
                        <ListItemText
                          primary={record.maintenance_type}
                          secondary={
                            <>
                              <Typography component="span" variant="body2" color="rgba(240, 230, 210, 0.7)">
                                {new Date(record.maintenance_date).toLocaleDateString()}
                                {record.resolved ? ' • Resolved' : ' • Pending'}
                              </Typography>
                              <Typography component="p" variant="body2" color={colors.offWhite} mt={0.5}>
                                {record.description}
                              </Typography>
                            </>
                          }
                          primaryTypographyProps={{ 
                            color: colors.vuYellow,
                            fontWeight: 500
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                ) : (
                  <Typography color={colors.offWhite}>
                    No maintenance records found for this equipment.
                  </Typography>
                )}
              </TabPanel>
            </Paper>
            
            {/* Notes */}
            {equipment.notes && (
              <Box mt={3}>
                <Typography variant="subtitle1" color={colors.vuYellow} mb={1}>
                  Notes
                </Typography>
                <Paper
                  sx={{ 
                    bgcolor: colors.mutedGray,
                    borderRadius: 2,
                    p: 2,
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
                  }}
                >
                  <Typography variant="body2" color={colors.offWhite}>
                    {equipment.notes}
                  </Typography>
                </Paper>
              </Box>
            )}
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default EquipmentDetailPage;