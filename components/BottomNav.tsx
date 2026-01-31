import React from 'react';
import { Home, Wallet, User, Trophy } from 'lucide-react';
import { ScreenName } from '../types';

interface BottomNavProps {
  currentScreen: ScreenName;
  onNavigate: (screen: ScreenName) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'wallet', icon: Wallet, label: 'Wallet' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  if (!['home', 'wallet', 'profile'].includes(currentScreen)) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-slate-900 border-t border-slate-800 pb-safe pt-2 px-6 z-50">
      <div className="flex justify-around items-center h-16">
        {navItems.map((item) => {
          const isActive = currentScreen === item.id;
          const Icon = item.icon;
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id as ScreenName)}
              className={`flex flex-col items-center gap-1 transition-all duration-300 ${isActive ? '-translate-y-1' : ''}`}
            >
              <div className={`p-2 rounded-xl transition-colors ${
                isActive 
                  ? 'bg-gradient-to-tr from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/30' 
                  : 'text-slate-500 hover:text-slate-300'
              }`}>
                <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'text-white' : 'text-slate-500'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};