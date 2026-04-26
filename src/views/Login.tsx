import React from 'react';
import { School, LogIn, ShieldCheck, Globe, Database } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: () => void;
}

export function Login({ onLogin }: LoginProps) {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 relative overflow-hidden font-sans">
      {/* Geometric background accents */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-emerald-900/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-[400px] h-[400px] bg-emerald-400/5 rounded-full blur-2xl"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-2xl shadow-emerald-900/10 p-12 relative z-10 border border-slate-200"
      >
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-emerald-900 rounded-xl flex items-center justify-center mx-auto mb-8 shadow-lg">
            <div className="text-white font-black text-2xl tracking-tighter italic">H</div>
          </div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tighter mb-3 uppercase">H&F Creator</h1>
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest leading-relaxed">
            Content, App & Gallery Hub
          </p>
        </div>

        <div className="space-y-3 mb-10">
          {[
            { icon: ShieldCheck, text: "Platform Media Kreatif" },
            { icon: Globe, text: "Aplikasi Terintegrasi" },
            { icon: Database, text: "Koleksi Gallery Terpusat" }
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-4 bg-slate-50 rounded-xl border border-slate-100">
              <item.icon className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="text-xs text-slate-600 font-bold tracking-tight">{item.text}</span>
            </div>
          ))}
        </div>

        <button
          onClick={onLogin}
          className="w-full h-14 flex items-center justify-center gap-4 bg-emerald-900 text-white rounded-xl font-black text-sm uppercase tracking-widest hover:bg-emerald-800 transition-all shadow-xl shadow-emerald-900/20 group"
        >
          <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 bg-white rounded-full p-0.5" />
          Masuk Sekarang
        </button>

        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col items-center gap-2">
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-4">Powered By</p>
          <div className="flex gap-6 grayscale opacity-40">
            <span className="font-black text-xs italic">H&F STUDIO</span>
            <span className="font-black text-xs italic">CREATOR HUB</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
