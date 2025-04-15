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
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { colors } from '../../styles/theme';

// Mock data for demonstration
const rentalStatuses = ['Active', 'Completed', 'Overdue', 'Cancelled'];

const mockRentals = Array.from({ length: 50 }, (_, i) => {
  const startDate = new Date(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
  const endDate = new Date(startDate.getTime() + Math.floor(Math.random() * 14 + 3) * 24 * 60 * 60 * 1000);
  
  return {
    id: i + 1,
    customerId: Math.floor(Math.random() * 100) + 1,
    customerName: `Customer ${Math.floor(Math.random() * 100) + 1}`,
    startDate: startDate.toISOString(),
    endDate: endDate.toISOString(),
    totalPrice: parseFloat((Math.random() * 1000 + 100).toFixed(2)),
    depositTotal: parseFloat((Math.random() * 500 + 50).toFixed(2)),
    depositPaid: Math.random() > 0.2,
    status: rentalStatuses[Math.floor(Math.random() * rentalStatuses.length)],
    itemCount: Math.floor(Math.random() * 5) + 1
  };
});

interface Rental {
  id: number;
  customerId: number;
  customerName: string;
  startDate: string;
  endDate: string;
  totalPrice: number;
  depositTotal: number;
  depositPaid: boolean;
  status: string;
  itemCount: number;
}

const RentalListPage: React.FC = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');

  // In a real application, this would be a call to your API
  const { data: rentals, isLoading } = useQuery<Rental[]>(
    'rentals',
    async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      return mockRentals;
    }
  );

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleStatusChange = (event: SelectChangeEvent) => {
    setStatusFilter(event.target.value);
    setPage(0);
  };

  const filteredRentals = rentals?.filter(rental => {
    let matchesSearch = true;
    let matchesStatus = true;
    
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      matchesSearch = 
        rental.customerName.toLowerCase().includes(searchLower) ||
        rental.id.toString().includes(searchLower);
    }
    
    if (statusFilter) {
      matchesStatus = rental.status === statusFilter;
    }
    
    return matchesSearch && matchesStatus;
  });

  const displayedRentals = filteredRentals?.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

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

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box 
        sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 4 
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{ 
            color: colors.offWhite,
            fontWeight: 'bold',
          }}
        >
          Rentals
        </Typography>
        
        <Button
          component={Link}
          to="/rentals/create"
          variant="contained"
          startIcon={<AddIcon />}
          sx={{
            backgroundColor: colors.distressedRed,
            color: colors.offWhite,
            '&:hover': {
              backgroundColor: '#a32e1c',
            }
          }}
        >
          Create Rental
        </Button>
      </Box>

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
              label="Search rentals"
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
              placeholder="Customer name, rental ID..."
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
                id="status-label" 
                sx={{ color: colors.offWhite }}
              >
                Status
              </InputLabel>
              <Select
                labelId="status-label"
                id="status-select"
                value={statusFilter}
                label="Status"
                onChange={handleStatusChange}
              >
                <MenuItem value="">
                  <em>All statuses</em>
                </MenuItem>
                {rentalStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
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
                  <TableCell>Customer</TableCell>
                  <TableCell>Start Date</TableCell>
                  <TableCell>End Date</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Deposit</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {displayedRentals?.map((rental) => (
                  <TableRow 
                    key={rental.id}
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
                      // Handle row click, navigate to rental details
                      window.location.href = `/rentals/${rental.id}`;
                    }}
                  >
                    <TableCell sx={{ color: colors.offWhite }}>{rental.id}</TableCell>
                    <TableCell sx={{ color: colors.offWhite }}>{rental.customerName}</TableCell>
                    <TableCell sx={{ color: colors.offWhite }}>
                      {new Date(rental.startDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ color: colors.offWhite }}>
                      {new Date(rental.endDate).toLocaleDateString()}
                    </TableCell>
                    <TableCell sx={{ color: colors.offWhite }}>${rental.totalPrice.toFixed(2)}</TableCell>
                    <TableCell sx={{ color: colors.offWhite }}>
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
                          }} 
                        />
                      )}
                    </TableCell>
                    <TableCell sx={{ color: colors.offWhite }}>{rental.itemCount}</TableCell>
                    <TableCell>
                      <Chip 
                        label={rental.status} 
                        size="small"
                        sx={{ 
                          bgcolor: `${getStatusColor(rental.status)}20`,
                          color: getStatusColor(rental.status),
                          fontWeight: 'bold',
                          border: `1px solid ${getStatusColor(rental.status)}`,
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
            count={filteredRentals?.length || 0}
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

export default RentalListPage;