import React, { useState } from 'react';
import { 
  Box, 
  Container, 
  Grid, 
  Typography, 
  TextField, 
  InputAdornment,
  CircularProgress,
  Alert,
  Drawer,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  Pagination,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import CloseIcon from '@mui/icons-material/Close';
import { useQuery } from 'react-query';

import { colors } from '../../styles/theme';
import { getEquipment, getCategories, Equipment } from '../../api/inventory';
import EquipmentCard from '../../components/ui/EquipmentCard';
import StyledButton from '../../components/ui/StyledButton';

// Define the interface expected by EquipmentCard
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

// Function to map API Equipment to EquipmentItem
const mapEquipmentToEquipmentItem = (equipment: Equipment, categoryName: string): EquipmentItem => {
  return {
    id: equipment.id,
    name: equipment.name,
    daily_rate: equipment.rental_price_daily,
    image_url: null, // API doesn't provide image_url
    status: equipment.status,
    category: {
      id: equipment.category_id,
      name: categoryName
    },
    brand: equipment.brand,
    model: equipment.model_number || '',
    in_stock: equipment.quantity
  };
};

const InventoryListPage: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  // Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<number | ''>('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState('name_asc');
  const [page, setPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Items per page based on screen size
  const itemsPerPage = isMobile ? 6 : isTablet ? 9 : 12;

  // Fetch equipment list
  const { 
    data: equipmentData, 
    isLoading: isLoadingEquipment, 
    error: equipmentError
  } = useQuery(
    ['equipment', page, searchTerm, categoryFilter, statusFilter, sortBy, itemsPerPage], 
    () => getEquipment({
      page,
      limit: itemsPerPage,
      search: searchTerm,
      category_id: categoryFilter !== '' ? categoryFilter : undefined,
      status: statusFilter !== '' ? statusFilter : undefined,
      sort_by: sortBy,
    }),
    {
      keepPreviousData: true,
    }
  );

  // Fetch equipment categories
  const { 
    data: categories
  } = useQuery('equipment-categories', getCategories);

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
    setPage(1); // Reset to first page on new search
  };

  // Handle category filter change
  const handleCategoryChange = (event: SelectChangeEvent<number | string>) => {
    setCategoryFilter(event.target.value as number | '');
    setPage(1); // Reset to first page on new filter
  };

  // Handle status filter change
  const handleStatusChange = (event: SelectChangeEvent<string>) => {
    setStatusFilter(event.target.value);
    setPage(1); // Reset to first page on new filter
  };

  // Handle sort change
  const handleSortChange = (event: SelectChangeEvent<string>) => {
    setSortBy(event.target.value);
    setPage(1); // Reset to first page on new sort
  };

  // Handle page change
  const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setCategoryFilter('');
    setStatusFilter('');
    setSortBy('name_asc');
    setPage(1);
  };

  // Toggle filter drawer (for mobile)
  const toggleDrawer = () => {
    setDrawerOpen(!drawerOpen);
  };

  // Calculate total pages
  const totalItems = equipmentData?.total_count || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box mb={4}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          fontWeight="bold"
          color={colors.offWhite}
        >
          Equipment Inventory
        </Typography>
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ color: 'rgba(240, 230, 210, 0.7)' }}
        >
          Browse and rent our selection of professional audio equipment
        </Typography>
      </Box>

      {/* Search and Filter Bar */}
      <Box 
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between',
          alignItems: { xs: 'stretch', sm: 'center' },
          mb: 3,
          gap: 2,
        }}
      >
        {/* Search Input */}
        <Box sx={{ flex: 1 }}>
          <TextField
            placeholder="Search equipment..."
            fullWidth
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: colors.charcoalBlack }} />
                </InputAdornment>
              ),
              sx: {
                backgroundColor: '#FFFFFF',
                borderRadius: theme.shape.borderRadius,
                color: colors.charcoalBlack,
                position: 'relative',
                overflow: 'hidden',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: theme.shape.borderRadius,
                  padding: 2,
                  background: `linear-gradient(90deg, ${colors.distressedRed}, ${colors.vuYellow})`,
                  WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                  WebkitMaskComposite: 'xor',
                  maskComposite: 'exclude',
                  pointerEvents: 'none',
                },
              },
            }}
            variant="outlined"
          />
        </Box>

        {/* Filter Button (Mobile) */}
        {isMobile ? (
          <StyledButton
            startIcon={<FilterListIcon />}
            buttonVariant="outlined"
            onClick={toggleDrawer}
            fullWidth
          >
            Filters
          </StyledButton>
        ) : (
          // Desktop Filters
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 2,
              alignItems: 'center',
            }}
          >
            {/* Category Filter */}
            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel id="category-filter-label" sx={{ color: colors.offWhite }}>Category</InputLabel>
              <Select
                labelId="category-filter-label"
                id="category-filter"
                value={categoryFilter}
                label="Category"
                onChange={handleCategoryChange}
                sx={{
                  backgroundColor: colors.mutedGray,
                  color: colors.offWhite,
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(240, 230, 210, 0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(240, 230, 210, 0.3)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.distressedRed,
                  },
                }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories?.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Status Filter */}
            <FormControl sx={{ minWidth: 120 }} size="small">
              <InputLabel id="status-filter-label" sx={{ color: colors.offWhite }}>Status</InputLabel>
              <Select
                labelId="status-filter-label"
                id="status-filter"
                value={statusFilter}
                label="Status"
                onChange={handleStatusChange}
                sx={{
                  backgroundColor: colors.mutedGray,
                  color: colors.offWhite,
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(240, 230, 210, 0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(240, 230, 210, 0.3)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.distressedRed,
                  },
                }}
              >
                <MenuItem value="">All Statuses</MenuItem>
                <MenuItem value="available">Available</MenuItem>
                <MenuItem value="rented">Rented</MenuItem>
                <MenuItem value="maintenance">Maintenance</MenuItem>
              </Select>
            </FormControl>

            {/* Sort By */}
            <FormControl sx={{ minWidth: 150 }} size="small">
              <InputLabel id="sort-by-label" sx={{ color: colors.offWhite }}>Sort By</InputLabel>
              <Select
                labelId="sort-by-label"
                id="sort-by"
                value={sortBy}
                label="Sort By"
                onChange={handleSortChange}
                sx={{
                  backgroundColor: colors.mutedGray,
                  color: colors.offWhite,
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(240, 230, 210, 0.2)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(240, 230, 210, 0.3)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: colors.distressedRed,
                  },
                }}
              >
                <MenuItem value="name_asc">Name (A-Z)</MenuItem>
                <MenuItem value="name_desc">Name (Z-A)</MenuItem>
                <MenuItem value="price_asc">Price (Low to High)</MenuItem>
                <MenuItem value="price_desc">Price (High to Low)</MenuItem>
                <MenuItem value="newest">Newest First</MenuItem>
              </Select>
            </FormControl>

            {/* Reset Filters */}
            {(searchTerm || categoryFilter !== '' || statusFilter !== '' || sortBy !== 'name_asc') && (
              <IconButton 
                onClick={handleResetFilters} 
                sx={{ color: colors.offWhite }}
                size="small"
              >
                <CloseIcon />
              </IconButton>
            )}
          </Box>
        )}
      </Box>

      {/* Mobile Filter Drawer */}
      <Drawer
        anchor="bottom"
        open={drawerOpen}
        onClose={toggleDrawer}
        PaperProps={{
          sx: {
            backgroundColor: colors.charcoalBlack,
            borderTopLeftRadius: 16,
            borderTopRightRadius: 16,
            padding: 3,
            paddingTop: 1,
            maxHeight: '85vh',
          }
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Typography variant="h6" color={colors.offWhite} fontWeight="bold">
            Filter Equipment
          </Typography>
          <IconButton onClick={toggleDrawer} sx={{ color: colors.offWhite }}>
            <CloseIcon />
          </IconButton>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Category Filter */}
          <FormControl fullWidth>
            <InputLabel id="drawer-category-filter-label" sx={{ color: colors.offWhite }}>Category</InputLabel>
            <Select
              labelId="drawer-category-filter-label"
              id="drawer-category-filter"
              value={categoryFilter}
              label="Category"
              onChange={handleCategoryChange}
              sx={{
                backgroundColor: colors.mutedGray,
                color: colors.offWhite,
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(240, 230, 210, 0.2)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(240, 230, 210, 0.3)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.distressedRed,
                },
              }}
            >
              <MenuItem value="">All Categories</MenuItem>
              {categories?.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Status Filter */}
          <FormControl fullWidth>
            <InputLabel id="drawer-status-filter-label" sx={{ color: colors.offWhite }}>Status</InputLabel>
            <Select
              labelId="drawer-status-filter-label"
              id="drawer-status-filter"
              value={statusFilter}
              label="Status"
              onChange={handleStatusChange}
              sx={{
                backgroundColor: colors.mutedGray,
                color: colors.offWhite,
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(240, 230, 210, 0.2)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(240, 230, 210, 0.3)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.distressedRed,
                },
              }}
            >
              <MenuItem value="">All Statuses</MenuItem>
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="rented">Rented</MenuItem>
              <MenuItem value="maintenance">Maintenance</MenuItem>
            </Select>
          </FormControl>

          {/* Sort By */}
          <FormControl fullWidth>
            <InputLabel id="drawer-sort-by-label" sx={{ color: colors.offWhite }}>Sort By</InputLabel>
            <Select
              labelId="drawer-sort-by-label"
              id="drawer-sort-by"
              value={sortBy}
              label="Sort By"
              onChange={handleSortChange}
              sx={{
                backgroundColor: colors.mutedGray,
                color: colors.offWhite,
                '.MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(240, 230, 210, 0.2)',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(240, 230, 210, 0.3)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: colors.distressedRed,
                },
              }}
            >
              <MenuItem value="name_asc">Name (A-Z)</MenuItem>
              <MenuItem value="name_desc">Name (Z-A)</MenuItem>
              <MenuItem value="price_asc">Price (Low to High)</MenuItem>
              <MenuItem value="price_desc">Price (High to Low)</MenuItem>
              <MenuItem value="newest">Newest First</MenuItem>
            </Select>
          </FormControl>

          <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
            <StyledButton
              buttonVariant="outlined"
              onClick={handleResetFilters}
              fullWidth
            >
              Reset Filters
            </StyledButton>
            <StyledButton
              buttonVariant="primary"
              onClick={toggleDrawer}
              fullWidth
            >
              Apply Filters
            </StyledButton>
          </Box>
        </Box>
      </Drawer>

      {/* Active filters display */}
      {(searchTerm || categoryFilter !== '' || statusFilter !== '') && (
        <Box 
          sx={{ 
            display: 'flex', 
            flexWrap: 'wrap',
            gap: 1,
            mb: 2,
          }}
        >
          {searchTerm && (
            <Box 
              sx={{ 
                bgcolor: 'rgba(240, 230, 210, 0.1)',
                color: colors.offWhite,
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Search: {searchTerm}
              <IconButton 
                size="small" 
                onClick={() => setSearchTerm('')}
                sx={{ 
                  ml: 0.5, 
                  color: colors.offWhite,
                  p: 0.5,
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
          
          {categoryFilter !== '' && categories && (
            <Box 
              sx={{ 
                bgcolor: 'rgba(240, 230, 210, 0.1)',
                color: colors.offWhite,
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Category: {categories.find(c => c.id === categoryFilter)?.name}
              <IconButton 
                size="small" 
                onClick={() => setCategoryFilter('')}
                sx={{ 
                  ml: 0.5, 
                  color: colors.offWhite,
                  p: 0.5,
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
          
          {statusFilter !== '' && (
            <Box 
              sx={{ 
                bgcolor: 'rgba(240, 230, 210, 0.1)',
                color: colors.offWhite,
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
                fontSize: '0.875rem',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              Status: {statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              <IconButton 
                size="small" 
                onClick={() => setStatusFilter('')}
                sx={{ 
                  ml: 0.5, 
                  color: colors.offWhite,
                  p: 0.5,
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      )}

      {/* Equipment List */}
      {isLoadingEquipment ? (
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
          <CircularProgress size={60} sx={{ color: colors.distressedRed }} />
        </Box>
      ) : equipmentError ? (
        <Alert 
          severity="error"
          sx={{ 
            mb: 3,
            backgroundColor: 'rgba(194, 59, 35, 0.1)',
            border: `1px solid ${colors.danger}`,
            color: colors.danger
          }}
        >
          Failed to load equipment. Please try refreshing the page.
        </Alert>
      ) : equipmentData && equipmentData.items && equipmentData.items.length > 0 ? (
        <>
          <Grid container spacing={3}>
            {equipmentData.items.map((equipment) => {
              // Find category name for this equipment
              const categoryName = categories?.find(c => c.id === equipment.category_id)?.name || 'Unknown';
              // Map API Equipment to EquipmentItem for the card
              const equipmentItem = mapEquipmentToEquipmentItem(equipment, categoryName);
              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={equipment.id}>
                  <EquipmentCard equipment={equipmentItem} compact={isMobile} />
                </Grid>
              );
            })}
          </Grid>

          {/* Pagination */}
          {totalPages > 1 && (
            <Box 
              sx={{
                display: 'flex',
                justifyContent: 'center',
                mt: 4,
              }}
            >
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: colors.offWhite,
                    '&.Mui-selected': {
                      backgroundColor: colors.distressedRed,
                      '&:hover': {
                        backgroundColor: '#A9331F',
                      },
                    },
                    '&:hover': {
                      backgroundColor: 'rgba(240, 230, 210, 0.1)',
                    },
                  },
                }}
              />
            </Box>
          )}
          
          {/* Results count */}
          <Typography 
            variant="body2" 
            align="center" 
            sx={{ mt: 2, color: 'rgba(240, 230, 210, 0.6)' }}
          >
            Showing {((page - 1) * itemsPerPage) + 1} - {Math.min(page * itemsPerPage, totalItems)} of {totalItems} items
          </Typography>
        </>
      ) : (
        <Box 
          sx={{ 
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            py: 6,
            backgroundColor: colors.mutedGray,
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" component="p" color={colors.offWhite} gutterBottom>
            No equipment found
          </Typography>
          <Typography variant="body2" color="rgba(240, 230, 210, 0.6)" align="center" sx={{ mb: 2 }}>
            Try adjusting your filters or search terms
          </Typography>
          <StyledButton 
            buttonVariant="outlined" 
            onClick={handleResetFilters}
          >
            Clear Filters
          </StyledButton>
        </Box>
      )}
    </Container>
  );
};

export default InventoryListPage;