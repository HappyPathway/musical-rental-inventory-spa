import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Box,
  Stepper,
  Step,
  StepLabel,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  InputAdornment,
  Chip,
  Alert,
  SelectChangeEvent, // Adding SelectChangeEvent for proper typing
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useNavigate } from 'react-router-dom';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import PaymentIcon from '@mui/icons-material/Payment';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import { colors } from '../../styles/theme';

// Mock data for demonstration
const mockCustomers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', phone: '(555) 123-4567' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '(555) 987-6543' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', phone: '(555) 246-8135' },
  { id: 4, name: 'Alice Williams', email: 'alice@example.com', phone: '(555) 369-2580' },
  { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', phone: '(555) 741-9630' },
];

const mockEquipment = [
  { id: 1, name: 'Fender Stratocaster', category: 'Guitars', price: 75.00, depositRequired: 150.00, available: true },
  { id: 2, name: 'Gibson Les Paul', category: 'Guitars', price: 90.00, depositRequired: 180.00, available: true },
  { id: 3, name: 'Shure SM58 Microphone', category: 'Microphones', price: 25.00, depositRequired: 50.00, available: true },
  { id: 4, name: 'Roland Jazz Chorus Amplifier', category: 'Amplifiers', price: 65.00, depositRequired: 130.00, available: true },
  { id: 5, name: 'DW Drum Kit', category: 'Drums', price: 120.00, depositRequired: 240.00, available: false },
  { id: 6, name: 'XLR Cable (10ft)', category: 'Accessories', price: 5.00, depositRequired: 10.00, available: true },
  { id: 7, name: 'Boss DD-7 Digital Delay Pedal', category: 'Effects', price: 15.00, depositRequired: 30.00, available: true },
  { id: 8, name: 'Akai MPK Mini MKII', category: 'Keyboards', price: 35.00, depositRequired: 70.00, available: true },
];

const paymentMethods = [
  { id: 'credit', name: 'Credit Card' },
  { id: 'debit', name: 'Debit Card' },
  { id: 'cash', name: 'Cash' },
  { id: 'venmo', name: 'Venmo' },
  { id: 'paypal', name: 'PayPal' },
];

const steps = ['Customer Information', 'Equipment Selection', 'Review & Payment'];

interface RentalItem {
  id: number;
  equipmentId: number;
  name: string;
  price: number;
  quantity: number;
  depositRequired: number;
  notes: string;
}

interface RentalFormData {
  customerId: number | null;
  customerName: string;
  startDate: Date | null;
  endDate: Date | null;
  durationType: string;
  items: RentalItem[];
  depositPaymentMethod: string;
  depositPaid: boolean;
  depositAmount: number;
  totalPrice: number;
  notes: string;
}

const CreateRentalPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<RentalFormData>({
    customerId: null,
    customerName: '',
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 7)), // Default 7 days
    durationType: 'daily',
    items: [],
    depositPaymentMethod: '',
    depositPaid: false,
    depositAmount: 0,
    totalPrice: 0,
    notes: '',
  });
  
  const [customerSearchTerm, setCustomerSearchTerm] = useState('');
  const [equipmentSearchTerm, setEquipmentSearchTerm] = useState('');
  const [equipmentCategoryFilter, setEquipmentCategoryFilter] = useState('');
  const [customerError, setCustomerError] = useState('');
  const [dateError, setDateError] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  // Filter customers based on search
  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    customer.email.toLowerCase().includes(customerSearchTerm.toLowerCase()) ||
    customer.phone.includes(customerSearchTerm)
  );

  // Get unique categories
  const categories = Array.from(new Set(mockEquipment.map(item => item.category)));

  // Filter equipment based on search and category
  const filteredEquipment = mockEquipment.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(equipmentSearchTerm.toLowerCase());
    const matchesCategory = equipmentCategoryFilter ? item.category === equipmentCategoryFilter : true;
    return matchesSearch && matchesCategory && item.available;
  });

  const handleNext = () => {
    // Validate current step before proceeding
    if (activeStep === 0) {
      if (!formData.customerId) {
        setCustomerError('Please select a customer');
        return;
      }
      if (!formData.startDate || !formData.endDate) {
        setDateError('Please select both start and end dates');
        return;
      }
      if (formData.startDate && formData.endDate && formData.startDate > formData.endDate) {
        setDateError('End date cannot be before start date');
        return;
      }
    } else if (activeStep === 1) {
      if (formData.items.length === 0) {
        setShowAlert(true);
        return;
      }
    }
    
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleCustomerChange = (customerId: number | null) => {
    setFormData({
      ...formData,
      customerId,
      customerName: customerId 
        ? mockCustomers.find(customer => customer.id === customerId)?.name || '' 
        : '',
    });
    setCustomerError('');
  };

  const handleAddEquipment = (equipmentId: number) => {
    const equipment = mockEquipment.find(item => item.id === equipmentId);
    if (!equipment) return;

    // Check if item already exists in the rental
    const existingItem = formData.items.find(item => item.equipmentId === equipmentId);
    
    if (existingItem) {
      // Update quantity if already in rental
      const updatedItems = formData.items.map(item => 
        item.equipmentId === equipmentId 
          ? { ...item, quantity: item.quantity + 1, price: item.price + equipment.price } 
          : item
      );
      
      // Update total price and deposit
      updateTotals(updatedItems);
    } else {
      // Add new item to rental
      const newItem: RentalItem = {
        id: formData.items.length + 1,
        equipmentId,
        name: equipment.name,
        price: equipment.price,
        quantity: 1,
        depositRequired: equipment.depositRequired,
        notes: '',
      };
      
      const updatedItems = [...formData.items, newItem];
      updateTotals(updatedItems);
    }

    setShowAlert(false);
  };

  const handleRemoveEquipment = (itemId: number) => {
    const updatedItems = formData.items.filter(item => item.id !== itemId);
    updateTotals(updatedItems);
  };

  const updateTotals = (items: RentalItem[]) => {
    const totalPrice = items.reduce((sum, item) => sum + item.price, 0);
    const depositAmount = items.reduce((sum, item) => sum + item.depositRequired, 0);
    
    setFormData({
      ...formData,
      items,
      totalPrice,
      depositAmount,
    });
  };

  const handleCompleteRental = () => {
    // In a real application, this would submit the rental to the API
    console.log('Submitting rental:', formData);
    
    // Mock successful submission
    setTimeout(() => {
      navigate('/rentals/1'); // Navigate to the detail page of the created rental
    }, 1000);
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Typography 
              variant="h6"
              sx={{ 
                color: colors.offWhite,
                mb: 3,
                fontWeight: 'medium'
              }}
            >
              Select Customer and Rental Dates
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Search Customers"
                  variant="outlined"
                  value={customerSearchTerm}
                  onChange={(e) => setCustomerSearchTerm(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#555' }} />
                      </InputAdornment>
                    ),
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
                {filteredCustomers.length > 0 ? (
                  <Paper
                    sx={{
                      maxHeight: 240,
                      overflow: 'auto',
                      bgcolor: 'rgba(58, 58, 58, 0.5)',
                      backdropFilter: 'blur(5px)',
                      borderRadius: 1,
                    }}
                  >
                    <List>
                      {filteredCustomers.map((customer) => (
                        <ListItem
                          button
                          key={customer.id}
                          selected={formData.customerId === customer.id}
                          onClick={() => handleCustomerChange(customer.id)}
                          sx={{
                            borderBottom: '1px solid rgba(240, 230, 210, 0.1)',
                            '&.Mui-selected': {
                              bgcolor: 'rgba(194, 59, 35, 0.1)',
                            },
                            '&:hover': {
                              bgcolor: 'rgba(240, 230, 210, 0.05)',
                            }
                          }}
                        >
                          <ListItemText
                            primary={<Typography sx={{ color: colors.offWhite }}>{customer.name}</Typography>}
                            secondary={
                              <Box>
                                <Typography sx={{ color: 'rgba(240, 230, 210, 0.7)', fontSize: '0.875rem' }}>
                                  {customer.email}
                                </Typography>
                                <Typography sx={{ color: 'rgba(240, 230, 210, 0.7)', fontSize: '0.875rem' }}>
                                  {customer.phone}
                                </Typography>
                              </Box>
                            }
                          />
                          {formData.customerId === customer.id && (
                            <Chip 
                              label="Selected" 
                              size="small"
                              sx={{ 
                                bgcolor: `${colors.success}20`,
                                color: colors.success,
                                fontWeight: 'bold',
                                border: `1px solid ${colors.success}`,
                              }} 
                            />
                          )}
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                ) : (
                  <Box 
                    sx={{ 
                      p: 3, 
                      textAlign: 'center',
                      color: 'rgba(240, 230, 210, 0.7)',
                      bgcolor: 'rgba(58, 58, 58, 0.5)',
                      borderRadius: 1,
                    }}
                  >
                    No customers found matching your search. Try different keywords or create a new customer.
                  </Box>
                )}
                {customerError && (
                  <FormHelperText 
                    error
                    sx={{ 
                      color: colors.danger + ' !important',
                      mt: 1,
                      ml: 2,
                    }}
                  >
                    {customerError}
                  </FormHelperText>
                )}
              </Grid>
              
              <Grid item xs={12} sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  sx={{
                    backgroundColor: colors.info,
                    color: colors.offWhite,
                    '&:hover': {
                      backgroundColor: '#4a7dbd',
                    }
                  }}
                >
                  Create New Customer
                </Button>
              </Grid>
              
              <Grid item xs={12}>
                <Divider sx={{ my: 2, bgcolor: 'rgba(240, 230, 210, 0.1)' }} />
              </Grid>
              
              <Grid item xs={12}>
                <Typography 
                  variant="subtitle1"
                  sx={{ 
                    color: colors.offWhite,
                    mb: 2,
                    fontWeight: 'medium'
                  }}
                >
                  Rental Period
                </Typography>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Start Date"
                    value={formData.startDate}
                    onChange={(newValue: Date | null) => {
                      setFormData({
                        ...formData,
                        startDate: newValue
                      });
                      setDateError('');
                    }}
                    sx={{
                      width: '100%',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#FFFFFF',
                        color: colors.charcoalBlack,
                      },
                      '& .MuiInputLabel-root': {
                        color: colors.offWhite
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="End Date"
                    value={formData.endDate}
                    onChange={(newValue: Date | null) => {
                      setFormData({
                        ...formData,
                        endDate: newValue
                      });
                      setDateError('');
                    }}
                    sx={{
                      width: '100%',
                      '& .MuiOutlinedInput-root': {
                        backgroundColor: '#FFFFFF',
                        color: colors.charcoalBlack,
                      },
                      '& .MuiInputLabel-root': {
                        color: colors.offWhite
                      }
                    }}
                  />
                </LocalizationProvider>
              </Grid>
              
              {dateError && (
                <Grid item xs={12}>
                  <FormHelperText 
                    error
                    sx={{ 
                      color: colors.danger + ' !important',
                      mt: 1,
                      ml: 2,
                    }}
                  >
                    {dateError}
                  </FormHelperText>
                </Grid>
              )}
              
              <Grid item xs={12} sm={6}>
                <FormControl 
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: '#FFFFFF',
                      color: colors.charcoalBlack,
                    }
                  }}
                >
                  <InputLabel 
                    id="duration-type-label"
                    sx={{ color: colors.offWhite }}
                  >
                    Billing Duration
                  </InputLabel>
                  <Select
                    labelId="duration-type-label"
                    id="duration-type"
                    value={formData.durationType}
                    label="Billing Duration"
                    onChange={(e: SelectChangeEvent) => setFormData({
                      ...formData,
                      durationType: e.target.value
                    })}
                  >
                    <MenuItem value="daily">Daily</MenuItem>
                    <MenuItem value="weekly">Weekly</MenuItem>
                    <MenuItem value="monthly">Monthly</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        );
      case 1:
        return (
          <Box>
            <Typography 
              variant="h6"
              sx={{ 
                color: colors.offWhite,
                mb: 3,
                fontWeight: 'medium'
              }}
            >
              Select Equipment for Rental
            </Typography>
            
            {showAlert && (
              <Alert 
                severity="warning" 
                sx={{ 
                  mb: 3,
                  backgroundColor: 'rgba(255, 206, 84, 0.1)',
                  border: `1px solid ${colors.vuYellow}`,
                  color: colors.vuYellow
                }}
                onClose={() => setShowAlert(false)}
              >
                Please add at least one equipment item before proceeding.
              </Alert>
            )}
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={5}>
                <Paper 
                  elevation={3}
                  sx={{ 
                    p: 3, 
                    bgcolor: colors.mutedGray,
                    borderRadius: 2,
                    position: 'relative',
                  }}
                >
                  <Typography 
                    variant="subtitle1"
                    sx={{ 
                      color: colors.offWhite,
                      mb: 2,
                      fontWeight: 'medium'
                    }}
                  >
                    Available Equipment
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Search Equipment"
                        variant="outlined"
                        value={equipmentSearchTerm}
                        onChange={(e) => setEquipmentSearchTerm(e.target.value)}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon sx={{ color: '#555' }} />
                            </InputAdornment>
                          ),
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
                      <FormControl 
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: '#FFFFFF',
                            color: colors.charcoalBlack,
                          }
                        }}
                      >
                        <InputLabel 
                          id="category-label"
                          sx={{ color: colors.offWhite }}
                        >
                          Filter by Category
                        </InputLabel>
                        <Select
                          labelId="category-label"
                          id="category-select"
                          value={equipmentCategoryFilter}
                          label="Filter by Category"
                          onChange={(e: SelectChangeEvent) => setEquipmentCategoryFilter(e.target.value)}
                        >
                          <MenuItem value="">All Categories</MenuItem>
                          {categories.map((category) => (
                            <MenuItem key={category} value={category}>{category}</MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  
                  <Box
                    sx={{
                      maxHeight: 300,
                      overflow: 'auto',
                      mb: 2
                    }}
                  >
                    <List>
                      {filteredEquipment.map((equipment) => (
                        <ListItem
                          key={equipment.id}
                          sx={{
                            borderBottom: '1px solid rgba(240, 230, 210, 0.1)',
                            p: 2,
                            '&:hover': {
                              bgcolor: 'rgba(58, 58, 58, 0.5)',
                            }
                          }}
                        >
                          <ListItemText
                            primary={
                              <Typography sx={{ color: colors.offWhite, fontWeight: 'medium' }}>
                                {equipment.name}
                              </Typography>
                            }
                            secondary={
                              <Box>
                                <Typography sx={{ color: 'rgba(240, 230, 210, 0.7)', fontSize: '0.75rem' }}>
                                  Category: {equipment.category}
                                </Typography>
                                <Typography sx={{ color: colors.vuYellow, mt: 0.5 }}>
                                  ${equipment.price.toFixed(2)} per day
                                </Typography>
                              </Box>
                            }
                          />
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleAddEquipment(equipment.id)}
                            sx={{
                              ml: 1,
                              backgroundColor: colors.distressedRed,
                              color: colors.offWhite,
                              '&:hover': {
                                backgroundColor: '#a32e1c',
                              },
                              minWidth: '40px',
                            }}
                          >
                            Add
                          </Button>
                        </ListItem>
                      ))}
                      
                      {filteredEquipment.length === 0 && (
                        <Box 
                          sx={{ 
                            p: 3, 
                            textAlign: 'center',
                            color: 'rgba(240, 230, 210, 0.7)'
                          }}
                        >
                          No equipment found matching your criteria
                        </Box>
                      )}
                    </List>
                  </Box>
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={7}>
                <Paper 
                  elevation={3}
                  sx={{ 
                    p: 3, 
                    bgcolor: colors.mutedGray,
                    borderRadius: 2,
                    position: 'relative',
                  }}
                >
                  <Typography 
                    variant="subtitle1"
                    sx={{ 
                      color: colors.offWhite,
                      mb: 2,
                      fontWeight: 'medium'
                    }}
                  >
                    Selected Equipment
                  </Typography>
                  
                  {formData.items.length > 0 ? (
                    <List>
                      {formData.items.map((item) => (
                        <ListItem
                          key={item.id}
                          sx={{
                            borderBottom: '1px solid rgba(240, 230, 210, 0.1)',
                            p: 2,
                            bgcolor: 'rgba(58, 58, 58, 0.3)',
                            mb: 1,
                            borderRadius: 1,
                          }}
                        >
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Typography sx={{ color: colors.offWhite, fontWeight: 'medium' }}>
                                  {item.name} {item.quantity > 1 && `(${item.quantity}x)`}
                                </Typography>
                                <Typography sx={{ color: colors.vuYellow }}>
                                  ${item.price.toFixed(2)}
                                </Typography>
                              </Box>
                            }
                            secondary={
                              <Typography sx={{ color: 'rgba(240, 230, 210, 0.7)', fontSize: '0.75rem' }}>
                                Deposit: ${item.depositRequired.toFixed(2)}
                              </Typography>
                            }
                          />
                          <ListItemSecondaryAction>
                            <IconButton 
                              edge="end" 
                              onClick={() => handleRemoveEquipment(item.id)}
                              sx={{
                                color: 'rgba(240, 230, 210, 0.5)',
                                '&:hover': {
                                  color: colors.danger,
                                }
                              }}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </ListItemSecondaryAction>
                        </ListItem>
                      ))}
                    </List>
                  ) : (
                    <Box 
                      sx={{ 
                        p: 4, 
                        textAlign: 'center',
                        color: 'rgba(240, 230, 210, 0.7)',
                        borderRadius: 1,
                        border: '1px dashed rgba(240, 230, 210, 0.3)',
                      }}
                    >
                      No equipment selected yet. Add equipment from the list on the left.
                    </Box>
                  )}
                  
                  {formData.items.length > 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        py: 1,
                        borderTop: '1px dashed rgba(240, 230, 210, 0.2)'
                      }}>
                        <Typography sx={{ color: 'rgba(240, 230, 210, 0.9)' }}>
                          Subtotal
                        </Typography>
                        <Typography sx={{ color: colors.offWhite }}>
                          ${formData.totalPrice.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        py: 1
                      }}>
                        <Typography sx={{ color: 'rgba(240, 230, 210, 0.9)' }}>
                          Deposit Required
                        </Typography>
                        <Typography sx={{ color: colors.offWhite }}>
                          ${formData.depositAmount.toFixed(2)}
                        </Typography>
                      </Box>
                      <Box sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        py: 1,
                        borderTop: '1px dashed rgba(240, 230, 210, 0.2)'
                      }}>
                        <Typography sx={{ color: colors.offWhite, fontWeight: 'bold' }}>
                          Total Due Today
                        </Typography>
                        <Typography sx={{ color: colors.vuYellow, fontWeight: 'bold' }}>
                          ${(formData.totalPrice + formData.depositAmount).toFixed(2)}
                        </Typography>
                      </Box>
                    </Box>
                  )}
                </Paper>
                
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="Notes"
                    variant="outlined"
                    multiline
                    rows={3}
                    value={formData.notes}
                    onChange={(e) => setFormData({
                      ...formData,
                      notes: e.target.value
                    })}
                    InputProps={{
                      sx: {
                        backgroundColor: '#FFFFFF',
                        color: colors.charcoalBlack,
                      }
                    }}
                    InputLabelProps={{
                      shrink: true,
                      sx: { color: colors.offWhite }
                    }}
                    placeholder="Add any special instructions or notes about this rental"
                  />
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
      case 2:
        return (
          <Box>
            <Typography 
              variant="h6"
              sx={{ 
                color: colors.offWhite,
                mb: 3,
                fontWeight: 'medium'
              }}
            >
              Review and Complete Rental
            </Typography>
            
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={3}
                  sx={{ 
                    p: 3, 
                    mb: { xs: 3, md: 0 },
                    bgcolor: colors.mutedGray,
                    borderRadius: 2,
                    position: 'relative',
                  }}
                >
                  <Typography 
                    variant="subtitle1"
                    sx={{ 
                      color: colors.offWhite,
                      mb: 2,
                      fontWeight: 'medium'
                    }}
                  >
                    Rental Summary
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Grid container spacing={1}>
                      <Grid item xs={5}>
                        <Typography sx={{ color: 'rgba(240, 230, 210, 0.7)' }}>
                          Customer:
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography sx={{ color: colors.offWhite, fontWeight: 'medium' }}>
                          {formData.customerName}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={5}>
                        <Typography sx={{ color: 'rgba(240, 230, 210, 0.7)' }}>
                          Rental Period:
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography sx={{ color: colors.offWhite }}>
                          {formData.startDate?.toLocaleDateString()} - {formData.endDate?.toLocaleDateString()}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={5}>
                        <Typography sx={{ color: 'rgba(240, 230, 210, 0.7)' }}>
                          Billing Type:
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography sx={{ color: colors.offWhite, textTransform: 'capitalize' }}>
                          {formData.durationType}
                        </Typography>
                      </Grid>
                      
                      <Grid item xs={5}>
                        <Typography sx={{ color: 'rgba(240, 230, 210, 0.7)' }}>
                          Items:
                        </Typography>
                      </Grid>
                      <Grid item xs={7}>
                        <Typography sx={{ color: colors.offWhite }}>
                          {formData.items.length}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Box>
                  
                  <Divider sx={{ my: 2, bgcolor: 'rgba(240, 230, 210, 0.1)' }} />
                  
                  <Typography 
                    variant="subtitle2"
                    sx={{ 
                      color: colors.offWhite,
                      mb: 1,
                      fontWeight: 'medium'
                    }}
                  >
                    Equipment List
                  </Typography>
                  
                  <List dense>
                    {formData.items.map((item) => (
                      <ListItem
                        key={item.id}
                        sx={{
                          py: 1,
                          px: 1,
                          borderBottom: '1px solid rgba(240, 230, 210, 0.1)',
                        }}
                      >
                        <ListItemText
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography sx={{ color: colors.offWhite, fontSize: '0.9rem' }}>
                                {item.name} {item.quantity > 1 && `(${item.quantity}x)`}
                              </Typography>
                              <Typography sx={{ color: colors.vuYellow, fontSize: '0.9rem' }}>
                                ${item.price.toFixed(2)}
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                  
                  <Box sx={{ mt: 3 }}>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      py: 1,
                    }}>
                      <Typography sx={{ color: 'rgba(240, 230, 210, 0.9)' }}>
                        Rental Subtotal
                      </Typography>
                      <Typography sx={{ color: colors.offWhite }}>
                        ${formData.totalPrice.toFixed(2)}
                      </Typography>
                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      py: 1,
                    }}>
                      <Typography sx={{ color: 'rgba(240, 230, 210, 0.9)' }}>
                        Security Deposit
                      </Typography>
                      <Typography sx={{ color: colors.offWhite }}>
                        ${formData.depositAmount.toFixed(2)}
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 1, bgcolor: 'rgba(240, 230, 210, 0.1)' }} />
                    <Box sx={{ 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      py: 1,
                    }}>
                      <Typography sx={{ color: colors.offWhite, fontWeight: 'bold' }}>
                        Total Due Today
                      </Typography>
                      <Typography sx={{ color: colors.vuYellow, fontWeight: 'bold' }}>
                        ${(formData.totalPrice + formData.depositAmount).toFixed(2)}
                      </Typography>
                    </Box>
                  </Box>
                  
                  {formData.notes && (
                    <>
                      <Divider sx={{ my: 2, bgcolor: 'rgba(240, 230, 210, 0.1)' }} />
                      <Typography 
                        variant="subtitle2"
                        sx={{ 
                          color: colors.offWhite,
                          mb: 1,
                          fontWeight: 'medium'
                        }}
                      >
                        Notes
                      </Typography>
                      <Typography 
                        sx={{ 
                          color: 'rgba(240, 230, 210, 0.7)',
                          fontSize: '0.9rem',
                          p: 1,
                          borderRadius: 1,
                          bgcolor: 'rgba(18, 18, 18, 0.3)',
                        }}
                      >
                        {formData.notes}
                      </Typography>
                    </>
                  )}
                </Paper>
              </Grid>
              
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={3}
                  sx={{ 
                    p: 3, 
                    bgcolor: colors.mutedGray,
                    borderRadius: 2,
                    position: 'relative',
                  }}
                >
                  <Typography 
                    variant="subtitle1"
                    sx={{ 
                      color: colors.offWhite,
                      mb: 2,
                      fontWeight: 'medium'
                    }}
                  >
                    Complete Rental
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography 
                      variant="body2"
                      sx={{ 
                        color: 'rgba(240, 230, 210, 0.7)',
                        mb: 2
                      }}
                    >
                      A security deposit is required to complete this rental. Please collect the deposit before proceeding.
                    </Typography>
                    
                    <FormControl 
                      fullWidth 
                      sx={{ 
                        mb: 3,
                        '& .MuiOutlinedInput-root': {
                          backgroundColor: '#FFFFFF',
                          color: colors.charcoalBlack,
                        }
                      }}
                    >
                      <InputLabel 
                        id="payment-method-label"
                        sx={{ color: colors.offWhite }}
                      >
                        Payment Method
                      </InputLabel>
                      <Select
                        labelId="payment-method-label"
                        id="payment-method"
                        value={formData.depositPaymentMethod}
                        label="Payment Method"
                        onChange={(e: SelectChangeEvent) => setFormData({
                          ...formData,
                          depositPaymentMethod: e.target.value
                        })}
                      >
                        <MenuItem value="">Select a payment method</MenuItem>
                        {paymentMethods.map((method) => (
                          <MenuItem key={method.id} value={method.id}>{method.name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    
                    <FormControl component="fieldset">
                      <Grid container alignItems="center">
                        <Grid item xs={12}>
                          <Button
                            variant="contained"
                            startIcon={<PaymentIcon />}
                            color="primary"
                            onClick={() => setFormData({
                              ...formData,
                              depositPaid: !formData.depositPaid
                            })}
                            sx={{
                              backgroundColor: formData.depositPaid ? colors.success : colors.mutedGray,
                              color: formData.depositPaid ? colors.offWhite : 'rgba(240, 230, 210, 0.7)',
                              borderColor: formData.depositPaid ? 'transparent' : 'rgba(240, 230, 210, 0.3)',
                              border: formData.depositPaid ? 'none' : '1px solid',
                              '&:hover': {
                                backgroundColor: formData.depositPaid ? '#3baf92' : 'rgba(240, 230, 210, 0.1)',
                              }
                            }}
                          >
                            {formData.depositPaid ? (
                              <>
                                <CheckCircleOutlineIcon sx={{ mr: 1 }} /> Deposit Collected
                              </>
                            ) : (
                              'Mark Deposit as Paid'
                            )}
                          </Button>
                        </Grid>
                      </Grid>
                    </FormControl>
                  </Box>
                  
                  <Divider sx={{ my: 3, bgcolor: 'rgba(240, 230, 210, 0.1)' }} />
                  
                  <Box>
                    <Typography 
                      variant="subtitle2"
                      sx={{ 
                        color: colors.offWhite,
                        mb: 2,
                        fontWeight: 'medium'
                      }}
                    >
                      Contract
                    </Typography>
                    
                    <Button
                      variant="outlined"
                      startIcon={<ReceiptIcon />}
                      sx={{
                        color: colors.offWhite,
                        borderColor: 'rgba(240, 230, 210, 0.3)',
                        '&:hover': {
                          backgroundColor: 'rgba(240, 230, 210, 0.05)',
                          borderColor: 'rgba(240, 230, 210, 0.5)',
                        }
                      }}
                    >
                      Generate Contract
                    </Button>
                  </Box>
                </Paper>
                
                <Box sx={{ mt: 4, textAlign: 'center' }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={handleCompleteRental}
                    disabled={!formData.depositPaymentMethod || !formData.depositPaid}
                    sx={{
                      backgroundColor: colors.distressedRed,
                      color: colors.offWhite,
                      py: 1.5,
                      px: 5,
                      '&:hover': {
                        backgroundColor: '#a32e1c',
                      },
                      '&.Mui-disabled': {
                        backgroundColor: 'rgba(194, 59, 35, 0.3)',
                      }
                    }}
                  >
                    Complete Rental
                  </Button>
                  
                  {(!formData.depositPaymentMethod || !formData.depositPaid) && (
                    <Typography 
                      variant="body2"
                      sx={{ 
                        color: 'rgba(240, 230, 210, 0.7)',
                        mt: 1
                      }}
                    >
                      Please collect deposit payment before completing the rental
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          component="a"
          href="/rentals"
          startIcon={<ArrowBackIcon />}
          sx={{ 
            color: colors.offWhite,
            mb: 2,
            '&:hover': {
              color: colors.vuYellow
            } 
          }}
        >
          Back to Rentals
        </Button>
        
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            color: colors.offWhite,
            fontWeight: 'bold',
          }}
        >
          Create New Rental
        </Typography>
      </Box>

      <Paper 
        elevation={3}
        sx={{ 
          p: 4, 
          mb: 4,
          bgcolor: colors.charcoalBlack,
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
        <Stepper 
          activeStep={activeStep} 
          alternativeLabel
          sx={{
            mb: 4,
            '.MuiStepLabel-label': {
              color: activeStep === 2 ? colors.vuYellow : 'rgba(240, 230, 210, 0.7)',
              '&.Mui-active': {
                color: colors.vuYellow
              },
              '&.Mui-completed': {
                color: colors.offWhite
              }
            },
            '.MuiStepIcon-root': {
              color: colors.mutedGray,
            },
            '.MuiStepIcon-root.Mui-active': {
              color: colors.vuYellow,
            },
            '.MuiStepIcon-root.Mui-completed': {
              color: colors.distressedRed,
            },
          }}
        >
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        
        <Box>{getStepContent(activeStep)}</Box>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{
              color: colors.offWhite,
              '&:hover': {
                backgroundColor: 'rgba(240, 230, 210, 0.05)'
              },
              '&.Mui-disabled': {
                color: 'rgba(240, 230, 210, 0.3)'
              }
            }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            sx={{
              backgroundColor: colors.distressedRed,
              color: colors.offWhite,
              '&:hover': {
                backgroundColor: '#a32e1c',
              }
            }}
          >
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateRentalPage;