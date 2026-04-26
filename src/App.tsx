import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, getRedirectResult } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, loginWithGoogle, logout } from './lib/firebase';
import { UserProfile } from './types';
import { Layout } from './components/Layout';
import { Dashboard } from './views/Dashboard';
import { Institutions } from './views/Institutions';
import { Students } from './views/Students';
import { Teachers } from './views/Teachers';
import { Settings } from './views/Settings';
import { Login } from './views/Login';
import { Profile } from './views/Profile';
import { Downloads } from './views/Downloads';
import { motion, AnimatePresence } from 'motion/react';
import { Loader2 } from 'lucide-react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, profile: null, loading: true, isAdmin: false });

export const useAuth = () => useContext(AuthContext);

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [siteConfig, setSiteConfig] = useState<SiteConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Fetch site config for theme colors early
    getDoc(doc(db, 'config', 'site')).then(snap => {
      if (snap.exists()) setSiteConfig(snap.data() as SiteConfig);
    });

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            const isAdminEmail = user.email?.toLowerCase() === 'ayobelajar4y0@gmail.com';
            const newProfile: UserProfile = {
              id: user.uid,
              email: user.email!,
              displayName: user.displayName || '',
              role: isAdminEmail ? 'Admin' : 'Operator',
              createdAt: serverTimestamp(),
            };
            await setDoc(doc(db, 'users', user.uid), newProfile);
            setProfile(newProfile);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-gray-50">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
          <Loader2 className="w-10 h-10" style={{ color: siteConfig?.primaryColor || '#059669' }} />
        </motion.div>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, isAdmin: profile?.role === 'Admin' }}>
      <Layout onLogout={logout}>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="p-6"
          >
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/artikel" element={<Institutions />} />
              <Route path="/apps" element={<Students />} />
              <Route path="/gallery" element={<Teachers />} />
              <Route path="/profil" element={<Profile />} />
              <Route path="/downloads" element={<Downloads />} />
              <Route 
                path="/admin" 
                element={
                  !user ? (
                    <Login onLogin={loginWithGoogle} />
                  ) : (profile?.role === 'Admin' || user.email === 'ayobelajar4y0@gmail.com') ? (
                    <Settings />
                  ) : (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white rounded-3xl border border-slate-200">
                      <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6">
                        <AlertCircle className="w-10 h-10 text-red-500" />
                      </div>
                      <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tighter mb-2">Akses Ditolak</h2>
                      <p className="text-slate-500 text-sm max-w-sm mb-8 font-medium">Maaf, halaman ini hanya dapat diakses oleh Administrator utama. Silakan hubungi pengelola sistem jika ada kendala.</p>
                      <div className="flex gap-4">
                        <button onClick={() => navigate('/')} className="bg-slate-100 text-slate-600 px-8 py-3 rounded-xl font-bold hover:bg-slate-200 transition-all">Kembali</button>
                        <button onClick={logout} className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-red-700 transition-all">Keluar & Ganti Akun</button>
                      </div>
                    </div>
                  )
                } 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Layout>
    </AuthContext.Provider>
  );
}
