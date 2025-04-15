import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TablePagination,
  Chip,
  CircularProgress,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Grid
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useQuery } from 'react-query';
import { colors } from '../../styles/theme';

// Mock data for demonstration
const paymentTypes = ['Cash', 'Credit Card', 'PayPal', 'Venmo', 'Bank Transfer'];

const mockPayments = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  rentalId: Math.floor(Math.random() * 1000) + 1,
  customerName: `Customer ${Math.floor(Math.random() * 100) + 1}`,
  amount: parseFloat((Math.random() * 1000 + 50).toFixed(2)),
  paymentType: paymentTypes[Math.floor(Math.random() * paymentTypes.length)],
  paymentDate: new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)).toISOString(),
  referenceNumber: `REF-${Math.floor(Math.random() * 1000000)}`,
  status: Math.random() > 0.1 ? 'Completed' : 'Failed'
})) as Payment[];

interface Payment {
  id: number;
  rentalId: number;
  customerName: string;
  amount: number;
  paymentType: string;
  paymentDate: string;
  referenceNumber: string;
  status: 'Completed' | 'Failed' | 'Pending';
}

const PaymentListPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentTypeFilter, setPaymentTypeFilter] = useState<string>('');

  // In a real application, this would be a call to your API
  const { data: payments = [], isLoading } = useQuery<Payment[]>(
    'payments',
    async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockPayments;
    }
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handlePaymentTypeChange = (event: SelectChangeEvent) => {
    setPaymentTypeFilter(event.target.value);
    setPage(0);
  };

  const filteredPayments = payments?.filter(payment => {
    let matchesSearch = true;
    let matchesType = true;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      matchesSearch = 
        payment.customerName.toLowerCase().includes(searchLower) ||
        payment.referenceNumber.toLowerCase().includes(searchLower) ||
        payment.rentalId.toString().includes(searchLower);
    }
    
    if (paymentTypeFilter) {
      matchesType = payment.paymentType === paymentTypeFilter;
    }
    
    return matchesSearch && matchesType;
  });

  const displayedPayments = filteredPayments?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const getStatusColor = (status: Payment['status']) => {
    switch (status) {
      case 'Completed':
        return colors.success;
      case 'Failed':
        return colors.danger;
      default:
        return colors.info;
    }
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
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
        Payments
      </Typography>

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
        <Grid container spacing={2} alignItems="flex-end">
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search payments"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(0);
              }}
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
              placeholder="Customer, reference, rental ID..."
            />
          </Grid>
          <Grid item xs={12} md={6}>
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
                id="payment-type-label" 
                sx={{ color: colors.offWhite }}
              >
                Payment Type
              </InputLabel>
              <Select
                labelId="payment-type-label"
                id="payment-type-select"
                value={paymentTypeFilter}
                label="Payment Type"
                onChange={handlePaymentTypeChange}
              >
                <MenuItem value="">
                  <em>All payment types</em>
                </MenuItem>
                {paymentTypes.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>
      </Paper>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress sx={{ color: colors.distressedRed }} />
        </Box>
      ) : (
        <>
          <TableContainer 
            component={Paper}
            sx={{ 
              bgcolor: colors.mutedGray,
              borderRadius: 2,
              overflow: 'hidden',
              mb: 2,
              '& th': {
                borderBottom: `1px solid ${colors.charcoalBlack}`,
                color: colors.vuYellow,
                fontWeight: 'bold',
              },
              '& tbody tr:nth-of-type(odd)': {
                backgroundColor: 'rgba(58, 58, 58, 0.6)',
              },
              '& tbody tr:nth-of-type(even)': {
                backgroundColor: 'rgba(58, 58, 58, 0.3)',
              },
              '& tbody tr:hover': {
                backgroundColor: 'rgba(194, 59, 35, 0.1)',
              }
            }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Rental ID</TableCell>
                  <TableCell>Customer</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Reference</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedPayments?.map((payment) => (
                  <TableRow 
                    key={payment.id}
                    sx={{ 
                      '&:last-child td, &:last-child th': { 
                        border: 0 
                      },
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      '&:hover': {
                        boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                      }
                    }}
                    onClick={() => {
                      // Handle row click, e.g. navigate to payment details
                      console.log(`Navigate to payment ${payment.id} details`);
                    }}
                  >
                    <TableCell sx={{ color: colors.offWhite }}>{payment.id}</TableCell>
                    <TableCell sx={{ color: colors.offWhite }}>{payment.rentalId}</TableCell>
                    <TableCell sx={{ color: colors.offWhite }}>{payment.customerName}</TableCell>
                    <TableCell sx={{ color: colors.offWhite }}>${payment.amount.toFixed(2)}</TableCell>
                    <TableCell sx={{ color: colors.offWhite }}>{payment.paymentType}</TableCell>
                    <TableCell sx={{ color: colors.offWhite }}>
                      {new Date(payment.paymentDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ color: colors.offWhite }}>{payment.referenceNumber}</TableCell>
                    <TableCell>
                      <Chip 
                        label={payment.status} 
                        size="small" 
                        sx={{ 
                          bgcolor: `${getStatusColor(payment.status)}20`, 
                          color: getStatusColor(payment.status),
                          fontWeight: 'bold',
                          border: `1px solid ${getStatusColor(payment.status)}`,
                        }} 
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          
          <TablePagination
            component="div"
            rowsPerPageOptions={[5, 10, 25]}
            count={filteredPayments?.length || 0}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            sx={{
              color: colors.offWhite,
              '& .MuiTablePagination-select': {
                color: colors.offWhite,
              },
              '& .MuiTablePagination-selectIcon': {
                color: colors.offWhite,
              },
              '& .MuiTablePagination-displayedRows': {
                color: colors.offWhite,
              },
              '& .MuiIconButton-root': {
                color: colors.offWhite,
              },
              '& .Mui-disabled': {
                color: 'rgba(240, 230, 210, 0.3) !important',
              }
            }}
          />
        </>
      )}
    </Container>
  );
};

export default PaymentListPage;