import { useState, createContext, useContext, useImperativeHandle, useRef } from 'react';
import { AlertTriangle, CheckCircle, XCircle, Info, X } from 'lucide-react';

const AlertContext = createContext(null);
export const alertContext = AlertContext;

export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState(null);
  const alertRef = useRef(null);

  useImperativeHandle(alertRef, () => ({
    showAlert: (options) => {
      return new Promise((resolve) => {
        setAlert({ ...options, onResolve: resolve });
      });
    }
  }));

  const showAlert = (options) => {
    return new Promise((resolve) => {
      setAlert({ ...options, onResolve: resolve });
    });
  };

  const hideAlert = (result) => {
    if (alert?.onResolve) {
      alert.onResolve(result);
    }
    setAlert(null);
  };

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert }}>
      {children}
      {alert && <AlertModal {...alert} onClose={hideAlert} />}
    </AlertContext.Provider>
  );
};

export const useAlert = () => {
  const context = useContext(AlertContext);

  if (!context || !context.showAlert) {
    return {
      success: (message) => { window.alert(message); },
      error: (message) => { window.alert(message); },
      warning: (message) => { window.alert(message); },
      info: (message) => { window.alert(message); }
    };
  }

  return {
    success: (message, title = 'Éxito') => context.showAlert({ type: 'success', message, title }),
    error: (message, title = 'Error') => context.showAlert({ type: 'error', message, title }),
    warning: (message, title = 'Advertencia') => context.showAlert({ type: 'warning', message, title }),
    info: (message, title = 'Información') => context.showAlert({ type: 'info', message, title }),
    showAlert: context.showAlert,
    hideAlert: context.hideAlert
  };
};

const createAlertHandler = (context) => {
  return async (options) => {
    if (!context || !context.showAlert) {
      if (options.type === 'confirm') {
        return window.confirm(options.message);
      }
      window.alert(options.message);
      return true;
    }
    return context.showAlert(options);
  };
};

const AlertModal = ({ type = 'info', title, message, confirmText = 'Aceptar', cancelText, onClose }) => {
  const icons = {
    success: <CheckCircle className="alert-icon success" size={48} />,
    error: <XCircle className="alert-icon error" size={48} />,
    warning: <AlertTriangle className="alert-icon warning" size={48} />,
    info: <Info className="alert-icon info" size={48} />,
    confirm: <AlertTriangle className="alert-icon warning" size={48} />
  };

  const handleConfirm = () => onClose(true);
  const handleCancel = () => onClose(false);

  return (
    <div className="alert-overlay">
      <div className="alert-modal">
        <button className="alert-close" onClick={handleCancel} aria-label="Cerrar">
          <X size={20} />
        </button>
        
        <div className="alert-icon-container">
          {icons[type] || icons.info}
        </div>
        
        {title && <h3 className="alert-title">{title}</h3>}
        {message && <p className="alert-message">{message}</p>}
        
        <div className="alert-buttons">
          {cancelText && (
            <button className="alert-btn cancel" onClick={handleCancel}>
              {cancelText}
            </button>
          )}
          <button className="alert-btn confirm" onClick={handleConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

let globalContextRef = null;

export const setAlertContext = (context) => {
  globalContextRef = context;
};

export const alertService = {
  success: async (message, title = 'Éxito') => {
    if (globalContextRef?.showAlert) {
      return globalContextRef.showAlert({ type: 'success', message, title });
    }
    window.alert(message);
    return true;
  },
  error: async (message, title = 'Error') => {
    if (globalContextRef?.showAlert) {
      return globalContextRef.showAlert({ type: 'error', message, title });
    }
    window.alert(message);
    return true;
  },
  warning: async (message, title = 'Advertencia') => {
    if (globalContextRef?.showAlert) {
      return globalContextRef.showAlert({ type: 'warning', message, title });
    }
    window.alert(message);
    return true;
  },
  info: async (message, title = 'Información') => {
    if (globalContextRef?.showAlert) {
      return globalContextRef.showAlert({ type: 'info', message, title });
    }
    window.alert(message);
    return true;
  },
  confirm: async (message, title = 'Confirmar') => {
    if (globalContextRef?.showAlert) {
      return globalContextRef.showAlert({ type: 'confirm', message, title, confirmText: 'Sí', cancelText: 'No' });
    }
    return window.confirm(message);
  }
};