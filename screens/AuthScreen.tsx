import React, { useState } from 'react';
import { Mail, Lock, User, Phone, ArrowRight, Trophy } from 'lucide-react';

interface AuthScreenProps {
  onLogin: (email: string, pass: string) => Promise<void>;
  onSignup: (name: string, email: string, phone: string, pass: string) => Promise<void>;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        await onLogin(email, password);
      } else {
        await onSignup(name, email, phone, password);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -right-[20%] w-[70%] h-[70%] bg-blue-600/20 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-[0%] -left-[10%] w-[50%] h-[50%] bg-cyan-600/10 rounded-full blur-[80px]"></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mx-auto flex items-center justify-center shadow-2xl shadow-blue-500/30 mb-6 rotate-3 hover:rotate-6 transition-transform">
            <Trophy size={40} className="text-white drop-shadow-md" />
          </div>
          <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
            {isLogin ? 'Welcome Back!' : 'Join the Squad'}
          </h1>
          <p className="text-slate-400">
            {isLogin ? 'Enter the arena and start winning.' : 'Create your account to compete.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                  required
                />
              </div>
              <div className="relative group">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
                  required
                />
              </div>
            </>
          )}

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
              required
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl py-4 pl-12 pr-4 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-600/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] mt-4"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                {isLogin ? 'Login' : 'Sign Up'} <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <p className="text-center mt-8 text-slate-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-400 font-bold hover:text-blue-300 transition-colors ml-1"
          >
            {isLogin ? 'Create one' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};