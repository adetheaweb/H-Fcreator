import React, { useState } from 'react';
import { LogIn, ShieldCheck, Globe, Database, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { loginWithEmail } from '../lib/firebase';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await loginWithEmail(email, password);
    } catch (err: any) {
      console.error(err);
      let msg = 'Gagal memproses. Silakan coba lagi.';
      if (err.code === 'auth/user-not-found') msg = 'Email tidak terdaftar.';
      if (err.code === 'auth/wrong-password') msg = 'Password salah. Silakan coba lagi.';
      if (err.code === 'auth/invalid-email') msg = 'Format email tidak valid.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Geometric background accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-900/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-emerald-400/5 rounded-full blur-2xl"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl shadow-emerald-900/10 p-10 relative z-10 border border-slate-200"
      >
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-emerald-900 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg">
            <div className="text-white font-black text-2xl tracking-tighter italic">H</div>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tighter mb-2 uppercase">H&F Creator</h1>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            Content, App & Gallery Hub
          </p>
        </div>

        <div className="mb-6 text-center">
          <h2 className="text-xl font-black text-slate-800 tracking-tighter uppercase">
            Selamat Datang
          </h2>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
            Masuk ke portal kreatif Anda
          </p>
        </div>

        <form onSubmit={handleEmailAction} className="space-y-4">
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-red-600"
            >
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <p className="text-[10px] font-bold leading-tight">{error}</p>
            </motion.div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-900 transition-all font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full h-14 pl-12 pr-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-900/10 focus:border-emerald-900 transition-all font-medium"
              />
            </div>
          </div>

          <button
            disabled={loading}
            type="submit"
            className="w-full h-14 flex items-center justify-center gap-4 bg-emerald-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/20 disabled:opacity-50 group active:scale-95"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Masuk Sekarang'}
          </button>
        </form>

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-100"></div>
          </div>
          <div className="relative flex justify-center text-[10px] uppercase font-black tracking-widest">
            <span className="bg-white px-4 text-slate-300 tracking-[0.3em]">Atau</span>
          </div>
        </div>

        <button
          onClick={() => {
            setLoading(true);
            onLogin();
          }}
          type="button"
          disabled={loading}
          className="w-full h-14 flex items-center justify-center gap-4 bg-white text-emerald-900 border-2 border-slate-100 rounded-xl font-black text-xs uppercase tracking-widest hover:border-emerald-900 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 bg-white rounded-full p-0.5" />
              Lanjutkan dengan Google
            </>
          )}
        </button>

        <div className="mt-10 pt-8 border-t border-slate-100 flex flex-col items-center gap-2">
          <p className="text-[9px] text-slate-400 font-black uppercase tracking-[0.2em] mb-3">Powered By</p>
          <div className="flex gap-6 grayscale opacity-40">
            <span className="font-black text-[9px] italic tracking-tighter">H&F STUDIO</span>
            <span className="font-black text-[9px] italic tracking-tighter">CREATOR HUB</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
