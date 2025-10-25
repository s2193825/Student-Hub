import React, { createContext, useState, useContext, ReactNode } from 'react';
import ReactDOM from 'react-dom';
import Toast from '../components/Toast';
import { Notification, NotificationType } from '../types';

interface NotificationContextState {
    addNotification: (type: NotificationType, message: string) => void;
}

const NotificationContext = createContext<NotificationContextState | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const addNotification = (type: NotificationType, message: string) => {
        const id = new Date().toISOString();
        setNotifications(prev => [...prev, { id, type, message }]);
    };

    const removeNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ addNotification }}>
            {children}
            {ReactDOM.createPortal(
                <div className="fixed top-5 right-5 z-[100] space-y-3">
                    {notifications.map(notification => (
                        <Toast key={notification.id} notification={notification} onClose={() => removeNotification(notification.id)} />
                    ))}
                </div>,
                document.getElementById('toast-root')!
            )}
        </NotificationContext.Provider>
    );
};

export const useNotification = (): NotificationContextState => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
