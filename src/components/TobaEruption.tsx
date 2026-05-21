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
  Check
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

  const [activeTab, setActiveTab] = useState<'etno' | 'science'>('etno');
  const [viscosity, setViscosity] = useState<'basaltic' | 'andesitic' | 'rhyolitic'>('rhyolitic');
  const [pressure, setPressure] = useState<'low' | 'medium' | 'extreme'>('extreme');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simResult, setSimResult] = useState<string | null>(null);
  const [magmaTemp, setMagmaTemp] = useState(850); // Celcius

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

            {/* Simulated Ash Sky Illustration with falling particles */}
            <div className="relative aspect-video bg-stone-900 rounded-[32px] overflow-hidden shadow-xl border-4 border-white flex flex-col items-center justify-center p-6 text-center group">
              <div className="absolute inset-0 bg-gradient-to-t from-red-950 via-stone-900 to-[#120505] opacity-95 z-0" />
              <div className="absolute inset-0 pointer-events-none opacity-40">
                {[...Array(15)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: ['-10%', '110%'],
                      x: ['-5%', '105%'],
                      opacity: [0, 1, 1, 0],
                      scale: [0.6, 1.2, 0.4]
                    }}
                    transition={{
                      duration: 6 + Math.random() * 5,
                      repeat: Infinity,
                      delay: i * 0.3,
                      ease: "linear"
                    }}
                    className="absolute w-2 h-2 bg-stone-400 rounded-full blur-[1.5px]"
                    style={{ left: `${Math.random() * 100}%`, top: '-5%' }}
                  />
                ))}
              </div>

              <div className="space-y-2 z-10">
                <Flame size={40} className="text-orange-500 mx-auto animate-bounce" />
                <p className="font-black text-white text-base tracking-tight uppercase italic leading-none">Super-Erupsi Gunung Toba</p>
                <p className="text-[10px] font-semibold text-stone-300 max-w-[270px] mx-auto leading-normal">
                  Kekuatan letusan dahsyat meledakkan 2.800 km³ magma, memicu zaman es vulkanik global selama 6 tahun!
                </p>
              </div>

              <span className="absolute bottom-3 right-4 text-[8px] font-mono text-stone-500 uppercase tracking-widest z-10">VEI-8 CATEGORY</span>
            </div>

            <div className="space-y-4 text-stone-800 leading-relaxed text-sm font-medium">
              <p>
                Gunung Toba purba meletus dengan kekuatan terdahsyat sejarah bumi, melepaskan debu vulkanik yang nyaris memusnahkan peradaban purba di berbagai penjuru benua.
              </p>
              <div className="bg-orange-500/5 p-5 rounded-[24px] border-2 border-orange-500/10 border-dashed">
                <p className="italic font-black text-orange-600 uppercase tracking-tight text-xs">
                  "Abu tebal menghalangi pancaran matahari, menurunkan suhu bumi rata-rata hingga 10-15°C secara masif. Manusia purba hanya tersisa beberapa ribu saja."
                </p>
              </div>
              <p>
                Konsekuensi runtuhnya dapur magma menyisakan patahan amblas selebar 100 km yang kelak menampung air tawar, menjadi danau vulkanik terdahsyat: <strong>Danau Toba</strong>.
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
                <span className="text-xs font-bold block text-orange-600 tracking-widest">(Anatomi Lempeng)</span>
              </h2>
              <div className="absolute top-4 right-6">
                <button 
                  onClick={() => playSound('knock')} 
                  className="bg-white p-2.5 rounded-full shadow-lg text-orange-600 active:scale-95 transition-all border border-stone-100"
                >
                  <Volume2 size={20} />
                </button>
              </div>
            </header>

            <div className="relative flex flex-col items-center pb-8 px-6 pt-6">
              <div className="w-full max-w-md flex flex-col gap-6">
                
                {/* Subduction Zone SVG diagram */}
                <div className="w-full p-4 bg-stone-50 rounded-[32px] border border-stone-200 shadow-inner space-y-3">
                  <svg viewBox="0 0 350 200" className="w-full bg-sky-200 rounded-2xl border border-stone-200">
                    <rect width="350" height="90" fill="#bae6fd" />
                    <rect x="0" y="90" width="120" height="30" fill="#38bdf8" opacity="0.6"/>
                    
                    {/* Oceanic Plate slipping */}
                    <path d="M 0 110 L 150 160 L 250 200 L 0 200 Z" fill="#94a3b8" />
                    <text x="35" y="150" fill="white" className="font-black text-[9px] uppercase tracking-wider rotate-[18deg]">Lempeng Samudra</text>
                    
                    {/* Continental Plate */}
                    <path d="M 120 110 L 120 90 L 150 70 L 190 70 L 200 90 L 350 90 L 350 200 L 120 200 Z" fill="#b45309" />
                    <text x="210" y="110" fill="white" className="font-black text-[9px] uppercase tracking-wider">Lempeng Sumatra</text>

                    {/* Subduction Friction arrows */}
                    <path d="M 50 115 L 120 138" stroke="red" strokeWidth="3" fill="none" />
                    
                    {/* Magma melting chamber */}
                    <circle cx="210" cy="140" r="18" fill="red" className="animate-pulse" />
                    <path d="M 210 140 L 205 90" stroke="red" strokeWidth="4" strokeDasharray="3,3" fill="none" />
                    <text x="180" y="132" fill="yellow" className="font-black text-[8px] uppercase tracking-widest bg-stone-900 px-1 py-0.5 rounded leading-none">Dapur Magma</text>

                    {/* Mountain peak */}
                    <path d="M 180 90 L 210 50 L 240 90 Z" fill="#d97706" />
                    <text x="212" y="65" fill="red" className="font-mono text-[9px] font-bold">Toba</text>
                  </svg>
                  <div className="text-center">
                    <span className="text-[9px] font-mono font-bold text-stone-500 uppercase tracking-widest">ANATOMI DISIPASI PANAS SUBDUKSI</span>
                  </div>
                </div>

                {/* Tab Controller */}
                <div className="flex p-1.5 bg-stone-100 rounded-[32px] items-center">
                  <button 
                    onClick={() => setActiveTab('etno')}
                    className={`h-[35px] flex-1 rounded-[28px] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      activeTab === 'etno' ? 'bg-white text-orange-600 shadow-md' : 'text-stone-400'
                    }`}
                  >
                    <BookOpen size={14} />
                    Proses Bumi
                  </button>
                  <button 
                    onClick={() => setActiveTab('science')}
                    className={`h-[35px] flex-1 rounded-[28px] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      activeTab === 'science' ? 'bg-stone-900 text-orange-400 shadow-md' : 'text-stone-400'
                    }`}
                  >
                    <Zap size={14} />
                    Gas Ideal
                  </button>
                </div>

                <div className="bg-white rounded-[40px] shadow-xl border-2 border-stone-100 p-8 text-left">
                  <AnimatePresence mode="wait">
                    {activeTab === 'etno' ? (
                      <motion.div
                        key="etno"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-orange-600" />
                          <h3 className="text-[20px] font-black text-stone-900 tracking-tighter uppercase italic">1. Subduksi & Magma</h3>
                        </div>
                        <p className="text-stone-700 text-sm font-semibold leading-relaxed">
                          Lempeng Indo-Australia menyusup ke bawah Lempeng Eurasia di lepas pantai barat Sumatra. Panas ekstrem hasil gesekan mencairkan kerak bumi menjadi magma riolit kental yang bersiap menerjang penutup gunung.
                        </p>
                        <div className="pt-2 border-t border-stone-100">
                          <span className="text-[9px] font-black text-orange-600/80 uppercase tracking-wider">Hasil Batuan:</span>
                          <p className="text-[11px] font-bold text-stone-500 mt-0.5">Membeku membentuk <strong className="text-stone-850">Rhyolite Tuff</strong> (Batu Apung khas Samosir).</p>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="science"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-4 h-4 rounded-full bg-orange-500" />
                            <h3 className="text-[20px] font-black text-stone-900 tracking-tighter uppercase italic">2. Rumus Gas</h3>
                          </div>
                          <div className="bg-stone-900 px-3 py-1 rounded-xl">
                            <span className="font-mono text-orange-400 font-black text-xs">P.V = n.R.T</span>
                          </div>
                        </div>
                        <p className="text-stone-700 text-sm font-semibold leading-relaxed">
                          Magma kental memerangkap gelembung-gelembung gas vulkanik. Menurut konsep gas ideal, ketika volume ruang magma tetap konstan (V) sedangkan panas terus disuplai (T naik), tekanan gas (P) berkumpul berlipat ganda hingga penutup batuan jebol hancur!
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button 
                  onClick={() => setCurrentPage('joyful')}
                  className="w-full bg-stone-900 hover:bg-stone-850 text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-transform uppercase tracking-widest text-xs"
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
      {currentPage !== 'dashboard' && (
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
      )}
    </div>
  );
}
