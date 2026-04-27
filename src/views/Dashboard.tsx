import React, { useEffect, useState } from 'react';
import { 
  Users, 
  School, 
  UserSquare2, 
  TrendingUp, 
  ArrowUpRight, 
  ArrowDownRight,
  ClipboardList,
  Calendar,
  Zap
} from 'lucide-react';
import { collection, getDocs, query, where, count } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { motion } from 'motion/react';
import { HeaderSlider } from '../components/HeaderSlider';

export function Dashboard() {
  const [stats, setStats] = useState({
    institutions: 0,
    students: 0,
    teachers: 0,
    activeStudents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const artSnap = await getDocs(collection(db, 'articles'));
        const appSnap = await getDocs(collection(db, 'my_apps'));
        const galSnap = await getDocs(collection(db, 'gallery'));
        
        setStats({
          institutions: artSnap.size,
          students: appSnap.size,
          teachers: galSnap.size,
          activeStudents: artSnap.docs.filter(d => d.data().status === 'Published').length
        });
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, 'dashboard_stats');
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  const cards = [
    { label: 'Artikel', value: stats.institutions, icon: School, color: 'bg-blue-50 text-blue-600', emoji: '📝' },
    { label: 'My App', value: stats.students, icon: Users, color: 'bg-emerald-50 text-emerald-600', emoji: '📱' },
    { label: 'Gallery', value: stats.teachers, icon: UserSquare2, color: 'bg-orange-50 text-orange-600', emoji: '🖼️' },
    { label: 'Published', value: stats.activeStudents, icon: Zap, color: 'bg-purple-50 text-purple-600', emoji: '✅' },
  ];

  return (
    <div className="space-y-8 p-4">
      {/* Header Slider */}
      <HeaderSlider />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4 group hover:border-emerald-500 transition-colors"
          >
            <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center text-xl`}>
              {card.emoji}
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{card.label}</p>
              <h3 className="text-2xl font-black text-slate-800 tracking-tight">
                {loading ? '...' : card.value.toLocaleString()}
              </h3>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <h3 className="font-bold text-slate-700">Audit Kelengkapan Artikel</h3>
            <button className="text-xs text-emerald-600 font-bold hover:underline">Lihat Semua</button>
          </div>
          
          <div className="p-8 h-80 flex items-end justify-between gap-4">
            {[45, 60, 40, 75, 50, 90, 65, 80, 55, 70, 85, 95].map((val, i) => (
              <div key={i} className="flex-1 group relative h-full flex flex-col justify-end">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${val}%` }}
                  transition={{ delay: i * 0.05, duration: 0.8 }}
                  className="bg-slate-100 group-hover:bg-emerald-500 rounded-t-sm transition-all relative"
                />
                <div className="text-[9px] text-slate-400 mt-3 text-center font-bold uppercase tracking-tighter">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'][i]}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Column */}
        <div className="col-span-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col">
          <h3 className="font-bold text-slate-700 mb-8 border-b border-slate-100 pb-4">Kualitas Data (Nasional)</h3>
          <div className="flex-1 space-y-8">
            {[
              { label: 'IDENTITAS ARTIKEL', val: 98, color: 'bg-emerald-500' },
              { label: 'DATA MY APP', val: 84, color: 'bg-blue-500' },
              { label: 'DATA GALLERY', val: 76, color: 'bg-orange-500' },
              { label: 'DATA SARPRAS', val: 42, color: 'bg-slate-300' }
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-[10px] font-black tracking-widest">
                  <span className="text-slate-500 lowercase first-letter:uppercase">{item.label}</span>
                  <span className={`${item.color.replace('bg-', 'text-')}`}>{item.val}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full ${item.color} transition-all duration-1000`} style={{ width: `${item.val}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 p-4 bg-slate-50 rounded-lg border border-slate-100">
            <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-2">Target Integrasi Nasional</p>
            <div className="text-xl font-black text-slate-700 tracking-tighter italic">AGUSTUS 2026</div>
          </div>
        </div>
      </div>
    </div>
  );
}
