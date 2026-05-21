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
            <header className="space-y-2">
              <div className="flex border-b-2 border-dashed border-stone-200 pb-2 mb-4">
                <span className="text-teal-600 font-black text-[10px] uppercase tracking-[0.2em] italic">Hukum Konservasi Adat</span>
              </div>
              <h1 className="text-3xl font-black text-stone-900 tracking-tighter leading-none uppercase italic">Ilmu Konservasi <br />Leluhur Batak</h1>
            </header>

            <div className="relative aspect-video bg-stone-900 rounded-[32px] overflow-hidden shadow-xl border-4 border-white flex flex-col items-center justify-center p-6 text-center group">
              <div className="absolute inset-0 bg-gradient-to-t from-teal-950 via-stone-900 to-[#0e1613] opacity-95 z-0" />
              <div className="absolute inset-0 pointer-events-none opacity-20">
                {[...Array(10)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      y: ['-10%', '110%'],
                      opacity: [0, 1, 0]
                    }}
                    transition={{
                      duration: 6 + Math.random() * 4,
                      repeat: Infinity,
                      delay: i * 0.5
                    }}
                    className="absolute w-1.5 h-6 bg-teal-400 rounded-full"
                    style={{ left: `${Math.random() * 100}%` }}
                  />
                ))}
              </div>

              <div className="space-y-2 z-10">
                <Compass size={40} className="text-teal-400 mx-auto animate-spin" style={{ animationDuration: '8s' }} />
                <p className="font-black text-white text-base tracking-tight uppercase italic leading-none">Hutan Adat Harangan</p>
                <p className="text-[10px] font-semibold text-stone-300 max-w-[270px] mx-auto leading-normal">
                  Sistem pemetaan tradisional Batak membagi rimba menjadi tiga sabuk penyangga demi kelestarian alam bersama.
                </p>
              </div>

              <span className="absolute bottom-3 right-4 text-[8px] font-mono text-stone-500 uppercase tracking-widest z-10 font-black">ADAT CONSERVATION RULES</span>
            </div>

            <div className="space-y-4 text-stone-800 leading-relaxed text-sm font-medium">
              <p>
                Tetua adat sadar bahwa hilangnya pohon tutupan di lereng perbukitan terjal akan merobek pertahanan rembes air permukaan, memicu keringnya sumur-sumur desa seketika.
              </p>
              <div className="bg-teal-500/5 p-5 rounded-[24px] border-2 border-teal-500/10 border-dashed">
                <p className="italic font-black text-teal-700 uppercase tracking-tight text-xs">
                  "Zona sakral Harangan dilarang ditebang seujung dahan pun. Ini adalah penahan alami banjir aliran air tanah."
                </p>
              </div>
              <p>
                Ayo cari tahu bagaimana akar menyatukan butiran lereng bukit dari perspektif fisika kohesi tanah!
              </p>
            </div>

            <button 
              onClick={() => setCurrentPage('meaningful')}
              className="w-full bg-teal-700 text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 shadow-2xl active:scale-95 transition-transform uppercase tracking-widest text-xs border-b-4 border-teal-950"
            >
              Mulai Ulas Sains Ekologi
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
                Sains Kohesi Tanah<br/>
                <span className="text-xs font-bold block text-teal-600 tracking-widest">(Mekanika Struktur Akar)</span>
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
                
                {/* Visual grid graphic representing zoning rules and structure */}
                <div className="w-full p-4 bg-stone-50 rounded-[32px] border border-stone-200 shadow-inner space-y-4">
                  <div className="grid grid-cols-3 gap-2">
                    <div className="bg-teal-900 text-white p-3 rounded-2xl text-center space-y-1">
                      <Trees size={20} className="mx-auto" />
                      <p className="font-black text-[8px] uppercase tracking-tighter">1. Harangan</p>
                      <p className="text-[6px] text-stone-300">Zonasi Tutupan Total</p>
                    </div>
                    <div className="bg-yellow-750 text-white p-3 rounded-2xl text-center space-y-1">
                      <Compass size={20} className="mx-auto" />
                      <p className="font-black text-[8px] uppercase tracking-tighter">2. Tombak</p>
                      <p className="text-[6px] text-stone-200">Menyadap Kemenyan</p>
                    </div>
                    <div className="bg-orange-800 text-white p-3 rounded-2xl text-center space-y-1">
                      <Heart size={20} className="mx-auto" />
                      <p className="font-black text-[8px] uppercase tracking-tighter">3. Gadung</p>
                      <p className="text-[6px] text-stone-200">Multi Kebun Kopi</p>
                    </div>
                  </div>
                  <span className="text-[9px] font-mono font-bold text-stone-400 uppercase tracking-widest text-center block">SABUK ADAT LINGKUNGAN BATAK</span>
                </div>

                {/* Tab selectors */}
                <div className="flex p-1.5 bg-stone-100 rounded-[32px] items-center">
                  <button 
                    onClick={() => setActiveTab('zonasi')}
                    className={`h-[35px] flex-1 rounded-[28px] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      activeTab === 'zonasi' ? 'bg-white text-teal-600 shadow-md' : 'text-stone-400'
                    }`}
                  >
                    <BookOpen size={14} />
                    Zonasi Rimba
                  </button>
                  <button 
                    onClick={() => setActiveTab('hidrologi')}
                    className={`h-[35px] flex-1 rounded-[28px] font-black text-[10px] uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
                      activeTab === 'hidrologi' ? 'bg-stone-900 text-teal-450 shadow-md' : 'text-stone-400'
                    }`}
                  >
                    <Zap size={14} />
                    Kohesi Tanah
                  </button>
                </div>

                <div className="bg-white rounded-[40px] shadow-xl border-2 border-stone-100 p-8">
                  <AnimatePresence mode="wait">
                    {activeTab === 'zonasi' ? (
                      <motion.div
                        key="zonasi"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-teal-600" />
                          <h3 className="text-[20px] font-black text-stone-900 tracking-tighter uppercase italic">Adat & Resapan</h3>
                        </div>
                        <p className="text-stone-700 text-sm font-semibold leading-relaxed">
                          Masyarakat adat membelah hutan adat menjadi tiga zona fungsional (Harangan sakral, Tombak yang dimanfaatkan untuk getah kemenyan haminjon, dan Pargadungan agro). Struktur ini mengunci kelestarian ekologi tanpa mematikan mata pencaharian warga.
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="hidrologi"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="space-y-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 rounded-full bg-emerald-500" />
                          <h3 className="text-[20px] font-black text-stone-900 tracking-tighter uppercase italic">Sains Kohesi Akar</h3>
                        </div>
                        <p className="text-stone-700 text-sm font-semibold leading-relaxed">
                          Anyaman biologis dari akar <strong className="text-emerald-600">Bamboo</strong> & rumput <strong className="text-emerald-600">Vetiver</strong> memiliki struktur anyaman berserat padat yang menembus dangkalan batuan dalam. Anyaman ini bertindak laksana jangkar pasak menyebarkan gaya geser air hujan sehingga tebing tetap kaku tahan longsor.
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <button 
                  onClick={() => setCurrentPage('joyful')}
                  className="w-full bg-stone-900 hover:bg-stone-850 text-white font-black py-5 rounded-[24px] flex items-center justify-center gap-3 shadow-xl active:scale-95 transition-transform uppercase tracking-widest text-xs"
                >
                  Mulai Game Penjaga Harangan
                  <Trees size={14} className="text-teal-400" />
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
      )}
    </div>
  );
}
