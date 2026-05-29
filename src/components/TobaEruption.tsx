import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Flame, 
  ArrowLeft, 
  Zap, 
  AlertTriangle, 
  RefreshCcw, 
  Award,
  BookOpen,
  Waves,
  Sparkles,
  Activity,
  LayoutGrid,
  Heart,
  Lightbulb,
  Gamepad2,
  ShieldAlert,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Volume2,
  Check,
  Play,
  Pause,
  VolumeX,
  MapPin,
  Map,
  Eye,
  Compass
} from 'lucide-react';

interface TobaEruptionProps {
  onBack: () => void;
}

type SubPage = 'dashboard' | 'mindful' | 'meaningful' | 'joyful' | 'mitigasi';

export default function TobaEruption({ onBack }: TobaEruptionProps) {
  const [currentPage, setCurrentPage] = useState<SubPage>(() => {
    const saved = localStorage.getItem('toba_current_page');
    return (saved as SubPage) || 'dashboard';
  });

  useEffect(() => {
    localStorage.setItem('toba_current_page', currentPage);
  }, [currentPage]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isVideoMuted, setIsVideoMuted] = useState(true);

  useEffect(() => {
    if (currentPage !== 'mindful' && videoRef.current) {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  }, [currentPage]);

  const [activeTab, setActiveTab] = useState<'etno' | 'science'>('etno');
  const [viscosity, setViscosity] = useState<'basaltic' | 'andesitic' | 'rhyolitic'>('rhyolitic');
  const [pressure, setPressure] = useState<'low' | 'medium' | 'extreme'>('extreme');
  const [silicaVal, setSilicaVal] = useState<number>(72); // Persentase Silika 45% - 75%
  const [pressureVal, setPressureVal] = useState<number>(130); // Tekanan Gas 10 - 150 MPa
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState<string | null>(null);
  const [magmaTemp, setMagmaTemp] = useState(750); // Celcius

  // Sync silicaVal with viscosity categories and live temperature mapping
  useEffect(() => {
    if (silicaVal <= 52) {
      setViscosity('basaltic');
      const ratio = (silicaVal - 45) / (52 - 45);
      setMagmaTemp(Math.round(1200 - ratio * 200)); // 1200°C to 1000°C
    } else if (silicaVal <= 65) {
      setViscosity('andesitic');
      const ratio = (silicaVal - 52) / (65 - 52);
      setMagmaTemp(Math.round(1000 - ratio * 200)); // 1000°C to 800°C
    } else {
      setViscosity('rhyolitic');
      const ratio = (silicaVal - 65) / (75 - 65);
      setMagmaTemp(Math.round(800 - ratio * 150)); // 800°C to 650°C
    }
    setSimResult(null);
  }, [silicaVal]);

  // Sync pressureVal with pressure categories
  useEffect(() => {
    if (pressureVal < 50) {
      setPressure('low');
    } else if (pressureVal < 110) {
      setPressure('medium');
    } else {
      setPressure('extreme');
    }
    setSimResult(null);
  }, [pressureVal]);

  // Meaningful state variables for Page A (Map) & Page B (Animation)
  const [meaningfulPage, setMeaningfulPage] = useState<'A' | 'B'>('A');
  const [selectedMarker, setSelectedMarker] = useState<string>('animal');
  const [animationStep, setAnimationStep] = useState<number>(1);
  const [isPlayingAnimation, setIsPlayingAnimation] = useState<boolean>(false);

  useEffect(() => {
    let interval: any;
    if (isPlayingAnimation && currentPage === 'meaningful' && meaningfulPage === 'B') {
      interval = setInterval(() => {
        setAnimationStep((prev) => (prev % 4) + 1);
      }, 4500);
    }
    return () => clearInterval(interval);
  }, [isPlayingAnimation, currentPage, meaningfulPage]);

  // --- New Mitigasi Hujan Abu & Pilihan Alat Pelindung states ---
  const [selectedEquipments, setSelectedEquipments] = useState<string[]>(() => {
    const saved = localStorage.getItem('toba_selected_equipments');
    return saved ? JSON.parse(saved) : [];
  });
  const [activeEvacTab, setActiveEvacTab] = useState<'sinabung' | 'sibayak'>('sinabung');
  const [isSubmitted, setIsSubmitted] = useState<boolean>(() => {
    return localStorage.getItem('toba_mitigation_submitted') === 'true';
  });
  const [hasEarnedBadge, setHasEarnedBadge] = useState<boolean>(() => {
    return localStorage.getItem('toba_mitigation_earned_badge') === 'true';
  });
  const [mitigasiTab, setMitigasiTab] = useState<'challenge' | 'evac'>('challenge');

  useEffect(() => {
    localStorage.setItem('toba_selected_equipments', JSON.stringify(selectedEquipments));
    localStorage.setItem('toba_mitigation_submitted', isSubmitted.toString());
    localStorage.setItem('toba_mitigation_earned_badge', hasEarnedBadge.toString());
  }, [selectedEquipments, isSubmitted, hasEarnedBadge]);

  // Audio References
  const audioRefs = useRef({
    earthquake: new Audio('https://assets.mixkit.co/active_storage/sfx/2567/2567-preview.mp3'),
    success: new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3'),
    failure: new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'),
    knock: new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3')
  });

  useEffect(() => {
    audioRefs.current.earthquake.volume = 0.4;
    audioRefs.current.success.volume = 0.4;
    audioRefs.current.failure.volume = 0.4;
    audioRefs.current.knock.volume = 0.3;
  }, []);

  const playSound = (type: 'earthquake' | 'success' | 'failure' | 'knock') => {
    try {
      const audio = audioRefs.current[type];
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch (e) {
      console.warn("Audio play failed", e);
    }
  };

  const handleSimulate = () => {
    setIsSimulating(true);
    setSimResult(null);
    playSound('earthquake');

    setTimeout(() => {
      setIsSimulating(false);
      audioRefs.current.earthquake.pause();

      let res = "";
      if (viscosity === 'rhyolitic' && pressure === 'extreme') {
        res = "super-eruption";
        playSound('success');
      } else if (viscosity === 'basaltic' && pressure === 'low') {
        res = "gentle-effusive";
        playSound('knock');
      } else if (pressure === 'extreme' || (viscosity === 'rhyolitic' && pressure === 'medium')) {
        res = "explosive-plinian";
        playSound('failure');
      } else {
        res = "moderate-strombolian";
        playSound('knock');
      }
      setSimResult(res);
    }, 2800);
  };

  const getMagmaSpecs = () => {
    switch(viscosity) {
      case 'basaltic':
        return { silica: '45-52% (Rendah)', flow: 'Sangat Cair / Lancar', temp: '1000 - 1200 °C', rock: 'Basalt / Scoria' };
      case 'andesitic':
        return { silica: '53-63% (Sedang)', flow: 'Kental Sedang / Lambat', temp: '800 - 1000 °C', rock: 'Andesit' };
      case 'rhyolitic':
        return { silica: '>68% (Sangat Tinggi)', flow: 'Sangat Pekat / Macet', temp: '650 - 800 °C', rock: 'Riolit / Batu Apung (Tuff Toba)' };
    }
  };

  const specs = getMagmaSpecs();

  const handleEquipmentToggle = (id: string) => {
    if (isSubmitted) return; // Cannot toggle after submitting unless reset
    playSound('knock');
    const alreadyHas = selectedEquipments.includes(id);
    if (alreadyHas) {
      setSelectedEquipments(prev => prev.filter(item => item !== id));
    } else {
      setSelectedEquipments(prev => [...prev, id]);
    }
  };

  const handleSubmitMitigation = () => {
    if (selectedEquipments.length === 0) {
      playSound('knock');
      return;
    }
    
    setIsSubmitted(true);
    
    // Correct combo is having 'mask' and 'goggles' but NOT 'hands'
    const isCorrect = selectedEquipments.includes('mask') && 
                      selectedEquipments.includes('goggles') && 
                      !selectedEquipments.includes('hands');
                      
    if (isCorrect) {
      playSound('success');
      setHasEarnedBadge(true);
    } else {
      playSound('failure');
      setHasEarnedBadge(false);
    }
  };

  const handleResetMitigation = () => {
    playSound('knock');
    setSelectedEquipments([]);
    setIsSubmitted(false);
    setHasEarnedBadge(false);
  };

  const navItems = [
    { id: 'dashboard' as const, label: 'Beranda', icon: LayoutGrid },
    { id: 'mindful' as const, label: 'Mindful', icon: Heart },
    { id: 'meaningful' as const, label: 'Meaningful', icon: Lightbulb },
    { id: 'joyful' as const, label: 'Joyful', icon: Gamepad2 },
    { id: 'mitigasi' as const, label: 'Mitigasi', icon: ShieldAlert },
  ];

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-cream-bg overflow-hidden relative">
      <AnimatePresence mode="wait">
        
        {/* --- 1. DASHBOARD --- */}
        {currentPage === 'dashboard' && (
          <motion.div 
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8 pb-20 relative"
          >
            {/* Geometric Tectonic Background shapes */}
            <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute border border-orange-500/5 rotate-45 w-48 h-48 rounded-[36px]"
                  style={{ 
                    top: `${Math.random() * 80}%`, 
                    left: `${Math.random() * 80 - 20}%`,
                    animationDelay: `${i * 0.5}s`
                  }} 
                />
              ))}
            </div>

            <header className="relative mt-4 space-y-1">
              <button 
                onClick={onBack}
                className="mb-4 px-3.5 py-2 bg-stone-100 hover:bg-stone-200 border border-stone-200 text-stone-700 text-[10px] font-extrabold rounded-full flex items-center gap-1.5 transition-all self-start w-fit uppercase tracking-tight"
              >
                <ArrowLeft size={12} strokeWidth={2.5} />
                Kembali ke Menu Utama
              </button>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl -z-10" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-orange-600/80">Eksplorasi Volkanologi</p>
              <h1 className="text-4xl font-black text-stone-900 tracking-tighter leading-none italic">
                Amukan <br/>
                <span className="text-orange-600 uppercase">Raksasa Toba</span>
              </h1>
              <div className="flex items-center gap-2 mt-4">
                <div className="h-1 w-12 bg-orange-400 rounded-full" />
                <p className="text-stone-500 text-[11px] font-bold uppercase tracking-widest">Pilih Jalur Belajar Geologi</p>
              </div>
            </header>

            <div className="grid grid-cols-2 gap-4">
              {/* MINDFUL CARD */}
              <motion.button
                whileHover={{ y: -4, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setCurrentPage('mindful')}
                className="group relative flex flex-col items-start p-5 bg-white rounded-[32px] border border-stone-100 text-left overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-200 col-span-2"
              >
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                  <Heart size={100} />
                </div>
                <div className="bg-orange-500 text-white p-2.5 rounded-2xl mb-4 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <Heart size={20} />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-black tracking-widest text-stone-400">74.000 TAHUN LALU</span>
                  <h3 className="font-black text-stone-850 text-xl tracking-tight leading-tight mt-0.5">Mindful: Sejarah & Tragedi</h3>
                  <p className="text-stone-500 font-bold text-[11px] leading-relaxed mt-1 pr-6">Pahami kedahsyatan erupsi purba terbesar di dunia & pembentukan kaldera.</p>
                </div>
              </motion.button>

              {/* MEANINGFUL CARD */}
              <motion.button
                whileHover={{ y: -4, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setCurrentPage('meaningful')}
                className="group relative flex flex-col items-start p-5 bg-white rounded-[32px] border border-stone-100 text-left overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-200 col-span-1"
              >
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                  <Lightbulb size={60} />
                </div>
                <div className="bg-orange-400 text-white p-2.5 rounded-2xl mb-4 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <Lightbulb size={20} />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-black tracking-widest text-stone-400">SAINS TEKTONIK</span>
                  <h3 className="font-black text-stone-850 text-base tracking-tight leading-tight mt-0.5">Meaningful</h3>
                  <p className="text-stone-500 font-bold text-[9px] mt-0.5 line-clamp-2">Sains dapur magma, subduksi & Gas Ideal.</p>
                </div>
              </motion.button>

              {/* JOYFUL CARD */}
              <motion.button
                whileHover={{ y: -4, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setCurrentPage('joyful')}
                className="group relative flex flex-col items-start p-5 bg-white rounded-[32px] border border-stone-100 text-left overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-200 col-span-1"
              >
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                  <Gamepad2 size={60} />
                </div>
                <div className="bg-stone-800 text-white p-2.5 rounded-2xl mb-4 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <Gamepad2 size={20} />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-black tracking-widest text-stone-400">SIMULATOR ERUPSI</span>
                  <h3 className="font-black text-stone-850 text-base tracking-tight leading-tight mt-0.5">Joyful</h3>
                  <p className="text-stone-500 font-bold text-[9px] mt-0.5 line-clamp-2">Lab interaktif menguji tekanan gas dapur magma.</p>
                </div>
              </motion.button>

              {/* MITIGASI CARD */}
              <motion.button
                whileHover={{ y: -4, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setCurrentPage('mitigasi')}
                className="group relative flex flex-col items-start p-5 bg-white rounded-[32px] border border-stone-100 text-left overflow-hidden shadow-sm hover:shadow-xl hover:border-orange-200 col-span-2"
              >
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                  <ShieldAlert size={100} />
                </div>
                <div className="bg-red-600 text-white p-2.5 rounded-2xl mb-4 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-black tracking-widest text-stone-400">SIAGA BENCANA VOLKANIK</span>
                  <h3 className="font-black text-stone-850 text-xl tracking-tight leading-tight mt-0.5">Mitigasi: Lindungi Warga</h3>
                  <p className="text-stone-500 font-bold text-[11px] leading-relaxed mt-1 pr-6">Pilahan skenario cerdas evakuasi aman awan panas & tsunami danau.</p>
                </div>
              </motion.button>
            </div>

            <div className="bg-stone-900 p-6 rounded-[32px] shadow-2xl relative overflow-hidden group mt-4">
              <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/10 rounded-full blur-2xl -mr-12 -mt-12" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-500 shrink-0">
                  <Flame size={24} />
                </div>
                <div className="space-y-1 text-left">
                  <p className="text-white font-black text-xs tracking-tight italic">"Sains membongkar misteri masa lalu demi menjamin keselamatan masa depan."</p>
                  <p className="text-stone-400 text-[8px] font-bold uppercase tracking-widest">- Geologi Sumatra Indah</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- 2. MINDFUL --- */}
        {currentPage === 'mindful' && (
          <motion.div 
            key="mindful"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 pb-20 text-left"
          >
            <header className="space-y-2">
              <div className="flex border-b-2 border-dashed border-stone-200 pb-2 mb-4">
                <span className="text-orange-600 font-black text-[10px] uppercase tracking-[0.2em] italic">Sejarah & Tragedi</span>
              </div>
              <h1 className="text-3xl font-black text-stone-900 tracking-tighter leading-none uppercase italic">Hari Dimana<br />Bumi Hampir Mati</h1>
            </header>

            {/* Interactive Video Player for Terbentuknya Toba */}
            <div className="relative aspect-video bg-stone-950 rounded-[32px] overflow-hidden shadow-2xl border-4 border-white">
              <video
                ref={videoRef}
                src="/ikantoba.mp4"
                className="absolute inset-0 w-full h-full object-cover z-0"
                playsInline
                loop
                muted
                controls
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
              />
            </div>

            <div className="space-y-4 text-stone-800 leading-relaxed text-sm font-medium">
              <p>
                Legenda bercerita tentang janji yang dilanggar, tentang air mata seorang ibu yang berubah menjadi banjir besar hingga menenggelamkan seluruh daratan dan melahirkan sebuah danau raksasa. Kisah itu diwariskan turun-temurun sebagai asal mula Danau Toba, penuh pesan tentang kejujuran dan janji yang harus dijaga.
              </p>
              <div className="bg-orange-500/5 p-5 rounded-[24px] border-2 border-orange-500/10 border-dashed">
                <p className="italic font-black text-orange-600 uppercase tracking-tight text-xs">
                  "Namun jauh di balik legenda yang hidup di tengah masyarakat, jejak sains menyimpan cerita lain yang tak kalah menakjubkan. Sekitar 74 ribu tahun lalu, terjadi salah satu letusan gunung api terbesar dalam sejarah bumi — ledakan dahsyat yang mengguncang langit, memuntahkan abu vulkanik hingga menyebar ke berbagai belahan dunia, bahkan mengubah iklim global selama bertahun-tahun."
                </p>
              </div>
              <p>
                Dari pertemuan antara mitos dan sains, lahirlah sebuah tempat yang bukan hanya indah, tetapi juga menyimpan rahasia masa lalu bumi. Selamat datang di jantung Supervolcano Toba, tempat di mana legenda, sejarah, dan kekuatan alam menyatu dalam satu kisah yang luar biasa.
              </p>
            </div>

            <button 
              onClick={() => setCurrentPage('meaningful')}
              className="w-full bg-orange-600 text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-transform uppercase tracking-widest text-xs border-b-4 border-orange-950"
            >
              Selidiki Rahasianya
              <ChevronRight size={18} />
            </button>
          </motion.div>
        )}

        {/* --- 3. MEANINGFUL --- */}
        {currentPage === 'meaningful' && (
          <motion.div 
            key="meaningful"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto no-scrollbar pb-20"
          >
            <header className="pt-4 pb-3 text-center relative border-b border-stone-200/50">
              <h2 className="text-xl font-black text-stone-900 tracking-tighter uppercase italic">
                Sains Geologi Toba<br/>
                <span className="text-xs font-bold block text-orange-600 tracking-widest">(Sirkuit Vulkanologi)</span>
              </h2>
            </header>

            <div className="relative flex flex-col items-center pb-8 px-5 pt-5">
              <div className="w-full max-w-md flex flex-col gap-5">
                
                {/* 2-Column Switcher Page A & Page B */}
                <div className="flex p-1.5 bg-stone-100 rounded-[28px] items-center border border-stone-200/30">
                  <button 
                    onClick={() => {
                        playSound('knock');
                        setMeaningfulPage('A');
                    }}
                    className={`h-[40px] flex-1 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      meaningfulPage === 'A' ? 'bg-white text-orange-600 shadow-sm border border-stone-200/40' : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    <Map size={14} />
                    A: Peta
                  </button>
                  <button 
                    onClick={() => {
                        playSound('knock');
                        setMeaningfulPage('B');
                    }}
                    className={`h-[40px] flex-1 rounded-[24px] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      meaningfulPage === 'B' ? 'bg-white text-orange-600 shadow-sm border border-stone-200/40' : 'text-stone-400 hover:text-stone-600'
                    }`}
                  >
                    <Sparkles size={14} className={meaningfulPage === 'B' ? 'animate-spin' : ''} />
                    B: Animasi
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {meaningfulPage === 'A' ? (
                    <motion.div
                      key="map-page"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 15 }}
                      className="space-y-4 w-full"
                    >
                      {/* Interactive Tectonic/Nature Map Card */}
                      <div className="w-full p-4 bg-stone-50 rounded-[32px] border border-stone-200 shadow-md space-y-3">
                        <div className="relative aspect-[4/3] bg-stone-100 rounded-2xl border border-stone-150 overflow-hidden shadow-inner">
                          {/* Real uploaded Map background image */}
                          <img 
                            src="/peta%20meaningful.png" 
                            alt="Peta Kaldera Toba" 
                            className="absolute inset-0 w-full h-full object-cover z-0"
                            referrerPolicy="no-referrer"
                          />

                          {/* Overlaying SVG Hotspots */}
                          <svg viewBox="0 0 320 240" className="absolute inset-0 w-full h-full select-none z-10 bg-black/5">
                            
                            {/* SIGN MODE (Cari Tanda Alam) HOTSPOTS */}
                            <g>
                              {/* 1. Aktivitas Hewan - Bukit Barisan */}
                              <g 
                                onClick={() => { playSound('knock'); setSelectedMarker('animal'); }}
                                className="cursor-pointer group/spot"
                                transform="translate(95, 75)"
                              >
                                <circle cx="0" cy="0" r="14" fill="#f59e0b" className={`opacity-30 ${selectedMarker === 'animal' ? 'animate-ping' : ''}`} />
                                <circle cx="0" cy="0" r="8" fill={selectedMarker === 'animal' ? '#d97706' : '#fcd34d'} stroke="white" strokeWidth="1.5" className="transition-colors duration-300" />
                                <text x="-3.5" y="2.5" fill="white" className="text-[8px] font-black">🐾</text>
                              </g>

                              {/* 2. Suhu Air - Aek Rangat (Samosir Western Shore) */}
                              <g 
                                onClick={() => { playSound('knock'); setSelectedMarker('watertemp'); }}
                                className="cursor-pointer group/spot"
                                transform="translate(148, 112)"
                              >
                                <circle cx="0" cy="0" r="14" fill="#3b82f6" className={`opacity-30 ${selectedMarker === 'watertemp' ? 'animate-ping' : ''}`} />
                                <circle cx="0" cy="0" r="8" fill={selectedMarker === 'watertemp' ? '#2563eb' : '#93c5fd'} stroke="white" strokeWidth="1.5" className="transition-colors duration-300" />
                                <text x="-3.5" y="2.5" fill="white" className="text-[8px] font-black">♨️</text>
                              </g>

                              {/* 3. Mitos Gempa - Naga Padoha (Deep fault/lake basin) */}
                              <g 
                                onClick={() => { playSound('knock'); setSelectedMarker('nagapadoha'); }}
                                className="cursor-pointer group/spot"
                                transform="translate(205, 135)"
                              >
                                <circle cx="0" cy="0" r="16" fill="#ec4899" className={`opacity-30 ${selectedMarker === 'nagapadoha' ? 'animate-ping' : ''}`} />
                                <circle cx="0" cy="0" r="8" fill={selectedMarker === 'nagapadoha' ? '#db2777' : '#fbcfe8'} stroke="white" strokeWidth="1.5" className="transition-colors duration-300" />
                                <text x="-3.5" y="2.5" fill="white" className="text-[8px] font-black">🐉</text>
                              </g>
                            </g>

                          </svg>

                          {/* Float Legend Indicator Overlay */}
                          <div className="absolute bottom-2 left-2 bg-stone-900/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 text-[7px] font-bold font-mono tracking-wider text-stone-300 space-y-0.5 shadow-md">
                            <span className={selectedMarker === 'animal' ? 'text-amber-400 font-black' : 'text-amber-400/70'}>🐾 1. AKTIVITAS HEWAN</span>
                            <span className={selectedMarker === 'watertemp' ? 'text-blue-400 font-black' : 'text-blue-400/70'}>♨️ 2. SUHU AIR (AEK RANGAT)</span>
                            <span className={selectedMarker === 'nagapadoha' ? 'text-pink-400 font-black' : 'text-pink-400/70'}>🐉 3. MITOS NAGA PADOHA</span>
                          </div>
                        </div>

                        <div className="text-center">
                          <span className="text-[9px] font-mono font-bold text-stone-500 uppercase tracking-widest flex items-center justify-center gap-1">
                            <Compass size={11} /> 
                            KETUK IKON DI SEKITAR KALDERA UNTUK CARI TANDA ALAM
                          </span>
                        </div>
                      </div>

                      {/* Map Geological & Kearifan Lokal Details card */}
                      <div className="bg-white rounded-[32px] shadow-md border border-stone-200/60 p-6 text-left space-y-4">
                        {/* SIGN MODE (Cari Tanda Alam) DESCRIPTIONS */}
                        {selectedMarker === 'animal' && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-3"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded-full bg-amber-100 border border-amber-300 text-[12px] flex items-center justify-center">🐾</span>
                              <h3 className="text-sm font-black text-stone-900 tracking-tight">Aktivitas Hewan (Pegunungan Bukit Barisan)</h3>
                            </div>
                            <p className="text-stone-700 text-[11.5px] font-semibold leading-relaxed">
                              Mengapa masyarakat dulu percaya jika hewan turun dari pegunungan Bukit Barisan, itu adalah peringatan?
                            </p>
                            <p className="text-stone-605 text-[11px] font-medium leading-relaxed bg-amber-500/5 p-3.5 rounded-2xl border border-amber-500/20">
                              Hal ini berkaitan dengan sensor alami hewan. <strong className="text-amber-700">Sensor panas & getaran mikro</strong> instingtif pada cakar dan cangkang hewan sangat sensitif terhadap getaran seismik infrasonic terkecil dan naiknya temperatur lapisan tanah akibat akumulasi gas magmatik di kedalaman bumi yang tidak mampu dirasakan manusia. Ketika mendeteksi perubahan anomali alamiah yang ekstrem ini, kawanan satwa liar terdorong bermigrasi secara masif menuruni pegunungan demi menyelamatkan diri.
                            </p>
                          </motion.div>
                        )}

                        {selectedMarker === 'watertemp' && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-3"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded-full bg-blue-100 border border-blue-300 text-[12px] flex items-center justify-center font-extrabold">♨️</span>
                              <h3 className="text-sm font-black text-stone-900 tracking-tight">Suhu Air & Panas Bumi (Aek Rangat)</h3>
                            </div>
                            <p className="text-stone-700 text-[11.5px] font-semibold leading-relaxed">
                              Munculnya sumber air panas (<strong className="text-blue-600">Aek Rangat</strong>) sebagai indikasi energi panas bumi yang masih aktif.
                            </p>
                            <p className="text-stone-605 text-[11px] font-medium leading-relaxed bg-blue-500/5 p-3.5 rounded-2xl border border-blue-500/20">
                              Mata air Aek Rangat di kaki Gunung Pusuk Buhit membuktikan bahwa di bawah Kaldera Toba terdapat sistem kantung <strong className="text-blue-700">geothermal (panas bumi)aktif</strong>. Siklus air tanah yang merembes masuk ke dalam bumi dipanaskan oleh sisa-sisa batuan cair dapur magma purba yang suhunya masih membara, membuahkan uap gas belerang alami bertekanan termal yang mendobrak dan kembali memancar ke permukaan tanah.
                            </p>
                          </motion.div>
                        )}

                        {selectedMarker === 'nagapadoha' && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="space-y-3"
                          >
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded-full bg-pink-100 border border-pink-300 text-[12px] flex items-center justify-center font-extrabold">🐉</span>
                              <h3 className="text-sm font-black text-stone-900 tracking-tight">Mitos Naga Padoha (Kearifan Gempa)</h3>
                            </div>
                            <p className="text-stone-700 text-[11.5px] font-semibold leading-relaxed">
                              Cerita rakyat tentang naga mistis di bawah tanah merekam memori kebencanaan prasejarah.
                            </p>
                            <p className="text-stone-605 text-[11px] font-medium leading-relaxed bg-pink-500/5 p-3.5 rounded-2xl border border-pink-500/20">
                              Legenda Batak menyebutkan bahwa gempa bumi dahsyat dipicu oleh menggeliatnya <strong className="text-pink-700">Naga Padoha</strong> yang memikul seluruh daratan Sumatra di bawah lapisan terdalam bumi. Secara ilmiah, mitologi puitis ini merupakan cara cerdas nenek moyang merekonsiliasikan, merekam, dan mentransmisikan bahaya gempa bumi tektonik & vulkanik akibat sesar geser Great Sumatran Fault dari generasi ke generasi melalui cerita lisan yang mudah dipahami demi keselamatan kolektif.
                            </p>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="animation-page"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      className="space-y-4 w-full"
                    >
                      {/* Video Player Box - Terbentuknya Toba */}
                      <div className="w-full p-4 bg-stone-900 rounded-[32px] border-2 border-white shadow-xl space-y-3 relative overflow-hidden">
                        <div className="relative aspect-video bg-stone-950 rounded-2xl border border-stone-800 overflow-hidden flex items-center justify-center">
                          <video
                            src="/terbentuktoba.mp4"
                            className="absolute inset-0 w-full h-full object-cover z-0"
                            playsInline
                            loop
                            controls
                            autoPlay
                            muted
                          />
                        </div>

                        {/* Video Title text */}
                        <div className="text-center font-black uppercase text-xs tracking-wider text-orange-500 py-1.5 border-t border-b border-stone-800">
                          Animasi Rekonstruksi Pembentukan Kaldera Toba
                        </div>
                      </div>

                      {/* Educational Explanation Column */}
                      <div className="bg-white rounded-[32px] shadow-md border border-stone-200/60 p-6 text-left space-y-5">
                        
                        {/* Section 1: Dapur Magma */}
                        <div className="space-y-1.5">
                          <h3 className="text-sm font-black text-stone-900 tracking-tight uppercase flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-red-600 block"></span>
                            Dapur Magma
                          </h3>
                          <p className="text-stone-750 text-[11.5px] font-semibold leading-relaxed">
                            Di bawah Danau Toba terdapat dapur magma, yaitu tempat berkumpulnya batuan cair panas di dalam bumi. Magma terus menumpuk dan menghasilkan tekanan besar hingga akhirnya memicu letusan super dahsyat.
                          </p>
                        </div>

                        <div className="h-px bg-stone-100" />

                        {/* Section 2: Tekanan Gas */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black text-stone-900 tracking-tight uppercase flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-full bg-orange-500 block text-orange-500"></span>
                              Tekanan Gas
                            </h3>
                            <div className="flex gap-1.5">
                              <span className="font-mono text-[9px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100/70">P = n·R·T / V</span>
                              <span className="font-mono text-[9px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-lg border border-orange-100/70">P = F / A</span>
                            </div>
                          </div>
                          <p className="text-stone-750 text-[11.5px] font-semibold leading-relaxed">
                            Magma Toba mengandung gas terlarut dalam jumlah masif. Berdasarkan rumus hukum gas ideal <strong className="text-orange-600">P = n·R·T / V</strong>, ketika temperatur magma (<strong className="text-stone-850">T</strong>) terus meroket di ruang dapur magma bervolume tetap (<strong className="text-stone-850">V</strong>), maka tekanan gas (<strong className="text-stone-850">P</strong>) akan berlipat ganda melampaui batas batas kritis batuan bumi.
                          </p>
                          <p className="text-stone-600 text-[11px] font-medium leading-relaxed bg-orange-50/30 p-3 rounded-2xl border border-orange-100/50">
                            Merujuk pada hukum tekanan fisika dasar <strong className="text-orange-600">P = F / A</strong>, akumulasi tekanan gas (<strong className="text-stone-850">P</strong>) menyuplai akumulasi gaya dorong (<strong className="text-stone-850">F</strong>) yang luar biasa besar terhadap luas area permukaan (<strong className="text-stone-850">A</strong>) penutup berupa badan gunung api di atasnya. Proses ini bagaikan botol soda yang dikocok kuat—ketika kekuatan dinding gunung tidak lagi mampu menahan gaya dorong gas raksasa ini, katup pengaman alami jebol dan terjadilah ledakan supervolcano Toba yang meletus secara dahsyat.
                          </p>
                        </div>

                        <div className="h-px bg-stone-100" />

                        {/* Section 3: Resurgent Dome */}
                        <div className="space-y-1.5">
                          <h3 className="text-sm font-black text-stone-900 tracking-tight uppercase flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 block"></span>
                            Resurgent Dome
                          </h3>
                          <p className="text-stone-750 text-[11.5px] font-semibold leading-relaxed">
                            Setelah letusan besar terjadi, magma baru dari bawah bumi mendorong bagian tengah kaldera naik ke permukaan. Proses ini membentuk Pulau Samosir di tengah Danau Toba.
                          </p>
                        </div>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Back to main road button or Play Simulator redirection */}
                <button 
                  onClick={() => setCurrentPage('joyful')}
                  className="w-full bg-stone-900 hover:bg-stone-850 text-white font-black py-4 rounded-[24px] flex items-center justify-center gap-3 shadow-md active:scale-95 transition-transform uppercase tracking-widest text-xs"
                >
                  Buka Simulator Erupsi
                  <Activity size={14} className="text-orange-500 animate-pulse" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- 4. JOYFUL (SIMULATION) --- */}
        {currentPage === 'joyful' && (
          <motion.div 
            key="joyful"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className={`flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 pb-20 flex flex-col items-center ${isSimulating ? 'animate-earthquake' : ''}`}
          >
            <div className="text-center space-y-1 w-full">
              <span className="px-3 py-1 bg-red-100 text-red-700 text-[9px] font-black rounded-full uppercase tracking-widest">Lab Fisika Gunung Api</span>
              <h2 className="text-3xl font-black text-stone-900 tracking-tighter uppercase italic">Tekanan & Magma</h2>
              <p className="text-[10px] text-stone-500 font-bold max-w-xs mx-auto uppercase tracking-wide leading-tight">Uji Tipe Letusan Toba Purba di sini!</p>
            </div>

            {/* Sliders container */}
            <div className="w-full space-y-6 bg-white p-5 rounded-[28px] border-2 border-stone-100 shadow-md">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-stone-500">
                  <span>1. Viskositas Magma (SiO₂: Kandungan Silika)</span>
                  <span className="text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full font-extrabold font-mono">
                    {silicaVal}% - {viscosity === 'basaltic' ? 'Basalt (Cair)' : viscosity === 'andesitic' ? 'Andesit' : 'Riolit (Kental / Toba)'}
                  </span>
                </div>
                <div className="relative pt-1">
                  <input
                    type="range"
                    min="45"
                    max="75"
                    step="1"
                    disabled={isSimulating}
                    value={silicaVal}
                    onChange={(e) => {
                      setSilicaVal(Number(e.target.value));
                    }}
                    className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-orange-600 border border-stone-200"
                  />
                  <div className="flex justify-between text-[8px] font-black text-stone-400 mt-1 px-1">
                    <span>45% (Cair)</span>
                    <span>60% (Sedang)</span>
                    <span>75% (Kental)</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-stone-500">
                  <span>2. Tekanan Gas Tektonik</span>
                  <span className="text-red-500 bg-red-50 px-2.5 py-0.5 rounded-full font-extrabold font-mono">
                    {pressureVal} MPa - {pressure === 'low' ? 'Rendah' : pressure === 'medium' ? 'Sedang' : 'Ekstrem'}
                  </span>
                </div>
                <div className="relative pt-1">
                  <input
                    type="range"
                    min="10"
                    max="150"
                    step="5"
                    disabled={isSimulating}
                    value={pressureVal}
                    onChange={(e) => {
                      setPressureVal(Number(e.target.value));
                    }}
                    className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-red-500 border border-stone-200"
                  />
                  <div className="flex justify-between text-[8px] font-black text-stone-400 mt-1 px-1">
                    <span>10 MPa (Rendah)</span>
                    <span>80 MPa (Sedang)</span>
                    <span>150 MPa (Ekstrem)</span>
                  </div>
                </div>
              </div>

              {/* Real-time Chemical Data read-outs */}
              <div className="border-t border-stone-100 pt-3 flex flex-col gap-1 text-[10px] text-stone-500 font-bold text-left">
                <div className="flex justify-between">
                  <span>Persentase Kandungan Silika (SiO₂):</span>
                  <span className="text-stone-850 font-black">{specs.silica}</span>
                </div>
                <div className="flex justify-between">
                  <span>Konsistensi Sifat Aliran:</span>
                  <span className="text-stone-850 font-black">{specs.flow}</span>
                </div>
                <div className="flex justify-between">
                  <span>Suhu Estimasi Magma:</span>
                  <span className="text-stone-850 font-black">{magmaTemp} °C</span>
                </div>
                <div className="flex justify-between">
                  <span>Batuan Hasil Pembekuan:</span>
                  <span className="text-stone-850 font-black italic">{specs.rock}</span>
                </div>
              </div>
            </div>

            {/* Simulated Stage Visual element */}
            <div className="relative w-full aspect-[4/3] bg-stone-900 rounded-[36px] overflow-hidden shadow-2xl border-2 border-white flex flex-col justify-end">
              <style>{`
                @keyframes smokePuff {
                  0% {
                    transform: translate(-50%, -50%) scale(0.3) translateY(0);
                    opacity: 0;
                  }
                  15% {
                    opacity: var(--puff-max-op, 0.6);
                  }
                  100% {
                    transform: translate(calc(-50% + var(--puff-drift-x, 15px)), -50%) scale(var(--puff-end-scale, 2.5)) translateY(var(--puff-rise-y, -100px));
                    opacity: 0;
                  }
                }
                @keyframes fireEmber {
                  0% {
                    transform: translate(-50%, -50%) scale(0.5) translateY(0);
                    opacity: 1;
                  }
                  100% {
                    transform: translate(calc(-50% + var(--ember-x, 30px)), -50%) scale(0.1) translateY(var(--ember-y, -140px));
                    opacity: 0;
                  }
                }
                @keyframes volcanicLightning {
                  0%, 90%, 94%, 98%, 100% { opacity: 0; }
                  92%, 96% { opacity: 0.8; }
                }
                @keyframes lavaFlow {
                  0%, 100% { opacity: 0.6; filter: brightness(1.0); }
                  50% { opacity: 0.9; filter: brightness(1.3); }
                }
              `}</style>

              {/* 1. Base Mountain Background with live vibration scale */}
              {simResult !== 'super-eruption' && (
                <img 
                  src="/gunungtoba.png" 
                  alt="Gunung Toba Purba" 
                  className={`absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-100 ${
                    isSimulating 
                      ? 'animate-earthquake scale-105' 
                      : ''
                  }`}
                  style={!isSimulating ? {
                    transform: `translate(${(Math.sin(Date.now() / 40) * (pressureVal > 110 ? 1.0 : pressureVal > 60 ? 0.4 : 0))}px, ${(Math.cos(Date.now() / 40) * (pressureVal > 110 ? 1.0 : pressureVal > 60 ? 0.4 : 0))}px) scale(${1 + (pressureVal / 1500)})`
                  } : undefined}
                  referrerPolicy="no-referrer"
                />
              )}

              {/* 2. Magma core glow inside the crater (y: 41%, x: 50%) */}
              {simResult !== 'super-eruption' && !isSimulating && (
                <div 
                  className="absolute rounded-full filter blur-[4px] pointer-events-none z-10 transition-all duration-300"
                  style={{
                    top: '41.5%',
                    left: '50%',
                    width: `${24 + (pressureVal / 6)}px`,
                    height: `${12 + (pressureVal / 11)}px`,
                    transform: 'translate(-50%, -50%)',
                    background: 'radial-gradient(circle, rgba(239,68,68,1) 0%, rgba(249,115,22,0.8) 50%, rgba(239,68,68,0) 100%)',
                    opacity: (pressureVal / 150) * 0.9 + (silicaVal / 75) * 0.1,
                    mixBlendMode: 'screen',
                    animation: `lavaFlow ${2 - (pressureVal / 100)}s infinite ease-in-out`
                  }}
                />
              )}

              {/* 3. Interactive Smoke/Ash Clouds on slider movement */}
              {simResult !== 'super-eruption' && !isSimulating && (
                <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
                  {/* Cloud 1 - Center Main */}
                  <div 
                    className="absolute rounded-full filter blur-[5px]"
                    style={{
                      top: '41%',
                      left: '50%',
                      width: `${20 + (pressureVal / 4)}px`,
                      height: `${16 + (pressureVal / 5)}px`,
                      backgroundColor: silicaVal > 65 ? '#292524' : silicaVal > 52 ? '#78716c' : '#e5e5e0',
                      '--puff-max-op': silicaVal > 65 ? '0.85' : silicaVal > 52 ? '0.7' : '0.5',
                      '--puff-drift-x': `${-12 + (pressureVal / 8)}px`,
                      '--puff-rise-y': `-${50 + (pressureVal * 0.6)}px`,
                      '--puff-end-scale': `${2.0 + (pressureVal / 60)}`,
                      animation: `smokePuff ${Math.max(1.2, 4.0 - (pressureVal / 40))}s infinite linear`
                    } as any}
                  />

                  {/* Cloud 2 - Center Left-leaning delay */}
                  <div 
                    className="absolute rounded-full filter blur-[6px]"
                    style={{
                      top: '41%',
                      left: '49%',
                      width: `${16 + (pressureVal / 5)}px`,
                      height: `${14 + (pressureVal / 6)}px`,
                      backgroundColor: silicaVal > 65 ? '#1c1917' : silicaVal > 52 ? '#57534e' : '#f5f5f4',
                      '--puff-max-op': silicaVal > 65 ? '0.8' : silicaVal > 52 ? '0.6' : '0.4',
                      '--puff-drift-x': `-${15 + (pressureVal / 6)}px`,
                      '--puff-rise-y': `-${65 + (pressureVal * 0.7)}px`,
                      '--puff-end-scale': `${2.4 + (pressureVal / 50)}`,
                      animation: `smokePuff ${Math.max(1.0, 3.5 - (pressureVal / 40))}s infinite linear`,
                      animationDelay: '1.2s'
                    } as any}
                  />

                  {/* Cloud 3 - Center Right-leaning delay */}
                  <div 
                    className="absolute rounded-full filter blur-[7px]"
                    style={{
                      top: '41.5%',
                      left: '51%',
                      width: `${18 + (pressureVal / 5)}px`,
                      height: `${15 + (pressureVal / 6)}px`,
                      backgroundColor: silicaVal > 65 ? '#44403c' : silicaVal > 52 ? '#6b7280' : '#e5e7eb',
                      '--puff-max-op': silicaVal > 65 ? '0.9' : silicaVal > 52 ? '0.65' : '0.45',
                      '--puff-drift-x': `${18 + (pressureVal / 7)}px`,
                      '--puff-rise-y': `-${55 + (pressureVal * 0.55)}px`,
                      '--puff-end-scale': `${2.2 + (pressureVal / 55)}`,
                      animation: `smokePuff ${Math.max(1.1, 3.8 - (pressureVal / 40))}s infinite linear`,
                      animationDelay: '2.4s'
                    } as any}
                  />

                  {/* Left Side Fumarole (steam vent) */}
                  <div 
                    className="absolute bg-stone-100/40 rounded-full filter blur-[4px]"
                    style={{
                      top: '46.5%',
                      left: '38%',
                      width: '10px',
                      height: '8px',
                      '--puff-max-op': '0.35',
                      '--puff-drift-x': '-8px',
                      '--puff-rise-y': '-35px',
                      '--puff-end-scale': '1.8',
                      animation: 'smokePuff 2.5s infinite linear'
                    } as any}
                  />

                  {/* Right Side Fumarole */}
                  <div 
                    className="absolute bg-stone-200/50 rounded-full filter blur-[4px]"
                    style={{
                      top: '44.5%',
                      left: '62%',
                      width: '12px',
                      height: '9px',
                      '--puff-max-op': '0.4',
                      '--puff-drift-x': '10px',
                      '--puff-rise-y': '-40px',
                      '--puff-end-scale': '2.0',
                      animation: 'smokePuff 2.2s infinite linear',
                      animationDelay: '0.6s'
                    } as any}
                  />

                  {/* Sparks/Embers if pressure is extreme */}
                  {pressureVal > 90 && (
                    <>
                      <div 
                        className="absolute bg-amber-400 rounded-full shadow-[0_0_8px_#f59e0b] filter blur-[0.5px]"
                        style={{
                          top: '41%',
                          left: '50%',
                          width: '4px',
                          height: '4px',
                          '--ember-x': '-25px',
                          '--ember-y': '-110px',
                          animation: 'fireEmber 1.2s infinite ease-out'
                        } as any}
                      />
                      <div 
                        className="absolute bg-orange-500 rounded-full shadow-[0_0_8px_#ef4444] filter blur-[0.5px]"
                        style={{
                          top: '41%',
                          left: '50.5%',
                          width: '3px',
                          height: '3px',
                          '--ember-x': '20px',
                          '--ember-y': '-130px',
                          animation: 'fireEmber 0.9s infinite ease-out',
                          animationDelay: '0.3s'
                        } as any}
                      />
                      <div 
                        className="absolute bg-yellow-300 rounded-full shadow-[0_0_8px_#fbbf24] filter blur-[0.5px]"
                        style={{
                          top: '41%',
                          left: '49.5%',
                          width: '5px',
                          height: '5px',
                          '--ember-x': '5px',
                          '--ember-y': '-150px',
                          animation: 'fireEmber 1.5s infinite ease-out',
                          animationDelay: '0.6s'
                        } as any}
                      />
                    </>
                  )}
                </div>
              )}

              {/* 4. Active Eruption Cinematic Visualizer when simulating */}
              {isSimulating && (
                <div className="absolute inset-0 z-20 pointer-events-none bg-black/10 select-none overflow-hiddenAll">
                  {/* Lightning flash (intermittent dramatic effect) */}
                  <div className="absolute inset-0 bg-white/70 z-30 pointer-events-none" style={{ animation: 'volcanicLightning 1.5s infinite' }} />

                  {/* Gushing central lava column */}
                  <motion.div 
                    initial={{ scaleY: 0, opacity: 0 }}
                    animate={{ scaleY: [1, 1.1, 1], opacity: [0.8, 1, 0.9] }}
                    className="absolute bg-gradient-to-t from-red-600 via-orange-500 to-yellow-400 blur-[2px] origin-bottom"
                    style={{
                      left: '48.5%',
                      width: '3%',
                      height: '35%',
                      bottom: '58%'
                    }}
                  />

                  {/* Explosive Ash plumes rising rapidly */}
                  <motion.div
                    initial={{ y: 0, x: -10, scale: 0.1, opacity: 0 }}
                    animate={{ 
                      y: [-10, -180], 
                      x: [-10, -50, -80],
                      scale: [0.2, 3.2, 5.0],
                      opacity: [0.9, 1, 0] 
                    }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
                    className="absolute bg-neutral-900 rounded-full filter blur-[10px]"
                    style={{ left: '50%', top: '41%', width: '40px', height: '35px' }}
                  />
                  <motion.div
                    initial={{ y: 0, x: 10, scale: 0.1, opacity: 0 }}
                    animate={{ 
                      y: [-12, -190], 
                      x: [10, 60, 90],
                      scale: [0.2, 2.9, 4.6],
                      opacity: [0.9, 1, 0] 
                    }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeOut", delay: 0.4 }}
                    className="absolute bg-stone-805 rounded-full filter blur-[12px]"
                    style={{ left: '50%', top: '41%', width: '45px', height: '40px' }}
                  />
                  <motion.div
                    initial={{ y: -5, x: 0, scale: 0.1, opacity: 0 }}
                    animate={{ 
                      y: [-5, -200], 
                      x: [0, -10, 20],
                      scale: [0.3, 3.5, 6.0],
                      opacity: [1, 1, 0] 
                    }}
                    transition={{ duration: 2.2, repeat: Infinity, ease: "easeOut", delay: 0.2 }}
                    className="absolute bg-stone-950 rounded-full filter blur-[15px]"
                    style={{ left: '50%', top: '41%', width: '35px', height: '30px' }}
                  />

                  {/* Fiery lava splashes emitting from crater */}
                  {Array.from({ length: 8 }).map((_, i) => {
                    const angle = -45 - (i * 12); // outward angles
                    const rad = angle * (Math.PI / 180);
                    const tx = Math.cos(rad) * 120;
                    const ty = Math.sin(rad) * 140;
                    return (
                      <motion.div
                        key={i}
                        initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                        animate={{ 
                          x: tx, 
                          y: ty, 
                          scale: 0.1, 
                          opacity: [1, 1, 0] 
                        }}
                        transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15, ease: "easeOut" }}
                        className="absolute rounded-full bg-gradient-to-br from-yellow-400 to-red-600 shadow-[0_0_10px_#ef4444]"
                        style={{
                          top: '41%',
                          left: '50%',
                          width: '6px',
                          height: '6px',
                        }}
                      />
                    );
                  })}
                  
                  {/* Smoke and red overlay ring shockwave */}
                  <motion.div
                    initial={{ scale: 0, opacity: 0.9 }}
                    animate={{ scale: 3.5, opacity: 0 }}
                    transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
                    className="absolute border-4 border-orange-500 rounded-full filter blur-[2px]"
                    style={{
                      top: '41%',
                      left: '50%',
                      width: '60px',
                      height: '35px',
                      transform: 'translate(-50%, -50%)',
                    }}
                  />
                </div>
              )}

              {/* 5. Post-Eruption States (Caldera Lake or Active Lava Flow) */}
              {!isSimulating && simResult && (
                <div className="absolute inset-0 z-30 pointer-events-none flex flex-col justify-between p-4 bg-black/40 backdrop-blur-[1px]">
                  
                  {/* Render Caldera Lake for Super-Erupsi */}
                  {simResult === 'super-eruption' ? (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute inset-0 bg-stone-900 flex flex-col justify-end p-5 overflow-hidden rounded-[34px] border border-white/20 pointer-events-auto"
                    >
                      {/* Crystalline Caldera Lake background simulation */}
                      <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-sky-300 to-sky-600 opacity-90 z-0">
                        {/* Shimmer/Water wave lines */}
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-sky-300/40 via-sky-500/10 to-sky-700/60 mix-blend-overlay animate-pulse" />
                      </div>
                      
                      {/* Samosir Island (Kubah Resurgent) rising at the center */}
                      <motion.div 
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4, duration: 1.0 }}
                        className="absolute top-[40%] left-[30%] right-[30%] h-[32%] bg-emerald-700/90 rounded-[100%] border-b-8 border-stone-800 shadow-inner z-10 flex flex-col items-center justify-center border-t border-emerald-500/30"
                      >
                        {/* Dense lush forest textures */}
                        <div className="absolute inset-4 rounded-full bg-emerald-800/80 filter blur-[3px]" />
                        <span className="text-[7.5px] font-black tracking-widest text-[#fef08a] uppercase drop-shadow-md z-20">PULAU SAMOSIR</span>
                        <span className="text-[5.5px] font-bold text-emerald-100 uppercase tracking-widest z-20">Resurgent Dome</span>
                      </motion.div>

                      {/* Surrounding steep caldera walls (tepi kaldera) */}
                      <div className="absolute top-0 bottom-0 left-0 w-[18%] bg-stone-850/95 border-r-2 border-stone-700/30 skew-y-3 z-10 shadow-lg" />
                      <div className="absolute top-0 bottom-0 right-0 w-[18%] bg-stone-850/95 border-l-2 border-stone-700/30 -skew-y-3 z-10 shadow-lg" />
                      <div className="absolute bottom-0 left-0 right-0 h-[22%] bg-stone-900 border-t-2 border-stone-800 z-10 flex items-center justify-center px-4" />

                      {/* Header title */}
                      <div className="absolute top-3 inset-x-4 flex justify-between items-center z-20">
                        <span className="text-[7.5px] font-black py-1 px-2.5 bg-sky-950/90 text-sky-300 border border-sky-500/30 rounded-full tracking-widest uppercase">
                          🌋 TERBENTUK KALDERA BARU
                        </span>
                        <span className="text-[7px] font-bold font-mono text-white/70">100 KM x 30 KM</span>
                      </div>

                      {/* Floating slow clouds */}
                      <div className="absolute top-8 left-[10%] w-24 h-6 bg-white/20 rounded-full filter blur-md animate-pulse animate-duration-5000" />
                      <div className="absolute top-12 right-[12%] w-16 h-4 bg-white/25 rounded-full filter blur-sm" />

                      {/* Explanatory Banner */}
                      <div className="relative z-20 text-center space-y-1 mb-1 max-w-[240px] mx-auto bg-stone-950/85 backdrop-blur-md p-3 rounded-2xl border border-white/10 shadow-xl">
                        <h4 className="text-[11px] font-black tracking-tight text-white uppercase italic">DANAU TOBA PURBA</h4>
                        <p className="text-[7.5px] text-stone-300 font-semibold leading-normal">
                          Super-erupsi memuntahkan magma riolit kental secara total. Atap dapur magma runtuh masif menciptakan danau vulkanik terdalam di dunia!
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    // Regular eruption finish states overlay details
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute inset-x-3 bottom-3 bg-stone-950/95 backdrop-blur-md p-3 rounded-2xl border border-white/10 text-center space-y-1 z-20"
                    >
                      <h4 className="text-[9.5px] font-black text-amber-400 uppercase tracking-wider">
                        {simResult === 'gentle-effusive' && '💧 BASALTIC EFFUSIVE FLOW'}
                        {simResult === 'explosive-plinian' && '☁️ TOWERING PLINIAN ERUPTION'}
                        {simResult === 'moderate-strombolian' && '💥 STROMBOLIAN ERUPTION'}
                      </h4>
                      <p className="text-[7.5px] text-stone-300 font-semibold leading-normal">
                        {simResult === 'gentle-effusive' && 'Magma basalt cair mengalir perlahan menuruni lereng tanpa letupan dahsyat. Gejala ini mirip pelepasan lava cair di pulau perisai Hawaii.'}
                        {simResult === 'explosive-plinian' && 'Letusan eksplosif gas tinggi meluncurkan abu pekat stratosfer. Kubah gunung tergerus secara parsial namun sistem kaldera belum runtuh.'}
                        {simResult === 'moderate-strombolian' && 'Semburan kembang api lava berkala melontarkan material piroklastik kecil di sekitar lubang kepundan. Energi gas terdisipasi aman.'}
                      </p>
                    </motion.div>
                  )}

                  {/* Visual Flows Overlay for Gentle Effusive (lava flows) */}
                  {simResult === 'gentle-effusive' && (
                    <div className="absolute inset-0 pointer-events-none z-10 opacity-70">
                      <svg viewBox="0 0 300 220" className="w-full h-full">
                        {/* Lava river 1 */}
                        <path 
                          d="M 150 93 Q 140 120 132 150 T 130 190" 
                          fill="none" 
                          stroke="#ea580c" 
                          strokeWidth="3.5" 
                          strokeLinecap="round"
                          style={{ animation: 'lavaFlow 1.8s infinite' }}
                        />
                        <path 
                          d="M 150 93 Q 140 120 132 150 T 130 190" 
                          fill="none" 
                          stroke="#f1a80a" 
                          strokeWidth="1.5" 
                          strokeLinecap="round"
                        />

                        {/* Lava river 2 */}
                        <path 
                          d="M 152 93 Q 165 130 178 160 T 185 190" 
                          fill="none" 
                          stroke="#ef4444" 
                          strokeWidth="4" 
                          strokeLinecap="round"
                          style={{ animation: 'lavaFlow 2.3s infinite' }}
                        />
                        <path 
                          d="M 152 93 Q 165 130 178 160 T 185 190" 
                          fill="none" 
                          stroke="#ea580c" 
                          strokeWidth="1.8" 
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  )}

                  {/* Volumetric high column for explosive Plinian */}
                  {simResult === 'explosive-plinian' && (
                    <div className="absolute inset-0 pointer-events-none z-10 mix-blend-screen opacity-80">
                      <svg viewBox="0 0 300 220" className="w-full h-full">
                        {/* Tall gray column expanding at top */}
                        <ellipse cx="150" cy="40" rx="45" ry="16" fill="#78716c" opacity="0.8" className="blur-[4px]" />
                        <ellipse cx="150" cy="50" rx="35" ry="12" fill="#57534e" opacity="0.9" className="blur-[2px]" />
                        <path d="M 142 90 L 120 40 L 180 40 L 158 90 Z" fill="#57534e" opacity="0.8" className="blur-[3px]" />
                        {/* Ash glow at bottom of column */}
                        <ellipse cx="150" cy="91" rx="10" ry="4" fill="#f97316" className="blur-[1px]" />
                      </svg>
                    </div>
                  )}

                  {/* Spark splatter for moderate strombolian */}
                  {simResult === 'moderate-strombolian' && (
                    <div className="absolute inset-0 pointer-events-none z-10">
                      <svg viewBox="0 0 300 220" className="w-full h-full">
                        <circle cx="150" cy="91" r="5" fill="#f97316" className="animate-ping" />
                        <circle cx="145" cy="85" r="1.5" fill="#ef4444" />
                        <circle cx="157" cy="81" r="2" fill="#f59e0b" />
                        <circle cx="138" cy="88" r="1" fill="#f59e0b" />
                        <circle cx="152" cy="74" r="1" fill="#ef4444" />
                      </svg>
                    </div>
                  )}
                </div>
              )}

              {/* Status Header pill */}
              <div className="absolute top-4 left-4 z-40">
                <span className="px-2.5 py-1 bg-black/75 backdrop-blur-md rounded-full text-white font-mono text-[8px] uppercase tracking-widest leading-none border border-white/10 shadow-lg">
                  {isSimulating ? 'ERUPSI AKTIF...' : simResult ? 'SIMULASI SELESAI' : 'SIAP DIUJI'}
                </span>
              </div>
            </div>

            <button
              onClick={handleSimulate}
              disabled={isSimulating}
              className="w-full py-5 bg-orange-600 hover:bg-orange-700 text-white font-black rounded-[32px] text-base shadow-xl flex items-center justify-center gap-2"
            >
              {isSimulating ? <RefreshCcw size={20} className="animate-spin" /> : (
                <>
                  <Flame size={18} className="fill-white" />
                  SIMULASIKAN ERUPSI TOBA!
                </>
              )}
            </button>

            {/* Results feedback popup modal */}
            <AnimatePresence>
              {simResult && !isSimulating && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 30 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 30 }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="w-full max-w-md bg-white p-6 rounded-[36px] border-4 border-stone-200 shadow-2xl space-y-4 text-left relative overflow-hidden"
                  >
                    {/* Decorative Top Accent bar based on Eruption type */}
                    <div 
                      className={`absolute top-0 inset-x-0 h-4 ${
                        simResult === 'super-eruption' 
                          ? 'bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500' 
                          : simResult === 'explosive-plinian' 
                          ? 'bg-stone-500' 
                          : simResult === 'gentle-effusive' 
                          ? 'bg-orange-500' 
                          : 'bg-yellow-500'
                      }`}
                    />

                    {/* Close button */}
                    <button
                      onClick={() => { setSimResult(null); playSound('knock'); }}
                      className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center text-stone-400 hover:text-stone-600 font-black rounded-full hover:bg-stone-100 transition-colors text-xs"
                      aria-label="Tutup"
                    >
                      ✕
                    </button>

                    <div className="flex gap-4 items-start pt-2">
                      <div className={`w-14 h-14 rounded-3xl flex items-center justify-center shrink-0 border-2 ${
                        simResult === 'super-eruption' 
                          ? 'bg-red-50 text-red-650 border-red-200 shadow-md'
                          : simResult === 'explosive-plinian'
                          ? 'bg-stone-50 text-stone-650 border-stone-200 shadow-sm'
                          : simResult === 'gentle-effusive'
                          ? 'bg-orange-50 text-orange-650 border-orange-200 shadow-sm'
                          : 'bg-yellow-50 text-yellow-600 border-yellow-250 shadow-sm'
                      }`}>
                        {simResult === 'super-eruption' ? (
                          <span className="text-3xl">🌋</span>
                        ) : simResult === 'explosive-plinian' ? (
                          <span className="text-3xl">☁️</span>
                        ) : simResult === 'gentle-effusive' ? (
                          <span className="text-3xl">💧</span>
                        ) : (
                          <span className="text-3xl">💥</span>
                        )}
                      </div>
                      <div className="space-y-1 pr-4">
                        <span className="text-[8px] font-black tracking-widest text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full uppercase">
                          HASIL SIMULASI FISIKA TOBA
                        </span>
                        <h4 className="text-lg font-black italic uppercase leading-none tracking-tight text-stone-900 pt-0.5">
                          {simResult === 'super-eruption' && 'Super-Erupsi Kaldera Toba!'}
                          {simResult === 'gentle-effusive' && 'Aliran Lava Tenang'}
                          {simResult === 'explosive-plinian' && 'Erupsi Eksplosif Plinian'}
                          {simResult === 'moderate-strombolian' && 'Eruption Moderate'}
                        </h4>
                      </div>
                    </div>

                    <div className="bg-stone-50 p-4 rounded-3xl border border-stone-150 space-y-2">
                      <h5 className="text-[9px] font-black uppercase text-stone-400 tracking-widest leading-none">Penjelasan Sains:</h5>
                      <p className="text-xs font-bold leading-relaxed text-stone-700">
                        {simResult === 'super-eruption' && 'Luar Biasa! Silika kental Riolit menyumbat pelepasan gelembung gas bertemu tekanan tektonik ekstrem memicu runtuhnya dapur magma, membentuk Danau Toba yang megah! Anda memecahkan rekor Geologi.'}
                        {simResult === 'gentle-effusive' && 'Magma basaltik yang cair meleleh dengan tenang menghasilkan lava tipis mirip gunung berapi di Hawaii. Tidak menghasilkan letusan pembentuk Toba.'}
                        {simResult === 'explosive-plinian' && 'Tekanan tinggi meluncurkan abu tebal tinggi ke stratosfer namun tidak sekuat erupsi katastrofe pembentuk cekungan dangkalan kaldera.'}
                        {simResult === 'moderate-strombolian' && 'Semburan kembang api vulkanik skala kecil. Gas berhasil bocor secara perlahan sehingga tidak memicu akumulasi energi mematikan.'}
                      </p>
                    </div>

                    {/* Interactive Parameter Summary badges */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-stone-500 font-mono">
                      <div className="bg-stone-50 px-3 py-2 rounded-2xl border border-stone-200">
                        <span className="text-[8px] text-stone-400">KANDUNGAN SILIKA:</span>
                        <span className="block font-black text-stone-850">{silicaVal}% ({viscosity.toUpperCase()})</span>
                      </div>
                      <div className="bg-stone-100/60 px-3 py-2 rounded-2xl border border-stone-200">
                        <span className="text-[8px] text-stone-400">TEKANAN GAS:</span>
                        <span className="block font-black text-stone-850">{pressureVal} MPa ({pressure.toUpperCase()})</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => { setSimResult(null); playSound('knock'); }}
                      className="w-full py-3.5 bg-stone-900 hover:bg-stone-800 text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-all shadow-md active:scale-[0.98] mt-2 block text-center"
                    >
                      Ulangi / Atur Ulang Parameter
                    </button>
                  </motion.div>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* --- 5. MITIGASI --- */}
        {currentPage === 'mitigasi' && (
          <motion.div 
            key="mitigasi"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-5 pb-20 text-left"
          >
            {/* Header info */}
            <div className="space-y-1 text-center">
              <span className="px-3 py-1 bg-red-100 text-red-700 text-[9px] font-black rounded-full uppercase tracking-widest border border-red-250 inline-block">AKSI MITIGASI VOLKANIK</span>
              <h2 className="text-2xl font-black text-stone-900 tracking-tighter uppercase italic mt-1">Sikap Siaga Bencana</h2>
              <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wide leading-tight">Pelajari rute penyelamatan & latih kepatuhan alat keselamatan.</p>
            </div>

            {/* Sub-tab Navigation inside Mitigasi */}
            <div className="grid grid-cols-2 gap-1.5 bg-stone-100 p-1.5 rounded-2xl border border-stone-200">
              <button
                onClick={() => {
                  playSound('knock');
                  setMitigasiTab('challenge');
                }}
                className={`py-2 px-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                  mitigasiTab === 'challenge'
                    ? 'bg-stone-900 text-white shadow-md'
                    : 'text-stone-500 hover:bg-stone-200/50'
                }`}
              >
                🎮 Tantangan Siaga
              </button>
              <button
                onClick={() => {
                  playSound('knock');
                  setMitigasiTab('evac');
                }}
                className={`py-2 px-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                  mitigasiTab === 'evac'
                    ? 'bg-stone-900 text-white shadow-md'
                    : 'text-stone-500 hover:bg-stone-200/50'
                }`}
              >
                🗺️ Rute Evakuasi
              </button>
            </div>

            {/* Conditionally Render Mitigasi Tab */}
            {mitigasiTab === 'challenge' ? (
              <div className="space-y-5">
                {/* Challenge Container */}
                <div className="w-full space-y-4 bg-white p-5 rounded-[28px] border-2 border-stone-100 shadow-sm">
                  <div className="space-y-1 text-center">
                    <span className="text-[8px] font-black tracking-widest text-[#ef4444] uppercase bg-red-50 border border-red-200/50 px-2.5 py-0.5 rounded-full">TANTANGAN SIAGA UTAMA</span>
                    <h3 className="text-xs font-black text-stone-900 leading-snug">
                      "Letusan terjadi! Hujan debu kaca vulkanik sangat tajam & gas sulfur terlepas mendadak. Amankan dirimu!"
                    </h3>
                    <p className="text-[9px] text-stone-400 font-bold">Pilih semua alat pelindung penunjang kehidupan yang tepat:</p>
                  </div>

                  {/* equipment selection lists */}
                  <div className="space-y-2.5">
                    {[
                      {
                        id: 'mask',
                        label: '1. Masker Respirator N95',
                        icon: '😷',
                        isCorrect: true,
                        desc: 'Menyaring partikel silika halus PM2.5 agar tidak merusak jaringan alveolus paru-paru.',
                        explanation: 'Sempurna! Masker respirator N95 kedap udara & berserat elektrostatik khusus sanggup memfilter material silika mikro abrasif (butir kristal kaca tajam) hingga 95% untuk mencegah silikosis mematikan.'
                      },
                      {
                        id: 'goggles',
                        label: '2. Kacamata Goggles Kedap Mata',
                        icon: '🥽',
                        isCorrect: true,
                        desc: 'Melindungi selaput mata dari debu kaca korosif agar kornea mata tidak tergores.',
                        explanation: 'Suka sekali dengan ini! Abu gunung api berupa pecahan silika berpola pecahan kaca tajam bergerigi. Kacamata Goggles kedap udara menghalang robekan pupil & infeksi kornea berat.'
                      },
                      {
                        id: 'hands',
                        label: '3. Tutup Mulut dengan Telapak Tangan',
                        icon: '✋',
                        isCorrect: false,
                        desc: 'Menggunakan kedua genggaman telapak tangan secara manual untuk menahan sebaran debu.',
                        explanation: 'Keliru/Sangat Bahaya! Selah-selah jari tangan terlalu besar untuk membendung debu berukuran mikro. Menaruh tangan kotor berabu ke area wajah justru mempercepat penyebaran gas asam korosif ke jaringan sensitif mulut.'
                      }
                    ].map((item) => {
                      const isSelected = selectedEquipments.includes(item.id);
                      return (
                        <div key={item.id} className="space-y-1.5">
                          <button
                            disabled={isSubmitted}
                            onClick={() => handleEquipmentToggle(item.id)}
                            className={`w-full p-4 rounded-3xl border-2 text-left transition-all flex items-start gap-3.5 relative overflow-hidden ${
                              isSelected
                                ? isSubmitted
                                  ? item.isCorrect
                                    ? 'bg-green-50/50 border-green-500 shadow-sm'
                                    : 'bg-red-50/50 border-red-500 shadow-sm'
                                  : 'bg-amber-55 border-amber-500 shadow-sm ring-2 ring-amber-400/10'
                                : isSubmitted
                                ? 'bg-stone-50 border-stone-200 opacity-60'
                                : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                            }`}
                          >
                            {/* Accent line on selected state */}
                            {isSelected && (
                              <div className={`absolute top-0 bottom-0 left-0 w-2 ${
                                isSubmitted
                                  ? item.isCorrect ? 'bg-green-500' : 'bg-red-500'
                                  : 'bg-amber-500'
                              }`} />
                            )}

                            <span className="text-3xl shrink-0 leading-none">{item.icon}</span>
                            
                            <div className="space-y-1 flex-1 pr-6">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <h4 className="font-black text-stone-900 text-xs">{item.label}</h4>
                                {isSelected ? (
                                  isSubmitted ? (
                                    <span className={`text-[8.5px] px-1.5 py-0.2 rounded font-black uppercase ${
                                      item.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                    }`}>
                                      {item.isCorrect ? 'BENAR' : 'SALAH'}
                                    </span>
                                  ) : (
                                    <span className="text-[8.5px] px-1.5 py-0.2 bg-amber-100 text-amber-850 rounded font-black uppercase">
                                      DIPILIH
                                    </span>
                                  )
                                ) : null}
                              </div>
                              <p className="text-[10px] text-stone-500 font-semibold leading-tight">{item.desc}</p>
                            </div>

                            {/* Bullet Box indicator */}
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                              isSelected
                                ? isSubmitted
                                  ? item.isCorrect 
                                    ? 'border-green-500 bg-green-500 text-white' 
                                    : 'border-red-500 bg-red-500 text-white'
                                  : 'border-amber-500 bg-amber-500 text-white'
                                : 'border-stone-300'
                            }`}>
                              {isSelected && <span className="text-[9px] font-black">✓</span>}
                            </div>
                          </button>

                          {/* Animated explanation display only once evaluated */}
                          <AnimatePresence>
                            {isSelected && isSubmitted && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className={`p-3.5 rounded-2xl text-[9.5px] font-semibold leading-relaxed border-l-4 ${
                                  item.isCorrect
                                    ? 'bg-green-50 text-green-700 border-green-400'
                                    : 'bg-red-50 text-red-700 border-red-400'
                                }`}
                              >
                                <strong>Analisi Medis:</strong> {item.explanation}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })}
                  </div>

                  {/* Submission and Evaluation Output screen */}
                  {!isSubmitted ? (
                    <button
                      onClick={handleSubmitMitigation}
                      disabled={selectedEquipments.length === 0}
                      className={`w-full py-4 rounded-[20px] font-black text-xs uppercase tracking-widest transition-all shadow-md flex items-center justify-center gap-1.5 ${
                        selectedEquipments.length === 0
                          ? 'bg-stone-200 text-stone-400 cursor-not-allowed'
                          : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-[0.98]'
                      }`}
                    >
                      🛡️ Kirim Jawaban & Cek Hasil
                    </button>
                  ) : (
                    <div className="space-y-3">
                      {/* Evaluation status message or Certificate Reward Badge */}
                      {selectedEquipments.includes('mask') && selectedEquipments.includes('goggles') && !selectedEquipments.includes('hands') ? (
                        <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300/60 rounded-[24px] text-center space-y-3.5 shadow-sm">
                          <motion.div 
                            initial={{ scale: 0.8, rotate: -15 }}
                            animate={{ scale: [1, 1.12, 1], rotate: [0, 6, -6, 0] }}
                            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                            className="mx-auto w-16 h-16 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 relative border border-amber-300 shadow-md"
                          >
                            <Award size={34} />
                            <span className="absolute -top-1 -right-1 text-base">🏅</span>
                          </motion.div>
                          
                          <div className="space-y-1">
                            <span className="text-[8.5px] font-black tracking-widest text-[#d97706] bg-amber-100 px-3 py-0.5 rounded-full uppercase border border-amber-200">LENCANA MITIGASI</span>
                            <h4 className="text-base font-black tracking-tight uppercase italic text-amber-950">Pejuang Tangguh Bencana</h4>
                            <p className="text-[10px] text-amber-900 font-bold leading-normal max-w-sm mx-auto">
                              Lencana diberikan atas kepatuhan protektif paripurna! Pemilihan Masker N95 dan Kacamata Pelindung (Goggles) menyelamatkan Anda dari luka abrasi kornea serta infeksi silika paru-paru akut.
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-[20px] text-center space-y-2">
                          <div className="mx-auto w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                            <AlertTriangle size={20} />
                          </div>
                          <div className="space-y-1">
                            <span className="text-[8px] font-black tracking-widest text-[#dc2626] bg-red-100 px-2.5 py-0.5 rounded-full uppercase">BELUM SEMPURNA</span>
                            <h4 className="text-xs font-black text-red-900 uppercase">Perlindungan Belum Optimal!</h4>
                            <p className="text-[9.5px] text-red-800 font-semibold leading-snug">
                              {selectedEquipments.includes('hands')
                                ? 'Pilihan memegang hidung/tutup mulut dengan tangan tidak efektif menepis pecahan kaca halus PM2.5. Tangan kotor juga membawa sisa debu masuk mata Anda.'
                                : 'Anda belum memilih semua alat perlindungan wajib. Ingat Anda butuh perlindungan simultan (N95 + Goggles) agar selamat dari butir kristal tajam abu vulkanik.'}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Reset Challenge Button */}
                      <button
                        onClick={handleResetMitigation}
                        className="w-full py-3 px-4 bg-stone-900 hover:bg-stone-850 text-white font-black text-[10px] uppercase tracking-wider rounded-[18px] transition-all flex items-center justify-center gap-1.5"
                      >
                        <RefreshCcw size={12} />
                        Coba Lagi / Atur Ulang Pilihan
                      </button>
                    </div>
                  )}
                </div>

                {/* Info Card explaining the danger of volcanic ash */}
                <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex gap-2.5">
                  <span className="text-lg shrink-0">☝️</span>
                  <p className="text-[9.5px] text-amber-900 font-semibold leading-normal">
                    <strong>Penting Diketahui:</strong> Partikel abu letusan itu BUKAN abu kayu lunak biasa, melainkan pecahan mineral glass silika yang keras, runcing, dan bergerigi mikro. Melindungi kornea mata & kantung napas adalah prioritas utama siaga dini.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-5">
                {/* Part 3: Tambahan Info Penting: Jalur Evakuasi di Sumatera Utara */}
                <div className="w-full bg-[#fef3c7]/40 p-5 rounded-[28px] border-2 border-[#f59e0b]/20 shadow-sm space-y-4">
                  <div className="flex gap-2.5 items-center">
                    <div className="w-10 h-10 rounded-2xl bg-[#f59e0b]/20 text-[#d97706] flex items-center justify-center shrink-0">
                      <Compass size={22} className="animate-pulse" />
                    </div>
                    <div>
                      <span className="text-[7.5px] font-black tracking-widest text-amber-700 bg-amber-100 px-2 py-0.5 rounded uppercase font-mono">PETA JALUR EVAKUASI SUMUT</span>
                      <h3 className="text-sm font-black text-amber-950 tracking-tight leading-none mt-0.5">Ring Siaga Sumatra Utara</h3>
                    </div>
                  </div>

                  <p className="text-[10px] text-amber-900 font-semibold leading-relaxed">
                    Di Sumatera Utara, terdapat rangkaian gunung api aktif selain sisa kompleks kaldera Toba. Simak rute mitigasi kedaruratan dari lereng Gunung Sinabung atau Sibayak berikut:
                  </p>

                  {/* Volcano Selector Tabs (Sinabung & Sibayak) */}
                  <div className="grid grid-cols-2 gap-2 bg-amber-950/5 p-1 rounded-2xl">
                    <button
                      onClick={() => { playSound('knock'); setActiveEvacTab('sinabung'); }}
                      className={`py-2 px-1 rounded-xl text-[10px] font-black uppercase transition-all ${
                        activeEvacTab === 'sinabung'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'text-amber-800 hover:bg-amber-50'
                      }`}
                    >
                      🌋 GN. SINABUNG (AKTIF NYATA)
                    </button>
                    <button
                      onClick={() => { playSound('knock'); setActiveEvacTab('sibayak'); }}
                      className={`py-2 px-1 rounded-xl text-[10px] font-black uppercase transition-all ${
                        activeEvacTab === 'sibayak'
                          ? 'bg-amber-600 text-white shadow-sm'
                          : 'text-amber-800 hover:bg-amber-50'
                      }`}
                    >
                      ⛰️ GN. SIBAYAK (AKTIF NORMAL)
                    </button>
                  </div>

                  {/* Evacuation details body */}
                  <div className="bg-white/80 p-4 rounded-2xl border border-amber-200/50 space-y-3">
                    {activeEvacTab === 'sinabung' ? (
                      <div className="space-y-2">
                        <div className="flex gap-1.5 items-center">
                          <MapPin size={12} className="text-red-500 shrink-0" />
                          <span className="text-[9.5px] font-black text-amber-950">JALUR & SEKTOR EVAKUASI SINABUNG:</span>
                        </div>
                        <ul className="text-[9.5px] text-amber-900 font-semibold space-y-2 list-disc pl-4 leading-normal">
                          <li>
                            <strong>Hindari Sektor Bahaya Utama:</strong> Sektor <strong>Selatan, Tenggara, dan Timur Laut</strong> gunung (terkena luncuran langsung awan panas Wedhus Gembel).
                          </li>
                          <li>
                            <strong>Koridor Pengungsian Mandiri:</strong> Diungsikan ke arah utara menuju <strong>Berastagi</strong>, barat daya ke <strong>Kabanjahe</strong>, atau utara/barat laut ke daerah darat datar dataran tinggi Karo yang terisolir awan panas.
                          </li>
                          <li>
                            <strong>Menjauhi Aliran Lau Borus:</strong> Sungai <strong>Lau Borus</strong> berpotensi mengalirkan lahar dingin sangat padat batu-batu vulkanik sisa semburan kawah. Jauhi sungai ini minimal 1-2 kilometer dari bantaran.
                          </li>
                        </ul>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex gap-1.5 items-center">
                          <MapPin size={12} className="text-red-500 shrink-0" />
                          <span className="text-[9.5px] font-black text-amber-950">JALUR & SEKTOR EVAKUASI SIBAYAK:</span>
                        </div>
                        <ul className="text-[9.5px] text-amber-900 font-semibold space-y-2 list-disc pl-4 leading-normal">
                          <li>
                            <strong>Radius Bahaya Pemukiman:</strong> Kepundan kawah belerang Sibayak hanya berjarak <strong>7 KM dari pusat wisata Berastagi</strong>, menjadikannya rentan timbunan debu piroklastik pekat jika letupan mendadak terjadi.
                          </li>
                          <li>
                            <strong>Arah Alur Pengungsian:</strong> Mengarah menjauh ke <strong>Kecamatan Nama Teran</strong> atau mengikuti jalan lintas Kabupaten ke arah <strong>Deli Serdang</strong>.
                          </li>
                          <li>
                            <strong>Rute Evakuasi Alternatif:</strong> Jalur ke arah <strong>Medan Selatan</strong> melintasi Sembahe dapat difungsikan apabila ditiup angin timur laut, menjauhi koridor paparan debu utama dari puncak Sibayak.
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* General evacuation guideline tip card */}
                  <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex gap-2">
                    <span className="text-base shrink-0 leading-none">🚑</span>
                    <p className="text-[9px] text-amber-850 font-bold leading-normal">
                      <strong>Arahan Kedaruratan:</strong> Selalu perhatikan rambu evakuasi hijau bergambar arah berlari yang terpasang sepanjang jalan Karo, serta pantau arahan berkala dari posko PVMBG / BNPB di kota Berastagi.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}

      </AnimatePresence>

      {/* --- BOTTOM DASHBOARD NAVIGATION --- */}
      <nav className="bg-cream-bg/95 backdrop-blur-md border-t border-stone-200 h-16 flex items-center justify-around fixed bottom-0 w-full max-w-md z-40 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                playSound('knock');
                setCurrentPage(item.id);
              }}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors relative ${
                isActive ? 'text-orange-600' : 'text-stone-400'
              }`}
            >
              <Icon size={18} className={isActive ? 'fill-orange-500/10' : ''} />
              <span className="text-[9px] mt-1 font-bold">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="toba-nav-indicator"
                  className="absolute bottom-0 w-8 h-1 bg-orange-600 rounded-t-full"
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
