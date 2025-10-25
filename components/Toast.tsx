import React, { useEffect, useState } from 'react';
import { Notification } from '../types';
import { CheckCircleSolidIcon, InfoIcon, XCircleIcon, CloseIcon } from './icons';

interface ToastProps {
  notification: Notification;
  onClose: () => void;
}

const toastConfig = {
    success: { icon: CheckCircleSolidIcon, barClass: 'bg-green-500' },
    error: { icon: XCircleIcon, barClass: 'bg-red-500' },
    info: { icon: InfoIcon, barClass: 'bg-blue-500' },
    warning: { icon: InfoIcon, barClass: 'bg-yellow-500' },
};

const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
    const [isExiting, setIsExiting] = useState(false);
    const { type, message } = notification;
    const config = toastConfig[type];
    const Icon = config.icon;

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsExiting(true);
            setTimeout(onClose, 500); // Wait for animation
        }, 5000);

        return () => clearTimeout(timer);
    }, [onClose]);

    const handleClose = () => {
         setIsExiting(true);
         setTimeout(onClose, 500);
    }

    return (
        <div className={`flex w-96 bg-white rounded-lg shadow-2xl overflow-hidden ${isExiting ? 'animate-toast-out' : 'animate-toast-in'}`}>
            <div className={`w-2 ${config.barClass}`}></div>
            <div className="flex items-center p-4 flex-grow">
                <Icon className={`w-8 h-8 mr-3 ${config.barClass.replace('bg-', 'text-')}`} />
                <p className="flex-grow text-medium-text">{message}</p>
                <button onClick={handleClose} className="ml-4 text-gray-400 hover:text-gray-600">
                    <CloseIcon className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};

export default Toast;
