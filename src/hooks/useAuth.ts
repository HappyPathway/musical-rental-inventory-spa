import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../contexts/AuthContext';
import { login as apiLogin, logout as apiLogout, register as apiRegister } from '../api/auth';

export const useAuth = () => {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();

  const login = async (username: string, password: string) => {
    try {
      const data = await apiLogin({ username, password });
      // After successful login, fetch user data (handled by AuthContext)
      window.location.href = '/'; // Force reload to ensure AuthContext refreshes
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const logout = () => {
    apiLogout();
    auth.setUser(null);
    navigate('/login');
  };

  const register = async (userData: {
    username: string;
    email: string;
    password: string;
    first_name: string;
    last_name: string;
  }) => {
    try {
      const data = await apiRegister(userData);
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  return {
    ...auth,
    login,
    logout,
    register,
  };
};

export default useAuth;