import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ROLES, FACULTY_SCOPES, STORAGE_KEYS, ROLE_DEFAULT_ROUTES } from '../utils/constants';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || null);
  const [activeFacultyScope, setActiveFacultyScope] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_FACULTY_SCOPE) || FACULTY_SCOPES.CLUB_COORDINATOR;
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize and verify user session on mount
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      const storedAccessToken = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      const storedRefreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);

      if (!storedAccessToken && !storedRefreshToken) {
        if (isMounted) {
          setUser(null);
          setIsLoading(false);
        }
        return;
      }

      try {
        // Try fetching current user profile with active access token
        const currentUser = await authService.getCurrentUser();
        if (isMounted && currentUser) {
          setUser(currentUser);
          setToken(localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN));
        }
      } catch (err) {
        // If 401 and refresh token exists, try refreshing token
        if (storedRefreshToken) {
          try {
            const tokenData = await authService.refreshToken(storedRefreshToken);
            if (tokenData?.access_token) {
              const refreshedUser = await authService.getCurrentUser();
              if (isMounted && refreshedUser) {
                setUser(refreshedUser);
                setToken(tokenData.access_token);
              }
            }
          } catch {
            if (isMounted) {
              await authService.logout();
              setUser(null);
              setToken(null);
            }
          }
        } else {
          if (isMounted) {
            await authService.logout();
            setUser(null);
            setToken(null);
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    restoreSession();

    return () => {
      isMounted = false;
    };
  }, []);

  // Listen for centralized session events
  useEffect(() => {
    const handleSessionExpired = () => {
      setUser(null);
      setToken(null);
      setIsLoading(false);
    };

    const handleTokenRefreshed = (e) => {
      if (e.detail?.access_token) {
        setToken(e.detail.access_token);
      }
    };

    window.addEventListener('yuva:session_expired', handleSessionExpired);
    window.addEventListener('yuva:token_refreshed', handleTokenRefreshed);

    return () => {
      window.removeEventListener('yuva:session_expired', handleSessionExpired);
      window.removeEventListener('yuva:token_refreshed', handleTokenRefreshed);
    };
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      const authResponse = await authService.login(email, password);
      
      let authenticatedUser = authResponse?.user;
      if (!authenticatedUser) {
        authenticatedUser = await authService.getCurrentUser();
      }

      setUser(authenticatedUser);
      setToken(authResponse.access_token);
      setIsLoading(false);

      const targetRoute = ROLE_DEFAULT_ROUTES[authenticatedUser.role] || '/student/dashboard';
      return { user: authenticatedUser, defaultRoute: targetRoute };
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  }, []);

  const logout = useCallback(async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } finally {
      setUser(null);
      setToken(null);
      setIsLoading(false);
    }
  }, []);

  const switchFacultyScope = useCallback((scope) => {
    setActiveFacultyScope(scope);
    localStorage.setItem(STORAGE_KEYS.ACTIVE_FACULTY_SCOPE, scope);
  }, []);

  const hasRole = useCallback((allowedRoles) => {
    if (!user) return false;
    if (Array.isArray(allowedRoles)) {
      return allowedRoles.includes(user.role);
    }
    return user.role === allowedRoles;
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isLoading,
        activeFacultyScope,
        login,
        logout,
        switchFacultyScope,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
