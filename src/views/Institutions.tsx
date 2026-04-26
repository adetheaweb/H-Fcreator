import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Search, 
  FileText,
  Tag,
  User,
  Clock
} from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Article } from '../types';
import { useAuth } from '../App';

export function Institutions() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    fetchArticles();
  }, []);

  async function fetchArticles() {
    setLoading(true);
    try {
      const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Article));
      setArticles(data);
    } catch (error) {
      console.error("Error fetching articles:", error);
    } finally {
      setLoading(false);
    }
  }

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filtered = articles.filter(a => 
    a.title.toLowerCase().includes(search.toLowerCase()) || 
    a.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Artikel Terbaru</h2>
          <p className="text-gray-500 text-sm">Informasi, berita, dan panduan pendidikan terkini.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden min-h-[500px] flex flex-col">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50">
          <h3 className="font-bold text-slate-700">Daftar Artikel Terbit</h3>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari Judul/Penulis..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            />
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="flex flex-col items-center gap-2">
                <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Memuat Artikel...</span>
              </div>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Tidak ada artikel ditemukan</p>
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${expandedId ? 'gap-8' : 'md:grid-cols-2 lg:grid-cols-2 gap-6'}`}>
              {filtered.map((article) => {
                const isExpanded = expandedId === article.id;
                
                // If something is expanded, and it's not this one, we might want to hide others or just keep them small.
                // The user said "tetep disana", usually implies expanding the existing tile or shifting to a detail view in same area.
                // Let's make it so if one is expanded it takes full width or stays in grid but grows.
                
                if (expandedId && !isExpanded) return null;

                return (
                  <div 
                    key={article.id} 
                    className={`group relative bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all duration-300 flex flex-col ${
                      isExpanded ? 'w-full shadow-2xl border-indigo-200' : 'hover:shadow-xl hover:border-indigo-200 h-full'
                    }`}
                  >
                    {/* Category Tag */}
                    <div className="absolute top-4 left-4 z-10">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur shadow-sm border border-slate-100 rounded-full text-[10px] font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-1.5">
                        <Tag className="w-3 h-3" />
                        {article.category}
                      </span>
                    </div>

                    <div className="p-8 flex flex-col h-full">
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mb-4 font-medium">
                        <span className="flex items-center gap-1"><User className="w-3 h-3" /> {article.author}</span>
                        <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.createdAt?.toDate ? article.createdAt.toDate().toLocaleDateString('id-ID') : 'Baru saja'}</span>
                      </div>

                      <h4 className={`${isExpanded ? 'text-2xl mb-6' : 'text-lg mb-3 line-clamp-2'} font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors`}>
                        {article.title}
                      </h4>

                      <div className={`text-slate-600 leading-relaxed ${isExpanded ? 'text-base space-y-4 mb-8' : 'text-sm mb-6 line-clamp-3'}`}>
                        {isExpanded ? (
                          article.content.split('\n').map((para, i) => (
                            <p key={i}>{para}</p>
                          ))
                        ) : (
                          article.content.replace(/<[^>]*>/g, '')
                        )}
                      </div>

                      <button 
                        onClick={() => setExpandedId(isExpanded ? null : article.id)}
                        className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center gap-2 border ${
                          isExpanded 
                            ? 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-slate-200' 
                            : 'bg-slate-50 text-slate-600 border-slate-100 hover:bg-indigo-600 hover:text-white hover:border-indigo-600'
                        }`}
                      >
                        {isExpanded ? 'Tutup Artikel' : 'Baca Selengkapnya'}
                      </button>
                    </div>
                  </div>
                );
              })}
              {expandedId && (
                <div className="mt-4 flex justify-start">
                   <button 
                    onClick={() => setExpandedId(null)}
                    className="text-indigo-600 font-bold text-xs uppercase tracking-widest flex items-center gap-2 hover:underline"
                   >
                     <Plus className="w-4 h-4 rotate-45" /> Kembali Ke Daftar
                   </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
