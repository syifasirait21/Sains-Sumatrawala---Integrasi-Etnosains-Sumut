import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Leaf, 
  ArrowLeft, 
  Zap, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  RefreshCcw, 
  Award,
  Sun,
  Waves,
  Percent,
  Compass,
  Volume2,
  LayoutGrid,
  Heart,
  Lightbulb,
  Gamepad2,
  ShieldAlert,
  ChevronRight,
  Check
} from 'lucide-react';

interface PanggungHijauProps {
  onBack: () => void;
}

type SubPage = 'dashboard' | 'mindful' | 'meaningful' | 'joyful' | 'mitigasi';

export default function PanggungHijau({ onBack }: PanggungHijauProps) {
  const [currentPage, setCurrentPage] = useState<SubPage>(() => {
    const saved = localStorage.getItem('hijau_current_page');
    return (saved as SubPage) || 'dashboard';
  });

  useEffect(() => {
    localStorage.setItem('hijau_current_page', currentPage);
  }, [currentPage]);

  const [activeTab, setActiveTab] = useState<'sarulla' | 'asahan'>('sarulla');

  // Game states for Grid Balancer
  const [currentDay, setCurrentDay] = useState(1);
  const [geothermalAlloc, setGeothermalAlloc] = useState(40); // MW
  const [hydroAlloc, setHydroAlloc] = useState(40); // MW
  const [coalAlloc, setCoalAlloc] = useState(20); // MW
  const [pollutionCumulative, setPollutionCumulative] = useState(0);
  const [gameLog, setGameLog] = useState<string[]>([]);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [failReason, setFailReason] = useState('');

  const weatherScenarios = [
    { 
      day: 1, 
      label: "Kondisi Berawan Normal", 
      desc: "Sungai Asahan berarus normal. Kebutuhan listrik kota hari ini mencapai 100 MW.",
      demand: 100,
      hydroCap: 60,
      geoCap: 50,
      eventLog: "Hari 1 dimulai. Cukupi kebutuhan listrik sebesar 100 MW!"
    },
    { 
      day: 2, 
      label: "Kemarau Panjang (Musim Kering)", 
      desc: "Debit air Danau Toba menyusut tajam! Kapasitas maksimal PLTA Asahan dipotong 50%. Kebutuhan: 100 MW.",
      demand: 100,
      hydroCap: 30,
      geoCap: 50,
      eventLog: "Kemarau landa air Asahan. Batasi ketergantungan pada hidro!"
    },
    { 
      day: 3, 
      label: "Curah Hujan Ekstrem (Debit Melimpah)", 
      desc: "Hujan deras mengguyur hulu. Aliran Asahan melonjak ke 80 MW! Kebutuhan kota: 110 MW.",
      demand: 110,
      hydroCap: 80,
      geoCap: 50,
      eventLog: "Hujan deras melimpah! Maksimalkan PLTA ramah karbon ini!"
    },
    { 
      day: 4, 
      label: "Beban Puncak (Pesta Rakyat Danau Toba)", 
      desc: "Festival rakyat memakan daya masif! Kebutuhan melonjak ke 140 MW. Kapasitas suplai normal.",
      demand: 140,
      hydroCap: 60,
      geoCap: 50,
      eventLog: "Beban puncak pesta rakyat! Siapkan pasokan daya ekstra!"
    },
    { 
      day: 5, 
      label: "Anomali Uap Sarulla (Geotermal Surge)", 
      desc: "Sembaluran magma dangkalan Sarulla meningkat aman! Kapasitas melonjak ke 70 MW. Kebutuhan: 120 MW.",
      demand: 120,
      hydroCap: 50,
      geoCap: 70,
      eventLog: "Sarulla mendapat dorongan alami! Gunakan energi bumi bersih!"
    }
  ];

  const currentScenario = weatherScenarios[currentDay - 1] || weatherScenarios[0];

  // Mitigasi states for Green
  interface MitigationItem {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }

  const [initialMitigationItems] = useState<MitigationItem[]>([
    { 
      id: '1', 
      text: "Mematikan lampu, AC, & peralatan elektronik saat tidak terpakai", 
      isCorrect: true, 
      explanation: "Menghemat karbon emisi harian & menjaga kestabilan sekring listrik rumah." 
    },
    { 
      id: '2', 
      text: "Menyalakan genset bertenaga solar sepanjang malam untuk mendinginkan garasi", 
      isCorrect: false, 
      explanation: "Sangat buruk! Pembakaran solar melontarkan jelaga beracun & membuang fosil secara cuma-cuma." 
    },
    { 
      id: '3', 
      text: "Mencabut kepala charger dari stopkontak setelah selesai pengisian daya", 
      isCorrect: true, 
      explanation: "Mencegah fenomena 'Vampire Power' arus hantu yang diam-diam tetap mencuri konsumsi listrik." 
    },
    { 
      id: '4', 
      text: "Membiarkan keran wastafel air mengalir deras saat menyikat gigi gratis", 
      isCorrect: false, 
      explanation: "Pemborosan air menuntut kincir pompa sedot berputar konstan, menghabiskan draf daya listrik." 
    },
    { 
      id: '5', 
      text: "Memaksimalkan sirkulasi udara jendela terbuka & menanam pepohonan teduh", 
      isCorrect: true, 
      explanation: "Menurunkan kelembaban ruangan secara alami, mengurangi ketergantungan pada boros daya AC." 
    }
  ]);

  const [mitigationLeft, setMitigationLeft] = useState<MitigationItem[]>(() => {
    const saved = localStorage.getItem('hijau_mitigation_left');
    return saved ? JSON.parse(saved) : initialMitigationItems;
  });
  const [mitigationCorrectZone, setMitigationCorrectZone] = useState<MitigationItem[]>(() => {
    const saved = localStorage.getItem('hijau_mitigation_correct');
    return saved ? JSON.parse(saved) : [];
  });
  const [mitigationAvoidZone, setMitigationAvoidZone] = useState<MitigationItem[]>(() => {
    const saved = localStorage.getItem('hijau_mitigation_avoid');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFeedback, setShowFeedback] = useState<boolean>(() => {
    return localStorage.getItem('hijau_mitigation_show_feedback') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('hijau_mitigation_left', JSON.stringify(mitigationLeft));
    localStorage.setItem('hijau_mitigation_correct', JSON.stringify(mitigationCorrectZone));
    localStorage.setItem('hijau_mitigation_avoid', JSON.stringify(mitigationAvoidZone));
    localStorage.setItem('hijau_mitigation_show_feedback', showFeedback.toString());
  }, [mitigationLeft, mitigationCorrectZone, mitigationAvoidZone, showFeedback]);

  const audioRefs = useRef({
    success: new Audio('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3'),
    failure: new Audio('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3'),
    knock: new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3')
  });

  useEffect(() => {
    audioRefs.current.success.volume = 0.4;
    audioRefs.current.failure.volume = 0.4;
    audioRefs.current.knock.volume = 0.3;
  }, []);

  const playSound = (type: 'success' | 'failure' | 'knock') => {
    try {
      const audio = audioRefs.current[type];
      audio.currentTime = 0;
      audio.play().catch(() => {});
    } catch {}
  };

  const handleNextDay = () => {
    const totalAllocated = geothermalAlloc + hydroAlloc + coalAlloc;
    const demand = currentScenario.demand;
    
    if (totalAllocated !== demand) {
      playSound('failure');
      setGameStatus('lost');
      setFailReason(`Blackout / Surutan Daya! Total alokasi (${totalAllocated} MW) tidak cocok dengan kebutuhan kota (${demand} MW).`);
      return;
    }

    if (hydroAlloc > currentScenario.hydroCap) {
      playSound('failure');
      setGameStatus('lost');
      setFailReason(`PLTA Overload! Alokasi Hidro (${hydroAlloc} MW) melampaui batas arus cuaca hari ini (${currentScenario.hydroCap} MW).`);
      return;
    }

    if (geothermalAlloc > currentScenario.geoCap) {
      playSound('failure');
      setGameStatus('lost');
      setFailReason(`Katup Sarulla Retak! Alokasi Geotermal (${geothermalAlloc} MW) melebihi kapasitas suplai uap aman (${currentScenario.geoCap} MW).`);
      return;
    }

    const dayPollution = coalAlloc * 0.45;
    const newCumulative = pollutionCumulative + dayPollution;
    setPollutionCumulative(newCumulative);

    if (newCumulative > 50) {
      playSound('failure');
      setGameStatus('lost');
      setFailReason(`Bencana Kabut Asap! Akumulasi emisi batu bara melebihi ambang bahaya (>50%, Milik Anda: ${newCumulative.toFixed(1)}%). Paru-paru kota tercemar.`);
      return;
    }

    playSound('knock');
    const logText = `Hari ${currentDay} Berhasil! Masalah ${demand} MW selesai. Polusi hari ini: +${dayPollution.toFixed(1)}%. Total akumulasi polusi: ${newCumulative.toFixed(1)}%`;
    setGameLog(prev => [...prev, logText]);

    if (currentDay < 5) {
      setCurrentDay(prev => prev + 1);
      const nextDemand = weatherScenarios[currentDay].demand;
      const part = Math.floor(nextDemand / 3);
      setGeothermalAlloc(part);
      setHydroAlloc(part);
      setCoalAlloc(nextDemand - part * 2);
    } else {
      playSound('success');
      setGameStatus('won');
    }
  };

  const resetGame = () => {
    playSound('knock');
    setCurrentDay(1);
    setGeothermalAlloc(40);
    setHydroAlloc(40);
    setCoalAlloc(20);
    setPollutionCumulative(0);
    setGameLog([]);
    setGameStatus('playing');
    setFailReason('');
  };

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
            className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-8 pb-20 relative text-left"
          >
            {/* Ambient Background animation or style */}
            <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute opacity-[0.03] border border-emerald-500 w-40 h-40 rounded-[40px] rotate-12"
                  style={{ top: `${i * 20}%`, left: `${i % 2 === 0 ? '-10%' : '60%'}` }}
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
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-emerald-500/5 rounded-full blur-3xl -z-10" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Energi Terbarukan</p>
              <h1 className="text-4xl font-black text-stone-900 tracking-tighter leading-none italic">
                Panggung <br/>
                <span className="text-emerald-600 uppercase">Hijau Sumatra</span>
              </h1>
              <div className="flex items-center gap-2 mt-4">
                <div className="h-1 w-12 bg-emerald-400 rounded-full" />
                <p className="text-stone-500 text-[11px] font-bold uppercase tracking-widest">Pilih Jalur Belajar Energi</p>
              </div>
            </header>

            <div className="grid grid-cols-2 gap-4">
              {/* MINDFUL CARD */}
              <motion.button
                whileHover={{ y: -4, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setCurrentPage('mindful')}
                className="group relative flex flex-col items-start p-5 bg-white rounded-[32px] border border-stone-100 text-left overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-200 col-span-2"
              >
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                  <Heart size={100} />
                </div>
                <div className="bg-emerald-600 text-white p-2.5 rounded-2xl mb-4 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <Heart size={20} />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-black tracking-widest text-stone-400">SUMATRA BERSIH</span>
                  <h3 className="font-black text-stone-850 text-xl tracking-tight leading-tight mt-0.5">Mindful: Transisi Bersih</h3>
                  <p className="text-stone-500 font-bold text-[11px] leading-relaxed mt-1 pr-6">Pahami urgensi mengurangi polusi karbon & pelesatan iklim mikro danau.</p>
                </div>
              </motion.button>

              {/* MEANINGFUL CARD */}
              <motion.button
                whileHover={{ y: -4, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setCurrentPage('meaningful')}
                className="group relative flex flex-col items-start p-5 bg-white rounded-[32px] border border-stone-100 text-left overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-200 col-span-1"
              >
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                  <Lightbulb size={60} />
                </div>
                <div className="bg-emerald-500 text-stone-900 p-2.5 rounded-2xl mb-4 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <Lightbulb size={20} />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-black tracking-widest text-stone-400">FISIKA TURBIN</span>
                  <h3 className="font-black text-stone-850 text-base tracking-tight leading-tight mt-0.5">Meaningful</h3>
                  <p className="text-stone-500 font-bold text-[9px] mt-0.5 line-clamp-2">Sains Hukum FaradayPLTA & Geotermal Sarulla.</p>
                </div>
              </motion.button>

              {/* JOYFUL CARD */}
              <motion.button
                whileHover={{ y: -4, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setCurrentPage('joyful')}
                className="group relative flex flex-col items-start p-5 bg-white rounded-[32px] border border-stone-100 text-left overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-200 col-span-1"
              >
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                  <Gamepad2 size={60} />
                </div>
                <div className="bg-stone-850 text-white p-2.5 rounded-2xl mb-4 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <Gamepad2 size={20} />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-black tracking-widest text-stone-400">GRID BALANCER</span>
                  <h3 className="font-black text-stone-850 text-base tracking-tight leading-tight mt-0.5">Joyful</h3>
                  <p className="text-stone-500 font-bold text-[9px] mt-0.5 line-clamp-2">Atur kincir PLTA & uap bumi untuk beban puncak kota.</p>
                </div>
              </motion.button>

              {/* MITIGASI CARD */}
              <motion.button
                whileHover={{ y: -4, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setCurrentPage('mitigasi')}
                className="group relative flex flex-col items-start p-5 bg-white rounded-[32px] border border-stone-100 text-left overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-200 col-span-2"
              >
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                  <ShieldAlert size={100} />
                </div>
                <div className="bg-emerald-700 text-white p-2.5 rounded-2xl mb-4 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-black tracking-widest text-stone-400">HEMAT LISTRIK PINTAR</span>
                  <h3 className="font-black text-stone-850 text-xl tracking-tight leading-tight mt-0.5">Mitigasi: Hemat Energi</h3>
                  <p className="text-stone-500 font-bold text-[11px] leading-relaxed mt-1 pr-6">Pilah kebiasaan sustainable sehari-hari untuk meredam pemanasan global.</p>
                </div>
              </motion.button>
            </div>

            <div className="bg-stone-900 p-6 rounded-[32px] shadow-2xl relative overflow-hidden group mt-4">
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl -mr-12 -mt-12" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-emerald-500/20 rounded-2xl flex items-center justify-center text-emerald-450 shrink-0">
                  <Leaf size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-white font-black text-xs tracking-tight italic">"Transisi energi menjaga warisan danau agar tetap hijau abadi."</p>
                  <p className="text-stone-400 text-[8px] font-bold uppercase tracking-widest">- Lembaga Ekologi Sumatra</p>
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
                <span className="text-emerald-600 font-black text-[10px] uppercase tracking-[0.2em] italic">Transisi Hijau</span>
              </div>
              <h1 className="text-3xl font-black text-stone-900 tracking-tighter leading-none uppercase italic">Bumi Meminta <br />Listrik Bersih</h1>
            </header>

            <div className="relative aspect-video bg-stone-900 rounded-[32px] overflow-hidden shadow-xl border-4 border-white flex flex-col items-center justify-center p-6 text-center group">
              <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-stone-900 to-[#0e1713] opacity-95 z-0" />
              <div className="absolute inset-0 pointer-events-none opacity-40">
                {[...Array(12)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: ['110%', '-10%'],
                      opacity: [0, 0.8, 0.8, 0],
                      scale: [0.8, 1.2, 0.6]
                    }}
                    transition={{
                      duration: 5 + Math.random() * 4,
                      repeat: Infinity,
                      delay: i * 0.4,
                      ease: "easeOut"
                    }}
                    className="absolute w-2.5 h-2.5 bg-emerald-400 rounded-full blur-[1px]"
                    style={{ left: `${Math.random() * 100}%` }}
                  />
                ))}
              </div>

              <div className="space-y-2 z-10">
                <Leaf size={40} className="text-emerald-400 mx-auto animate-bounce" />
                <p className="font-black text-white text-base tracking-tight uppercase italic leading-none">Sumatra Hebat Mandiri</p>
                <p className="text-[10px] font-semibold text-stone-300 max-w-[270px] mx-auto leading-normal">
                  Sarulla menyalurkan uap geotermal dangkalan, sedangkan PLTA Asahan memanfaatkan deras air terjun tersingkap.
                </p>
              </div>

              <span className="absolute bottom-3 right-4 text-[8px] font-mono text-stone-500 uppercase tracking-widest z-10">ECO TRANSITION</span>
            </div>

            <div className="space-y-4 text-stone-800 leading-relaxed text-sm font-medium">
              <p>
                Asap pekat dari cerobong pembakaran batu bara melepaskan jutaan ton karbon dioksida yang memerangkap panas matahari, membuat danau menguap berlebih & iklim mikro Sumut tidak seimbang.
              </p>
              <div className="bg-emerald-500/5 p-5 rounded-[24px] border-2 border-emerald-500/10 border-dashed">
                <p className="italic font-black text-emerald-700 uppercase tracking-tight text-xs">
                  "Satu-satunya jalan mengembalikan kesegaran rimba adalah mematikan tungku batu bara secara berkala & mengandalkan dinamika generator turbin bersih Sumatra."
                </p>
              </div>
              <p>
                Mari kita ulas dasar-dasar ilmu mekanika alam pembangkit raksasa ini agar paham cara kerjanya!
              </p>
            </div>

            <button 
              onClick={() => setCurrentPage('meaningful')}
              className="w-full bg-emerald-600 text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-transform uppercase tracking-widest text-xs border-b-4 border-emerald-950"
            >
              Mulai Eksplorasi Sains
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
            className="flex-1 overflow-y-auto no-scrollbar pb-20 text-left"
          >
            <header className="pt-4 pb-3 text-center relative border-b border-stone-200/50">
              <h2 className="text-xl font-black text-stone-900 tracking-tighter uppercase italic">
                Sains Generator Hijau<br/>
                <span className="text-xs font-bold block text-emerald-600 tracking-widest">(Prinsip Konversi)</span>
              </h2>
              <div className="absolute top-4 right-6">
                <button 
                  onClick={() => playSound('knock')} 
                  className="bg-white p-2.5 rounded-full shadow-lg text-emerald-600 active:scale-95 transition-all border border-stone-100"
                >
                  <Volume2 size={20} />
                </button>
              </div>
            </header>

            <div className="relative flex flex-col items-center pb-8 px-6 pt-6">
              <div className="w-full max-w-md flex flex-col gap-6">
                
                {/* Simulated Eco Station visual graphic */}
                <div className="w-full p-4 bg-stone-50 rounded-[32px] border border-stone-200 shadow-inner flex flex-col items-center gap-3">
                  <div className="w-full h-32 bg-sky-200 rounded-2xl relative overflow-hidden border border-stone-200 flex items-end">
                    {/* Air PLTA Asahan flows */}
                    <div className="absolute inset-0 bg-sky-100 opacity-60 z-0" />
                    <svg viewBox="0 0 100 40" className="w-full h-12 fill-blue-500 opacity-80 z-10 animate-pulse">
                      <path d="M0 20 Q 25 15, 50 20 T 100 20 L 100 40 L 0 40 Z" />
                    </svg>
                    {/* Spinning Turbine wheel */}
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                      className="absolute right-8 bottom-6 w-12 h-12 rounded-full border-4 border-dashed border-emerald-600"
                    />
                    <span className="absolute bottom-1 right-2 text-[8px] font-mono text-emerald-700 italic font-black uppercase">Turbine Active</span>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-stone-500 uppercase tracking-widest text-center">SKEMA ROTOR INDUKSI PLTA ASAHAN</span>
                </div>

                {/* Tab selector */}
                <div className="flex p-1.5 bg-stone-100 rounded-[32px] items-center">
                  <button 
                    onClick={() => setActiveTab('sarulla')}
                    className={`h-[35px] flex-1 rounded-[28px] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      activeTab === 'sarulla' ? 'bg-white text-emerald-600 shadow-md' : 'text-stone-400'
                    }`}
                  >
                    <Sun size={14} />
                    Panas Sarulla
                  </button>
                  <button 
                    onClick={() => setActiveTab('asahan')}
                    className={`h-[35px] flex-1 rounded-[28px] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      activeTab === 'asahan' ? 'bg-stone-900 text-emerald-400 shadow-md' : 'text-stone-400'
                    }`}
                  >
                    <Waves size={14} />
                    Air Asahan
                  </button>
                </div>

                <div className="bg-white rounded-[40px] shadow-xl border-2 border-stone-100 p-8">
                  <AnimatePresence mode="wait">
                    {activeTab === 'sarulla' ? (
                      <motion.div
                        key="sarulla"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-emerald-600" />
                          <h3 className="text-[20px] font-black text-stone-900 tracking-tighter uppercase italic">PLTP Sarulla (Bumi)</h3>
                        </div>
                        <p className="text-stone-700 text-sm font-semibold leading-relaxed">
                          PLTP Sarulla menyerap uap bertekanan tinggi dangkalan kawah vulkanis dangkalan Tapanuli Utara. Tekanan uap murni dialirkan langsung memutar turbin silinder, memeras energi geothermal alami tanpa sisa asap hitam.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="asahan"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-blue-500" />
                          <h3 className="text-[20px] font-black text-stone-900 tracking-tighter uppercase italic">PLTA Asahan (Air)</h3>
                        </div>
                        <p className="text-stone-700 text-sm font-semibold leading-relaxed">
                          Menggunakan prinsip <strong className="text-blue-600 font-black">Hukum Induksi Faraday</strong>. Aliran tebing Sungai Asahan memutar rotor roda magnet dalam lilitan tembaga konduktor raksasa, mengubah total energi kinetik hidrolik menjadi sirkulasi megawatt listrik rumah tangga.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button 
                  onClick={() => setCurrentPage('joyful')}
                  className="w-full bg-stone-900 hover:bg-stone-850 text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-transform uppercase tracking-widest text-xs"
                >
                  Buka Pengontrol Grid Listrik
                  <Zap size={14} className="text-yellow-400 animate-pulse" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- 4. JOYFUL (GRID BALANCER CHALLENGE) --- */}
        {currentPage === 'joyful' && (
          <motion.div 
            key="joyful"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 pb-20 flex flex-col items-center"
          >
            {/* Status bar */}
            <div className="flex justify-between items-center w-full px-1">
              <span className="text-[9px] font-black text-stone-500 uppercase tracking-widest">
                GRID LEVEL: <span className="text-stone-900 font-extrabold">HARI {currentDay} / 5</span>
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[8px] font-bold text-stone-400">AKUMULASI EMISI CO₂:</span>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${pollutionCumulative > 35 ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-700'}`}>
                  {pollutionCumulative.toFixed(1)}% / 50%
                </span>
              </div>
            </div>

            {gameStatus === 'playing' ? (
              <div className="w-full space-y-6 text-left">
                {/* Weather Card banner */}
                <div className="bg-emerald-900 text-white rounded-[28px] p-6 shadow-xl relative overflow-hidden">
                  <div className="space-y-1">
                    <span className="text-[8px] font-black tracking-widest text-[#a7f3d0] bg-white/10 px-2 py-0.5 rounded-full uppercase">
                      {currentScenario.label}
                    </span>
                    <h3 className="text-xl font-black italic tracking-tighter leading-none mt-1">Hari {currentScenario.day}: {currentScenario.demand} Megawatt</h3>
                    <p className="text-white/80 text-[10px] font-medium leading-relaxed mt-1">
                      {currentScenario.desc}
                    </p>
                  </div>
                </div>

                {/* Energy Sliders Panel */}
                <div className="bg-white p-5 rounded-[32px] border border-stone-200/50 shadow-md space-y-4">
                  <h4 className="text-[10px] font-black uppercase text-stone-400 tracking-wider">Alokasikan Sumber Energi</h4>
                  
                  {/* Heat/Geothermal */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-xs text-stone-700">
                      <span className="flex items-center gap-1 italic font-semibold">
                        <TrendingUp size={14} className="text-emerald-600" /> Panas Bumi (Sarulla)
                      </span>
                      <span className="font-mono text-emerald-600 font-extrabold">{geothermalAlloc} MW</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max={currentScenario.geoCap} 
                      value={geothermalAlloc} 
                      onChange={(e) => setGeothermalAlloc(parseInt(e.target.value))}
                      className="w-full accent-emerald-600 cursor-pointer"
                    />
                  </div>

                  {/* Hydropower */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-xs text-stone-700">
                      <span className="flex items-center gap-1 italic font-semibold">
                        <Waves size={14} className="text-blue-500" /> Hidro (Asahan)
                      </span>
                      <span className="font-mono text-blue-600 font-extrabold">{hydroAlloc} MW</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max={currentScenario.hydroCap} 
                      value={hydroAlloc} 
                      onChange={(e) => setHydroAlloc(parseInt(e.target.value))}
                      className="w-full accent-blue-650 cursor-pointer"
                    />
                  </div>

                  {/* Fosil/Coal */}
                  <div className="space-y-1">
                    <div className="flex justify-between font-bold text-xs text-stone-700">
                      <span className="flex items-center gap-1 italic font-semibold">
                        <Zap size={14} className="text-red-500" /> Batu Bara (Generator Fosil)
                      </span>
                      <span className="font-mono text-red-500 font-extrabold">{coalAlloc} MW</span>
                    </div>
                    <input 
                      type="range" 
                      min="0" 
                      max="140" 
                      value={coalAlloc} 
                      onChange={(e) => setCoalAlloc(parseInt(e.target.value))}
                      className="w-full accent-red-650 cursor-pointer"
                    />
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      <p className="text-[8px] font-black uppercase text-stone-400">Total Output</p>
                      <p className="font-mono text-lg font-extrabold text-stone-900 leading-none mt-1">
                        {geothermalAlloc + hydroAlloc + coalAlloc} MW
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[8px] font-black uppercase text-stone-400">Target Kota</p>
                      <p className="font-mono text-lg font-extrabold text-[#721010] leading-none mt-1">
                        {currentScenario.demand} MW
                      </p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleNextDay}
                  className={`w-full py-4.5 rounded-[24px] font-black text-xs tracking-wider uppercase transition-all flex items-center justify-center ${
                    geothermalAlloc + hydroAlloc + coalAlloc === currentScenario.demand
                      ? 'bg-stone-900 text-white shadow-md'
                      : 'bg-stone-200 text-stone-400 cursor-not-allowed'
                  }`}
                >
                  Kunci Konfigurasi Hari Kepler-{currentDay}
                </button>
              </div>
            ) : gameStatus === 'won' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-[40px] border-4 border-emerald-500 text-center space-y-4 shadow-2xl w-full"
              >
                <div className="w-16 h-16 bg-emerald-100 rounded-full mx-auto flex items-center justify-center text-emerald-600 shadow-inner">
                  <CheckCircle2 size={36} />
                </div>
                <h3 className="text-2xl font-black text-stone-900 uppercase italic">Pioneer Energi Hijau</h3>
                <p className="text-xs text-stone-500 font-bold px-4 pt-1 leading-snug">
                  Hebat! Seluruh 5 hari terselesaikan dengan pembagian optimal daya ramah emisi tanpa padam.
                </p>
                <button onClick={resetGame} className="w-full py-3 bg-emerald-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl">
                  Reboot Simulasi
                </button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-[40px] border-4 border-red-500 text-center space-y-4 shadow-2xl w-full"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center text-red-600 shadow-inner">
                  <XCircle size={36} />
                </div>
                <h3 className="text-2xl font-black text-stone-900 uppercase italic">Grid Balancer Roboh</h3>
                <p className="text-xs text-stone-500 font-bold px-4 leading-relaxed">
                  {failReason}
                </p>
                <button onClick={resetGame} className="w-full py-3 bg-red-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl">
                  Mulai Ulang Alokasi
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* --- 5. MITIGASI (SUSTAINABLE LIFESTYLE SORTING) --- */}
        {currentPage === 'mitigasi' && (
          <motion.div 
            key="mitigasi"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 pb-20 text-left"
          >
            <div className="space-y-1">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded-full uppercase tracking-widest">MITIGASI KRISIS ENERGI</span>
              <h2 className="text-3xl font-black text-stone-900 tracking-tighter uppercase italic text-emerald-800">Hemat Energi Pintar</h2>
              <p className="text-[10px] text-stone-500 font-bold max-w-xs uppercase tracking-wide leading-tight">Pilah kebiasaan sehari-hari untuk menjaga kelestarian & meredam pemanasan!</p>
            </div>

            {mitigationLeft.length > 0 ? (
              <div className="space-y-4">
                <p className="text-[9px] font-black uppercase text-stone-400 tracking-widest">Tindakan Selanjutnya:</p>
                <motion.div 
                  layout
                  className="p-5 bg-white rounded-3xl border-2 border-stone-100 shadow-xl flex flex-col gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0">
                      <Leaf size={20} />
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
                      <span className="text-[9px] font-black uppercase tracking-widest">Harus Dihindari</span>
                    </button>
                  </div>
                </motion.div>
              </div>
            ) : (
              <div className="p-6 bg-emerald-50 rounded-[32px] border-2 border-dashed border-emerald-200 text-center space-y-3">
                <Check className="text-emerald-600 mx-auto" size={32} />
                <h4 className="font-sans font-black text-emerald-800 uppercase text-xs">Semua Data Terpilah</h4>
                <p className="text-[10px] text-stone-500 font-bold">Tekan evaluasi jawaban untuk mengoreksi ketepatan pembagian rute hemat daya!</p>
              </div>
            )}

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

            <div className="space-y-2">
              {mitigationLeft.length === 0 && (
                <button
                  onClick={checkMitigationAnswers}
                  className="w-full py-4 bg-stone-900 hover:bg-stone-850 text-white font-black text-xs uppercase tracking-widest rounded-[24px] shadow-md transition-transform"
                >
                  Evaluasi Jawaban
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
                  isActive ? 'text-emerald-600' : 'text-stone-400'
                }`}
              >
                <Icon size={18} className={isActive ? 'fill-emerald-500/10' : ''} />
                <span className="text-[9px] mt-1 font-bold">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="hijau-nav-indicator"
                    className="absolute bottom-0 w-8 h-1 bg-emerald-600 rounded-t-full"
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
