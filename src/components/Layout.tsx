import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  FileText, 
  AppWindow, 
  Image, 
  LogOut, 
  Menu, 
  X, 
  Search,
  Bell,
  Settings as SettingsIcon,
  Phone,
  Download as DownloadIcon
} from 'lucide-react';
import { useAuth } from '../App';
import { motion } from 'motion/react';
import { useNavigate, useLocation } from 'react-router-dom';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SiteConfig } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
}

export function Layout({ children, onLogout }: LayoutProps) {
  const { user, profile } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);
  const [siteConfig, setSiteConfig] = useState<SiteConfig>({
    adminPhotoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&h=200&auto=format&fit=crop',
    adminName: 'H&F Manager',
    adminStatus: 'Active'
  });
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Listen for real-time updates to site config
    const unsubscribe = onSnapshot(doc(db, 'config', 'site'), (doc) => {
      if (doc.exists()) {
        setSiteConfig(doc.data() as SiteConfig);
      }
    });

    return () => unsubscribe();
  }, []);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/' },
    { id: 'institutions', label: 'Artikel', icon: FileText, path: '/artikel' },
    { id: 'students', label: 'My App', icon: AppWindow, path: '/apps' },
    { id: 'teachers', label: 'Gallery', icon: Image, path: '/gallery' },
    { id: 'contacts', label: 'Kontak', icon: Phone, path: '/kontak' },
    { id: 'downloads', label: 'Download', icon: DownloadIcon, path: '/downloads' },
  ];

  // Only show settings in sidebar if already on admin path
  if (location.pathname === '/admin') {
    navItems.push({ id: 'settings', label: 'Pengaturan Web', icon: SettingsIcon, path: '/admin' });
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      {/* Sidebar Navigation */}
      <motion.aside 
        initial={false}
        animate={{ width: isSidebarOpen ? 260 : 80 }}
        className="bg-emerald-900 flex flex-col shrink-0 sticky top-0 h-screen transition-all duration-300 ease-in-out z-20 shadow-xl"
      >
        <div className="px-6 pb-6 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-emerald-400 rounded-md flex items-center justify-center font-bold text-emerald-900 shrink-0">H</div>
            {isSidebarOpen && (
              <motion.span 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="text-xl font-bold text-white tracking-tight whitespace-nowrap"
              >
                H&F_Creator
              </motion.span>
            )}
          </div>
          
          {isSidebarOpen && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center p-4 bg-emerald-950/40 rounded-2xl border border-emerald-800/50"
            >
              <div className="relative">
                <img 
                  src={siteConfig.adminPhotoUrl} 
                  className="w-16 h-16 rounded-full border-2 border-emerald-500/50 object-cover shadow-lg"
                  alt="Admin"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 border-2 border-emerald-900 rounded-full"></div>
              </div>
              <div className="mt-3 text-center">
                <p className="text-white font-bold text-xs">{siteConfig.adminName}</p>
                <div className="flex items-center gap-1 justify-center mt-1">
                  <div className="w-1 h-1 bg-emerald-400 rounded-full animate-pulse"></div>
                  <p className="text-[10px] text-emerald-400 font-black tracking-widest uppercase">Status: {siteConfig.adminStatus}</p>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1">
          {navItems.map((item) => (
            <button
              key={item.id}
              id={`nav-${item.id}`}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center transition-all duration-200 px-4 py-3 rounded-lg flex items-center gap-3 cursor-pointer ${
                location.pathname === item.path 
                  ? 'bg-emerald-800 text-white shadow-inner shadow-emerald-950/50' 
                  : 'text-emerald-100/60 hover:bg-emerald-800/50 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {isSidebarOpen && <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-emerald-800">
          {user && (
            <>
              <div className={`bg-emerald-950 p-4 rounded-lg flex items-center gap-3 overflow-hidden ${!isSidebarOpen && 'justify-center p-2'}`}>
                <div className="w-10 h-10 bg-slate-400 rounded-lg shrink-0 flex items-center justify-center text-white font-bold">
                  {profile?.displayName?.charAt(0) || user.email?.charAt(0) || 'U'}
                </div>
                {isSidebarOpen && (
                  <div className="overflow-hidden">
                    <p className="text-xs font-semibold text-white truncate">{profile?.displayName || user.email}</p>
                    <p className="text-[10px] text-emerald-400 truncate uppercase tracking-wider">{profile?.role || 'User'}</p>
                  </div>
                )}
              </div>
              <button
                onClick={onLogout}
                className="w-full mt-4 flex items-center gap-3 px-4 py-3 rounded-lg text-emerald-100/60 hover:bg-red-900/40 hover:text-red-200 transition-all duration-200"
              >
                <LogOut className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span className="text-sm font-medium">Keluar</span>}
              </button>
            </>
          )}
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0 sticky top-0 z-10 shadow-sm">
          <div className="flex items-center gap-6">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-bold text-slate-700 hidden lg:block">Media & Application Portal</h1>
            <div className="relative hidden md:block">
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-emerald-500"
              />
              <Search className="absolute left-4 top-2.5 text-slate-400 w-4 h-4" />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-400 hover:text-emerald-600 transition-colors">
              <Bell className="w-5 h-5" />
            </button>
          </div>
        </header>

        <main className="flex-1 relative overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
