import apiClient from './client';
import jwt_decode from 'jwt-decode';

interface LoginCredentials {
  username: string;
  password: string;
}

interface TokenResponse {
  access_token: string;
  token_type: string;
}

interface DecodedToken {
  sub: string;
  exp: number;
  is_staff?: boolean;
  is_superuser?: boolean;
}

// Login user and get token
export const login = async (credentials: LoginCredentials): Promise<TokenResponse> => {
  const formData = new URLSearchParams();
  formData.append('username', credentials.username);
  formData.append('password', credentials.password);

  const response = await apiClient.post<TokenResponse>('/api/auth/token', formData, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });
  
  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }
  
  return response.data;
};

// Register new user
export const register = async (userData: {
  username: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}) => {
  const response = await apiClient.post('/api/users/', userData);
  return response.data;
};

// Get current user profile
export const getCurrentUser = async () => {
  const response = await apiClient.get('/api/users/me');
  return response.data;
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const decoded = jwt_decode<DecodedToken>(token);
    const currentTime = Date.now() / 1000;
    
    // Check if token is expired
    if (decoded.exp < currentTime) {
      localStorage.removeItem('token');
      return false;
    }
    
    return true;
  } catch (error) {
    localStorage.removeItem('token');
    return false;
  }
};

// Check if user is staff
export const isStaff = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const decoded = jwt_decode<DecodedToken>(token);
    return decoded.is_staff === true;
  } catch (error) {
    return false;
  }
};

// Check if user is admin (superuser)
export const isAdmin = (): boolean => {
  const token = localStorage.getItem('token');
  if (!token) return false;
  
  try {
    const decoded = jwt_decode<DecodedToken>(token);
    return decoded.is_superuser === true;
  } catch (error) {
    return false;
  }
};

// Logout user
export const logout = (): void => {
  localStorage.removeItem('token');
};