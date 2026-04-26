import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Box,
  Globe,
  Smartphone,
  Monitor,
  ExternalLink
} from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { App as AppType } from '../types';
import { motion } from 'motion/react';

export function Students() {
  const [apps, setApps] = useState<AppType[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchApps();
  }, []);

  async function fetchApps() {
    setLoading(true);
    try {
      const q = query(collection(db, 'my_apps'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as AppType));
      setApps(data);
    } catch (error) {
      console.error("Error fetching apps:", error);
    } finally {
      setLoading(false);
    }
  }

  const filtered = apps.filter(a => 
    a.name.toLowerCase().includes(search.toLowerCase())
  );

  const getPlatformIcon = (platform: string) => {
    switch(platform) {
      case 'Web': return <Globe className="w-4 h-4" />;
      case 'Mobile': return <Smartphone className="w-4 h-4" />;
      case 'Desktop': return <Monitor className="w-4 h-4" />;
      default: return <Box className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Katalog Aplikasi</h2>
          <p className="text-slate-500 text-sm">Daftar sistem informasi dan aplikasi digital ekosistem H&F Creator.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[500px] flex flex-col">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded-lg text-white">
              <Box className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm tracking-tight">Katalog My Apps</h3>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari Aplikasi..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
            />
          </div>
        </div>

        <div className="p-6 flex-1">
          {loading ? (
             <div className="h-full flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Hub...</div>
          ) : filtered.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Belum ada aplikasi</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((app) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={app.id} 
                  className="bg-white border border-slate-100 rounded-2xl p-5 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all group flex flex-col h-full"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 border border-indigo-100 group-hover:scale-110 transition-transform duration-300">
                      {getPlatformIcon(app.platform)}
                    </div>
                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {app.version}
                    </span>
                  </div>
                  
                  <div className="flex-1 mb-6">
                    <h4 className="font-extrabold text-slate-800 text-lg tracking-tight group-hover:text-indigo-600 transition-colors mb-1">{app.name}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-2">
                      {app.description || `Sistem informasi berbasis ${app.platform} untuk mendukung operasional H&F Creator.`}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                       <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                       <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{app.platform}</span>
                    </div>
                    {app.url && (
                      <a 
                        href={app.url} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="flex items-center gap-1.5 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 active:scale-95"
                      >
                        Buka App <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
