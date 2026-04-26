import React, { useState } from 'react';
import { LogIn, ShieldCheck, Globe, Database, Mail, Lock, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { loginWithEmail, registerWithEmail } from '../lib/firebase';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmailAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      if (isRegistering) {
        await registerWithEmail(email, password);
      } else {
        await loginWithEmail(email, password);
      }
    } catch (err: any) {
      console.error(err);
      let msg = 'Gagal memproses. Silakan coba lagi.';
      if (err.code === 'auth/user-not-found') msg = 'Email tidak terdaftar.';
      if (err.code === 'auth/wrong-password') msg = 'Password salah.';
      if (err.code === 'auth/email-already-in-use') msg = 'Email sudah terdaftar.';
      if (err.code === 'auth/weak-password') msg = 'Password terlalu lemah.';
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

        <AnimatePresence mode="wait">
          {!showEmailForm ? (
            <motion.div
              key="social"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              <div className="space-y-2">
                {[
                  { icon: ShieldCheck, text: "Platform Media Kreatif" },
                  { icon: Globe, text: "Aplikasi Terintegrated" },
                  { icon: Database, text: "Koleksi Gallery Terpusat" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 bg-slate-50 rounded-xl border border-slate-100">
                    <item.icon className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="text-[11px] text-slate-600 font-bold tracking-tight uppercase">{item.text}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setLoading(true);
                    onLogin();
                  }}
                  disabled={loading}
                  className="w-full h-14 flex items-center justify-center gap-4 bg-emerald-900 text-white rounded-xl font-black text-xs uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/20 group active:scale-95 disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 bg-white rounded-full p-0.5" />
                      Masuk dengan Google
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowEmailForm(true)}
                  className="w-full h-14 flex items-center justify-center gap-4 bg-white text-emerald-900 border-2 border-slate-100 rounded-xl font-black text-xs uppercase tracking-widest hover:border-emerald-900 transition-all active:scale-95"
                >
                  <Mail className="w-5 h-5" />
                  Gunakan Email
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="email"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <button 
                onClick={() => setShowEmailForm(false)}
                className="mb-6 text-[10px] font-black text-emerald-600 uppercase tracking-widest hover:underline flex items-center gap-2"
              >
                ← Kembali
              </button>

              <div className="mb-6">
                <h2 className="text-xl font-black text-slate-800 tracking-tighter uppercase">
                  {isRegistering ? 'Buat Akun Baru' : 'Selamat Datang Kembali'}
                </h2>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                  {isRegistering ? 'Lengkapi data di bawah ini' : 'Silakan masuk ke akun Anda'}
                </p>
              </div>

              <form onSubmit={handleEmailAction} className="space-y-4">
                {error && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start gap-2 text-red-600">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <p className="text-[10px] font-bold leading-tight">{error}</p>
                  </div>
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
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (isRegistering ? 'Daftar Sekarang' : 'Masuk Sekarang')}
                </button>

                <button
                  type="button"
                  onClick={() => setIsRegistering(!isRegistering)}
                  className="w-full text-center text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-emerald-600 transition-colors"
                >
                  {isRegistering ? 'Sudah punya akun? Masuk' : 'Belum punya akun? Daftar'}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

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
