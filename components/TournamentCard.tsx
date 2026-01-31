import React from 'react';
import { Trophy, Users, Clock, MapPin, Skull, Crown } from 'lucide-react';
import { Tournament } from '../types';

interface TournamentCardProps {
  data: Tournament;
  isJoined: boolean;
  joinedCount: number;
  onJoin: (id: string) => void;
  onViewDetails: (room: {id: string, pass: string}) => void;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({ 
  data, 
  isJoined, 
  joinedCount, 
  onJoin,
  onViewDetails 
}) => {
  const isFull = joinedCount >= data.maxSlots;
  
  // Format Date
  const dateObj = new Date(data.startTime);
  const dateStr = isNaN(dateObj.getTime()) ? data.startTime : dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
  const timeStr = isNaN(dateObj.getTime()) ? '' : dateObj.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });

  // Progress Bar
  const progressPercent = Math.min((joinedCount / data.maxSlots) * 100, 100);

  return (
    <div className="bg-slate-800 rounded-2xl overflow-hidden border border-slate-700 shadow-xl mb-6 relative group">
      {/* Status Badge */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        <span className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm ${
          data.status === 'Live' ? 'bg-red-500 text-white animate-pulse' : 'bg-blue-600 text-white'
        }`}>
          {data.status}
        </span>
      </div>

      {/* Banner Image */}
      <div className="relative h-44 bg-slate-900">
        <img 
          src={data.bannerUrl || "https://picsum.photos/400/200"} 
          alt="Tournament Banner" 
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
        />
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-slate-900 to-transparent"></div>
      </div>

      {/* Content */}
      <div className="p-5 -mt-6 relative">
        <h3 className="text-lg font-bold text-white mb-4 line-clamp-1">{data.title}</h3>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 mb-4 bg-slate-900/50 p-3 rounded-xl border border-slate-700/50">
          <div className="flex flex-col items-center">
             <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Prize Pool</span>
             <span className="text-yellow-400 font-black text-lg">₹{data.prizePool}</span>
          </div>
          <div className="flex flex-col items-center border-l border-slate-700">
             <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Entry</span>
             <span className="text-white font-bold text-lg">₹{data.entryFee}</span>
          </div>
          <div className="flex flex-col items-center border-l border-slate-700">
             <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">Type</span>
             <span className="text-cyan-400 font-bold text-sm mt-1">{data.map}</span>
          </div>
        </div>

        {/* Rewards Info */}
        <div className="flex gap-2 mb-4">
           <div className="flex-1 bg-green-900/20 border border-green-500/20 rounded-lg p-2 flex items-center justify-center gap-2">
              <Crown size={14} className="text-green-500" />
              <span className="text-xs font-semibold text-green-400">Booyah: ₹{data.booyah}</span>
           </div>
           <div className="flex-1 bg-orange-900/20 border border-orange-500/20 rounded-lg p-2 flex items-center justify-center gap-2">
              <Skull size={14} className="text-orange-500" />
              <span className="text-xs font-semibold text-orange-400">Kill: ₹{data.perKill}</span>
           </div>
        </div>

        {/* Time & Slots */}
        <div className="flex justify-between items-center text-xs text-slate-400 mb-4 px-1">
          <div className="flex items-center gap-1.5">
            <Clock size={14} className="text-blue-500" />
            <span className="font-medium text-slate-300">{dateStr}, {timeStr}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users size={14} className="text-purple-500" />
            <span className="font-medium text-slate-300">{joinedCount}/{data.maxSlots} Joined</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-slate-700 rounded-full mb-5 overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 ease-out"
            style={{ width: `${progressPercent}%` }}
          ></div>
        </div>

        {/* Action Button */}
        {isJoined ? (
          data.roomId ? (
             <button 
                onClick={() => onViewDetails({id: data.roomId || '', pass: data.roomPass || ''})}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all active:scale-[0.98] animate-pulse"
             >
                VIEW ROOM ID & PASS
             </button>
          ) : (
             <button disabled className="w-full py-3.5 rounded-xl bg-slate-700/50 text-emerald-500 font-bold text-sm border border-emerald-500/30 flex items-center justify-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                JOINED
             </button>
          )
        ) : (
          <button 
            onClick={() => !isFull && onJoin(data.id)}
            disabled={isFull}
            className={`w-full py-3.5 rounded-xl font-bold text-sm shadow-lg transition-all active:scale-[0.98] ${
              isFull 
                ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-blue-500/25'
            }`}
          >
            {isFull ? 'TOURNAMENT FULL' : `JOIN NOW • ₹${data.entryFee}`}
          </button>
        )}
      </div>
    </div>
  );
};