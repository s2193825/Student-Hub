import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, UserRole } from '../types';
import { mockApi } from '../services/mockApi';

interface AuthContextState {
    user: User | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string, role: UserRole) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // This effect could be used to check for a session token in a real app
        setLoading(false);
    }, []);

    const login = async (email: string, password: string, role: UserRole) => {
        const matchingUsers = await mockApi.authenticate(email, password);
        const userForRole = matchingUsers.find(u => u.role === role);

        if (userForRole) {
            setUser(userForRole);
            setIsAuthenticated(true);
        } else {
            throw new Error("Invalid credentials for the selected role.");
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
    };

    const value: AuthContextState = {
        user,
        isAuthenticated,
        loading,
        login,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextState => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
