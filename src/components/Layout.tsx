import React from 'react';
import { Car, LogOut } from 'lucide-react';
import { storageUtils } from '../utils/storage';

interface LayoutProps {
  children: React.ReactNode;
  showHeader?: boolean;
  onLogout?: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, showHeader = false, onLogout }) => {
  const currentUser = storageUtils.getCurrentUser();

  const handleLogout = () => {
    storageUtils.clearCurrentUser();
    if (onLogout) onLogout();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {showHeader && currentUser && (
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <Car className="w-8 h-8 text-blue-600 mr-3" />
                <h1 className="text-xl font-bold text-gray-900">Car Wash App</h1>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  Welcome, {currentUser.firstName}!
                </span>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        </header>
      )}
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
};