import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { ref, onValue, set, update, serverTimestamp, push } from 'firebase/database';
import { auth, db } from './services/firebase';
import { UserProfile, ScreenName, Tournament } from './types';
import { AuthScreen } from './screens/AuthScreen';
import { HomeScreen } from './screens/HomeScreen';
import { WalletScreen } from './screens/WalletScreen';
import { ProfileScreen } from './screens/ProfileScreen';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentScreen, setCurrentScreen] = useState<ScreenName>('auth');
  const [loading, setLoading] = useState(true);
  
  // Modal for Room Details
  const [roomDetails, setRoomDetails] = useState<{id: string, pass: string} | null>(null);

  // Auth Listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      if (u) {
        // Fetch User Profile
        const userRef = ref(db, 'users/' + u.uid);
        onValue(userRef, (snapshot) => {
          const data = snapshot.val();
          if (data) {
             setUserProfile({ uid: u.uid, ...data });
             if (currentScreen === 'auth') setCurrentScreen('home');
          }
        });
      } else {
        setUserProfile(null);
        setCurrentScreen('auth');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentScreen]);

  // Auth Actions
  const handleLogin = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      toast.success("Welcome Back!");
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleSignup = async (name: string, email: string, phone: string, pass: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      if (cred.user) {
        await set(ref(db, 'users/' + cred.user.uid), {
          name, email, phone,
          depositBal: 0, winningBal: 0, bonusBal: 0,
          totalMatches: 0, totalWon: 0, lifetimeEarnings: 0,
          status: "Active",
          createdAt: serverTimestamp()
        });
        toast.success("Account Created!");
      }
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setCurrentScreen('auth');
  };

  const handleJoinTournament = (t: Tournament) => {
    if (!userProfile) return;
    
    // Balance Check
    const totalBal = (userProfile.depositBal || 0) + (userProfile.winningBal || 0) + (userProfile.bonusBal || 0);
    const fee = Number(t.entryFee);
    
    if (totalBal < fee) {
       toast.error("Insufficient Balance. Please add money.");
       setCurrentScreen('wallet');
       return;
    }

    if (window.confirm(`Join ${t.title} for ₹${fee}?`)) {
       // Deduct from deposit balance first (simplified logic)
       // In a real app, you'd likely have complex logic on backend
       // We will just reduce depositBal for now or fail if deposit is not enough? 
       // The legacy code subtracted from depositBal. We will follow legacy.
       // NOTE: The legacy code was:
       // newBalance = (userData.depositBal || 0) - fee;
       // updates['users/' + myUid + '/depositBal'] = newBalance;
       
       // BUT wait, what if deposit is 0 but they have winnings? 
       // The legacy code actually ONLY checked total balance but SUBTRACTED from depositBal which could go negative.
       // I will fix this logic to be safer: Subtract from Deposit -> Winnings -> Bonus
       
       let remainingFee = fee;
       let newDep = userProfile.depositBal;
       let newWin = userProfile.winningBal;
       let newBon = userProfile.bonusBal;

       if (newDep >= remainingFee) {
          newDep -= remainingFee;
          remainingFee = 0;
       } else {
          remainingFee -= newDep;
          newDep = 0;
          if (newWin >= remainingFee) {
            newWin -= remainingFee;
            remainingFee = 0;
          } else {
            remainingFee -= newWin;
            newWin = 0;
            if (newBon >= remainingFee) {
               newBon -= remainingFee;
               remainingFee = 0;
            }
          }
       }

       if (remainingFee > 0) {
          toast.error("Error calculating balance deduction.");
          return;
       }

       const updates: any = {};
       updates[`users/${user.uid}/depositBal`] = newDep;
       updates[`users/${user.uid}/winningBal`] = newWin;
       updates[`users/${user.uid}/bonusBal`] = newBon;
       
       updates[`registrations/${t.id}/${user.uid}`] = {
          ign: userProfile.name,
          joinedAt: serverTimestamp()
       };

       const txKey = push(ref(db, `transactions/${user.uid}`)).key;
       updates[`transactions/${user.uid}/${txKey}`] = {
         type: `Entry Fee: ${t.title}`,
         amount: fee,
         status: 'Success',
         date: new Date().toLocaleString()
       };

       update(ref(db), updates)
         .then(() => toast.success("Joined Successfully!"))
         .catch((e) => toast.error(e.message));
    }
  };

  // Render Loader
  if (loading) return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center">
       <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  // Render Auth
  if (!user || currentScreen === 'auth') {
    return (
       <>
        <ToastContainer theme="dark" position="top-center" />
        <AuthScreen onLogin={handleLogin} onSignup={handleSignup} />
       </>
    );
  }

  // Main App
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      <ToastContainer theme="dark" position="top-center" autoClose={3000} />
      
      {/* Header */}
      <Header 
        balance={(userProfile?.depositBal || 0) + (userProfile?.winningBal || 0) + (userProfile?.bonusBal || 0)}
        onNotificationClick={() => setCurrentScreen('notifications')}
        onWalletClick={() => setCurrentScreen('wallet')}
        showBack={currentScreen === 'add-money' || currentScreen === 'transactions'}
        onBack={() => setCurrentScreen('wallet')}
      />

      {/* Screens */}
      <div className="max-w-md mx-auto min-h-screen relative">
         {currentScreen === 'home' && (
           <HomeScreen 
             userId={user.uid} 
             onJoinTournament={handleJoinTournament}
             onViewRoom={(details) => setRoomDetails(details)}
           />
         )}
         
         {currentScreen === 'wallet' && userProfile && (
           <WalletScreen 
             user={userProfile} 
             onRefreshUser={() => {}} 
           />
         )}

         {currentScreen === 'profile' && userProfile && (
           <ProfileScreen 
             user={userProfile} 
             onLogout={handleLogout} 
           />
         )}
      </div>

      {/* Room Details Modal */}
      {roomDetails && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
           <div className="bg-white text-slate-900 w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-pulse-fast-stop">
              <div className="flex justify-between items-center mb-4">
                 <h3 className="font-black text-lg text-slate-900">Room Details</h3>
                 <button onClick={() => setRoomDetails(null)} className="p-1 rounded-full bg-slate-100 hover:bg-slate-200">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                 </button>
              </div>
              
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-4">
                 <p className="text-xs font-bold text-slate-400 uppercase mb-1">Room ID</p>
                 <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-xl">{roomDetails.id}</span>
                    <button 
                      onClick={() => {navigator.clipboard.writeText(roomDetails.id); toast.success("Copied ID")}}
                      className="text-xs bg-black text-white px-2 py-1 rounded"
                    >COPY</button>
                 </div>
              </div>

              <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 mb-6">
                 <p className="text-xs font-bold text-slate-400 uppercase mb-1">Password</p>
                 <div className="flex justify-between items-center">
                    <span className="font-mono font-bold text-xl">{roomDetails.pass}</span>
                    <button 
                      onClick={() => {navigator.clipboard.writeText(roomDetails.pass); toast.success("Copied Password")}}
                      className="text-xs bg-black text-white px-2 py-1 rounded"
                    >COPY</button>
                 </div>
              </div>

              <div className="bg-yellow-50 text-yellow-800 text-xs p-3 rounded-lg flex gap-2">
                 <span className="font-bold">⚠️</span>
                 <span>Do not share these details with anyone outside the tournament.</span>
              </div>
           </div>
        </div>
      )}

      {/* Bottom Nav */}
      <BottomNav 
        currentScreen={currentScreen} 
        onNavigate={setCurrentScreen} 
      />
    </div>
  );
};

export default App;