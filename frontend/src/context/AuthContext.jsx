import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ROLES, FACULTY_SCOPES, STORAGE_KEYS, DEMO_PERSONAS, ROLE_DEFAULT_ROUTES } from '../utils/constants';
import authService from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Default to a rich demo student session or stored token/user
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    // Default initial mock session: Student 1 for seamless navigation
    return {
      id: 5,
      email: 'aarav@yuva.edu',
      fullName: 'Aarav Patel',
      role: ROLES.STUDENT,
      raNumber: 'RA2311003010001',
      department: 'Computer Science & Engineering',
      section: 'Sec-A',
      semester: 6,
      avatarUrl: null,
    };
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN) || 'mock-dev-jwt-token';
  });

  const [activeFacultyScope, setActiveFacultyScope] = useState(() => {
    return localStorage.getItem(STORAGE_KEYS.ACTIVE_FACULTY_SCOPE) || FACULTY_SCOPES.CLUB_COORDINATOR;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Sync token to storage
  useEffect(() => {
    if (token) {
      localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    }
  }, [token]);

  // Sync user to storage
  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
    }
  }, [user]);

  // Listen for unauthorized 401 events from API client
  useEffect(() => {
    const handleUnauthorized = () => {
      logout();
    };
    window.addEventListener('yuva:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('yuva:unauthorized', handleUnauthorized);
  }, []);

  const login = useCallback(async (email, password) => {
    setIsLoading(true);
    try {
      // If mock demo persona matches email, log in with demo data
      const matchedPersona = DEMO_PERSONAS.find((p) => p.email.toLowerCase() === email.toLowerCase());
      if (matchedPersona) {
        const demoUser = {
          id: matchedPersona.role === ROLES.SUPER_ADMIN ? 1 : matchedPersona.role === ROLES.ADMIN ? 2 : matchedPersona.role === ROLES.CLUB_ADMIN ? 4 : matchedPersona.role === ROLES.FACULTY ? 3 : 5,
          email: matchedPersona.email,
          fullName: matchedPersona.name,
          role: matchedPersona.role,
          raNumber: matchedPersona.raNumber || null,
          title: matchedPersona.title,
          department: 'Computer Science & Engineering',
          section: 'Sec-A',
        };
        setUser(demoUser);
        setToken(`mock-jwt-token-for-${demoUser.role.toLowerCase()}`);
        setIsLoading(false);
        return { user: demoUser, defaultRoute: ROLE_DEFAULT_ROUTES[demoUser.role] };
      }

      // Try actual backend API call
      const res = await authService.login(email, password);
      setUser(res.user);
      setToken(res.access_token);
      setIsLoading(false);
      return { user: res.user, defaultRoute: ROLE_DEFAULT_ROUTES[res.user.role] };
    } catch (err) {
      setIsLoading(false);
      throw err;
    }
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
  }, []);

  // Quick switcher for hackathon evaluation and testing all 5 roles instantly
  const switchDemoUser = useCallback((personaEmail) => {
    const matchedPersona = DEMO_PERSONAS.find((p) => p.email === personaEmail);
    if (!matchedPersona) return;

    const switchedUser = {
      id: matchedPersona.role === ROLES.SUPER_ADMIN ? 1 : matchedPersona.role === ROLES.ADMIN ? 2 : matchedPersona.role === ROLES.CLUB_ADMIN ? 4 : matchedPersona.role === ROLES.FACULTY ? 3 : 5,
      email: matchedPersona.email,
      fullName: matchedPersona.name,
      role: matchedPersona.role,
      raNumber: matchedPersona.raNumber || null,
      title: matchedPersona.title,
      department: 'Computer Science & Engineering',
      section: 'Sec-A',
    };

    setUser(switchedUser);
    setToken(`mock-jwt-token-for-${switchedUser.role.toLowerCase()}`);
    if (matchedPersona.role === ROLES.FACULTY) {
      setActiveFacultyScope(FACULTY_SCOPES.CLUB_COORDINATOR);
      localStorage.setItem(STORAGE_KEYS.ACTIVE_FACULTY_SCOPE, FACULTY_SCOPES.CLUB_COORDINATOR);
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
        switchDemoUser,
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
