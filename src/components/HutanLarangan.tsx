import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Trees, 
  ArrowLeft, 
  Zap, 
  CheckCircle2, 
  XCircle, 
  RefreshCcw, 
  Award,
  Compass,
  Heart,
  Volume2,
  LayoutGrid,
  Lightbulb,
  Gamepad2,
  ShieldAlert,
  ChevronRight,
  BookOpen,
  Check
} from 'lucide-react';

interface HutanLaranganProps {
  onBack: () => void;
}

type SubPage = 'dashboard' | 'mindful' | 'meaningful' | 'joyful' | 'mitigasi';

export default function HutanLarangan({ onBack }: HutanLaranganProps) {
  const [currentPage, setCurrentPage] = useState<SubPage>(() => {
    const saved = localStorage.getItem('harangan_current_page');
    return (saved as SubPage) || 'dashboard';
  });

  useEffect(() => {
    localStorage.setItem('harangan_current_page', currentPage);
  }, [currentPage]);

  const [activeTab, setActiveTab] = useState<'zonasi' | 'hidrologi'>('zonasi');
  const [meaningfulTab, setMeaningfulTab] = useState<'A' | 'B'>('A');
  const [hasRoots, setHasRoots] = useState<boolean>(true);
  const [pullForce, setPullForce] = useState<number>(0);
  const [selectedArea, setSelectedArea] = useState<'gundul' | 'harangan'>('harangan');

  // Simulation states
  const [currentWave, setCurrentWave] = useState(1);
  const [forestHealth, setForestHealth] = useState(100);
  const [gameStatus, setGameStatus] = useState<'playing' | 'won' | 'lost'>('playing');
  const [waveFeedback, setWaveFeedback] = useState<string | null>(null);
  const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);

  const threatWaves = [
    {
      wave: 1,
      threatTitle: "Pembalakan Liar (Penebang Gelap)",
      threatDesc: "Sekelompok pembalak gelap berupaya menebang pohon beringin raksasa di dekat mata air keramat dusun.",
      options: [
        {
          id: "chem",
          text: "Semprot wilayah dengan herbisida kimia kuat agar kayu pohon layu & mati",
          isCorrect: false,
          explanation: "Salah! Minyak kimia mematikan merembes ke air tanah, meracuni seluruh penduduk desa & ekosistem sungai."
        },
        {
          id: "custom",
          text: "Pasang 'Saring' (Tanda Larangan Adat) & Mobilisasi Patroli Adat",
          isCorrect: true,
          explanation: "Benar! Menancapkan tanda 'Saring' (hukum customary Batak) membuat masyarakat bersatu menghentikan penebang melintasi batas."
        },
        {
          id: "ignore",
          text: "Biarkan mereka mengambil 2-3 pohon saja asal tidak habis terjual",
          isCorrect: false,
          explanation: "Salah! Sekali pohon pelindung air roboh, tanah longsor akan langsung menyumbat mata air alami."
        }
      ]
    },
    {
      wave: 2,
      threatTitle: "Wabah Hama Pengisap Kantong Semar",
      threatDesc: "Hama mengisap Kantong Semar endemik di rawa Tapanuli, memicu pembusukan sel vegetasi dasar.",
      options: [
        {
          id: "pesticide",
          text: "Semprot pestisida kimia berpembasmi tinggi secara merata",
          isCorrect: false,
          explanation: "Salah! Pestisida membunuh lebah penyerbuk alami & meracuni fauna sensitif seperti Orangutan Tapanuli."
        },
        {
          id: "predator",
          text: "Lepaskan kepik predator (Pengendali Biologis Alami) pembilas hama",
          isCorrect: true,
          explanation: "Benar! Teknik etnosains menggunakan pengendali alami menyeimbangkan kembali rantai makanan rimbun tanpa racun."
        },
        {
          id: "cut",
          text: "Bakar seluruh vegetasi bawah agar hama mati terpanggang",
          isCorrect: false,
          explanation: "Salah! Ini memicu kebakaran hutan sekunder hebat yang membakar ratusan jenis anggrek langka."
        }
      ]
    },
    {
      wave: 3,
      threatTitle: "Penurunan Drastis Debit Air Tanah",
      threatDesc: "Sumur warga di batas pargadungan mengering karena hilangnya dangkalan penyimpanan pori tanah.",
      options: [
        {
          id: "bore",
          text: "Lakukan pengeboran tanah dalam sedalam 200m menyedot paksa sisa air",
          isCorrect: false,
          explanation: "Salah! Pengeboran membabi buta membongkar pori tanah secara kasar memicu retakan ambles seketika."
        },
        {
          id: "vetiver",
          text: "Tanam rumput Vetiver (Akar Rumpun) & rumpun Bambu di sekitar bantaran",
          isCorrect: true,
          explanation: "Benar! Etnosains membuktikan akar Bambu & Vetiver mengikat anyaman partikel tanah, menyegel kantung resapan air bawah tanah."
        },
        {
          id: "cement",
          text: "Lapisi seluruh tepian parit tebing sungai dengan beton semen kaku",
          isCorrect: false,
          explanation: "Salah! Menyemen aliran air mematikan pori-pori resapan alami tanah, memicu banjir kilat dangkalan lereng."
        }
      ]
    },
    {
      wave: 4,
      threatTitle: "Risiko Kebakaran Gesekan Kemarau",
      threatDesc: "Ranting kering menumpuk berlebih di tepian pargadungan, mengancam tersulut api gesekan angin panas.",
      options: [
        {
          id: "sand",
          text: "Buat 'Sekat Bakar Alami' (Parit Basah/Wet Bioswales) di parit batas zona",
          isCorrect: true,
          explanation: "Benar! Sekat bakar basah menghambat laju rambatan bara api agar tidak masuk membakar inti terdalam rimba raya."
        },
        {
          id: "water",
          text: "Tunggu hujan turun dari angkasa tanpa melakukan rekayasa fisik apapun",
          isCorrect: false,
          explanation: "Salah! Membiarkan tumpukan biomassa kering berlipat ganda berbahaya saat tiupan angin gurundalu menyapu rimba."
        },
        {
          id: "blow",
          text: "Gunakan kipas angin bertenaga diesel raksasa meniup panas keluar",
          isCorrect: false,
          explanation: "Salah! Embusan angin kencang kipas menyuntik pasokan oksigen masif, membuat percikan bara meledak kobaran."
        }
      ]
    }
  ];

  const currentScenario = threatWaves[currentWave - 1] || threatWaves[0];

  // Mitigasi sorting state
  interface MitigationItem {
    id: string;
    text: string;
    isCorrect: boolean;
    explanation: string;
  }

  const [initialMitigationItems] = useState<MitigationItem[]>([
    { 
      id: '1', 
      text: "Menanam rumput Vetiver & Bambu di lereng curam sekitar hulu mata air", 
      isCorrect: true, 
      explanation: "Akar rumpun mengikat partikel remah dangkalan tebing, menyerap surplus air & mencegah longsor lereng." 
    },
    { 
      id: '2', 
      text: "Membakar rumput & semak belukar tumpangsari agar lahan bersih dengan cepat", 
      isCorrect: false, 
      explanation: "Sangat keliru! Api mudah menjalar tidak terkontrol ditiup angin kemarau, menyapu habitat hayati." 
    },
    { 
      id: '3', 
      text: "Melaporkan penebangan liar di batas zona Harangan kepada tetua hukum adat setempat", 
      isCorrect: true, 
      explanation: "Mobilisasi sosial cepat menjamin penegakan sanksi denda adat yang teruji menutup celah kerusakan." 
    },
    { 
      id: '4', 
      text: "Menyemprotkan pestisida kimia dosis pekat secara merata untuk membunuh ulat buah", 
      isCorrect: false, 
      explanation: "Salah! Racun mencemari dangkalan rawa gambut, mematikan rantai makanan tapanuli & lebah madu alami." 
    },
    { 
      id: '5', 
      text: "Menghormati tanda larangan adat 'Saring' demi kelestarian sirkulasi rimba tutupan", 
      isCorrect: true, 
      explanation: "Kepatuhan sosial adat merupakan tulang punggung keberhasilan konservasi ekologi jangka panjang." 
    }
  ]);

  const [mitigationLeft, setMitigationLeft] = useState<MitigationItem[]>(() => {
    const saved = localStorage.getItem('harangan_mitigation_left');
    return saved ? JSON.parse(saved) : initialMitigationItems;
  });
  const [mitigationCorrectZone, setMitigationCorrectZone] = useState<MitigationItem[]>(() => {
    const saved = localStorage.getItem('harangan_mitigation_correct');
    return saved ? JSON.parse(saved) : [];
  });
  const [mitigationAvoidZone, setMitigationAvoidZone] = useState<MitigationItem[]>(() => {
    const saved = localStorage.getItem('harangan_mitigation_avoid');
    return saved ? JSON.parse(saved) : [];
  });
  const [showFeedback, setShowFeedback] = useState<boolean>(() => {
    return localStorage.getItem('harangan_mitigation_show_feedback') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('harangan_mitigation_left', JSON.stringify(mitigationLeft));
    localStorage.setItem('harangan_mitigation_correct', JSON.stringify(mitigationCorrectZone));
    localStorage.setItem('harangan_mitigation_avoid', JSON.stringify(mitigationAvoidZone));
    localStorage.setItem('harangan_mitigation_show_feedback', showFeedback.toString());
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

  const handleSelectOption = (option: typeof currentScenario.options[0]) => {
    if (waveFeedback) return;

    setIsAnswerCorrect(option.isCorrect);
    setWaveFeedback(option.explanation);

    if (option.isCorrect) {
      playSound('success');
      setForestHealth(prev => Math.min(100, prev + 10));
    } else {
      playSound('failure');
      setForestHealth(prev => Math.max(0, prev - 25));
    }
  };

  const handleNextWave = () => {
    if (forestHealth <= 40) {
      setGameStatus('lost');
      return;
    }

    setWaveFeedback(null);
    setIsAnswerCorrect(null);

    if (currentWave < 4) {
      setCurrentWave(prev => prev + 1);
    } else {
      setGameStatus('won');
      playSound('success');
    }
  };

  const resetGame = () => {
    playSound('knock');
    setCurrentWave(1);
    setForestHealth(100);
    setGameStatus('playing');
    setWaveFeedback(null);
    setIsAnswerCorrect(null);
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
            {/* Tectonic / nature overlay lines */}
            <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden">
              {[...Array(5)].map((_, i) => (
                <div 
                  key={i}
                  className="absolute opacity-[0.02] border border-teal-600 w-44 h-44 rounded-[44px] rotate-45"
                  style={{ top: `${i * 20}%`, left: `${i % 2 === 0 ? '-20%' : '60%'}` }}
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
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-teal-500/5 rounded-full blur-3xl -z-10" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-600">Etnobotani & Konservasi</p>
              <h1 className="text-4xl font-black text-stone-900 tracking-tighter leading-none italic">
                Kearifan <br/>
                <span className="text-teal-600 uppercase">Hutan Larangan</span>
              </h1>
              <div className="flex items-center gap-2 mt-4">
                <div className="h-1 w-12 bg-teal-400 rounded-full" />
                <p className="text-stone-500 text-[11px] font-bold uppercase tracking-widest">Pilih Jalur Belajar Ekologi</p>
              </div>
            </header>

            <div className="grid grid-cols-2 gap-4">
              {/* MINDFUL CARD */}
              <motion.button
                whileHover={{ y: -4, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setCurrentPage('mindful')}
                className="group relative flex flex-col items-start p-5 bg-white rounded-[32px] border border-stone-100 text-left overflow-hidden shadow-sm hover:shadow-xl hover:border-teal-200 col-span-2"
              >
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                  <Heart size={100} />
                </div>
                <div className="bg-teal-600 text-white p-2.5 rounded-2xl mb-4 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <Heart size={20} />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-black tracking-widest text-stone-400">ZONASI ADAT BATAK</span>
                  <h3 className="font-black text-stone-850 text-xl tracking-tight leading-tight mt-0.5">Mindful: Jona Harangan</h3>
                  <p className="text-stone-500 font-bold text-[11px] leading-relaxed mt-1 pr-6">Pahami rincian wilayah sakral penjaga resapan pasokan air alami hulu.</p>
                </div>
              </motion.button>

              {/* MEANINGFUL CARD */}
              <motion.button
                whileHover={{ y: -4, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setCurrentPage('meaningful')}
                className="group relative flex flex-col items-start p-5 bg-white rounded-[32px] border border-stone-100 text-left overflow-hidden shadow-sm hover:shadow-xl hover:border-teal-200 col-span-1"
              >
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                  <Lightbulb size={60} />
                </div>
                <div className="bg-teal-500 text-stone-900 p-2.5 rounded-2xl mb-4 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <Lightbulb size={20} />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-black tracking-widest text-stone-400">KOHESI AKAR</span>
                  <h3 className="font-black text-stone-850 text-base tracking-tight mt-0.5 leading-tight">Meaningful</h3>
                  <p className="text-stone-500 font-bold text-[9px] mt-0.5 line-clamp-2">Sains anyaman akar Bamboo & Vetiver ikat lereng.</p>
                </div>
              </motion.button>

              {/* JOYFUL CARD */}
              <motion.button
                whileHover={{ y: -4, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setCurrentPage('joyful')}
                className="group relative flex flex-col items-start p-5 bg-white rounded-[32px] border border-stone-100 text-left overflow-hidden shadow-sm hover:shadow-xl hover:border-teal-200 col-span-1"
              >
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                  <Gamepad2 size={60} />
                </div>
                <div className="bg-stone-850 text-white p-2.5 rounded-2xl mb-4 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <Gamepad2 size={20} />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-black tracking-widest text-stone-400">PENJAGA HUTAN</span>
                  <h3 className="font-black text-stone-850 text-base tracking-tight mt-0.5 leading-tight">Joyful</h3>
                  <p className="text-stone-500 font-bold text-[9px] mt-0.5 line-clamp-2">Atasi tantangan logging gelap, hama & kekeringan hulu.</p>
                </div>
              </motion.button>

              {/* MITIGASI CARD */}
              <motion.button
                whileHover={{ y: -4, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => setCurrentPage('mitigasi')}
                className="group relative flex flex-col items-start p-5 bg-white rounded-[32px] border border-stone-100 text-left overflow-hidden shadow-sm hover:shadow-xl hover:border-teal-200 col-span-2"
              >
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity pointer-events-none">
                  <ShieldAlert size={100} />
                </div>
                <div className="bg-teal-700 text-white p-2.5 rounded-2xl mb-4 shadow-md group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <ShieldAlert size={20} />
                </div>
                <div>
                  <span className="text-[9px] uppercase font-black tracking-widest text-stone-400">SIRENE PENYAMAN ALAM</span>
                  <h3 className="font-black text-stone-850 text-xl tracking-tight leading-tight mt-0.5">Mitigasi: Rawat Harangan</h3>
                  <p className="text-stone-500 font-bold text-[11px] leading-relaxed mt-1 pr-6">Pilah aksi berkelanjutan merawat rawa gambut & ekosistem Kantong Semar.</p>
                </div>
              </motion.button>
            </div>

            <div className="bg-stone-900 p-6 rounded-[32px] shadow-2xl relative overflow-hidden group mt-4">
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-500/10 rounded-full blur-2xl -mr-12 -mt-12" />
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-teal-500/20 rounded-2xl flex items-center justify-center text-teal-450 shrink-0">
                  <Trees size={24} />
                </div>
                <div className="space-y-1">
                  <p className="text-white font-black text-xs tracking-tight italic">"Menjaga rimba adalah amanat adat demi merawat napas dangkalan tanah."</p>
                  <p className="text-stone-400 text-[8px] font-bold uppercase tracking-widest">- Lembaga Adat Danau Toba</p>
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
            <header className="space-y-1">
              <div className="flex border-b-2 border-dashed border-stone-200 pb-2 mb-3">
                <span className="text-teal-600 font-extrabold text-[9px] uppercase tracking-[0.25em] italic">Misteri & Perlindungan Adat</span>
              </div>
              <h1 className="text-3xl font-black text-stone-900 tracking-tighter leading-none uppercase italic">Harangan Batak</h1>
              <p className="text-[10px] text-stone-500 font-bold uppercase tracking-wider">Menatap Gerbang Kelestarian Rimba Purba</p>
            </header>

            {/* Visual Content: Hutan lebat di lereng bukit dengan kabut tebal + papan kayu */}
            <div className="relative aspect-[4/3] bg-gradient-to-b from-[#111f1a] to-[#040a08] rounded-[36px] overflow-hidden shadow-2xl border-4 border-white flex flex-col justify-between p-5 relative">
              <style>{`
                @keyframes fogSlowDrift1 {
                  0% { transform: translateX(-15%) translateY(5px) scale(1); opacity: 0.2; }
                  50% { transform: translateX(15%) translateY(-10px) scale(1.15); opacity: 0.55; }
                  100% { transform: translateX(-15%) translateY(5px) scale(1); opacity: 0.2; }
                }
                @keyframes fogSlowDrift2 {
                  0% { transform: translateX(15%) translateY(-5px) scale(1.1); opacity: 0.3; }
                  50% { transform: translateX(-15%) translateY(10px) scale(0.9); opacity: 0.6; }
                  100% { transform: translateX(15%) translateY(-5px) scale(1.1); opacity: 0.3; }
                }
                @keyframes treeSway {
                  0%, 100% { transform: rotate(0deg); }
                  50% { transform: rotate(1.5deg); }
                }
                .anim-fog-1 {
                  animation: fogSlowDrift1 12s infinite ease-in-out;
                }
                .anim-fog-2 {
                  animation: fogSlowDrift2 16s infinite ease-in-out;
                }
                .anim-tree {
                  animation: treeSway 5s infinite ease-in-out;
                }
              `}</style>

              {/* Mountains & Hills Layout (Lereng Bukit) */}
              <div className="absolute inset-0 pointer-events-none z-0">
                {/* Sky & Clouds glow */}
                <div className="absolute top-2 left-1/4 w-36 h-20 bg-teal-800/10 rounded-full blur-3xl" />
                
                {/* Hill Background 3 */}
                <div className="absolute bottom-16 -left-10 right-0 h-36 bg-emerald-950/40 rounded-[100%] rotate-3 transform-gpu filter blur-[1px]" />

                {/* Hill Background 2 */}
                <div className="absolute bottom-10 -right-20 -left-10 h-32 bg-teal-950/60 rounded-[100%] -rotate-2 transform-gpu" />

                {/* Main Fore Slope (Lereng Utama) */}
                <div className="absolute bottom-0 left-0 right-[-30px] h-28 bg-[#091b14] rounded-[100%] rotate-3 flex items-start pt-2">
                  <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/30 to-transparent pointer-events-none" />
                </div>
              </div>

              {/* Overlapping Dense Trees (Hutan Lebat) */}
              <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
                {/* Back trees */}
                <div className="absolute bottom-20 left-[15%] opacity-40 scale-75 text-emerald-800 anim-tree" style={{ animationDelay: '0.5s' }}><Trees size={40} /></div>
                <div className="absolute bottom-16 left-[40%] opacity-35 scale-90 text-teal-800 anim-tree" style={{ animationDelay: '1.2s' }}><Trees size={38} /></div>
                <div className="absolute bottom-22 right-[20%] opacity-45 scale-75 text-emerald-700 anim-tree" style={{ animationDelay: '0s' }}><Trees size={44} /></div>

                {/* Mid trees */}
                <div className="absolute bottom-12 left-5 opacity-60 text-emerald-900 anim-tree" style={{ animationDelay: '2s' }}><Trees size={50} /></div>
                <div className="absolute bottom-10 right-8 opacity-75 text-[#0a271c] anim-tree" style={{ animationDelay: '0.8s' }}><Trees size={56} /></div>
                <div className="absolute bottom-14 left-[55%] opacity-55 text-teal-900 anim-tree" style={{ animationDelay: '1.5s' }}><Trees size={48} /></div>

                {/* Front big trees framing */}
                <div className="absolute bottom-4 left-[22%] opacity-85 text-emerald-950 anim-tree"><Trees size={62} /></div>
                <div className="absolute bottom-2 right-[25%] opacity-90 text-emerald-950 anim-tree" style={{ animationDelay: '0s' }}><Trees size={68} /></div>
              </div>

              {/* Thick Floating Fog layers (Kabut Tebal) */}
              <div className="absolute inset-0 pointer-events-none z-20">
                <div className="absolute top-[20%] left-[-20%] w-[140%] h-[55%] bg-stone-100/10 rounded-full blur-2xl anim-fog-1" />
                <div className="absolute top-[35%] right-[-20%] w-[140%] h-[50%] bg-teal-100/15 rounded-full blur-3xl anim-fog-2" />
                <div className="absolute bottom-[-15%] left-[-10%] w-[120%] h-[40%] bg-stone-200/5 blur-xl pointer-events-none animate-pulse" />
              </div>

              {/* Simple subtle vignette */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 pointer-events-none z-30" />

              {/* Status Tag on top */}
              <div className="z-30 self-start">
                <span className="text-[7.5px] font-black tracking-[0.2em] px-2.5 py-1 bg-black/65 text-teal-400 rounded-full border border-teal-500/30 backdrop-blur-md uppercase">
                  🌲 Atmosfer Halimun Harangan
                </span>
              </div>

              {/* Rustic Wood Signboard: "Hutan Larangan: Jangan Menebang, Jangan Merusak" */}
              <div className="z-30 self-center flex flex-col items-center select-none w-full max-w-[280px]">
                {/* Wood Signpost peg */}
                <div className="w-2.5 h-12 bg-amber-950 border-r border-amber-900 shadow-md transform translate-y-3" />
                
                {/* Weathered Wooden sign element */}
                <div className="w-full bg-gradient-to-br from-[#593922] to-[#3a2010] p-3 rounded-2xl border-4 border-[#281408] shadow-[0_8px_30px_rgb(0,0,0,0.6)] text-center space-y-1 relative">
                  {/* Fake rustic nails */}
                  <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-stone-700 border border-stone-800" />
                  <div className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-stone-700 border border-stone-800" />
                  <div className="absolute bottom-1.5 left-1.5 w-1.5 h-1.5 rounded-full bg-stone-700 border border-stone-805" />
                  <div className="absolute bottom-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-stone-700 border border-stone-805" />
                  
                  {/* Local script decoration (Batak Script inspired glyps) */}
                  <div className="text-[#e2b07e] font-serif tracking-[0.35em] text-[10px] leading-none opacity-85 select-none font-bold animate-pulse">
                    ᯂᯮᯖᯉ᯲ ᯞᯒᯝᯉ᯲
                  </div>
                  
                  {/* Indonesian Translated Warning Label */}
                  <div className="space-y-0.5">
                    <h3 className="font-extrabold text-[#fdf4e8] tracking-widest text-[11px] uppercase leading-tight font-sans">
                      Hutan Larangan
                    </h3>
                    <div className="w-16 h-[1.5px] bg-red-500/80 mx-auto rounded-full" />
                    <p className="text-[8.5px] text-[#fbf1c7]/95 font-black uppercase tracking-wider leading-tight">
                      Jangan Menebang,<br />Jangan Merusak.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bottom Info Status bar */}
              <div className="z-30 flex justify-between items-center w-full min-h-[14px]">
                <span className="text-[8px] text-white/50 uppercase font-black tracking-widest">Ketinggian: 1,400 MDPL</span>
                <span className="text-[8px] text-teal-400 font-extrabold animate-pulse">● KRISTAL KABUT TEBAL</span>
              </div>
            </div>

            {/* Narrative text requested by user */}
            <div className="bg-white p-5 rounded-[28px] border-2 border-stone-100 shadow-sm space-y-3">
              <span className="text-[8px] font-black tracking-widest text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full border border-teal-200/50 uppercase">Naskah Filosofis</span>
              <p className="text-stone-800 font-semibold text-[11.5px] leading-relaxed select-none first-letter:text-2xl first-letter:font-black first-letter:text-teal-700 first-letter:mr-1 first-letter:float-left">
                "Nenek moyang kita percaya bahwa hutan ini memiliki penjaga, sehingga tidak boleh ada satu pun pohon yang ditebang. Benarkah itu hanya mitos, atau sebuah strategi jenius untuk melindungi desa dari amukan tanah dan haus yang berkepanjangan?"
              </p>
            </div>

            {/* Interactive button element requested by user */}
            <button 
              onClick={() => {
                playSound('knock');
                setCurrentPage('meaningful');
              }}
              className="w-full bg-emerald-700 hover:bg-emerald-650 text-white font-black py-4.5 rounded-[22px] flex items-center justify-center gap-2.5 shadow-xl active:scale-95 transition-transform uppercase tracking-widest text-xs border-b-4 border-emerald-950"
            >
              <span>🌲 Masuk ke Dalam Hutan</span>
              <ChevronRight size={16} className="text-white/80 shrink-0" />
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
                Ulasan Mekanika & Hidrologi<br/>
                <span className="text-xs font-bold block text-teal-600 tracking-widest">(Mari Belajar Sains Hutan Adat!)</span>
              </h2>
              <div className="absolute top-4 right-6">
                <button 
                  onClick={() => playSound('knock')} 
                  className="bg-white p-2.5 rounded-full shadow-lg text-teal-600 active:scale-95 transition-all border border-stone-100"
                >
                  <Volume2 size={20} />
                </button>
              </div>
            </header>

            <div className="relative flex flex-col items-center pb-8 px-6 pt-6">
              <div className="w-full max-w-md flex flex-col gap-6">
                
                {/* Part A vs Part B Tab selectors */}
                <div className="grid grid-cols-2 p-1.5 bg-stone-100 rounded-[28px] items-center border border-stone-200">
                  <button 
                    onClick={() => {
                      playSound('knock');
                      setMeaningfulTab('A');
                      setPullForce(0);
                    }}
                    className={`py-3 rounded-[24px] font-black text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                      meaningfulTab === 'A' ? 'bg-stone-900 text-white shadow-md' : 'text-stone-500 hover:bg-stone-200/50'
                    }`}
                  >
                    <Trees size={13} />
                    Bagian A: Jangkar Akar
                  </button>
                  <button 
                    onClick={() => {
                      playSound('knock');
                      setMeaningfulTab('B');
                    }}
                    className={`py-3 rounded-[24px] font-black text-[10px] uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                      meaningfulTab === 'B' ? 'bg-stone-900 text-white shadow-md' : 'text-stone-500 hover:bg-stone-200/50'
                    }`}
                  >
                    <Zap size={13} />
                    Bagian B: Hidrologi Air
                  </button>
                </div>

                <AnimatePresence mode="wait">
                  {meaningfulTab === 'A' ? (
                    <motion.div
                      key="tab-a"
                      initial={{ opacity: 0, x: -15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 15 }}
                      className="space-y-6"
                    >
                      {/* Sub-Header */}
                      <div className="space-y-1">
                        <span className="text-[8px] font-black tracking-widest text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-250 uppercase">
                          Sains Mekanika Tanah
                        </span>
                        <h3 className="text-lg font-black text-stone-900 uppercase tracking-tight">
                          1️⃣ Mekanika Jangkar Akar & Kohesi
                        </h3>
                        <p className="text-[10px] text-stone-500 font-bold leading-snug">
                          Lihat struktur internal lereng bukit melalui sinar-X (X-Ray) dan rasakan kekuatan cengkeraman akar!
                        </p>
                      </div>

                      {/* Interactive Section Selector: Root State Toggle */}
                      <div className="grid grid-cols-2 gap-2 bg-stone-50 p-1 rounded-2xl border border-stone-200/60 shadow-inner">
                        <button
                          onClick={() => {
                            playSound('knock');
                            setHasRoots(true);
                            setPullForce(0);
                          }}
                          className={`py-2 px-1 text-[9px] font-black uppercase rounded-xl transition-all ${
                            hasRoots
                              ? 'bg-emerald-600 text-white shadow-sm'
                              : 'text-stone-600 hover:bg-white/50'
                          }`}
                        >
                          🌲 Ada Akar (Lestari)
                        </button>
                        <button
                          onClick={() => {
                            playSound('knock');
                            setHasRoots(false);
                            setPullForce(0);
                          }}
                          className={`py-2 px-1 text-[9px] font-black uppercase rounded-xl transition-all ${
                            !hasRoots
                              ? 'bg-red-600 text-white shadow-sm'
                              : 'text-stone-600 hover:bg-white/50'
                          }`}
                        >
                          🪵 Tanpa Akar (Gundul)
                        </button>
                      </div>

                      {/* X-RAY VISUALIZATION AREA */}
                      <div className="relative aspect-[4/3] bg-zinc-950 rounded-[32px] overflow-hidden border-4 border-stone-900 shadow-2xl flex flex-col justify-between p-4 transform-gpu">
                        {/* Simulation blue grid overlay */}
                        <div className="absolute inset-x-0 top-0 bottom-0 pointer-events-none opacity-[0.06] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:16px_16px]" />
                        
                        {/* Title Watermark */}
                        <div className="absolute top-3 left-3 text-[7.5px] font-mono text-zinc-650 tracking-[0.25em] z-10 font-bold uppercase">
                          ⚡ LERENG LOKAL X-RAY SCANNER
                        </div>

                        {/* Interactive Hill & Tree Graphic (SVG based layout) */}
                        <div className="absolute inset-0 flex items-end pointer-events-none z-10 overflow-hidden">
                          {/* Underground Grid Boundary with Glow */}
                          <svg className="w-full h-full" viewBox="0 0 320 240">
                            {/* Underground rock particles */}
                            <g className="opacity-40">
                              <circle cx="45" cy="180" r="4" fill="#a8a29e" />
                              <circle cx="85" cy="195" r="5" fill="#a8a29e" />
                              <circle cx="120" cy="175" r="4" fill="#78716c" />
                              <circle cx="160" cy="190" r="6" fill="#a8a29e" />
                              <circle cx="210" cy="185" r="5" fill="#78716c" />
                              <circle cx="250" cy="200" r="3.5" fill="#a8a29e" />
                            </g>

                            {/* Slanted Slope Earth representation line */}
                            <path 
                              d="M -10,130 Q 160,150 330,175 L 330,250 L -10,250 Z" 
                              fill="#131316" 
                              stroke="#57534e" 
                              strokeWidth="2.5" 
                            />

                            {/* Ground slope shear stress lines (red warning when pulling too hard without roots) */}
                            {!hasRoots && pullForce > 45 && (
                              <g className="stroke-red-500 opacity-60 animate-pulse" strokeWidth="1.5" strokeDasharray="2,3">
                                <line x1="80" y1="145" x2="160" y2="155" />
                                <line x1="160" y1="155" x2="260" y2="168" />
                              </g>
                            )}

                            {/* Tree positioning with local rotation when slipping */}
                            <g 
                              transform={`translate(160, 142) rotate(${
                                !hasRoots && pullForce > 30 
                                  ? Math.min(32, (pullForce - 30) * 0.7) 
                                  : 0
                              }) translate(-160, -142)`}
                              style={{ transition: 'transform 0.15s ease-out' }}
                            >
                              {/* The Virtual Tree Roots (X-RAY VIEW) */}
                              {hasRoots ? (
                                <g className="stroke-emerald-400" strokeWidth="2.2" strokeLinecap="round" fill="none">
                                  {/* Deep networks of root anchor filaments */}
                                  <path d="M 160,140 Q 150,165 120,185" className={pullForce > 40 ? "animate-pulse" : ""} style={{ strokeWidth: pullForce > 40 ? 3 : 2.2 }} />
                                  <path d="M 160,140 Q 170,170 210,195" className={pullForce > 40 ? "animate-pulse" : ""} style={{ strokeWidth: pullForce > 40 ? 3 : 2.2 }} />
                                  <path d="M 160,140 L 165,220" className={pullForce > 40 ? "animate-pulse" : ""} style={{ strokeWidth: pullForce > 40 ? 3.5 : 2.2 }} />
                                  <path d="M 165,180 Q 185,195 195,215" />
                                  <path d="M 155,165 Q 135,190 145,210" />
                                  <path d="M 165,200 Q 150,215 130,225" />
                                  
                                  {/* Anchor indicators (glowing green circles around bounded rock particles) */}
                                  <circle cx="120" cy="185" r="4.5" fill="none" className="animate-ping" style={{ animationDuration: '3s' }} />
                                  <circle cx="210" cy="195" r="4.5" fill="none" className="animate-ping" style={{ animationDuration: '4s' }} />
                                  <circle cx="165" cy="220" r="5" fill="none" className="animate-ping" style={{ animationDuration: '2.5s' }} />
                                </g>
                              ) : (
                                <g className="stroke-red-500/60" strokeWidth="1.5" strokeLinecap="round" strokeDasharray="4,4" fill="none">
                                  {/* Cut, broken, weak roots */}
                                  <path d="M 160,140 Q 155,152 145,158" />
                                  <path d="M 160,140 Q 165,155 175,160" />
                                  <line x1="160" y1="140" x2="161" y2="152" />
                                  
                                  {/* Failure shear crack lines */}
                                  {pullForce > 30 && (
                                    <path d="M 130,135 Q 160,150 190,145" stroke="#ef4444" strokeWidth="2.5" />
                                  )}
                                </g>
                              )}

                              {/* Visible Tree Trunk and Foliage */}
                              <g fill={hasRoots ? "#10b981" : "#b45309"}>
                                {/* Trunk */}
                                <rect x="156" y="90" width="8" height="50" fill="#78350f" rx="1" />
                                {/* Branches */}
                                <path d="M 160,110 L 140,95" stroke="#78350f" strokeWidth="2" />
                                <path d="M 160,100 L 178,88" stroke="#78350f" strokeWidth="2" />

                                {/* Foliage Layers */}
                                {hasRoots ? (
                                  <>
                                    <circle cx="160" cy="70" r="24" fill="#047857" className="opacity-90" />
                                    <circle cx="145" cy="80" r="16" fill="#065f46" className="opacity-95" />
                                    <circle cx="175" cy="78" r="18" fill="#10b981" className="opacity-80" />
                                  </>
                                ) : (
                                  <>
                                    <path d="M 160,65 L 142,85 L 178,85 Z" fill="#78350f" />
                                    <circle cx="160" cy="65" r="10" fill="#a16207" className="opacity-80" />
                                    <p className="font-mono text-stone-500 font-bold" />
                                  </>
                                )}
                              </g>
                            </g>
                          </svg>
                        </div>

                        {/* Top corner metrics HUD display */}
                        <div className="z-20 text-right space-y-1 select-none pointer-events-none">
                          <div className="inline-block bg-zinc-900/95 border border-zinc-800 px-3 py-1 rounded-xl">
                            <span className="text-[7.5px] font-bold text-zinc-400 block tracking-widest uppercase">
                              STABILITAS LERENG:
                            </span>
                            <span className={`font-mono text-[11px] font-black ${
                              hasRoots
                                ? 'text-emerald-400'
                                : pullForce < 30
                                ? 'text-amber-400 animate-pulse'
                                : 'text-red-500 animate-bounce'
                            }`}>
                              {hasRoots 
                                ? '100% AMAN (KOKOH)' 
                                : pullForce < 30
                                ? '65% PREKULIKULER'
                                : '0% LONGSOR TOTAL!'}
                            </span>
                          </div>
                        </div>

                        {/* Bottom feedback dialog prompt explaining structural action */}
                        <div className="z-25 bg-black/75 backdrop-blur-md p-3.5 rounded-[22px] border border-white/5 space-y-1 shadow-2xl">
                          <p className="text-[10px] text-zinc-100 font-black tracking-tight leading-tight uppercase flex items-center gap-1.5">
                            {hasRoots ? (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                                <span className="text-emerald-400">PASAK JANGKAR MENGIKAT BUTIRAN</span>
                              </>
                            ) : (
                              <>
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                                <span className="text-red-400">STRUKTUR KRITIS (GAYA GESEK RENDAH)</span>
                              </>
                            )}
                          </p>
                          <p className="text-[9px] text-zinc-350 font-semibold leading-normal">
                            {hasRoots
                              ? 'Akar mengikat dan menahan partikel-partikel batuan dangkalan bumi. Meskipun gaya tarikan Anda dinaikkan, tegangan geser didistribusikan merata ke sekat bawah, menghentikan longsoran.'
                              : pullForce < 30
                              ? 'Tanah di lereng hanya ditahan oleh gesekan mekanis ringkas antar butiran pasir yang gembur. Tarikan sedikit saja dapat membelah tanah.'
                              : 'KO HESI NOL! Butiran tanah gundul yang tidak diikat akar runtuh akibat tak sanggup membendung beban geser melintasi kemiringan.'}
                          </p>
                        </div>
                      </div>

                      {/* --- "SENTUH & TARIK" INTERACTIVE SLIDER --- */}
                      <div className="bg-white p-5 rounded-[28px] border-2 border-stone-100 shadow-sm space-y-3.5">
                        <div className="flex justify-between items-center text-[10px] font-black tracking-wider text-stone-600">
                          <span className="uppercase text-[9px]">🪵 KEKUATAN TARIKAN SISWA:</span>
                          <span className="font-mono text-xs text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md">
                            {pullForce} kN (Kilo Newton)
                          </span>
                        </div>

                        <div className="relative">
                          <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={pullForce}
                            onChange={(e) => {
                              const v = Number(e.target.value);
                              setPullForce(v);
                              if (v > 10 && v % 25 === 0) {
                                playSound('knock');
                              }
                              if (!hasRoots && v === 35) {
                                playSound('failure');
                              }
                            }}
                            className="w-full h-2.5 bg-stone-200 rounded-lg appearance-none cursor-pointer accent-stone-900"
                          />
                          <div className="flex justify-between text-[8px] font-bold text-stone-400 mt-1.5 uppercase">
                            <span>Sila Sentuh & Tarik</span>
                            <span>Maksimal 100 kN</span>
                          </div>
                        </div>

                        {/* Interactive Warning banner depending on force and roots */}
                        {pullForce > 10 && (
                          <div className={`p-3 rounded-2xl border flex gap-2 items-center ${
                            hasRoots
                              ? 'bg-green-50 border-green-200 text-green-800'
                              : 'bg-red-50 border-red-200 text-red-800 animate-pulse'
                          }`}>
                            <span className="text-sm shrink-0">{hasRoots ? '🛡️' : '🚨'}</span>
                            <div className="text-[9.5px] font-bold leading-snug">
                              {hasRoots ? (
                                <span>Akar kokoh memberikan kohesi tinggi. Gaya penolakan tebing {pullForce} kN berhasil digagalkan dengan aman!</span>
                              ) : pullForce < 45 ? (
                                <span>Gaya gesek butiran mulai jenuh! Sedikit lagi tanah akan mengalami retakan geser besar.</span>
                              ) : (
                                <span>Hukum runtuhan pasir bekerja! Lereng bergeser ke lembah karena gaya beban gravitasi {pullForce} kN melampaui kohesi nol.</span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* --- MEKANIKA Deep Dive Lessons Cards --- */}
                      <div className="space-y-3">
                        <div className="bg-lime-50/50 p-4.5 rounded-[24px] border border-lime-200/60 text-left space-y-1.5">
                          <h4 className="font-extrabold text-[#365314] text-xs uppercase tracking-wide flex items-center gap-1.5">
                            <span>📌 1. Analisis Gaya Gesek</span>
                          </h4>
                          <p className="text-[10px] text-lime-950 font-semibold leading-relaxed">
                            Akar pohon bertindak sebagai <strong>"Pasak Mekanis" (Anchor)</strong> yang menembus sela-sela formasi batuan keras. Jaringan anyaman sela-sela akar ini mengunci butiran-butiran pasir lepas, menolak pergeseran bidang miring tanah laksana sekrup penguat di dinding batu.
                          </p>
                        </div>

                        <div className="bg-rose-50/50 p-4.5 rounded-[24px] border border-rose-200/60 text-left space-y-1.5">
                          <h4 className="font-extrabold text-[#881337] text-xs uppercase tracking-wide flex items-center gap-1.5">
                            <span>📌 2. Analisis Kohesi Tanah</span>
                          </h4>
                          <p className="text-[10px] text-rose-955 font-semibold leading-relaxed">
                            Tanpa anyaman akar, butiran tanah terjal hanya mengandalkan gaya gesek antar butiran (Internal Friction Angle) yang renggang. Sesaat ketika hujan datang, air meresap dan bertindak sebagai <strong>lubrikan/pelicin</strong> yang memisahkan jalinan butir, melondongkan masa tanah runtuh ke lembah akibat heretan gaya gravitasi murni tanpa hambatan.
                          </p>
                        </div>
                      </div>

                    </motion.div>
                  ) : (
                    <motion.div
                      key="tab-b"
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -15 }}
                      className="space-y-6"
                    >
                      {/* Sub-Header */}
                      <div className="space-y-1">
                        <span className="text-[8px] font-black tracking-widest text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 uppercase">
                          Sains Hidrologi & Siklus Air
                        </span>
                        <h3 className="text-lg font-black text-stone-900 uppercase tracking-tight">
                          2️⃣ Analisis Infiltrasi & Spons Raksasa
                        </h3>
                        <p className="text-[10px] text-stone-500 font-bold leading-snug">
                          Uji aliran air hujan dan saksikan kinerja absorpsi pori akar di dua kondisi area hutan yang berbeda!
                        </p>
                      </div>

                      {/* AREA SELECTOR COMPARATIVE */}
                      <div className="grid grid-cols-2 gap-2 bg-stone-50 p-1.5 rounded-2xl border border-stone-200/80">
                        <button
                          onClick={() => {
                            playSound('knock');
                            setSelectedArea('harangan');
                          }}
                          className={`py-2 px-1 text-[9.5px] font-extrabold uppercase rounded-xl transition-all flex items-center justify-center gap-1 ${
                            selectedArea === 'harangan'
                              ? 'bg-emerald-700 text-white shadow'
                              : 'text-stone-500 hover:bg-stone-200/50'
                          }`}
                        >
                          🟢 Hutan Larangan (Lestari)
                        </button>
                        <button
                          onClick={() => {
                            playSound('knock');
                            setSelectedArea('gundul');
                          }}
                          className={`py-2 px-1 text-[9.5px] font-extrabold uppercase rounded-xl transition-all flex items-center justify-center gap-1 ${
                            selectedArea === 'gundul'
                              ? 'bg-amber-700 text-white shadow'
                              : 'text-stone-500 hover:bg-stone-200/50'
                          }`}
                        >
                          🟤 Lahan Gundul (Gundul)
                        </button>
                      </div>

                      {/* WEATHER SIMULATOR INTERACTIVE ANIMATION */}
                      <div className="relative aspect-[4/3] bg-gradient-to-b from-teal-950 to-zinc-950 rounded-[32px] overflow-hidden border-2 border-stone-800 shadow-2xl p-4 flex flex-col justify-between">
                        <style>{`
                          @keyframes rainDrop {
                            0% { transform: translateY(-30px); opacity: 0; }
                            50% { opacity: 0.6; }
                            100% { transform: translateY(160px); opacity: 0; }
                          }
                          @keyframes runOffSlide {
                            0% { transform: translateX(0) translateY(0); opacity: 0; }
                            30% { opacity: 0.8; }
                            100% { transform: translateX(110px) translateY(85px); opacity: 0; }
                          }
                          .rain-drop {
                            position: absolute;
                            width: 1.5px;
                            height: 10px;
                            background: #60a5fa;
                            opacity: 0;
                            pointer-events: none;
                            animation: rainDrop 1.5s infinite linear;
                          }
                          .run-off-flow {
                            position: absolute;
                            width: 4px;
                            height: 4px;
                            background: #f87171;
                            border-radius: 50%;
                            animation: runOffSlide 1.3s infinite linear;
                          }
                        `}</style>

                        {/* Rain visual particles generation */}
                        <div className="absolute inset-x-0 top-0 h-40 pointer-events-none z-10 overflow-hidden">
                          <div className="rain-drop left-[10%]" style={{ animationDelay: '0s', animationDuration: '1.2s' }} />
                          <div className="rain-drop left-[25%]" style={{ animationDelay: '0.3s', animationDuration: '1.5s' }} />
                          <div className="rain-drop left-[40%]" style={{ animationDelay: '0.7s', animationDuration: '1.1s' }} />
                          <div className="rain-drop left-[55%]" style={{ animationDelay: '0.1s', animationDuration: '1.4s' }} />
                          <div className="rain-drop left-[70%]" style={{ animationDelay: '0.5s', animationDuration: '1.3s' }} />
                          <div className="rain-drop left-[85%]" style={{ animationDelay: '0.9s', animationDuration: '1.6s' }} />
                        </div>

                        {/* Comparative Landscape View */}
                        <div className="absolute inset-0 z-0">
                          <svg className="w-full h-full" viewBox="0 0 320 240">
                            {/* Slanted Slope Earth background */}
                            <path d="M -10,130 Q 160,150 330,175 L 330,250 L -10,250 Z" fill="#18181b" stroke="#3f3f46" strokeWidth="2" />
                            
                            {/* Ground surface layers overlay */}
                            {selectedArea === 'harangan' ? (
                              <>
                                {/* Dense Green Grass & Silt */}
                                <path d="M -10,130 Q 160,150 330,175" fill="none" stroke="#059669" strokeWidth="6" />
                                {/* Root pore tunnels paths */}
                                <g className="stroke-[#3b82f6]/40 opacity-70" strokeWidth="3" fill="none" strokeDasharray="3,3">
                                  <path d="M 60,135 Q 75,170 85,210" />
                                  <path d="M 160,143 Q 140,180 135,220" />
                                  <path d="M 240,155 Q 260,195 245,230" />
                                </g>

                                {/* Groundwater recharge reservoir graphic (glowing blue sponge indicator) */}
                                <ellipse cx="160" cy="205" rx="90" ry="25" fill="#1d4ed8" className="opacity-30 blur-md animate-pulse" />
                                <text x="160" y="210" fill="#93c5fd" fontSize="8" fontWeight="bold" textAnchor="middle" className="font-mono uppercase opacity-80">
                                  💧 SPONS AIR TANAH PENUH
                                </text>

                                {/* Base Springs (Clear blue drop flows from spring base) */}
                                <path d="M 30,133 Q 15,160 5,200" stroke="#3b82f6" strokeWidth="2" fill="none" />
                                <circle cx="5" cy="200" r="3" fill="#60a5fa" className="animate-ping" />
                              </>
                            ) : (
                              <>
                                {/* Cracked dried gundul land top soil (brown/red color) */}
                                <path d="M -10,130 Q 160,150 330,175" fill="none" stroke="#92400e" strokeWidth="6" />
                                <g className="stroke-red-400" strokeWidth="1">
                                  <line x1="85" y1="139" x2="85" y2="148" />
                                  <line x1="180" y1="147" x2="183" y2="155" />
                                  <line x1="260" y1="156" x2="258" y2="164" />
                                </g>

                                {/* No Water Sponge Waterway is empty */}
                                <text x="160" y="210" fill="#ef4444" fontSize="8" fontWeight="bold" textAnchor="middle" className="font-mono uppercase opacity-70">
                                  🏜️ KERING & TANDUS (KOSONG)
                                </text>
                              </>
                            )}
                          </svg>

                          {/* Red Water streams sliding downhill for bare gundul area representing run-off */}
                          {selectedArea === 'gundul' && (
                            <>
                              <div className="run-off-flow left-[20%] top-[40%]" style={{ animationDelay: '0s' }} />
                              <div className="run-off-flow left-[45%] top-[45%]" style={{ animationDelay: '0.4s' }} />
                              <div className="run-off-flow left-[70%] top-[50%]" style={{ animationDelay: '0.8s' }} />
                              
                              {/* Flooded town indicators at base */}
                              <div className="absolute bottom-16 right-4 bg-red-950/90 text-red-500 border border-red-800/80 rounded px-2 py-0.5 text-[7px] font-black uppercase animate-bounce">
                                🌊 BANJIR RUN-OFF TINGGI
                              </div>
                            </>
                          )}
                        </div>

                        {/* UI Overlay display text inside the screen */}
                        <div className="z-15 text-left bg-black/60 backdrop-blur-sm p-3.5 rounded-[22px] border border-white/5 space-y-1">
                          <h4 className="text-[10px] font-black text-stone-100 uppercase tracking-wide">
                            {selectedArea === 'harangan' 
                              ? '🔄 SISTEM RESERVOIR SPONS (Lestari)' 
                              : '💥 RUNTUHNYA DAERAH TANGKAPAN AIR (Gundul)'}
                          </h4>
                          <ul className="text-[8.5px] text-stone-300 font-semibold leading-normal list-disc pl-3.5 space-y-1">
                            {selectedArea === 'harangan' ? (
                              <>
                                <li><strong>Proses Infiltrasi Aktif:</strong> Pori-pori di akar menyalurkan air hujan masuk menembus tanah tanpa mengikis permukaan.</li>
                                <li><strong>Penyaring Alami:</strong> Spons bumi menyaring air keruh menjadi mata air pegunungan yang sangat bening secara bertahap.</li>
                              </>
                            ) : (
                              <>
                                <li><strong>Hampir Nol Infiltrasi:</strong> Air mengalir bebas lurus di atas permukaan tanah liat keras pelindung botak.</li>
                                <li><strong>Mutilasi Banjir Bandang:</strong> Sedimen lumpur ikut terseret jatuh, mendatangkan petaka banjir di perkampungan hilir.</li>
                              </>
                            )}
                          </ul>
                        </div>

                        {/* Simulation metric panel footer */}
                        <div className="z-15 flex justify-between items-center text-[7.5px] font-mono text-zinc-350 bg-stone-900/90 py-1.5 px-3 rounded-full border border-stone-800/50">
                          <span>INFILTRASI (I): {selectedArea === 'harangan' ? 'Tinggi (92%)' : 'Sangat Rendah (4%)'}</span>
                          <span>RUN-OFF (R): {selectedArea === 'harangan' ? 'Sangat Kecil (8%)' : 'Amat Tinggi (96%)'}</span>
                        </div>
                      </div>

                      {/* --- HIDROLOGI SAINS Deep Dive (Infiltrasi & Spons) --- */}
                      <div className="space-y-4">
                        <div className="bg-white p-5 rounded-[28px] border-2 border-stone-100 shadow-sm space-y-3">
                          <span className="text-[8px] font-black tracking-widest text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full uppercase">Penjelasan Sains</span>
                          <div className="space-y-3.5 text-[11px] font-semibold text-stone-700 leading-relaxed">
                            <p>
                              🟢 <strong>Pori Akar (Infiltrasi):</strong> Di dalam Hutan Larangan, tumpukan serasah daun mati & anyaman akar gembur menciptakan milyaran pori mikro makro tanah. Air hujan tidak langsung lari meninggi sebagai limpasan banjir (run-off), melainkan diserap masuk (infiltrasi) merambat ke lapisan bawah tanah.
                            </p>
                            <p>
                              🔵 <strong>Spons Raksasa (Groundwater Sponge):</strong> Hutan lestari bertindak bagaikan spons penahan raksasa. Menyerap air melimpah di musim hujan untuk disimpan di bawah tanah, kemudian menyuplainya perlahan-lahan ke mata air jernih tatkala musim kemarau panjang membakar lereng.
                            </p>
                          </div>
                        </div>

                        {/* --- RUMUS FISIKA IPA (LaTeX styled card formula) --- */}
                        <div className="bg-[#e0f2fe] border-2 border-blue-200 p-5 rounded-[28px] text-center space-y-3 shadow-inner">
                          <span className="text-[8px] font-black tracking-widest text-blue-700 bg-blue-100 px-3 py-0.5 rounded-full uppercase border border-blue-200">
                            Persamaan Keseimbangan Siklus Air
                          </span>
                          
                          <div className="py-2.5">
                            <div className="font-mono text-xl font-black text-blue-950 tracking-wide uppercase select-none animate-pulse">
                              P = I + R
                            </div>
                            <div className="text-[8.5px] text-blue-700 font-bold uppercase tracking-widest mt-1">
                              (Presipitasi = Infiltrasi + Run-off)
                            </div>
                          </div>

                          <div className="text-left bg-white/70 p-3.5 rounded-2xl border border-blue-100/50 space-y-1.5 text-[10px] text-blue-900 font-semibold leading-normal">
                            <h5 className="font-black text-[10.5px] text-blue-950 uppercase">Hubungan Parameter Hidrologi:</h5>
                            <p>
                              • <strong>P (Presipitasi):</strong> Curah hujan total yang jatuh ke bumi.
                            </p>
                            <p>
                              • <strong>I (Infiltrasi):</strong> Laju penyerapan air masuk lewat pori akar pohon.
                            </p>
                            <p>
                              • <strong>R (Run-off):</strong> Aliran permukaan liar yang merangsang luapan banjir bandang.
                            </p>
                            <div className="h-[1px] bg-blue-200 my-1" />
                            <p className="italic text-[9.5px] font-black leading-snug">
                              ⚠️ Hukum Kekekalan Aliran: Jika Hutan Larangan ditebang gundul, laju Infiltrasi (I) anjlok mendekati nol. Hal ini memaksa nilai Run-off (R) membubung tinggi drastis. Hasil fisika tak terelakkan: Longsor dahsyat di atas tebing & banjir merusak di area perumahan!
                            </p>
                          </div>
                        </div>
                      </div>

                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Main Action navigation footer button */}
                <button 
                  onClick={() => {
                    playSound('knock');
                    setCurrentPage('joyful');
                  }}
                  className="w-full bg-stone-900 hover:bg-stone-850 text-white font-black py-4.5 rounded-[22px] flex items-center justify-center gap-2 text-xs uppercase tracking-widest shadow-xl transition-all hover:scale-[1.01] active:scale-[0.98] border-b-4 border-stone-950"
                >
                  <span>Mulai Game Penjaga Harangan</span>
                  <ChevronRight size={15} className="text-teal-400 shrink-0" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* --- 4. JOYFUL (FOREST GUARDIAN GAME) --- */}
        {currentPage === 'joyful' && (
          <motion.div 
            key="joyful"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 pb-20 flex flex-col items-center text-left"
          >
            {/* Health & Wave metrics */}
            <div className="flex justify-between items-center w-full px-1">
              <span className="text-[9px] font-black text-stone-500 uppercase tracking-widest">
                TANTANGAN: <span className="text-stone-950 font-extrabold">WAVE {currentWave} / 4</span>
              </span>
              <div className="flex items-center gap-1">
                <span className="text-[8px] font-bold text-stone-400">KESEHATAN HUTAN:</span>
                <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full ${forestHealth < 55 ? 'bg-red-100 text-red-650' : 'bg-teal-100 text-teal-800'}`}>
                  {forestHealth}%
                </span>
              </div>
            </div>

            {/* Health Progress Line */}
            <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full rounded-full ${forestHealth < 55 ? 'bg-red-500' : 'bg-teal-600'}`}
                animate={{ width: `${forestHealth}%` }}
              />
            </div>

            {gameStatus === 'playing' ? (
              <div className="w-full space-y-6">
                {/* Threat Banner Panel */}
                <div className="bg-teal-900 text-white p-6 rounded-[28px] shadow-xl relative overflow-hidden">
                  <span className="text-[8px] font-black tracking-widest bg-white/10 px-2 py-0.5 rounded-full uppercase text-emerald-300">
                    KRISIS EKOSISTEM AKTIF
                  </span>
                  <h3 className="text-xl font-black italic tracking-tighter leading-snug mt-1.5">Wave {currentScenario.wave}: {currentScenario.threatTitle}</h3>
                  <p className="text-white/80 text-[10px] font-medium leading-relaxed mt-1">
                    {currentScenario.threatDesc}
                  </p>
                </div>

                {/* Submitting Option buttons */}
                <div className="space-y-3">
                  <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider block px-1">Langkah Mana yang Tepat?</span>
                  {currentScenario.options.map((option) => (
                    <button
                      key={option.id}
                      disabled={waveFeedback !== null}
                      onClick={() => handleSelectOption(option)}
                      className={`w-full text-left p-4 rounded-2xl border-2 text-xs font-bold leading-snug transition-transform active:scale-[0.99] flex justify-between items-center ${
                        waveFeedback 
                          ? option.isCorrect 
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-extrabold'
                            : 'bg-stone-50 border-stone-100 text-stone-400'
                          : 'bg-white border-stone-200 text-stone-700 hover:border-teal-500'
                      }`}
                    >
                      <span className="pr-4">{option.text}</span>
                      <ChevronRight size={14} className="shrink-0 text-stone-400" />
                    </button>
                  ))}
                </div>

                {/* Feedback Panel overlay / modal */}
                <AnimatePresence>
                  {waveFeedback && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`p-5 rounded-[28px] border-4 space-y-3 shadow-lg ${
                        isAnswerCorrect ? 'border-emerald-500 bg-emerald-50 text-emerald-950' : 'border-red-500 bg-red-50 text-red-950'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isAnswerCorrect ? <CheckCircle2 size={18} className="text-emerald-600" /> : <XCircle size={18} className="text-red-500" />}
                        <span className="text-[10px] font-black uppercase tracking-wider">{isAnswerCorrect ? 'KOREKTIF!' : 'GAGAL MITIGASI!'}</span>
                      </div>
                      <p className="text-[10px] font-bold leading-relaxed">{waveFeedback}</p>
                      <button
                        onClick={handleNextWave}
                        className={`w-full py-3 text-white rounded-xl font-black text-xs uppercase tracking-widest ${isAnswerCorrect ? 'bg-emerald-600' : 'bg-red-500'}`}
                      >
                        {currentWave < 4 ? 'Lanjutkan Penyelidikan' : 'Selesaikan Kajian Hutan'}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : gameStatus === 'won' ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-[40px] border-4 border-teal-600 text-center space-y-4 shadow-2xl w-full"
              >
                <div className="w-16 h-16 bg-teal-100 rounded-full mx-auto flex items-center justify-center text-teal-700 shadow-inner">
                  <Award size={36} />
                </div>
                <h3 className="text-2xl font-black text-stone-900 uppercase italic">Pelindung Harangan!</h3>
                <p className="text-xs text-stone-500 font-bold px-4 leading-normal">
                  Keren! Anda sukses menepis empat ancaman ekologis rawan menggunakan perpaduan dinamis adat saring & sains biologi.
                </p>
                <button onClick={resetGame} className="w-full py-3 bg-teal-700 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl">
                  Ulangi Misi Penjaga
                </button>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white p-8 rounded-[40px] border-4 border-red-500 text-center space-y-4 shadow-2xl w-full"
              >
                <div className="w-16 h-16 bg-red-100 rounded-full mx-auto flex items-center justify-center text-red-650 shadow-inner">
                  <XCircle size={36} />
                </div>
                <h3 className="text-2xl font-black text-stone-900 uppercase italic font-mono">Gundul Hancur</h3>
                <p className="text-xs text-stone-500 font-bold px-4 leading-relaxed">
                  Ekosistem rimbun terdegradasi parah di bawah batas aman. Hubungan hidrologi air patah.
                </p>
                <button onClick={resetGame} className="w-full py-3 bg-red-600 text-white font-extrabold text-xs uppercase tracking-widest rounded-xl">
                  Ubah Strategi Conservasi
                </button>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* --- 5. MITIGASI (FOREST CONSERVATION CARD SORTING) --- */}
        {currentPage === 'mitigasi' && (
          <motion.div 
            key="mitigasi"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex-1 overflow-y-auto no-scrollbar p-6 space-y-6 pb-20 text-left"
          >
            <div className="space-y-1">
              <span className="px-3 py-1 bg-teal-100 text-teal-700 text-[9px] font-black rounded-full uppercase tracking-widest">SIRENE EKOLOGI</span>
              <h2 className="text-3xl font-black text-stone-900 tracking-tighter uppercase italic text-teal-800">Rawat Harangan</h2>
              <p className="text-[10px] text-stone-500 font-bold max-w-xs uppercase tracking-wide leading-tight">Pilah kebiasaan perlindungan adat sehari-hari demi kelestarian rawa & satwa!</p>
            </div>

            {mitigationLeft.length > 0 ? (
              <div className="space-y-4">
                <p className="text-[9px] font-black uppercase text-stone-400 tracking-widest">Tindakan Selanjutnya:</p>
                <motion.div 
                  layout
                  className="p-5 bg-white rounded-3xl border-2 border-stone-100 shadow-xl flex flex-col gap-4"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-teal-50 text-teal-550 flex items-center justify-center shrink-0">
                      <Trees size={20} />
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
              <div className="p-6 bg-teal-50 rounded-[32px] border-2 border-dashed border-teal-200 text-center space-y-3">
                <Check className="text-teal-605 mx-auto" size={32} />
                <h4 className="font-sans font-black text-teal-800 uppercase text-xs">Seluruh Tindakan Terpilah</h4>
                <p className="text-[10px] text-stone-500 font-bold">Tekan tombol cek evaluasi jawaban untuk mengukur kecakapan konservasi Anda.</p>
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
                isActive ? 'text-teal-700' : 'text-stone-400'
              }`}
            >
              <Icon size={18} className={isActive ? 'fill-teal-500/10' : ''} />
              <span className="text-[9px] mt-1 font-bold">{item.label}</span>
              {isActive && (
                <motion.div
                  layoutId="harangan-nav-indicator"
                  className="absolute bottom-0 w-8 h-1 bg-teal-700 rounded-t-full"
                />
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
