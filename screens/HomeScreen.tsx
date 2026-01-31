import React, { useEffect, useState } from 'react';
import { Tournament } from '../types';
import { db } from '../services/firebase';
import { ref, onValue } from 'firebase/database';
import { TournamentCard } from '../components/TournamentCard';
import { Trophy, AlertCircle } from 'lucide-react';

interface HomeScreenProps {
  userId: string;
  onJoinTournament: (t: Tournament) => void;
  onViewRoom: (room: {id: string, pass: string}) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ userId, onJoinTournament, onViewRoom }) => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [registrations, setRegistrations] = useState<Record<string, Record<string, any>>>({});
  const [banners, setBanners] = useState<{url: string, link: string}[]>([]);
  const [notice, setNotice] = useState<string>('');

  useEffect(() => {
    // Load Tournaments
    const tRef = ref(db, 'tournaments');
    const unsubT = onValue(tRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const tList = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        })).reverse(); // Newest first
        setTournaments(tList);
      } else {
        setTournaments([]);
      }
    });

    // Load Registrations to check counts and if user joined
    const rRef = ref(db, 'registrations');
    const unsubR = onValue(rRef, (snap) => {
      setRegistrations(snap.val() || {});
    });

    // Load Settings (Banners, Notice)
    const sRef = ref(db, 'settings');
    const unsubS = onValue(sRef, (snap) => {
      const data = snap.val();
      if (data) {
        setNotice(data.notice || '');
        if (data.banners) {
          setBanners(Object.values(data.banners));
        }
      }
    });

    return () => {
      unsubT();
      unsubR();
      unsubS();
    };
  }, []);

  return (
    <div className="pb-24">
      {/* Banner Section */}
      {banners.length > 0 ? (
        <div className="px-4 py-4 overflow-x-auto no-scrollbar flex gap-4 snap-x">
          {banners.map((b, i) => (
            <div key={i} className="min-w-[90%] snap-center rounded-2xl overflow-hidden shadow-lg h-48 relative bg-slate-800">
               <img src={b.url} alt="Banner" className="w-full h-full object-cover" />
               <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="px-4 py-4">
           <div className="w-full h-48 rounded-2xl bg-slate-800 animate-pulse flex items-center justify-center text-slate-700">
              <span className="font-bold">Loading Events...</span>
           </div>
        </div>
      )}

      {/* Notice Marquee */}
      {notice && (
        <div className="mx-4 mb-6 bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-3 flex items-center gap-3">
           <div className="bg-yellow-500 text-black text-[10px] font-black px-2 py-0.5 rounded uppercase">Notice</div>
           <div className="overflow-hidden whitespace-nowrap flex-1">
             <div className="animate-marquee inline-block text-sm text-yellow-200 font-medium">
               {notice}
             </div>
           </div>
        </div>
      )}

      {/* Tournaments List */}
      <div className="px-4">
        <div className="flex items-center gap-2 mb-4">
           <Trophy className="text-blue-500" size={20} />
           <h2 className="text-xl font-bold text-white">Live Tournaments</h2>
        </div>

        {tournaments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Trophy size={48} className="mb-4 opacity-20" />
            <p>No matches available right now.</p>
          </div>
        ) : (
          tournaments.filter(t => t.status !== 'Completed').map(t => {
            const joined = registrations[t.id] ? Object.keys(registrations[t.id]).length : 0;
            const isUserJoined = registrations[t.id] && registrations[t.id][userId];
            
            return (
              <TournamentCard 
                key={t.id}
                data={t}
                isJoined={!!isUserJoined}
                joinedCount={joined}
                onJoin={() => onJoinTournament(t)}
                onViewDetails={onViewRoom}
              />
            );
          })
        )}
      </div>
    </div>
  );
};