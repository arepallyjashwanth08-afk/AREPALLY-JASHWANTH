import React, { useState, useEffect } from 'react';
import { UserProfile, Transaction } from '../types';
import { ArrowUpRight, ArrowDownLeft, History, CreditCard, Banknote } from 'lucide-react';
import { db } from '../services/firebase';
import { ref, onValue, push, update } from 'firebase/database';

interface WalletScreenProps {
  user: UserProfile;
  onRefreshUser: () => void;
}

// NOTE: This should point to your real backend in production
const BACKEND_URL = "http://localhost:3000";

export const WalletScreen: React.FC<WalletScreenProps> = ({ user }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [view, setView] = useState<'main' | 'add' | 'withdraw' | 'history'>('main');
  
  // Add Money State
  const [addAmount, setAddAmount] = useState('');
  const [loadingPay, setLoadingPay] = useState(false);
  
  // Withdraw State
  const [wAmount, setWAmount] = useState('');
  const [wMethod, setWMethod] = useState('UPI');
  const [wDetails, setWDetails] = useState('');

  useEffect(() => {
    const txRef = ref(db, `transactions/${user.uid}`);
    const unsub = onValue(txRef, (snap) => {
      const data = snap.val();
      if (data) {
        const list = Object.keys(data).map(k => ({ id: k, ...data[k] })).reverse();
        setTransactions(list);
      }
    });
    return () => unsub();
  }, [user.uid]);

  const initiatePayment = async () => {
    if (!addAmount || Number(addAmount) < 10) {
      alert("Minimum amount is ₹10");
      return;
    }
    setLoadingPay(true);
    try {
        // Simulation of backend call as requested
        // In real app: const res = await fetch(`${BACKEND_URL}/create-order`, ...);
        // For demo UI purposes, we just simulate a delay and success.
        
        /* 
        const response = await fetch(`${BACKEND_URL}/create-order`, {
             method: 'POST',
             headers: { 'Content-Type': 'application/json' },
             body: JSON.stringify({
                 amount: addAmount,
                 uid: user.uid,
                 name: user.name,
                 email: user.email,
                 phone: user.phone
             })
        });
        const result = await response.json();
        if(result.success) window.open(result.payment_url);
        */

        // Mocking behavior for the UI demo
        setTimeout(() => {
             alert(`Redirecting to Payment Gateway for ₹${addAmount}... (Backend Integration Required)`);
             setLoadingPay(false);
        }, 1500);

    } catch (e) {
        alert("Error connecting to payment gateway.");
        setLoadingPay(false);
    }
  };

  const requestWithdraw = async () => {
    const amt = Number(wAmount);
    if (!amt || amt < 22) {
      alert("Minimum withdrawal is ₹22");
      return;
    }
    if (user.winningBal < amt) {
      alert("Insufficient winning balance.");
      return;
    }

    const updates: any = {};
    updates[`users/${user.uid}/winningBal`] = user.winningBal - amt;
    const reqKey = push(ref(db, 'requests/withdraw')).key;
    updates[`requests/withdraw/${reqKey}`] = {
      uid: user.uid,
      name: user.name,
      amount: amt,
      method: wMethod,
      details: wDetails,
      status: 'Pending',
      date: new Date().toLocaleString()
    };
    updates[`transactions/${user.uid}/${push(ref(db, `transactions/${user.uid}`)).key}`] = {
      type: "Withdrawal Request",
      amount: amt,
      status: "Pending",
      date: new Date().toLocaleString()
    };

    try {
      await update(ref(db), updates);
      alert("Withdrawal requested!");
      setView('main');
      setWAmount('');
    } catch(e) {
      console.error(e);
      alert("Failed to request withdrawal.");
    }
  };

  // Sub-screens
  if (view === 'add') {
    return (
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => setView('main')}>
           <ArrowDownLeft className="rotate-90 text-slate-400" />
           <h2 className="text-xl font-bold text-white">Add Money</h2>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6 mb-6 text-center border border-slate-700">
           <div className="text-slate-400 text-sm font-medium mb-1">Current Balance</div>
           <div className="text-3xl font-black text-white">₹{user.depositBal + user.winningBal + user.bonusBal}</div>
        </div>
        
        <label className="text-sm font-bold text-slate-300 mb-2 block">Amount (₹)</label>
        <input 
          type="number" 
          value={addAmount} 
          onChange={e => setAddAmount(e.target.value)}
          placeholder="Min ₹10"
          className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white text-lg font-bold outline-none focus:border-blue-500 mb-4"
        />
        
        <div className="bg-yellow-500/10 border border-yellow-500/20 p-3 rounded-xl mb-6 flex gap-3 items-start">
           <div className="mt-1"><CreditCard size={16} className="text-yellow-500"/></div>
           <div className="text-xs text-yellow-200">Payments are secured via UPI. Amount will be added automatically after successful payment.</div>
        </div>

        <button 
          onClick={initiatePayment}
          disabled={loadingPay}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 font-bold text-white shadow-lg shadow-blue-500/20 active:scale-95 transition-transform"
        >
          {loadingPay ? 'Processing...' : 'Proceed to Pay'}
        </button>
      </div>
    );
  }

  if (view === 'withdraw') {
    return (
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6 cursor-pointer" onClick={() => setView('main')}>
           <ArrowDownLeft className="rotate-90 text-slate-400" />
           <h2 className="text-xl font-bold text-white">Withdraw</h2>
        </div>
        <div className="bg-slate-800 rounded-2xl p-6 mb-6 text-center border border-slate-700">
           <div className="text-slate-400 text-sm font-medium mb-1">Winnings Available</div>
           <div className="text-3xl font-black text-green-400">₹{user.winningBal}</div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-bold text-slate-300 mb-2 block">Amount (₹)</label>
            <input 
              type="number" 
              value={wAmount} 
              onChange={e => setWAmount(e.target.value)}
              placeholder="Min ₹22"
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white font-bold outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label className="text-sm font-bold text-slate-300 mb-2 block">Method</label>
            <select 
              value={wMethod}
              onChange={e => setWMethod(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-blue-500 appearance-none"
            >
              <option>UPI</option>
              <option>Bank Transfer</option>
            </select>
          </div>
          <div>
             <label className="text-sm font-bold text-slate-300 mb-2 block">Details (UPI ID / Bank Info)</label>
             <input 
               value={wDetails}
               onChange={e => setWDetails(e.target.value)}
               placeholder="e.g. user@upi"
               className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-white outline-none focus:border-blue-500"
             />
          </div>
        </div>

        <button 
          onClick={requestWithdraw}
          className="w-full py-4 rounded-xl bg-slate-100 text-slate-900 font-bold mt-6 hover:bg-white active:scale-95 transition-transform"
        >
          Request Withdrawal
        </button>
      </div>
    );
  }

  // Main Wallet View
  return (
    <div className="p-4 pb-24">
      {/* Total Balance Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl relative overflow-hidden mb-6">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
        
        <div className="relative z-10">
          <p className="text-slate-400 font-medium text-sm mb-1">Total Balance</p>
          <h1 className="text-4xl font-black text-white mb-6">₹{user.depositBal + user.winningBal + user.bonusBal}</h1>
          
          <div className="grid grid-cols-3 gap-4 border-t border-slate-700 pt-4">
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold">Deposit</p>
              <p className="text-white font-bold">₹{user.depositBal}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold">Winnings</p>
              <p className="text-green-400 font-bold">₹{user.winningBal}</p>
            </div>
            <div>
              <p className="text-slate-400 text-[10px] uppercase font-bold">Bonus</p>
              <p className="text-yellow-400 font-bold">₹{user.bonusBal}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button 
          onClick={() => setView('add')}
          className="bg-blue-600 hover:bg-blue-500 text-white rounded-xl p-4 flex flex-col items-center gap-2 shadow-lg shadow-blue-600/20 transition-transform active:scale-95"
        >
          <ArrowDownLeft size={24} />
          <span className="font-bold text-sm">Add Cash</span>
        </button>
        <button 
          onClick={() => setView('withdraw')}
          className="bg-slate-800 hover:bg-slate-700 text-white rounded-xl p-4 flex flex-col items-center gap-2 border border-slate-700 transition-transform active:scale-95"
        >
          <ArrowUpRight size={24} />
          <span className="font-bold text-sm">Withdraw</span>
        </button>
      </div>

      {/* Transactions Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-white">Recent Transactions</h3>
        <button className="text-blue-400 text-xs font-bold" onClick={() => setView('main')}>View All</button>
      </div>

      {/* Transaction List */}
      <div className="space-y-3">
        {transactions.length === 0 ? (
          <div className="text-center py-10 text-slate-500">
             <History size={32} className="mx-auto mb-2 opacity-50"/>
             <p className="text-sm">No transactions yet.</p>
          </div>
        ) : (
          transactions.slice(0, 10).map((tx, idx) => {
            const isCredit = ['deposit', 'win', 'refund', 'top-up'].some(s => tx.type.toLowerCase().includes(s));
            return (
              <div key={idx} className="bg-slate-800/50 p-4 rounded-xl flex items-center justify-between border border-slate-700/50">
                <div className="flex items-center gap-3">
                   <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isCredit ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {isCredit ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                   </div>
                   <div>
                      <p className="font-bold text-sm text-slate-200">{tx.type}</p>
                      <p className="text-[10px] text-slate-500">{tx.status} • {tx.date}</p>
                   </div>
                </div>
                <div className={`font-bold text-sm ${isCredit ? 'text-green-400' : 'text-slate-200'}`}>
                  {isCredit ? '+' : '-'} ₹{tx.amount}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};