import React from 'react';
import { useTranslation } from 'react-i18next';
import Modal from './Modal';

interface BetaAnnouncementProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: () => void;
  onRegister: () => void;
}

const BetaAnnouncement: React.FC<BetaAnnouncementProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
}) => {
  const { t } = useTranslation();

  const handleLogin = () => {
    localStorage.setItem('has_seen_beta_announcement', 'true');
    onLogin();
  };

  const handleRegister = () => {
    localStorage.setItem('has_seen_beta_announcement', 'true');
    onRegister();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} saveToLocalStorage={true}>
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">🚀</span>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Neosbuy is now in Beta!
          </h3>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300">
          We are developing our product and inviting you to be part of this journey. 🎯
        </p>
        
        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 You can now use Neosbuy <span className="font-semibold">completely free</span>. 
            Sign up now to start using it!
          </p>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300">
          Your feedback is valuable to us. We can't wait to hear your thoughts. 🙌
        </p>

        <div className="flex flex-col space-y-2 pt-4">
          <button
            onClick={handleLogin}
            className="w-full rounded-lg bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Sign In
          </button>
          <button
            onClick={handleRegister}
            className="w-full rounded-lg border border-blue-600 px-4 py-2 text-blue-600 transition-colors hover:bg-blue-50 dark:border-blue-500 dark:text-blue-500 dark:hover:bg-blue-900/20"
          >
            Sign Up
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default BetaAnnouncement; 