import { Toast, ToastMessage } from "primereact/toast";
import React, { createContext, useContext, useRef } from "react";

interface NotificationContextType {
  showMessage: (props: ToastMessage) => void;
  clear: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const toast = useRef<Toast>(null);

  const showMessage = (props: ToastMessage) => {
    toast.current?.show(props);
  };

  const clear = () => {
    toast.current?.clear();
  };

  return (
    <NotificationContext.Provider value={{ showMessage, clear }}>
      <Toast ref={toast} />
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error(
      "useNotification must be used within a NotificationProvider"
    );
  }
  return context;
};
