import React from 'react';
import { Bell, Wallet } from 'lucide-react';

interface HeaderProps {
  title?: string;
  balance: number;
  onNotificationClick: () => void;
  onWalletClick: () => void;
  showBack?: boolean;
  onBack?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  title = "The Ninja Sports", 
  balance, 
  onNotificationClick, 
  onWalletClick,
  showBack = false,
  onBack
}) => {
  return (
    <div className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 h-16 flex items-center justify-between px-4 shadow-sm">
      <div className="flex items-center gap-3">
        {showBack && onBack && (
          <button onClick={onBack} className="p-1 rounded-full hover:bg-slate-800 transition">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          </button>
        )}
        <div className="font-extrabold text-xl tracking-tight text-white flex items-center gap-2">
           {!showBack && <span className="text-2xl">🎮</span>}
           <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
             {title}
           </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button 
          onClick={onWalletClick}
          className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-3 py-1.5 rounded-full transition-all active:scale-95"
        >
          <div className="w-5 h-5 rounded-full bg-yellow-500 flex items-center justify-center text-[10px] font-bold text-black">₹</div>
          <span className="font-bold text-sm text-white">{balance}</span>
        </button>
        
        <button 
          onClick={onNotificationClick}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 transition-all active:scale-95 relative"
        >
          <Bell size={20} />
          {/* <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span> */}
        </button>
      </div>
    </div>
  );
};