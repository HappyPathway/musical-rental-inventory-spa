import React from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, CircularProgress, Box } from '@mui/material';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import theme from './styles/theme';
import { AuthProvider } from './contexts/AuthContext';

// Layout
import AppLayout from './components/layout/AppLayout';

// Pages - lazy load to improve initial loading time
const HomePage = React.lazy(() => import('./pages/HomePage'));
const LoginPage = React.lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = React.lazy(() => import('./pages/auth/RegisterPage'));
const InventoryListPage = React.lazy(() => import('./pages/inventory/InventoryListPage'));
const EquipmentDetailPage = React.lazy(() => import('./pages/inventory/EquipmentDetailPage'));
const RentalListPage = React.lazy(() => import('./pages/rentals/RentalListPage'));
const RentalDetailPage = React.lazy(() => import('./pages/rentals/RentalDetailPage'));
const CreateRentalPage = React.lazy(() => import('./pages/rentals/CreateRentalPage'));
const PaymentListPage = React.lazy(() => import('./pages/payments/PaymentListPage'));
const ProfilePage = React.lazy(() => import('./pages/auth/ProfilePage'));
const NotFoundPage = React.lazy(() => import('./pages/NotFoundPage'));

// Configure React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Loading component for lazy-loaded routes
const LoadingComponent = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: theme.palette.background.default,
    }}
  >
    <CircularProgress sx={{ color: theme.palette.primary.main }} />
  </Box>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient}>
        <Router>
          <AuthProvider>
            <React.Suspense fallback={<LoadingComponent />}>
              <Routes>
                {/* Auth Pages (no layout) */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                
                {/* Pages with App Layout */}
                <Route path="/" element={<AppLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="inventory" element={<InventoryListPage />} />
                  <Route path="inventory/:id" element={<EquipmentDetailPage />} />
                  <Route path="rentals" element={<RentalListPage />} />
                  <Route path="rentals/:id" element={<RentalDetailPage />} />
                  <Route path="rentals/new" element={<CreateRentalPage />} />
                  <Route path="payments" element={<PaymentListPage />} />
                  <Route path="profile" element={<ProfilePage />} />
                </Route>
                
                {/* 404 route */}
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
              </Routes>
            </React.Suspense>
          </AuthProvider>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
