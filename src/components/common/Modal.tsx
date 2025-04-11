import React from 'react';
import { useTranslation } from 'react-i18next';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  saveToLocalStorage?: boolean;
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  children, 
  title,
  saveToLocalStorage = false
}) => {
  const { t } = useTranslation();

  const handleClose = () => {
    if (saveToLocalStorage) {
      localStorage.setItem('has_seen_beta_announcement', 'true');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />
      <div className="relative z-50 w-full max-w-md rounded-lg bg-white p-6 shadow-xl dark:bg-gray-800">
        {title && (
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-gray-100">
            {title}
          </h2>
        )}
        <div className="relative">
          <button
            onClick={handleClose}
            className="absolute -right-2 -top-2 rounded-full p-1 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal; 