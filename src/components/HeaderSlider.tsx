import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Slider } from '../types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function HeaderSlider() {
  const [sliders, setSliders] = useState<Slider[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSliders() {
      const q = query(
        collection(db, 'sliders'),
        where('active', '==', true),
        orderBy('order', 'asc')
      );
      const snap = await getDocs(q);
      setSliders(snap.docs.map(doc => ({ id: doc.id, ...doc.data() } as Slider)));
      setLoading(false);
    }
    fetchSliders();
  }, []);

  useEffect(() => {
    if (sliders.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % sliders.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [sliders]);

  if (loading || sliders.length === 0) return null;

  const next = () => setCurrentIndex((prev) => (prev + 1) % sliders.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + sliders.length) % sliders.length);

  return (
    <div className="relative w-full h-[300px] md:h-[400px] rounded-3xl overflow-hidden shadow-2xl bg-slate-900 group">
      <AnimatePresence mode="wait">
        <motion.div
          key={sliders[currentIndex].id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <img 
            src={sliders[currentIndex].imageUrl} 
            alt={sliders[currentIndex].title}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&q=80&w=1200';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent flex flex-col justify-end p-8 md:p-12">
            {sliders[currentIndex].title && (
              <motion.h2 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-white text-3xl md:text-5xl font-black mb-2 tracking-tighter uppercase"
              >
                {sliders[currentIndex].title}
              </motion.h2>
            )}
            {sliders[currentIndex].subtitle && (
              <motion.p 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-emerald-400 text-sm md:text-lg font-bold uppercase tracking-[0.2em] mb-6"
              >
                {sliders[currentIndex].subtitle}
              </motion.p>
            )}
            {sliders[currentIndex].link && (
              <motion.a
                href={sliders[currentIndex].link}
                target="_blank"
                rel="noreferrer"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="w-fit px-8 py-3 bg-white text-slate-900 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-emerald-400 hover:text-emerald-950 transition-all shadow-lg shadow-white/10"
              >
                Selengkapnya
              </motion.a>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {sliders.length > 1 && (
        <>
          <button 
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button 
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 backdrop-blur-md text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {sliders.map((_, i) => (
              <button 
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? 'w-8 bg-white' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
