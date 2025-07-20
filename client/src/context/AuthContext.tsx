// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_APP_NAME: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

export interface User {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  avatar?: string;
  isActive: boolean;
  roles: Array<{
    _id: string;
    name: string;
    description: string;
  }>;
  projects: Array<{
    project: {
      _id: string;
      name: string;
      key: string;
    };
    role: {
      _id: string;
      name: string;
    };
  }>;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshToken: () => Promise<void>;
  isAuthenticated: boolean;
  hasRole: (roleName: string) => boolean;
  hasPermission: (permission: string) => boolean;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps { 
  children: ReactNode; 
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5050';

  // // Initialize auth state on mount
  // useEffect(() => {
  //   let mounted = true;
    
  //   const initializeAuth = async () => {
  //     // Prevent multiple simultaneous refresh calls
  //     if (refreshing) return;
      
  //     try {
  //       setRefreshing(true);
  //       await refreshToken();
  //     } catch (error) {
  //       console.log('Initial refresh failed, user needs to login');
  //       // Don't throw error - just means user needs to login
  //     } finally {
  //       if (mounted) {
  //         setLoading(false);
  //         setRefreshing(false);
  //       }
  //     }
  //   };

  //   initializeAuth();

  //   return () => {
  //     mounted = false;
  //   };
  // }, []); // Only run once on mount

  // / Simplified initialization - just check for existing token
  useEffect(() => {
    console.log('🔍 AuthProvider initializing...');
    
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('accessToken');
        console.log('📦 Found token:', !!token);
        
        if (token) {
          // Try to get user profile with existing token
          const response = await fetch(`${API_BASE}/api/auth/profile`, {
            headers: { 'Authorization': `Bearer ${token}` },
            credentials: 'include',
          });
          
          if (response.ok) {
            const data = await response.json();
            console.log('✅ Profile loaded:', data.user?.username);
            setUser(data.user);
          } else {
            console.log('❌ Profile failed, clearing token');
            localStorage.removeItem('accessToken');
          }
        } else {
          console.log('🔓 No token found');
        }
      } catch (error) {
        console.error('🚨 Auth init error:', error);
        localStorage.removeItem('accessToken');
      } finally {
        console.log('✅ Auth initialization complete');
        setLoading(false);
      }
    };

    initAuth();
  }, []);


  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Login failed');

      // Store access token and set user
      localStorage.setItem('accessToken', data.accessToken);
      setUser(data.user);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterData) => {
    try {
      setLoading(true);
      const response = await fetch(`${API_BASE}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Registration failed');

      // Store access token and set user
      localStorage.setItem('accessToken', data.accessToken);
      setUser(data.user);
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        await fetch(`${API_BASE}/api/auth/logout`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          credentials: 'include',
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('accessToken');
      setUser(null);
    }
  };

// AuthContext.tsx - Fixed refreshToken function
const refreshToken = async () => {
  try {
    const response = await fetch(`${API_BASE}/api/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.ok) {
      const data = await response.json();
      if (data.accessToken && data.user) {
        localStorage.setItem('accessToken', data.accessToken);
        setUser(data.user); // User data comes from refresh response
      } else {
        throw new Error('Invalid refresh response');
      }
    } else if (response.status === 409) {
      // Handle conflict - token might be already rotated
      console.log('Token refresh conflict, retrying...');
      // Wait a moment and try once more
      await new Promise(resolve => setTimeout(resolve, 100));
      throw new Error('Token refresh conflict');
    } else {
      // Other errors mean refresh failed
      await logout();
      throw new Error('Refresh token expired');
    }
  } catch (error) {
    console.error('Token refresh error:', error);
    await logout();
    throw error;
  }
};


  const hasRole = (roleName: string): boolean => {
    if (!user) return false;
    return user.roles.some(role => role.name === roleName);
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (hasRole('Admin')) return true;
    return false;
  };

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
    refreshToken,
    isAuthenticated: !!user,
    hasRole,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
