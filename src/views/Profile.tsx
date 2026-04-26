import React, { useEffect, useState } from 'react';
import { 
  Search, 
  Phone,
  Mail,
  Globe,
  MessageSquare,
  ExternalLink,
  AtSign,
  Twitter,
  Github,
  Linkedin,
  Facebook,
  Instagram,
  Youtube
} from 'lucide-react';
import { collection, getDocs, query, orderBy, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Contact, SiteConfig } from '../types';
import { motion } from 'motion/react';

export function Profile() {
  const [contacts, setContacts] = useState<Contact[]>([]);
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
      const configSnap = await getDoc(doc(db, 'config', 'site'));
      if (configSnap.exists()) {
        setSiteConfig(configSnap.data() as SiteConfig);
      }

      // Fetch contacts
      const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
      const snap = await getDocs(q);
      const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Contact));
      setContacts(data);
    } catch (error) {
      console.error("Error fetching profile data:", error);
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
    if (p.includes('ig') || p.includes('instagram')) return <Instagram className="w-5 h-5" />;
    if (p.includes('fb') || p.includes('facebook')) return <Facebook className="w-5 h-5" />;
    if (p.includes('tw') || p.includes('twitter') || p.includes('x.com')) return <Twitter className="w-5 h-5" />;
    if (p.includes('in') || p.includes('linkedin')) return <Linkedin className="w-5 h-5" />;
    if (p.includes('gh') || p.includes('github')) return <Github className="w-5 h-5" />;
    if (p.includes('yt') || p.includes('youtube')) return <Youtube className="w-5 h-5" />;
    return <AtSign className="w-5 h-5" />;
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
    <div className="space-y-8">
      {/* Admin Profile Header */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="h-32 bg-emerald-700 relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
          <div className="absolute -bottom-16 left-8">
            <div className="relative">
              <img 
                src={siteConfig?.adminPhotoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop'} 
                className="w-32 h-32 rounded-3xl border-4 border-white object-cover shadow-xl"
                alt="Admin"
                referrerPolicy="no-referrer"
              />
              <div className="absolute bottom-2 right-2 w-6 h-6 bg-emerald-500 border-4 border-white rounded-full"></div>
            </div>
          </div>
        </div>
        <div className="pt-20 pb-8 px-8 ml-0 sm:ml-40 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{siteConfig?.adminName || 'H&F Creator Admin'}</h2>
            <p className="text-emerald-600 font-bold uppercase tracking-[0.2em] text-[10px] mt-1">{siteConfig?.adminStatus || 'PROFIL TERVERIFIKASI'}</p>
          </div>
          <div className="flex gap-2">
             <button onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })} className="px-6 py-2.5 bg-emerald-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200">
               Hubungi Saya
             </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: About/Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
            <h3 className="font-black text-slate-800 text-sm uppercase tracking-widest mb-6 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-emerald-500 rounded-full"></span>
              Tentang Creator
            </h3>
            <p className="text-sm text-slate-500 leading-relaxed font-medium">
              Selamat datang di portal resmi H&F_Creator. Kami berdedikasi untuk menciptakan aplikasi berkualitas, konten edukatif, dan media kreatif untuk mendukung ekosistem digital.
            </p>
          </div>
        </div>

        {/* Right Column: Social Links & Contacts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm min-h-[400px] flex flex-col">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/50 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <h3 className="font-black text-slate-800 text-xs tracking-widest uppercase">Media Sosial & Kontak</h3>
              </div>
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Cari platform..." 
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-medium"
                />
              </div>
            </div>

            <div className="p-6 flex-1">
              {loading ? (
                <div className="h-full flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Memuat Tautan...</div>
              ) : filtered.length === 0 ? (
                <div className="h-full flex items-center justify-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Tidak ada tautan ditemukan</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filtered.map((item) => (
                    <motion.div 
                      key={item.id} 
                      whileHover={{ y: -4 }}
                      className="bg-slate-50/30 border border-slate-100 rounded-2xl p-5 hover:shadow-md hover:border-emerald-100 transition-all group"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                            {getContactIcon(item.platform)}
                          </div>
                          <div>
                            <h4 className="font-extrabold text-slate-800 tracking-tight text-sm leading-none mb-1">{item.platform}</h4>
                            <p className="text-[9px] text-slate-400 font-black uppercase tracking-wider">{item.value.length > 25 ? item.value.substring(0, 25) + '...' : item.value}</p>
                          </div>
                        </div>
                        <a 
                          href={getContactLink(item)}
                          target="_blank" 
                          rel="noreferrer" 
                          className="p-2 bg-white border border-slate-200 text-slate-400 rounded-lg hover:text-emerald-600 hover:border-emerald-600 transition-all"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
