import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Download as DownloadIcon,
  FileText,
  FileCode,
  FileImage,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Download } from '../types';
import { motion } from 'motion/react';

export function Downloads() {
  const [downloads, setDownloads] = useState<Download[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchDownloads();
  }, []);

  async function fetchDownloads() {
    setLoading(true);
    try {
      const q = query(collection(db, 'downloads'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Download));
      setDownloads(data);
    } catch (error) {
      console.error("Error fetching downloads:", error);
    } finally {
      setLoading(false);
    }
  }

  const filtered = downloads.filter(d => 
    d.title.toLowerCase().includes(search.toLowerCase()) ||
    d.description.toLowerCase().includes(search.toLowerCase())
  );

  const getFileIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('pdf') || t.includes('doc')) return <FileText className="w-5 h-5 text-red-500" />;
    if (t.includes('zip') || t.includes('rar') || t.includes('exe')) return <FileCode className="w-5 h-5 text-amber-500" />;
    if (t.includes('jpg') || t.includes('png') || t.includes('img')) return <FileImage className="w-5 h-5 text-emerald-500" />;
    return <DownloadIcon className="w-5 h-5 text-indigo-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Download Center</h2>
          <p className="text-slate-500 text-sm">Akses berbagai file dan resources resmi H&F Creator.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[500px] flex flex-col">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500 rounded-lg text-white">
              <DownloadIcon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm tracking-tight">Katalog Downloads</h3>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari File..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all font-medium"
            />
          </div>
        </div>

        <div className="p-6 flex-1">
          {loading ? (
             <div className="h-full flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Loading Resources...</div>
          ) : filtered.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Belum ada file untuk di-download</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={item.id} 
                  className="group bg-white border border-slate-100 rounded-2xl p-5 hover:shadow-xl hover:border-amber-200 transition-all flex flex-col h-full"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-amber-50 transition-colors">
                      {getFileIcon(item.type)}
                    </div>
                    <div className="text-right">
                       <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{item.type}</span>
                       <span className="bg-slate-100 px-1.5 py-0.5 rounded text-[8px] font-black text-slate-500 uppercase">{item.fileSize}</span>
                    </div>
                  </div>

                  <div className="flex-1 mb-6">
                    <h4 className="font-extrabold text-slate-800 tracking-tight mb-2 group-hover:text-amber-600 transition-colors">{item.title}</h4>
                    <p className="text-slate-500 text-xs leading-relaxed line-clamp-3">
                      {item.description || "Silahkan unduh file ini untuk kemudahan akses informasi H&F Creator."}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-50">
                    <a 
                      href={item.fileUrl} 
                      target="_blank" 
                      rel="noreferrer" 
                      className="w-full flex items-center justify-between bg-slate-900 text-white px-4 py-3 rounded-xl text-xs font-bold hover:bg-amber-600 transition-all active:scale-95 shadow-lg shadow-slate-900/10 group/btn"
                    >
                      <span>Download Sekarang</span>
                      <div className="bg-white/10 p-1 rounded-md group-hover/btn:translate-x-1 transition-transform">
                        <ChevronRight className="w-3 h-3" />
                      </div>
                    </a>
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
