import React from 'react';
import './index.css';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { DataProvider } from './contexts/DataContext';
import Login from './components/Login';
import MainApp from './MainApp';

const AppContent: React.FC = () => {
    const { isAuthenticated } = useAuth();
    
    if (!isAuthenticated) {
        return <Login />;
    }

    return (
        <DataProvider>
            <MainApp />
        </DataProvider>
    )
}

function App() {
  return (
    <NotificationProvider>
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
