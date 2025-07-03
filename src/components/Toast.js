"use client";

import { useState, useEffect } from "react";
import { CheckCircle, AlertTriangle, X, Info } from "lucide-react";

const Toast = ({
  message,
  type = "info",
  isVisible,
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const getToastStyles = () => {
    const baseStyles =
      "fixed top-4 right-4 z-50 max-w-sm w-full bg-white border-l-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out";

    if (!isVisible) {
      return `${baseStyles} translate-x-full opacity-0`;
    }

    switch (type) {
      case "success":
        return `${baseStyles} border-green-500 translate-x-0 opacity-100`;
      case "error":
        return `${baseStyles} border-red-500 translate-x-0 opacity-100`;
      case "warning":
        return `${baseStyles} border-yellow-500 translate-x-0 opacity-100`;
      default:
        return `${baseStyles} border-blue-500 translate-x-0 opacity-100`;
    }
  };

  const getIcon = () => {
    const iconClass = "h-5 w-5 mr-3 flex-shrink-0";

    switch (type) {
      case "success":
        return <CheckCircle className={`${iconClass} text-green-500`} />;
      case "error":
        return <AlertTriangle className={`${iconClass} text-red-500`} />;
      case "warning":
        return <AlertTriangle className={`${iconClass} text-yellow-500`} />;
      default:
        return <Info className={`${iconClass} text-blue-500`} />;
    }
  };

  const getTextColor = () => {
    switch (type) {
      case "success":
        return "text-green-800";
      case "error":
        return "text-red-800";
      case "warning":
        return "text-yellow-800";
      default:
        return "text-blue-800";
    }
  };

  if (!isVisible && !message) return null;

  return (
    <div className={getToastStyles()}>
      <div className="p-4">
        <div className="flex items-start">
          {getIcon()}
          <div className="flex-1">
            <p className={`text-sm font-medium ${getTextColor()}`}>{message}</p>
          </div>
          <button
            onClick={onClose}
            className={`ml-4 inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:text-gray-600 transition-colors duration-200`}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

// Toast context and hook for easier usage
export const useToast = () => {
  const [toast, setToast] = useState({
    message: "",
    type: "info",
    isVisible: false,
  });

  const showToast = (message, type = "info", duration = 5000) => {
    setToast({
      message,
      type,
      isVisible: true,
      duration,
    });
  };

  const hideToast = () => {
    setToast((prev) => ({
      ...prev,
      isVisible: false,
    }));
  };

  const ToastComponent = () => (
    <Toast
      message={toast.message}
      type={toast.type}
      isVisible={toast.isVisible}
      onClose={hideToast}
      duration={toast.duration}
    />
  );

  return {
    showToast,
    hideToast,
    ToastComponent,
    showSuccess: (message, duration) => showToast(message, "success", duration),
    showError: (message, duration) => showToast(message, "error", duration),
    showWarning: (message, duration) => showToast(message, "warning", duration),
    showInfo: (message, duration) => showToast(message, "info", duration),
  };
};

export default Toast;
