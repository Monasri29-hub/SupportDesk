import React, { createContext, useContext, useState, ReactNode } from 'react';

export type UserRole = 'customer' | 'support' | null;

interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextType {
  user: User | null;
  role: UserRole;
  login: (role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<Exclude<UserRole, null>, User> = {
  customer: {
    id: 'CUST-1001',
    name: 'John Smith',
    email: 'john.smith@email.com',
    role: 'customer'
  },
  support: {
    id: 'AGENT-001',
    name: 'Sarah Support',
    email: 'sarah@supportteam.com',
    role: 'support'
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (role: UserRole) => {
    if (role) {
      setUser(mockUsers[role]);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      role: user?.role || null,
      login,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
