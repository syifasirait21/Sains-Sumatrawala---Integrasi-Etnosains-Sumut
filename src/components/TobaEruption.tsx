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
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState<string | null>(null);
  const [magmaTemp, setMagmaTemp] = useState(850); // Celcius

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

  // Mitigasi states
  interface MitigationItem {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }

  const [initialMitigationItems] = useState<MitigationItem[]>([
    { 
      id: '1', 
      text: "Mempersiapkan tas siaga bencana berisi masker, makanan kering, & air bersih", 
      isCorrect: true, 
      explanation: "Pertahanan pertama saat mengungsi cepat, menjamin hidrasi & nutrisi dasar serta perlindungan pernapasan." 
    },
    { 
      id: '2', 
      text: "Mendekati tepian Danau Toba untuk berselfie setelah terdengar sirine getaran keras", 
      isCorrect: false, 
      explanation: "Sangat berbahaya! Longsor tebing bawah air danau akibat gempa vulkanik berisiko menimbulkan gelombang tsunami." 
    },
    { 
      id: '3', 
      text: "Membersihkan tumpukan abu tebal di atap rumah saat letusan masih aktif tanpa pelindung", 
      isCorrect: false, 
      explanation: "Hindari! Abu vulkanik bersifat korosif & tajam, membahayakan mata/paru-paru jika terhirup langsung." 
    },
    { 
      id: '4', 
      text: "Menutup rapat celah ventilasi, jendela, & pintu menggunakan kain basah", 
      isCorrect: true, 
      explanation: "Kain basah sangat efektif menyaring aerosol abu vulkanik berbahaya agar tidak masuk mencemari sirkulasi dalam rumah." 
    },
    { 
      id: '5', 
      text: "Bergegas mengungsi ke titik evakuasi yang ditentukan PVMBG/BNPB", 
      isCorrect: true, 
      explanation: "Evakuasi terstruktur ke zona aman meminimalisir risiko jatuhnya korban akibat awan panas (wedhus gembel)." 
    }
  ]);

  const [mitigationLeft, setMitigationLeft] = useState<MitigationItem[]>(() => {
    const saved = localStorage.getItem('toba_mitigation_left');
    return saved ? JSON.parse(saved) : initialMitigationItems;
  });
  const [mitigationCorrectZone, setMitigationCorrectZone] = useState<MitigationItem[]>(() => {
    const saved = localStorage.getItem('toba_mitigation_correct');
    return saved ? JSON.parse(saved) : [];
  });
  const [mitigationAvoidZone, setMitigationAvoidZone] = useState<MitigationItem[]>(() => {
    const saved = localStorage.getItem('toba_mitigation_avoid');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFeedback, setShowFeedback] = useState<boolean>(() => {
    return localStorage.getItem('toba_mitigation_show_feedback') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('toba_mitigation_left', JSON.stringify(mitigationLeft));
    localStorage.setItem('toba_mitigation_correct', JSON.stringify(mitigationCorrectZone));
    localStorage.setItem('toba_mitigation_avoid', JSON.stringify(mitigationAvoidZone));
    localStorage.setItem('toba_mitigation_show_feedback', showFeedback.toString());
  }, [mitigationLeft, mitigationCorrectZone, mitigationAvoidZone, showFeedback]);

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

  const handleMitigationSelect = (item: MitigationItem, target: 'benar' | 'salah') => {
    playSound('knock');
    setMitigationLeft(prev => prev.filter(i => i.id !== item.id));
    if (target === 'benar') {
      setMitigationCorrectZone(prev => [...prev, item]);
    } else {
      setMitigationAvoidZone(prev => [...prev, item]);
    }
  };

  const handleResetMitigation = () => {
    playSound('knock');
    setMitigationLeft(initialMitigationItems);
    setMitigationCorrectZone([]);
    setMitigationAvoidZone([]);
    setShowFeedback(false);
  };

  const checkMitigationAnswers = () => {
    const isAllPlaced = mitigationLeft.length === 0;
    if (!isAllPlaced) return;

    setShowFeedback(true);
    const hasError = 
      mitigationCorrectZone.some(item => !item.isCorrect) || 
      mitigationAvoidZone.some(item => item.isCorrect);

    if (hasError) {
      playSound('failure');
    } else {
      playSound('success');
    }
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
                    Halaman A: Peta
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
                    Halaman B: Animasi
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
            <div className="w-full space-y-5 bg-white p-5 rounded-[28px] border-2 border-stone-100 shadow-md">
              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-stone-500">
                  <span>1. Viskositas Magma (Silika)</span>
                  <span className="text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">{viscosity.toUpperCase()}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['basaltic', 'andesitic', 'rhyolitic'].map((v) => (
                    <button
                      key={v}
                      disabled={isSimulating}
                      onClick={() => {
                        setViscosity(v as any);
                        setMagmaTemp(v === 'basaltic' ? 1100 : v === 'andesitic' ? 900 : 750);
                        setSimResult(null);
                        playSound('knock');
                      }}
                      className={`py-2 p-1.5 rounded-2xl border text-[9px] font-black uppercase transition-all ${
                        viscosity === v ? 'bg-orange-600 border-orange-600 text-white shadow-sm' : 'bg-stone-50 border-stone-200 text-stone-400'
                      }`}
                    >
                      {v === 'basaltic' ? 'Basalt (Cair)' : v === 'andesitic' ? 'Andesit' : 'Riolit (Kental)'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-wider text-stone-500">
                  <span>2. Tekanan Gas Tektonik</span>
                  <span className="text-red-500 bg-red-50 px-2 py-0.5 rounded-full">{pressure.toUpperCase()}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {['low', 'medium', 'extreme'].map((p) => (
                    <button
                      key={p}
                      disabled={isSimulating}
                      onClick={() => {
                        setPressure(p as any);
                        setSimResult(null);
                        playSound('knock');
                      }}
                      className={`py-2 p-1.5 rounded-2xl border text-[9px] font-black uppercase transition-all ${
                        pressure === p ? 'bg-red-500 border-red-500 text-white shadow-sm' : 'bg-stone-50 border-stone-200 text-stone-400'
                      }`}
                    >
                      {p === 'low' ? 'Rendah' : p === 'medium' ? 'Sedang' : 'Ekstrem'}
                    </button>
                  ))}
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
              <svg viewBox="0 0 300 220" className="w-full h-full">
                <AnimatePresence>
                  {isSimulating && (
                    <motion.g
                      initial={{ opacity: 0, scale: 0.2 }}
                      animate={{ opacity: [0.8, 1, 0.8], scale: [0.8, 2.5, 3] }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 2.8, ease: "easeOut" }}
                      className="origin-[150px_110px]"
                    >
                      <circle cx="150" cy="100" r="15" fill="#ef4444" opacity="0.8" className="blur-[2px]" />
                      <circle cx="130" cy="80" r="20" fill="#f97316" opacity="0.6" className="blur-[4px]" />
                      <circle cx="170" cy="75" r="22" fill="#78716c" opacity="0.4" className="blur-[6px]" />
                    </motion.g>
                  )}
                </AnimatePresence>

                <motion.g animate={simResult === 'super-eruption' ? { y: 20 } : { y: 0 }}>
                  {simResult === 'super-eruption' ? (
                    <>
                      <path d="M 0 190 L 80 150 L 110 160 L 100 190 Z" fill="#451a03" stroke="#1c1917" strokeWidth="2" />
                      <path d="M 300 190 L 220 150 L 190 160 L 200 190 Z" fill="#451a03" stroke="#1c1917" strokeWidth="2" />
                      <rect x="90" y="155" width="120" height="35" rx="8" fill="#1d4ed8" opacity="0.85" />
                      <path d="M 125 165 C 135 152, 165 152, 175 165 Z" fill="#b45309" stroke="#78350f" strokeWidth="1.5" />
                      <text x="135" y="180" fill="yellow" className="font-sans font-black text-[9px]">DANAU TOBA</text>
                    </>
                  ) : (
                    <>
                      <ellipse cx="150" cy="180" rx="35" ry="20" fill={pressure === 'extreme' ? '#ef4444' : '#b45309'} className="animate-pulse" />
                      <path d="M 150 180 L 150 110" stroke={pressure === 'extreme' ? '#ef4444' : '#b45309'} strokeWidth="5" />
                      <path d="M 40 190 L 150 90 L 260 190 Z" fill="#57534e" stroke="#292524" strokeWidth="3" />
                    </>
                  )}
                </motion.g>
                <rect x="0" y="190" width="300" height="30" fill="#1c1917" />
              </svg>

              <div className="absolute top-4 left-4">
                <span className="px-2.5 py-1 bg-black/60 backdrop-blur-md rounded-full text-white font-mono text-[8px] uppercase tracking-widest leading-none">
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

            {/* Results feedback popup card */}
            <AnimatePresence>
              {simResult && !isSimulating && (
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  className="w-full bg-white p-5 rounded-[32px] border-4 border-stone-200 shadow-xl space-y-3 text-left"
                >
                  <div className="flex gap-3 items-center border-b border-stone-100 pb-2">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 bg-orange-100 text-orange-600">
                      <AlertTriangle size={24} />
                    </div>
                    <div>
                      <span className="text-[8px] font-black tracking-widest text-stone-400">HASIL SIMULASI FISIKA</span>
                      <h4 className="text-base font-black italic uppercase leading-none tracking-tight text-stone-850">
                        {simResult === 'super-eruption' && 'Super-Erupsi Kaldera Toba!'}
                        {simResult === 'gentle-effusive' && 'Aliran Lava Tenang'}
                        {simResult === 'explosive-plinian' && 'Erupsi Eksplosif Plinian'}
                        {simResult === 'moderate-strombolian' && 'Eruption Moderate'}
                      </h4>
                    </div>
                  </div>
                  <p className="text-xs font-bold leading-relaxed text-stone-600">
                    {simResult === 'super-eruption' && 'Luar Biasa! Silika kental Riolit menyumbat pelepasan gelembung gas bertemu tekanan tektonik ekstrem memicu runtuhnya dapur magma, membentuk Danau Toba yang megah! Anda memecahkan rekor Geologi.'}
                    {simResult === 'gentle-effusive' && 'Magma basaltik yang cair meleleh dengan tenang menghasilkan lava tipis mirip gunung berapi di Hawaii. Tidak menghasilkan letusan pembentuk Toba.'}
                    {simResult === 'explosive-plinian' && 'Tekanan tinggi meluncurkan abu tebal tinggi ke stratosfer namun tidak sekuat erupsi katastrofe pembentuk cekungan dangkalan kaldera.'}
                    {simResult === 'moderate-strombolian' && 'Semburan kembang api vulkanik skala kecil. Gas berhasil bocor secara perlahan sehingga tidak memicu akumulasi energi mematikan.'}
                  </p>
                  <button 
                    onClick={() => { setSimResult(null); playSound('knock'); }}
                    className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-600 font-extrabold text-[10px] uppercase rounded-xl transition-colors"
                  >
                    Atur Ulang Parameter
                  </button>
                </motion.div>
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
            className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 pb-20 text-left"
          >
            <div className="space-y-1">
              <span className="px-3 py-1 bg-red-100 text-red-700 text-[9px] font-black rounded-full uppercase tracking-widest">AKSI MITIGASI VOLKANIK</span>
              <h2 className="text-3xl font-black text-stone-900 tracking-tighter uppercase italic">Sikap Siaga Bencana</h2>
              <p className="text-[10px] text-stone-500 font-bold max-w-xs uppercase tracking-wide leading-tight">Uji ketangguhan memisahkan aksi penyelamatan & pencegahan krisis!</p>
            </div>

            {/* Left/current action cards */}
            {mitigationLeft.length > 0 ? (
              <div className="space-y-4">
                <p className="text-[9px] font-black uppercase text-stone-400 tracking-widest px-1">Pilahan Tindakan Selanjutnya:</p>
                <motion.div 
                  layout
                  className="p-5 bg-white rounded-3xl border-2 border-stone-100 shadow-xl flex flex-col gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
                      <ShieldAlert size={20} />
                    </div>
                    <span className="text-xs font-black text-stone-850 leading-tight">{mitigationLeft[0].text}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleMitigationSelect(mitigationLeft[0], 'benar')}
                      className="flex flex-col items-center justify-center py-3 bg-green-50 hover:bg-green-100 text-green-600 rounded-2xl border border-green-200/50 transition-all active:scale-95"
                    >
                      <CheckCircle2 size={18} className="mb-1" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Perlu Dilakukan</span>
                    </button>
                    <button
                      onClick={() => handleMitigationSelect(mitigationLeft[0], 'salah')}
                      className="flex flex-col items-center justify-center py-3 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl border border-red-200/50 transition-all active:scale-95"
                    >
                      <XCircle size={18} className="mb-1" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Harus Dihinari</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="p-6 bg-emerald-50 rounded-[32px] border-2 border-dashed border-emerald-200 text-center space-y-3">
                <Check className="text-emerald-600 mx-auto" size={32} />
                <h4 className="font-sans font-black text-emerald-800 uppercase text-xs">Seluruh Tindakan Telah Dipilah</h4>
                <p className="text-[10px] text-stone-500 font-bold max-w-xs mx-auto">Klik tombol cek jawaban di bawah untuk menilai pemahaman mitigasi Anda.</p>
              </div>
            )}

            {/* Split Sorting Zones */}
            <div className="grid grid-cols-2 gap-4">
              {/* Correct Zone */}
              <div className="flex flex-col gap-2">
                <div className="p-3 rounded-[24px] bg-green-100 text-green-700 text-center font-black uppercase italic tracking-tighter text-[9px] border border-green-200">
                  Perlu Dilakukan
                </div>
                <div className="flex-1 min-h-[140px] p-2 bg-stone-50 border-2 border-dashed border-stone-200 rounded-[28px] flex flex-col gap-1.5">
                  {mitigationCorrectZone.length === 0 ? (
                    <span className="text-[8px] font-bold text-stone-400 uppercase text-center my-auto">KOSONG</span>
                  ) : (
                    mitigationCorrectZone.map(item => (
                      <div 
                        key={item.id} 
                        className={`p-2 rounded-xl text-[9px] font-bold ${
                          showFeedback 
                            ? item.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            : 'bg-white border border-stone-100 text-stone-600'
                        }`}
                      >
                        <p className="line-clamp-2 leading-none">{item.text}</p>
                        {showFeedback && <p className="text-[7px] leading-tight mt-1 pt-1 border-t border-current/10 opacity-80 font-medium">{item.explanation}</p>}
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Avoided Zone */}
              <div className="flex flex-col gap-2">
                <div className="p-3 rounded-[24px] bg-red-100 text-red-700 text-center font-black uppercase italic tracking-tighter text-[9px] border border-red-200">
                  Harus Dihindari
                </div>
                <div className="flex-1 min-h-[140px] p-2 bg-stone-50 border-2 border-dashed border-stone-200 rounded-[28px] flex flex-col gap-1.5">
                  {mitigationAvoidZone.length === 0 ? (
                    <span className="text-[8px] font-bold text-stone-400 uppercase text-center my-auto">KOSONG</span>
                  ) : (
                    mitigationAvoidZone.map(item => (
                      <div 
                        key={item.id} 
                        className={`p-2 rounded-xl text-[9px] font-bold ${
                          showFeedback 
                            ? !item.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            : 'bg-white border border-stone-100 text-stone-600'
                        }`}
                      >
                        <p className="line-clamp-2 leading-none">{item.text}</p>
                        {showFeedback && <p className="text-[7px] leading-tight mt-1 pt-1 border-t border-current/10 opacity-80 font-medium">{item.explanation}</p>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="space-y-2">
              {mitigationLeft.length === 0 && (
                <button
                  onClick={checkMitigationAnswers}
                  className="w-full py-4 bg-stone-900 hover:bg-stone-850 text-white font-black text-xs uppercase tracking-widest rounded-[24px] shadow-md transition-transform"
                >
                  Evaluasi Jawaban Anda
                </button>
              )}
              <button
                onClick={handleResetMitigation}
                className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-500 font-black text-[10px] uppercase tracking-wider rounded-[20px] transition-colors flex items-center justify-center gap-1.5"
              >
                <RefreshCcw size={12} />
                Atur Ulang Simulasi
              </button>
            </div>
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
