import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Image as ImageIcon,
  Calendar,
  Grid,
  Video
} from 'lucide-react';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { GalleryItem, SiteConfig } from '../types';
import { motion } from 'motion/react';

export function Teachers() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      // Fetch site config
      const docSnap = await getDoc(doc(db, 'config', 'site'));
      if (docSnap.exists()) {
        setSiteConfig(docSnap.data() as SiteConfig);
      }

      // Fetch gallery
      const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as GalleryItem));
      setItems(data);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    } finally {
      setLoading(false);
    }
  }

  const filtered = items.filter(item => 
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gallery Media</h2>
          <p className="text-slate-500 text-sm">Dokumentasi kegiatan, aset kreatif, dan portofolio H&F_Creator.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        {siteConfig?.youtubeVideoId && !search && (
          <div className="p-6 border-b border-slate-100 bg-slate-50/30">
            <div className="flex items-center gap-3 mb-4">
               <div className="p-2 bg-red-50 rounded-lg text-red-600">
                  <Video className="w-4 h-4" />
               </div>
               <h3 className="font-bold text-slate-800 text-sm tracking-tight uppercase">Video Utama Portal</h3>
            </div>
            <div className="aspect-video w-full max-w-4xl mx-auto rounded-2xl overflow-hidden shadow-xl border-4 border-white">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${siteConfig.youtubeVideoId}`}
                title="H&F Gallery Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-2">
            <Grid className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-slate-700 uppercase text-xs tracking-widest">Media Gallery</h3>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari Judul Foto..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs w-48 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="p-6 flex-1">
          {loading ? (
             <div className="flex items-center justify-center h-64 text-slate-400 font-bold uppercase tracking-widest text-xs">Memindai Database Gallery...</div>
          ) : filtered.length === 0 ? (
             <div className="flex flex-col items-center justify-center h-64 text-slate-400">
               <ImageIcon className="w-12 h-12 mb-4 opacity-20" />
               <span className="font-bold uppercase tracking-widest text-xs opacity-50">Gallery Masih Kosong</span>
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((item) => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group relative bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden hover:shadow-xl transition-all"
                >
                  <div className="aspect-square overflow-hidden bg-slate-200">
                    <img 
                      src={item.imageUrl} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=400';
                      }}
                    />
                  </div>
                  <div className="p-4">
                    <div className="text-[10px] font-black text-indigo-600 uppercase tracking-widest mb-1">{item.type}</div>
                    <h4 className="font-bold text-slate-800 text-sm truncate">{item.title}</h4>
                    <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-400 font-bold uppercase">
                       <Calendar className="w-3 h-3" />
                       {item.createdAt?.toDate ? item.createdAt.toDate().toLocaleDateString('id-ID') : 'Baru saja'}
                    </div>
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
