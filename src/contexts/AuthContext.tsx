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
  login: (email: string, role: UserRole) => boolean;
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

  const login = (email: string, role: UserRole) => {
    // In a real app, we would validate password here
    // For now, we justify trust based on the simulated role selection
    if (role) {
      // Dynamic user generation
      const name = email.split('@')[0].split('.')[0]; // Simple name extraction
      const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

      // Generate a deterministic ID based on email for persistence
      // Simple hash-like approach for demo purposes
      const uniqueSuffix = email.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0).toString(16).toUpperCase();

      const newUser: User = {
        id: role === 'customer' ? `CUST-${uniqueSuffix}` : `AGENT-${uniqueSuffix}`,
        name: capitalizedName,
        email: email,
        role: role
      };

      setUser(newUser);
      return true;
    }
    return false;
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
