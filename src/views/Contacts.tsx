import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Phone,
  Mail,
  Globe,
  MessageSquare,
  ExternalLink,
  AtSign
} from 'lucide-react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Contact } from '../types';
import { motion } from 'motion/react';

export function Contacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchContacts();
  }, []);

  async function fetchContacts() {
    setLoading(true);
    try {
      const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contact));
      setContacts(data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  }

  const filtered = contacts.filter(c => 
    c.platform.toLowerCase().includes(search.toLowerCase()) ||
    c.value.toLowerCase().includes(search.toLowerCase())
  );

  const getContactIcon = (platform: string) => {
    const p = platform.toLowerCase();
    if (p.includes('wa') || p.includes('whatsapp') || p.includes('phone')) return <Phone className="w-5 h-5" />;
    if (p.includes('mail') || p.includes('email')) return <Mail className="w-5 h-5" />;
    if (p.includes('web') || p.includes('site')) return <Globe className="w-5 h-5" />;
    if (p.includes('ig') || p.includes('instagram') || p.includes('social')) return <AtSign className="w-5 h-5" />;
    return <MessageSquare className="w-5 h-5" />;
  };

  const getContactLink = (contact: Contact) => {
    const val = contact.value;
    const p = contact.platform.toLowerCase();
    if (val.startsWith('http')) return val;
    if (p.includes('wa') || p.includes('whatsapp')) return `https://wa.me/${val.replace(/\D/g, '')}`;
    if (p.includes('mail') || p.includes('email')) return `mailto:${val}`;
    return '#';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Hubungi Kami</h2>
          <p className="text-slate-500 text-sm">Saluran komunikasi resmi H&F_Creator Team.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[500px] flex flex-col">
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-lg text-white">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-800 text-sm tracking-tight">Daftar Kontak Terintegrasi</h3>
          </div>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Cari Kontak..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
            />
          </div>
        </div>

        <div className="p-6 flex-1">
          {loading ? (
             <div className="h-full flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Sinkronisasi Kontak...</div>
          ) : filtered.length === 0 ? (
            <div className="h-full flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Belum ada data kontak</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((item) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  key={item.id} 
                  className="bg-slate-50/30 border border-slate-100 rounded-2xl p-6 hover:shadow-lg hover:border-emerald-100 transition-all group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 -mr-8 -mt-8 rounded-full blur-2xl group-hover:bg-emerald-500/10 transition-colors"></div>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform duration-300">
                      {getContactIcon(item.platform)}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-slate-800 tracking-tight leading-none mb-1">{item.platform}</h4>
                      <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.15em]">Official Channel</p>
                    </div>
                  </div>

                  <p className="text-slate-600 font-bold text-sm mb-6 truncate">{item.value}</p>

                  <a 
                    href={getContactLink(item)}
                    target="_blank" 
                    rel="noreferrer" 
                    className="w-full flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white hover:border-emerald-600 transition-all"
                  >
                    Hubungi Sekarang <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
