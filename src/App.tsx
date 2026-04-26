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
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    // Handle redirect result automatically if user was redirected
    getRedirectResult(auth).catch((error) => console.error("Redirect login error:", error));

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            setProfile(userDoc.data() as UserProfile);
          } else {
            const isAdminEmail = user.email === 'ayobelajar4y0@gmail.com';
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
          <Loader2 className="w-10 h-10 text-emerald-600" />
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
                element={user ? <Settings /> : <Login onLogin={loginWithGoogle} />} 
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </Layout>
    </AuthContext.Provider>
  );
}
