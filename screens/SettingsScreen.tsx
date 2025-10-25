
import React from 'react';
import { BackIcon, ChevronRightIcon, UserCircleIcon, ShieldCheckIcon, NotificationIcon, LogoutIcon } from '../components/Icons';

interface SettingsScreenProps {
  onBack: () => void;
  onLogout: () => void;
  onEditProfileClick: () => void;
}

const SettingsItem: React.FC<{ icon: React.ElementType, label: string, onClick?: () => void, isLogout?: boolean }> = ({ icon: Icon, label, onClick, isLogout }) => (
  <button onClick={onClick} className="w-full flex items-center py-4 px-2 hover:bg-dumm-gray-200 rounded-lg transition-colors duration-200">
    <Icon className={`w-6 h-6 ${isLogout ? 'text-red-500' : 'text-dumm-text-dark'}`} />
    <span className={`flex-1 ml-4 text-left ${isLogout ? 'text-red-500 font-semibold' : 'text-dumm-text-light'}`}>{label}</span>
    {!isLogout && <ChevronRightIcon className="w-5 h-5 text-dumm-text-dark" />}
  </button>
);

const SettingsScreen: React.FC<SettingsScreenProps> = ({ onBack, onLogout, onEditProfileClick }) => {
  return (
    <div className="text-dumm-text-light">
      <header className="p-4 flex items-center space-x-4">
        <button onClick={onBack}>
          <BackIcon className="w-6 h-6" />
        </button>
        <h2 className="font-bold text-xl flex-1">Settings</h2>
      </header>

      <main className="px-4 mt-4 space-y-2">
        <SettingsItem icon={UserCircleIcon} label="Edit Profile" onClick={onEditProfileClick} />
        <div className="border-b border-dumm-gray-300 mx-2"></div>
        <SettingsItem icon={UserCircleIcon} label="Account" />
        <SettingsItem icon={ShieldCheckIcon} label="Privacy and Security" />
        <SettingsItem icon={NotificationIcon} label="Notifications" />
        <div className="border-b border-dumm-gray-300 mx-2"></div>
        <SettingsItem icon={LogoutIcon} label="Log Out" onClick={onLogout} isLogout />
      </main>
    </div>
  );
};

export default SettingsScreen;
