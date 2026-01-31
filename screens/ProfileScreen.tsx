import React from 'react';
import { UserProfile } from '../types';
import { User, LogOut, Shield, FileText, Headphones, ChevronRight, Gamepad2 } from 'lucide-react';
import { auth } from '../services/firebase';

interface ProfileScreenProps {
  user: UserProfile;
  onLogout: () => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onLogout }) => {
  const menuItems = [
    { icon: Headphones, label: 'Contact Support', action: () => window.open('https://wa.me/91XXXXXXXXXX') }, // Add real number from settings if available
    { icon: Shield, label: 'Privacy Policy', action: () => {} },
    { icon: FileText, label: 'Terms & Conditions', action: () => {} },
  ];

  return (
    <div className="pb-24">
      {/* Header Profile Section */}
      <div className="bg-slate-800 pb-8 pt-6 px-6 rounded-b-[2.5rem] shadow-xl relative overflow-hidden border-b border-slate-700">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/5 rounded-full blur-3xl -mr-10 -mt-20"></div>
        
        <div className="flex flex-col items-center relative z-10">
          <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-500 p-1 mb-4 shadow-lg shadow-blue-500/20">
             <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-3xl font-bold text-white">
               {user.name.charAt(0).toUpperCase()}
             </div>
          </div>
          <h2 className="text-2xl font-black text-white mb-1">{user.name}</h2>
          <div className="bg-slate-700/50 px-3 py-1 rounded-full border border-slate-600 mb-6">
             <span className="text-xs font-mono text-slate-300">UID: {user.uid.substring(0,6).toUpperCase()}</span>
          </div>

          <div className="flex w-full justify-around border-t border-slate-700/50 pt-6">
             <div className="text-center">
               <div className="text-2xl font-bold text-white">{user.totalMatches}</div>
               <div className="text-[10px] text-slate-400 uppercase tracking-wider">Matches</div>
             </div>
             <div className="text-center">
               <div className="text-2xl font-bold text-green-400">{user.totalWon}</div>
               <div className="text-[10px] text-slate-400 uppercase tracking-wider">Won</div>
             </div>
             <div className="text-center">
               <div className="text-2xl font-bold text-yellow-400">₹{user.lifetimeEarnings}</div>
               <div className="text-[10px] text-slate-400 uppercase tracking-wider">Earned</div>
             </div>
          </div>
        </div>
      </div>

      {/* Menu List */}
      <div className="px-4 mt-6 space-y-3">
        {/* Edit Profile */}
        <button className="w-full bg-slate-800 p-4 rounded-xl flex items-center justify-between border border-slate-700 group hover:bg-slate-750 transition-colors">
           <div className="flex items-center gap-4">
              <div className="bg-slate-700 p-2 rounded-lg text-slate-300 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                <User size={20} />
              </div>
              <span className="font-semibold text-slate-200">Edit Profile</span>
           </div>
           <ChevronRight size={18} className="text-slate-500" />
        </button>

        {menuItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <button key={idx} onClick={item.action} className="w-full bg-slate-800 p-4 rounded-xl flex items-center justify-between border border-slate-700 group hover:bg-slate-750 transition-colors">
              <div className="flex items-center gap-4">
                  <div className="bg-slate-700 p-2 rounded-lg text-slate-300 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                    <Icon size={20} />
                  </div>
                  <span className="font-semibold text-slate-200">{item.label}</span>
              </div>
              <ChevronRight size={18} className="text-slate-500" />
            </button>
          )
        })}

        <button onClick={onLogout} className="w-full bg-slate-800 p-4 rounded-xl flex items-center justify-between border border-slate-700 group hover:bg-red-900/10 hover:border-red-900/30 transition-colors mt-6">
           <div className="flex items-center gap-4">
              <div className="bg-slate-700 p-2 rounded-lg text-slate-300 group-hover:text-red-500 group-hover:bg-red-500/10 transition-colors">
                <LogOut size={20} />
              </div>
              <span className="font-semibold text-slate-200 group-hover:text-red-400">Logout</span>
           </div>
        </button>

        <div className="text-center mt-8 text-xs text-slate-600 font-medium">
           v1.0.0 • The Ninja Sports
        </div>
      </div>
    </div>
  );
};