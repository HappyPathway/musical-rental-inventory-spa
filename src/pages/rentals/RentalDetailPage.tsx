import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Grid, 
  Chip,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert
} from '@mui/material';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ReceiptIcon from '@mui/icons-material/Receipt';
import HistoryIcon from '@mui/icons-material/History';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import { colors } from '../../styles/theme';

interface RentalItem {
  id: number;
  equipmentId: number;
  equipmentName: string;
  quantity: number;
  price: number;
  condition: string;
  returned: boolean;
  returnedDate: string | null;
}

interface Rental {
  id: number;
  customerId: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  depositTotal: number;
  depositPaid: boolean;
  status: string;
  notes: string;
  contractSigned: boolean;
  items: RentalItem[];
  paymentHistory: PaymentRecord[];
}

interface PaymentRecord {
  id: number;
  amount: number;
  paymentType: string;
  paymentDate: string;
  referenceNumber: string;
}

// This would be fetched from the API in a real application
const mockRental: Rental = {
  id: 1,
  customerId: 42,
  customerName: "John Doe",
  customerEmail: "john.doe@example.com",
  customerPhone: "555-123-4567",
  startDate: new Date(2025, 3, 5).toISOString(),
  endDate: new Date(2025, 3, 12).toISOString(),
  totalPrice: 875.50,
  depositTotal: 300.00,
  depositPaid: true,
  status: "Active",
  notes: "Customer requested equipment to be delivered to venue.",
  contractSigned: true,
  items: [
    {
      id: 1,
      equipmentId: 101,
      equipmentName: "Fender Stratocaster",
      quantity: 1,
      price: 250.00,
      condition: "Excellent, no scratches",
      returned: false,
      returnedDate: null
    },
    {
      id: 2,
      equipmentId: 205,
      equipmentName: "Shure SM58 Microphone",
      quantity: 2,
      price: 75.50,
      condition: "Good working condition",
      returned: false,
      returnedDate: null
    },
    {
      id: 3,
      equipmentId: 310,
      equipmentName: "Roland Jazz Chorus Amplifier",
      quantity: 1,
      price: 200.00,
      condition: "Minor wear on knobs",
      returned: false,
      returnedDate: null
    },
    {
      id: 4,
      equipmentId: 415,
      equipmentName: "XLR Cable",
      quantity: 5,
      price: 50.00,
      condition: "New",
      returned: false,
      returnedDate: null
    }
  ],
  paymentHistory: [
    {
      id: 1001,
      amount: 300.00,
      paymentType: "Credit Card",
      paymentDate: new Date(2025, 3, 1).toISOString(),
      referenceNumber: "CC-9876543"
    },
    {
      id: 1002,
      amount: 400.00,
      paymentType: "PayPal",
      paymentDate: new Date(2025, 3, 5).toISOString(),
      referenceNumber: "PP-1234567"
    }
  ]
};

const RentalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const rentalId = parseInt(id || '0', 10);

  // In a real application, this would call the API with the ID
  const { data: rental, isLoading, error } = useQuery<Rental, Error>(
    ['rental', rentalId],
    async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      if (rentalId !== 1 && rentalId <= 0) {
        throw new Error('Rental not found');
      }
      return mockRental;
    }
  );

  const handleMarkReturned = () => {
    // This would be an API call in a real application
    alert('This feature would process the return in a real application');
  };

  const handleProcessPayment = () => {
    // Navigate to payment page in a real application
    navigate('/payments/new?rentalId=' + rentalId);
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
        <CircularProgress sx={{ color: colors.distressedRed }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" 
          sx={{ 
            mb: 3,
            backgroundColor: 'rgba(194, 59, 35, 0.1)',
            border: `1px solid ${colors.danger}`,
            color: colors.danger
          }}
        >
          Error loading rental details: {error.message}
        </Alert>
        <Button
          component={Link}
          to="/rentals"
          startIcon={<ArrowBackIcon />}
          sx={{ 
            color: colors.offWhite,
            '&:hover': {
              color: colors.vuYellow
            } 
          }}
        >
          Back to Rentals
        </Button>
      </Container>
    );
  }

  if (!rental) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="warning"
          sx={{ 
            mb: 3,
            backgroundColor: 'rgba(255, 206, 84, 0.1)',
            border: `1px solid ${colors.vuYellow}`,
            color: colors.vuYellow
          }}
        >
          Rental not found
        </Alert>
        <Button
          component={Link}
          to="/rentals"
          startIcon={<ArrowBackIcon />}
          sx={{ 
            color: colors.offWhite,
            '&:hover': {
              color: colors.vuYellow
            } 
          }}
        >
          Back to Rentals
        </Button>
      </Container>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return colors.success;
      case 'Overdue':
        return colors.danger;
      case 'Completed':
        return colors.vuYellow;
      case 'Cancelled':
        return colors.info;
      default:
        return colors.offWhite;
    }
  };

  const remainingBalance = rental.totalPrice - rental.paymentHistory.reduce(
    (sum, payment) => sum + payment.amount, 0
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Button
          component={Link}
          to="/rentals"
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
        
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2
        }}>
          <Box>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{ 
                color: colors.offWhite,
                fontWeight: 'bold'
              }}
            >
              Rental #{rental.id}
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Chip 
                label={rental.status} 
                sx={{ 
                  bgcolor: `${getStatusColor(rental.status)}20`,
                  color: getStatusColor(rental.status),
                  fontWeight: 'bold',
                  border: `1px solid ${getStatusColor(rental.status)}`,
                  mr: 1
                }} 
              />
              
              {rental.contractSigned && (
                <Chip 
                  label="Contract Signed" 
                  size="small"
                  sx={{ 
                    bgcolor: 'rgba(93, 156, 236, 0.1)',
                    color: colors.info,
                    fontWeight: 'medium',
                    border: `1px solid ${colors.info}`,
                  }} 
                />
              )}
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {rental.status === 'Active' && (
              <Button
                variant="outlined"
                onClick={handleMarkReturned}
                startIcon={<LocalShippingIcon />}
                sx={{
                  borderColor: colors.vuYellow,
                  color: colors.vuYellow,
                  '&:hover': {
                    borderColor: colors.vuYellow,
                    backgroundColor: 'rgba(255, 206, 84, 0.1)',
                  }
                }}
              >
                Mark Returned
              </Button>
            )}
            
            {remainingBalance > 0 && (
              <Button
                variant="contained"
                onClick={handleProcessPayment}
                startIcon={<PaymentIcon />}
                sx={{
                  backgroundColor: colors.distressedRed,
                  color: colors.offWhite,
                  '&:hover': {
                    backgroundColor: '#a32e1c',
                  }
                }}
              >
                Process Payment
              </Button>
            )}
          </Box>
        </Box>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 3, 
              mb: 4,
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
            <Typography 
              variant="h6" 
              component="h2"
              sx={{ 
                color: colors.offWhite,
                fontWeight: 'bold',
                mb: 3
              }}
            >
              Rental Items
            </Typography>
            
            <List sx={{ mb: 2 }}>
              {rental.items.map(item => (
                <React.Fragment key={item.id}>
                  <ListItem
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      bgcolor: 'rgba(58, 58, 58, 0.3)',
                      '&:hover': {
                        bgcolor: 'rgba(58, 58, 58, 0.5)',
                      }
                    }}
                  >
                    <ListItemText 
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography sx={{ color: colors.offWhite }}>
                            {item.equipmentName} {item.quantity > 1 && `(${item.quantity}x)`}
                          </Typography>
                          <Typography sx={{ color: colors.offWhite }}>
                            ${item.price.toFixed(2)}
                          </Typography>
                        </Box>
                      }
                      secondary={
                        <Box sx={{ mt: 0.5 }}>
                          <Typography variant="body2" sx={{ color: 'rgba(240, 230, 210, 0.7)' }}>
                            Condition: {item.condition}
                          </Typography>
                          {item.returned && (
                            <Chip 
                              label="Returned" 
                              size="small"
                              sx={{ 
                                mt: 0.5,
                                bgcolor: `${colors.success}20`,
                                color: colors.success,
                                fontWeight: 'bold',
                                border: `1px solid ${colors.success}`,
                                fontSize: '0.7rem',
                              }} 
                            />
                          )}
                        </Box>
                      }
                      sx={{
                        my: 0.5,
                      }}
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
            
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              mt: 3,
              pt: 2,
              borderTop: `1px dashed rgba(240, 230, 210, 0.2)`,
              color: colors.offWhite
            }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">${rental.totalPrice.toFixed(2)}</Typography>
            </Box>
          </Paper>
          
          <Paper 
            elevation={3}
            sx={{ 
              p: 3, 
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
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2
            }}>
              <Typography 
                variant="h6" 
                component="h2"
                sx={{ 
                  color: colors.offWhite,
                  fontWeight: 'bold',
                }}
              >
                Payment History
              </Typography>
              
              <PaymentIcon sx={{ color: colors.vuYellow }} />
            </Box>
            
            <Divider sx={{ mb: 2, bgcolor: 'rgba(240, 230, 210, 0.1)' }} />
            
            {rental.paymentHistory.length > 0 ? (
              <>
                <List>
                  {rental.paymentHistory.map(payment => (
                    <ListItem
                      key={payment.id}
                      sx={{
                        borderRadius: 1,
                        mb: 1,
                        bgcolor: 'rgba(58, 58, 58, 0.3)',
                        '&:hover': {
                          bgcolor: 'rgba(58, 58, 58, 0.5)',
                        }
                      }}
                    >
                      <ListItemText 
                        primary={
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Typography sx={{ color: colors.offWhite }}>
                              {payment.paymentType} 
                              <Typography 
                                component="span" 
                                variant="caption" 
                                sx={{ 
                                  color: 'rgba(240, 230, 210, 0.7)',
                                  ml: 1 
                                }}
                              >
                                #{payment.referenceNumber}
                              </Typography>
                            </Typography>
                            <Typography sx={{ color: colors.offWhite }}>
                              ${payment.amount.toFixed(2)}
                            </Typography>
                          </Box>
                        }
                        secondary={
                          <Typography variant="body2" sx={{ color: 'rgba(240, 230, 210, 0.7)' }}>
                            {new Date(payment.paymentDate).toLocaleDateString()} at {new Date(payment.paymentDate).toLocaleTimeString()}
                          </Typography>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mt: 3,
                  pt: 2,
                  borderTop: `1px dashed rgba(240, 230, 210, 0.2)`,
                }}>
                  <Typography sx={{ color: colors.offWhite }}>Total Paid</Typography>
                  <Typography sx={{ color: colors.offWhite }}>
                    ${rental.paymentHistory.reduce((sum, payment) => sum + payment.amount, 0).toFixed(2)}
                  </Typography>
                </Box>
                
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  mt: 1,
                }}>
                  <Typography sx={{ color: colors.offWhite, fontWeight: 'bold' }}>Remaining</Typography>
                  <Typography sx={{ 
                    color: remainingBalance > 0 ? colors.danger : colors.success,
                    fontWeight: 'bold'
                  }}>
                    ${remainingBalance.toFixed(2)}
                  </Typography>
                </Box>
              </>
            ) : (
              <Typography sx={{ color: 'rgba(240, 230, 210, 0.7)', py: 2, textAlign: 'center' }}>
                No payment records found
              </Typography>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={3}
            sx={{ 
              p: 3, 
              mb: 4,
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
            <Typography 
              variant="h6" 
              component="h2"
              sx={{ 
                color: colors.offWhite,
                fontWeight: 'bold',
                mb: 2
              }}
            >
              Customer Information
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" sx={{ color: colors.offWhite, fontWeight: 'bold' }}>
                {rental.customerName}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(240, 230, 210, 0.7)' }}>
                {rental.customerEmail}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(240, 230, 210, 0.7)' }}>
                {rental.customerPhone}
              </Typography>
            </Box>
            
            <Button
              component={Link}
              to={`/customers/${rental.customerId}`}
              variant="outlined"
              size="small"
              sx={{
                borderColor: colors.info,
                color: colors.info,
                '&:hover': {
                  borderColor: colors.info,
                  backgroundColor: 'rgba(93, 156, 236, 0.1)',
                }
              }}
            >
              View Customer Profile
            </Button>
          </Paper>
          
          <Paper 
            elevation={3}
            sx={{ 
              p: 3, 
              mb: 4,
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
            <Typography 
              variant="h6" 
              component="h2"
              sx={{ 
                color: colors.offWhite,
                fontWeight: 'bold',
                mb: 2
              }}
            >
              Rental Details
            </Typography>
            
            <Grid container spacing={1} sx={{ mb: 2 }}>
              <Grid item xs={5}>
                <Typography variant="body2" sx={{ color: 'rgba(240, 230, 210, 0.7)' }}>
                  Duration:
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography variant="body2" sx={{ color: colors.offWhite }}>
                  {new Date(rental.startDate).toLocaleDateString()} - {new Date(rental.endDate).toLocaleDateString()}
                </Typography>
              </Grid>
              
              <Grid item xs={5}>
                <Typography variant="body2" sx={{ color: 'rgba(240, 230, 210, 0.7)' }}>
                  Deposit:
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography variant="body2" sx={{ color: colors.offWhite }}>
                  ${rental.depositTotal.toFixed(2)}
                  {rental.depositPaid && (
                    <Chip 
                      label="Paid" 
                      size="small"
                      sx={{ 
                        ml: 1,
                        bgcolor: `${colors.success}20`,
                        color: colors.success,
                        fontWeight: 'bold',
                        border: `1px solid ${colors.success}`,
                        fontSize: '0.7rem',
                      }} 
                    />
                  )}
                </Typography>
              </Grid>
              
              <Grid item xs={5}>
                <Typography variant="body2" sx={{ color: 'rgba(240, 230, 210, 0.7)' }}>
                  Total Items:
                </Typography>
              </Grid>
              <Grid item xs={7}>
                <Typography variant="body2" sx={{ color: colors.offWhite }}>
                  {rental.items.length}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ my: 2, bgcolor: 'rgba(240, 230, 210, 0.1)' }} />
            
            <Typography 
              variant="subtitle2"
              sx={{ 
                color: colors.offWhite,
                fontWeight: 'medium',
                mb: 1
              }}
            >
              Notes
            </Typography>
            
            <Typography 
              variant="body2" 
              sx={{ 
                color: 'rgba(240, 230, 210, 0.7)',
                p: 1.5,
                borderRadius: 1,
                bgcolor: 'rgba(18, 18, 18, 0.3)',
              }}
            >
              {rental.notes || "No notes available"}
            </Typography>
          </Paper>
          
          <Paper 
            elevation={3}
            sx={{ 
              p: 3,
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
            <Typography 
              variant="h6" 
              component="h2"
              sx={{ 
                color: colors.offWhite,
                fontWeight: 'bold',
                mb: 2
              }}
            >
              Actions
            </Typography>
            
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<ReceiptIcon />}
                sx={{
                  justifyContent: 'flex-start',
                  color: colors.offWhite,
                  borderColor: 'rgba(240, 230, 210, 0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(240, 230, 210, 0.05)',
                    borderColor: 'rgba(240, 230, 210, 0.5)',
                  }
                }}
              >
                Download Invoice
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<HistoryIcon />}
                sx={{
                  justifyContent: 'flex-start',
                  color: colors.offWhite,
                  borderColor: 'rgba(240, 230, 210, 0.3)',
                  '&:hover': {
                    backgroundColor: 'rgba(240, 230, 210, 0.05)',
                    borderColor: 'rgba(240, 230, 210, 0.5)',
                  }
                }}
              >
                View Activity Log
              </Button>
              
              {rental.contractSigned && (
                <Button
                  variant="outlined"
                  startIcon={<ReceiptIcon />}
                  sx={{
                    justifyContent: 'flex-start',
                    color: colors.offWhite,
                    borderColor: 'rgba(240, 230, 210, 0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(240, 230, 210, 0.05)',
                      borderColor: 'rgba(240, 230, 210, 0.5)',
                    }
                  }}
                >
                  View Contract
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RentalDetailPage;