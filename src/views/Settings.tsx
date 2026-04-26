import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  AppWindow, 
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  Search,
  CheckCircle2,
  AlertCircle,
  Phone,
  Download,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy, 
  serverTimestamp,
  setDoc,
  getDoc
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { Article, App as AppType, GalleryItem, Contact, SiteConfig, Download as DownloadType } from '../types';
import { useAuth } from '../App';

type TabType = 'articles' | 'apps' | 'gallery' | 'contacts' | 'admin_profile' | 'downloads';

export function Settings() {
  const [activeTab, setActiveTab] = useState<TabType>('articles');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { user } = useAuth();

  // Data States
  const [articles, setArticles] = useState<Article[]>([]);
  const [apps, setApps] = useState<AppType[]>([]);
  const [gallery, setGallery] = useState<GalleryItem[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [downloads, setDownloads] = useState<DownloadType[]>([]);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    adminPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop',
    adminName: 'H&F Manager',
    adminStatus: 'Active',
    youtubeVideoId: 'H3v_A94f1r8'
  });

  // Form States
  const [articleForm, setArticleForm] = useState({
    title: '',
    content: '',
    category: 'Pendidikan',
    status: 'Published' as 'Draft' | 'Published'
  });

  const [appForm, setAppForm] = useState({
    name: '',
    version: '1.0.0',
    platform: 'Web' as 'Web' | 'Mobile' | 'Desktop',
    url: '',
    description: ''
  });

  const [galleryForm, setGalleryForm] = useState({
    title: '',
    imageUrl: '',
    videoUrl: '',
    mediaType: 'image' as 'image' | 'video',
    type: 'Educational' as 'Event' | 'Educational' | 'Misc'
  });

  const [contactForm, setContactForm] = useState({
    platform: '',
    value: '',
    icon: 'Phone'
  });

  const [downloadForm, setDownloadForm] = useState({
    title: '',
    description: '',
    fileUrl: '',
    fileSize: '',
    type: 'PDF'
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  async function fetchData() {
    setLoading(true);
    setErrorMessage(null);
    try {
      if (activeTab === 'articles') {
        const q = query(collection(db, 'articles'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setArticles(snap.docs.map(d => ({ id: d.id, ...d.data() } as Article)));
      } else if (activeTab === 'apps') {
        const q = query(collection(db, 'my_apps'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setApps(snap.docs.map(d => ({ id: d.id, ...d.data() } as AppType)));
      } else if (activeTab === 'gallery') {
        const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setGallery(snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryItem)));
      } else if (activeTab === 'contacts') {
        const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setContacts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Contact)));
      } else if (activeTab === 'downloads') {
        const q = query(collection(db, 'downloads'), orderBy('createdAt', 'desc'));
        const snap = await getDocs(q);
        setDownloads(snap.docs.map(d => ({ id: d.id, ...d.data() } as DownloadType)));
      } else if (activeTab === 'admin_profile') {
        const docRef = doc(db, 'config', 'site');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSiteConfig(docSnap.data() as SiteConfig);
        }
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, activeTab);
      setErrorMessage("Gagal mengambil data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage(null);
    setErrorMessage(null);
    
    try {
      if (activeTab === 'articles') {
        if (editingId) {
          await setDoc(doc(db, 'articles', editingId), {
            ...articleForm,
            updatedAt: serverTimestamp()
          }, { merge: true });
        } else {
          await addDoc(collection(db, 'articles'), {
            ...articleForm,
            author: user?.displayName || user?.email || 'Anonymous',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        }
        setArticleForm({ title: '', content: '', category: 'Pendidikan', status: 'Published' });
        setSuccessMessage('Artikel berhasil disimpan!');
      } else if (activeTab === 'apps') {
        if (editingId) {
          await setDoc(doc(db, 'my_apps', editingId), {
            ...appForm,
            updatedAt: serverTimestamp()
          }, { merge: true });
        } else {
          await addDoc(collection(db, 'my_apps'), {
            ...appForm,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
        }
        setAppForm({ name: '', version: '1.0.0', platform: 'Web', url: '', description: '' });
        setSuccessMessage('Aplikasi berhasil disimpan!');
      } else if (activeTab === 'gallery') {
        if (editingId) {
          await setDoc(doc(db, 'gallery', editingId), {
            ...galleryForm
          }, { merge: true });
        } else {
          await addDoc(collection(db, 'gallery'), {
            ...galleryForm,
            createdAt: serverTimestamp()
          });
        }
        setGalleryForm({ title: '', imageUrl: '', type: 'Educational' });
        setSuccessMessage('Media berhasil disimpan!');
      } else if (activeTab === 'contacts') {
        if (editingId) {
          await setDoc(doc(db, 'contacts', editingId), {
            ...contactForm
          }, { merge: true });
        } else {
          await addDoc(collection(db, 'contacts'), {
            ...contactForm,
            createdAt: serverTimestamp()
          });
        }
        setContactForm({ platform: '', value: '', icon: 'Phone' });
        setSuccessMessage('Kontak berhasil disimpan!');
      } else if (activeTab === 'downloads') {
        if (editingId) {
          await setDoc(doc(db, 'downloads', editingId), {
            ...downloadForm
          }, { merge: true });
        } else {
          await addDoc(collection(db, 'downloads'), {
            ...downloadForm,
            createdAt: serverTimestamp()
          });
        }
        setDownloadForm({ title: '', description: '', fileUrl: '', fileSize: '', type: 'PDF' });
        setSuccessMessage('Download berhasil disimpan!');
      } else if (activeTab === 'admin_profile') {
        const path = 'config/site';
        try {
          await setDoc(doc(db, 'config', 'site'), {
            ...siteConfig,
            updatedAt: serverTimestamp()
          });
          setSuccessMessage('Profil admin berhasil diperbarui!');
          // Clear success message after 3 seconds
          setTimeout(() => setSuccessMessage(null), 3000);
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, path);
        }
      }
      setShowModal(false);
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error("Error saving data:", err);
      setErrorMessage("Gagal menyimpan data. Pastikan Anda memiliki izin yang cukup.");
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(item: any) {
    setEditingId(item.id);
    if (activeTab === 'articles') {
      setArticleForm({ title: item.title, content: item.content, category: item.category, status: item.status });
    } else if (activeTab === 'apps') {
      setAppForm({ name: item.name, version: item.version, platform: item.platform, url: item.url, description: item.description });
    } else if (activeTab === 'gallery') {
      setGalleryForm({ 
        title: item.title, 
        imageUrl: item.imageUrl || '', 
        videoUrl: item.videoUrl || '',
        mediaType: item.mediaType || 'image',
        type: item.type 
      });
    } else if (activeTab === 'contacts') {
      setContactForm({ platform: item.platform, value: item.value, icon: item.icon });
    } else if (activeTab === 'downloads') {
      setDownloadForm({ title: item.title, description: item.description, fileUrl: item.fileUrl, fileSize: item.fileSize, type: item.type });
    }
    setShowModal(true);
  }

  async function handleDelete(id: string, collectionName: string) {
    if (!window.confirm('Hapus item ini?')) return;
    try {
      await deleteDoc(doc(db, collectionName, id));
      fetchData();
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Pengaturan Web</h2>
          <p className="text-slate-500 text-sm">Kelola konten portal, aplikasi, dan gallery media.</p>
        </div>
        {activeTab !== 'admin_profile' && (
          <button 
            onClick={() => {
              setEditingId(null);
              setShowModal(true);
            }}
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20"
          >
            <Plus className="w-4 h-4" />
            Tambah {activeTab === 'articles' ? 'Artikel' : activeTab === 'apps' ? 'Aplikasi' : 'Media'}
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-slate-200/50 rounded-2xl w-fit">
        {[
          { id: 'articles', label: 'Artikel', icon: FileText },
          { id: 'apps', label: 'My App', icon: AppWindow },
          { id: 'gallery', label: 'Gallery', icon: ImageIcon },
          { id: 'contacts', label: 'Kontak', icon: Phone },
          { id: 'downloads', label: 'Downloads', icon: Download },
          { id: 'admin_profile', label: 'Profil Admin', icon: CheckCircle2 },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as TabType)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-white text-indigo-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm min-h-[500px] relative">
        <AnimatePresence>
          {successMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 right-4 z-20 bg-emerald-100 text-emerald-700 px-4 py-2 rounded-lg border border-emerald-200 text-xs font-bold shadow-lg flex items-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              {successMessage}
            </motion.div>
          )}
          {errorMessage && (
            <motion.div 
              initial={{ opacity: 0, y: -20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -20 }}
              className="absolute top-4 right-4 z-20 bg-red-100 text-red-700 px-4 py-2 rounded-lg border border-red-200 text-xs font-bold shadow-lg flex items-center gap-2"
            >
              <AlertCircle className="w-4 h-4" />
              {errorMessage}
            </motion.div>
          )}
        </AnimatePresence>
        {activeTab === 'admin_profile' ? (
          <div className="p-8">
            <h3 className="text-xl font-bold mb-8 text-slate-800">Konfigurasi Profil Admin</h3>
            <form onSubmit={handleSubmit} className="max-w-2xl space-y-8">
              <div className="flex flex-col sm:flex-row items-center gap-8 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="relative group">
                  <img 
                    src={siteConfig.adminPhotoUrl} 
                    className="w-28 h-28 rounded-full border-4 border-white shadow-xl object-cover transition-transform group-hover:scale-105" 
                    alt="Admin Preview"
                  />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="font-bold text-slate-800 text-lg mb-1">Preview Foto Admin</h4>
                  <p className="text-xs text-slate-500 leading-relaxed max-w-xs transition-colors">Gantilah tautan foto dipengaturan tautan profile admin dibawah ini untuk merubah tampilan di sidebar.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Nama Manager / Admin</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: H&F Manager"
                    value={siteConfig.adminName} 
                    onChange={(e) => setSiteConfig({...siteConfig, adminName: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-sm transition-all font-medium" 
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Status Penanggung Jawab</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Active / Online"
                    value={siteConfig.adminStatus} 
                    onChange={(e) => setSiteConfig({...siteConfig, adminStatus: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-sm transition-all font-medium" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Tautan URL Foto Profil (Direct Link)</label>
                  <input 
                    required
                    type="url" 
                    placeholder="https://images.unsplash.com/..."
                    value={siteConfig.adminPhotoUrl} 
                    onChange={(e) => setSiteConfig({...siteConfig, adminPhotoUrl: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-sm transition-all font-medium" 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">YouTube Video ID (untuk Gallery)</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: H3v_A94f1r8"
                    value={siteConfig.youtubeVideoId} 
                    onChange={(e) => setSiteConfig({...siteConfig, youtubeVideoId: e.target.value})}
                    className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none text-sm transition-all font-medium" 
                  />
                  <p className="text-[9px] text-slate-400 mt-1 font-medium">Video ini akan ditampilkan di bagian atas Gallery Media.</p>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <button 
                  type="submit"
                  disabled={loading}
                  className="bg-indigo-600 text-white px-10 py-3.5 rounded-2xl font-bold hover:bg-indigo-700 active:scale-95 transition-all shadow-xl shadow-indigo-600/25 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Menyimpan...
                    </>
                  ) : (
                    <>
                      Perbarui Profil Admin
                      <CheckCircle2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-400 text-[11px] uppercase font-bold tracking-widest">
                  <th className="px-6 py-3 border-b border-slate-100">Informasi Item</th>
                  <th className="px-6 py-3 border-b border-slate-100">Status/Type</th>
                  <th className="px-6 py-3 border-b border-slate-100 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                  <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Sinkronisasi...</td></tr>
                ) : activeTab === 'articles' ? (
                  articles.length === 0 ? (
                    <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Data Kosong</td></tr>
                  ) : articles.map(a => (
                    <tr key={a.id} className="hover:bg-slate-50 border-b border-slate-50 group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{a.title}</div>
                        <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{a.author}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${a.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                          {a.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(a)} className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-100"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(a.id, 'articles')} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 rounded-lg border border-slate-100 hover:border-red-100"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : activeTab === 'apps' ? (
                  apps.length === 0 ? (
                    <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Data Kosong</td></tr>
                  ) : apps.map(ap => (
                    <tr key={ap.id} className="hover:bg-slate-50 border-b border-slate-50 group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{ap.name}</div>
                        <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{ap.platform}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-black text-slate-500 tracking-widest">VERSION {ap.version}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(ap)} className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-100"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(ap.id, 'my_apps')} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 rounded-lg border border-slate-100 hover:border-red-100"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : activeTab === 'gallery' ? (
                  gallery.length === 0 ? (
                    <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Data Kosong</td></tr>
                  ) : gallery.map(g => (
                    <tr key={g.id} className="hover:bg-slate-50 border-b border-slate-50 group">
                      <td className="px-6 py-4 flex items-center gap-3">
                        <img src={g.imageUrl} className="w-10 h-10 object-cover rounded-lg" alt="" />
                        <div>
                          <div className="font-bold text-slate-800">{g.title}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded text-[10px] font-black text-indigo-700 tracking-widest uppercase">{g.type}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(g)} className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-100"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(g.id, 'gallery')} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 rounded-lg border border-slate-100 hover:border-red-100"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : activeTab === 'contacts' ? (
                  contacts.length === 0 ? (
                    <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Data Kosong</td></tr>
                  ) : contacts.map(c => (
                    <tr key={c.id} className="hover:bg-slate-50 border-b border-slate-50 group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{c.platform}</div>
                        <div className="text-[10px] text-slate-400 font-medium tracking-wider">{c.value}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-black text-slate-500 tracking-widest uppercase">{c.icon}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(c)} className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-100"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(c.id, 'contacts')} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 rounded-lg border border-slate-100 hover:border-red-100"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  downloads.length === 0 ? (
                    <tr><td colSpan={3} className="px-6 py-12 text-center text-slate-400 font-bold uppercase tracking-widest text-[10px]">Data Kosong</td></tr>
                  ) : downloads.map(d => (
                    <tr key={d.id} className="hover:bg-slate-50 border-b border-slate-50 group">
                      <td className="px-6 py-4">
                        <div className="font-bold text-slate-800">{d.title}</div>
                        <div className="text-[10px] text-slate-400 font-medium tracking-wider">{d.type} • {d.fileSize}</div>
                      </td>
                      <td className="px-6 py-4">
                         <a href={d.fileUrl} target="_blank" rel="noreferrer" className="text-indigo-600 text-[10px] font-black uppercase tracking-widest hover:underline">Link File</a>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleEdit(d)} className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 rounded-lg border border-slate-100 hover:border-indigo-100"><Edit2 className="w-3.5 h-3.5" /></button>
                          <button onClick={() => handleDelete(d.id, 'downloads')} className="p-1.5 text-slate-400 hover:text-red-500 transition-colors bg-slate-50 rounded-lg border border-slate-100 hover:border-red-100"><Trash2 className="w-3.5 h-3.5" /></button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowModal(false)} className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-8 overflow-y-auto max-h-[90vh]">
              <h3 className="text-xl font-bold mb-6">{editingId ? 'Edit' : 'Tambah'} {activeTab === 'articles' ? 'Artikel' : activeTab === 'apps' ? 'Aplikasi' : activeTab === 'gallery' ? 'Media' : activeTab === 'contacts' ? 'Kontak' : 'Download'}</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                {activeTab === 'articles' && (
                  <>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-6 -mt-4">Lengkapi detail artikel yang ingin diterbitkan</p>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Judul Artikel</label>
                        <input required type="text" value={articleForm.title} onChange={(e) => setArticleForm({...articleForm, title: e.target.value})} placeholder="Masukkan judul menarik..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all font-medium" />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Kategori</label>
                          <select value={articleForm.category} onChange={(e) => setArticleForm({...articleForm, category: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all font-medium">
                            <option value="Pendidikan">Pendidikan</option>
                            <option value="Berita">Berita</option>
                            <option value="Panduan">Panduan</option>
                            <option value="Kreativitas">Kreativitas</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Status</label>
                          <select value={articleForm.status} onChange={(e) => setArticleForm({...articleForm, status: e.target.value as 'Draft' | 'Published'})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all font-medium">
                            <option value="Published">Published</option>
                            <option value="Draft">Draft</option>
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Konten Artikel</label>
                        <textarea required rows={8} value={articleForm.content} onChange={(e) => setArticleForm({...articleForm, content: e.target.value})} placeholder="Tuliskan isi artikel Anda di sini..." className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all resize-none font-medium leading-relaxed" />
                      </div>
                    </div>
                  </>
                )}
                {activeTab === 'apps' && (
                  <>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Nama Aplikasi</label>
                      <input required type="text" value={appForm.name} onChange={(e) => setAppForm({...appForm, name: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">URL</label>
                      <input required type="url" value={appForm.url} onChange={(e) => setAppForm({...appForm, url: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all" />
                    </div>
                  </>
                )}
                {activeTab === 'gallery' && (
                  <>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Judul Media</label>
                      <input required type="text" value={galleryForm.title} onChange={(e) => setGalleryForm({...galleryForm, title: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all" />
                    </div>
                    <div className="flex gap-4 p-1 bg-slate-100 rounded-xl">
                      <button 
                        type="button" 
                        onClick={() => setGalleryForm({...galleryForm, mediaType: 'image'})}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${galleryForm.mediaType === 'image' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                      >
                        Gambar (URL)
                      </button>
                      <button 
                        type="button" 
                        onClick={() => setGalleryForm({...galleryForm, mediaType: 'video'})}
                        className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${galleryForm.mediaType === 'video' ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-400'}`}
                      >
                        Video (ID)
                      </button>
                    </div>
                    {galleryForm.mediaType === 'image' ? (
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">URL Gambar</label>
                        <input required type="url" placeholder="https://..." value={galleryForm.imageUrl} onChange={(e) => setGalleryForm({...galleryForm, imageUrl: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all" />
                      </div>
                    ) : (
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">YouTube Video ID</label>
                        <input required type="text" placeholder="Contoh: H3v_A94f1r8" value={galleryForm.videoUrl} onChange={(e) => setGalleryForm({...galleryForm, videoUrl: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all" />
                        <p className="text-[9px] text-slate-400 mt-1 uppercase font-bold tracking-widest">Masukkan ID video setelah v= di URL YouTube</p>
                      </div>
                    )}
                  </>
                )}
                {activeTab === 'contacts' && (
                  <>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Platform (Contoh: WhatsApp, Email)</label>
                      <input required type="text" value={contactForm.platform} onChange={(e) => setContactForm({...contactForm, platform: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Value (Nomor/Link/Email)</label>
                      <input required type="text" value={contactForm.value} onChange={(e) => setContactForm({...contactForm, value: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all" />
                    </div>
                  </>
                )}
                {activeTab === 'downloads' && (
                  <>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Judul File</label>
                      <input required type="text" value={downloadForm.title} onChange={(e) => setDownloadForm({...downloadForm, title: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all" />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">URL/Link Download</label>
                      <input required type="url" value={downloadForm.fileUrl} onChange={(e) => setDownloadForm({...downloadForm, fileUrl: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Ukuran (Contoh: 15MB)</label>
                        <input type="text" value={downloadForm.fileSize} onChange={(e) => setDownloadForm({...downloadForm, fileSize: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Tipe (Contoh: PDF)</label>
                        <input type="text" value={downloadForm.type} onChange={(e) => setDownloadForm({...downloadForm, type: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">Deskripsi Singkat</label>
                      <textarea value={downloadForm.description} onChange={(e) => setDownloadForm({...downloadForm, description: e.target.value})} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 outline-none text-sm transition-all h-20 resize-none" />
                    </div>
                  </>
                )}
                <div className="flex justify-end gap-3 pt-6">
                  <button type="button" onClick={() => setShowModal(false)} className="px-6 py-2.5 text-sm font-bold text-slate-500">Batal</button>
                  <button type="submit" className="px-8 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">Simpan Data</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
