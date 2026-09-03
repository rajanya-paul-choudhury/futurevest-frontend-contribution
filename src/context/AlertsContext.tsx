import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Alert } from '../pages/Alerts';

interface AlertsContextType {
  alerts: Alert[];
  addAlert: (alert: Alert) => void;
  toggleAlertActive: (alertId: string) => void;
  deleteAlert: (alertId: string) => void;
  updateAlert: (alert: Alert) => void;
}

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

export const AlertsProvider = ({ children }: { children: ReactNode }) => {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  const addAlert = (alert: Alert) => {
    setAlerts(prev => [alert, ...prev]);
  };

  const toggleAlertActive = (alertId: string) => {
    setAlerts(prev => prev.map(alert =>
      alert.id === alertId ? { ...alert, isActive: !alert.isActive } : alert
    ));
  };

  const deleteAlert = (alertId: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const updateAlert = (updatedAlert: Alert) => {
    setAlerts(prev => prev.map(alert => alert.id === updatedAlert.id ? updatedAlert : alert));
  };

  return (
    <AlertsContext.Provider value={{ alerts, addAlert, toggleAlertActive, deleteAlert, updateAlert }}>
      {children}
    </AlertsContext.Provider>
  );
};

export const useAlerts = () => {
  const context = useContext(AlertsContext);
  if (!context) throw new Error('useAlerts must be used within an AlertsProvider');
  return context;
}; 
