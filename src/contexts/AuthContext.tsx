import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { getCurrentUser, isAuthenticated, isStaff, isAdmin } from '../api/auth';

interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isStaff: boolean;
  isAdmin: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isStaff: false,
  isAdmin: false,
  user: null,
  loading: true,
  error: null,
  setUser: () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!isAuthenticated()) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getCurrentUser();
        setUser(userData);
        setError(null);
      } catch (err) {
        setError('Failed to load user profile');
        console.error('Error loading user profile:', err);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  const value = {
    isAuthenticated: isAuthenticated(),
    isStaff: isStaff(),
    isAdmin: isAdmin(),
    user,
    loading,
    error,
    setUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;