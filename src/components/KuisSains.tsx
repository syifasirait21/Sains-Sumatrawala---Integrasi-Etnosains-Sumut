import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { toPng } from 'html-to-image';
import { 
  HelpCircle, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  RefreshCcw, 
  Award,
  Download,
  BookOpen,
  Check,
  Trophy,
  User,
  Sparkles
} from 'lucide-react';

interface KuisSainsProps {
  onBack: () => void;
}

interface Question {
  id: number;
  question: string;
  options: string[];
  correctIdx: number;
  explanation: string;
}

export default function KuisSains({ onBack }: KuisSainsProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [studentName, setStudentName] = useState('');
  const [isFinished, setIsFinished] = useState(false);
  const [isBadgeClaimed, setIsBadgeClaimed] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const certRef = useRef<HTMLDivElement>(null);

  const questions: Question[] = [
    {
      id: 1,
      question: "Mengapa tiang fondasi 'Ehomo' pada Omo Hada Nias diletakkan di atas batu datar, bukan ditanam di dalam tanah?",
      options: [
        "Agar bangunan memiliki sistem kaku tahan roboh dangkalan tanah.",
        "Menggunakan Hukum Newton I (Inersia): Saat tanah bergerak gempa mendatar, rumah cenderung mempertahankan posisinya dan hanya bergeser bebas.",
        "Supaya rayap kayu tanah tidak bisa naik ke rangka utama.",
        "Mendekatkan ikatan tiang langsung ke pusat gravitasi inti bumi."
      ],
      correctIdx: 1,
      explanation: "Tepat! Konsep Inersia (Kelembaman) memungkinkan struktur Omo Hada tidak terguncang kaku mengikuti gerakan tanah gempa, melainkan bergeser fleksibel tanpa patah."
    },
    {
      id: 2,
      question: "Dapur magma dangkalan Toba meledak dengan dahsyat (Supervolcanic VEI-8) karena dipicu oleh kombinasi faktor fisik apa?",
      options: [
        "Aliran lava cair basaltik bersuhu sangat rendah dan hantaman meteor.",
        "Tekanan uap gas yang rendah dan kestabilan kerak lempeng rias.",
        "Magma sangat encer ber-SiO2 rendah dan letupan uap danau.",
        "Viskositas magma riolitik (kental silika tinggi) yang menyumbat gelembung gas bertemu tekanan tektonik ekstrem akibat gesekan subduksi lempeng."
      ],
      correctIdx: 3,
      explanation: "Luar biasa! Magma Riolitik yang sangat kental menghalangi gas terlepas, memicu penumpukan gas bertekanan ekstrem hingga meledak dahsyat meruntuhkan kaldera."
    },
    {
      id: 3,
      question: "Pembangkit listrik tenaga air PLTA Asahan mengubah energi kinetik aliran air Danau Toba menjadi listrik dengan prinsip fisika...",
      options: [
        "Hukum Induksi Elektro-Magnetik Faraday: Aliran deras air memutar turbin dinamo dalam kumparan medan magnet menghasilkan arus listrik.",
        "Hukum Pascal: Tekanan hidrolik air membilas muatan elektron bebas.",
        "Teori Radiasi Benda Hitam: Refleksi matahari memicu lompatan foton.",
        "Hukum Kekekalan Massa Einstein: Air terkonversi langsung menjadi muatan voltase."
      ],
      correctIdx: 0,
      explanation: "Tepat sekali! Energi mekanik putaran poros turbin yang dipancari debit air Sungai Asahan menginduksi aliran elektron di dalam generator magnet."
    },
    {
      id: 4,
      question: "Dari sisi etnobotani dan hidrologi, mengapa dilarang menebang pohon di zona 'Harangan' (Hutan Larangan Batak)?",
      options: [
        "Suku Batak tidak menyukai kayu pohon Harangan yang terlalu berserat kasar.",
        "Pohon Harangan menghasilkan senyawa racun gas yang mematikan dahan kopi.",
        "Akar pepohonan memiliki daya Kohesi (Root Cohesion) yang menyatukan butiran tanah, berfungsi menahan laju air sekaligus menyegel risiko tanah longsor bukit terjal.",
        "Hukum adat melarang karena melanggar hak migrasi lebah raksasa."
      ],
      correctIdx: 2,
      explanation: "Luar biasa! Struktur anyaman akar berfungsi mengikat sela remah tanah, menjaga stabilitas lereng sumatra dari bahaya longsor erosi."
    },
    {
      id: 5,
      question: "Bagi masyarakat adat Sumatra, jenis getah eksotis bernilai tinggi apa yang dihasilkan secara berkelanjutan di zona 'Tombak Adat'?",
      options: [
        "Kemenyan (resin getah beraroma khas Sumatra Utara).",
        "Karet sintetis kopolimer.",
        "Minyak kelapa sawit mentah (CPO).",
        "Getah pinus kimiawi industri pupuk urea."
      ],
      correctIdx: 0,
      explanation: "Benar! Kemenyan (Batak: Haminjon) disadap secara tradisional turun-temurun tanpa merusak kelestarian ekosistem rimba utama."
    }
  ];

  const currentQuestion = questions[currentIdx];

  const playSound = (url: string) => {
    try {
      const audio = new Audio(url);
      audio.volume = 0.35;
      audio.play().catch(() => {});
    } catch {}
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    
    setSelectedIdx(idx);
    setIsAnswered(true);

    if (idx === currentQuestion.correctIdx) {
      playSound('https://assets.mixkit.co/active_storage/sfx/2013/2013-preview.mp3');
      setScore(prev => prev + 20);
    } else {
      playSound('https://assets.mixkit.co/active_storage/sfx/2571/2571-preview.mp3');
    }
  };

  const handleNext = () => {
    setIsAnswered(false);
    setSelectedIdx(null);

    if (currentIdx < questions.length - 1) {
      setCurrentIdx(prev => prev + 1);
    } else {
      playSound('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3');
      setIsFinished(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
    }
  };

  const handleDownload = async () => {
    if (certRef.current === null) return;
    
    try {
      const dataUrl = await toPng(certRef.current, { cacheBust: true });
      const link = document.createElement('a');
      link.download = `Sertifikat-Sains-Sumatrawala-${studentName.replace(/\s+/g, '-') || 'Siswa'}.png`;
      link.href = dataUrl;
      link.click();
      setIsBadgeClaimed(true);
    } catch (err) {
      console.error('oops, something went wrong with downlading certificate image!', err);
    }
  };

  const resetQuiz = () => {
    setCurrentIdx(0);
    setSelectedIdx(null);
    setIsAnswered(false);
    setScore(0);
    setStudentName('');
    setIsFinished(false);
    setIsBadgeClaimed(false);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7] text-stone-900 pb-24 select-none relative">
      
      {/* Dynamic Confetti for finish */}
      <AnimatePresence>
        {showConfetti && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] pointer-events-none overflow-hidden bg-white/30 backdrop-blur-[2px]"
          >
            {Array.from({ length: 80 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  top: "40%", 
                  left: "50%", 
                  scale: 0,
                  opacity: 1
                }}
                animate={{ 
                  top: `${Math.random() * 110}%`,
                  left: `${Math.random() * 100}%`,
                  scale: Math.random() * 1.8 + 0.6,
                  rotate: Math.random() * 720,
                  opacity: [1, 1, 0]
                }}
                transition={{ 
                  duration: 4, 
                  ease: "circOut",
                  delay: Math.random() * 0.4
                }}
                className="absolute w-3 h-3 rounded-full shadow-md"
                style={{ 
                  backgroundColor: ['#D4AF37', '#8B0000', '#22C55E', '#3B82F6', '#FF8C00'][Math.floor(Math.random() * 5)] 
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sticky Header */}
      <header className="p-4 bg-white border-b border-stone-200/60 sticky top-0 z-40 flex items-center justify-between shadow-sm">
        <button 
          onClick={onBack}
          className="p-2 border border-stone-200 bg-stone-50 hover:bg-stone-100 rounded-full text-stone-600 transition-colors flex items-center justify-center"
        >
          <ArrowLeft size={16} strokeWidth={2.5} />
        </button>
        <div className="text-center">
          <p className="text-[9px] font-black uppercase text-amber-500 tracking-widest">EVALUASI AKADEMIK</p>
          <h2 className="text-base font-black text-stone-800 tracking-tight italic uppercase">Kuis Sains Terpadu</h2>
        </div>
        <div className="w-10 h-10 flex items-center justify-center shrink-0 grayscale opacity-20">
          <img src="/Lambang_Universitas_Negeri_Medan.png" className="w-6 h-6 object-contain" alt="Logo" />
        </div>
      </header>

      <div className="p-6 flex flex-col items-center">
        {!isFinished ? (
          <div className="w-full max-w-sm space-y-6">
            
            {/* Progress counter */}
            <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest text-stone-400">
              <span>Pertanyaan ke-{currentIdx + 1} dari 5</span>
              <span className="text-stone-900 bg-stone-100 px-2.5 py-0.5 rounded-full">Nilai: {score} / 100</span>
            </div>

            {/* Custom Progress bar */}
            <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 transition-all duration-300 rounded-full" 
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>

            {/* Question Card */}
            <div className="bg-white p-6 rounded-[32px] border border-stone-200/50 shadow-md text-left space-y-4">
              <h3 className="text-base font-extrabold text-stone-900 leading-snug">
                {currentQuestion.question}
              </h3>
            </div>

            {/* Options list */}
            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedIdx === idx;
                const isCorrect = idx === currentQuestion.correctIdx;
                
                let btnStyle = "bg-white border-stone-200/60 text-stone-700 hover:border-amber-400 active:border-amber-500 shadow-sm";
                let iconBlock = null;

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = "bg-green-50 border-green-500 text-green-800 font-bold shadow-green-100";
                    iconBlock = <CheckCircle2 className="text-green-600 shrink-0" size={16} />;
                  } else if (isSelected) {
                    btnStyle = "bg-red-50 border-red-500 text-red-800 font-bold shadow-red-100";
                    iconBlock = <XCircle className="text-red-600 shrink-0" size={16} />;
                  } else {
                    btnStyle = "bg-stone-50 border-stone-100 text-stone-400 opacity-60";
                  }
                }

                return (
                  <motion.button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    whileTap={{ scale: 0.98 }}
                    className={`w-full text-left p-4.5 rounded-[24px] border-2 text-xs font-semibold leading-relaxed transition-all flex justify-between items-center gap-4 ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {iconBlock}
                  </motion.button>
                );
              })}
            </div>

            {/* Feedbacks and Next Button */}
            <AnimatePresence>
              {isAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white p-6 rounded-[28px] border-2 border-stone-200 shadow-md text-left space-y-3"
                >
                  <p className="text-[10px] font-black uppercase tracking-wider text-stone-400">Pelajaran Sains Terintegrasi:</p>
                  <p className="text-xs font-medium leading-relaxed text-stone-600">
                    {currentQuestion.explanation}
                  </p>
                  
                  <button
                    onClick={handleNext}
                    className="w-full py-4.5 bg-stone-900 text-white font-extrabold text-xs uppercase tracking-wider rounded-[20px] shadow-lg transition"
                  >
                    {currentIdx < questions.length - 1 ? 'Pertanyaan Selanjutnya' : 'Kirim Jawaban & Lihat Hasil'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        ) : (
          // COMPLETED FINISH STATE: INPUT NAME & CLAIM BADGE
          <div className="w-full max-w-sm space-y-6">
            
            {/* Scoring visual card */}
            <div className="bg-white p-8 rounded-[40px] border-2 border-stone-200 shadow-lg text-center space-y-4">
              <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto">
                <Trophy size={36} strokeWidth={2.5} />
              </div>
              
              <div className="space-y-1">
                <span className="text-[10px] font-black tracking-widest text-amber-600 uppercase">HASIL EVALUASI SELESAI</span>
                <h3 className="text-3xl font-black italic tracking-tighter uppercase text-stone-950">Skor Anda: {score} / 100</h3>
                <p className="text-[11px] font-bold text-stone-500 leading-normal px-4">
                  {score >= 80 
                    ? 'Sangat mengagumkan! Anda menguasai seluruh konsep fisika, geologi, dan etnosains Sumatra dengan nilai gemilang.' 
                    : 'Keren! Pemahaman sains lokalmu sudah sangat bagus. Silakan cetak sertifikat kelulusanmu.'
                  }
                </p>
              </div>
            </div>

            {/* Input Name Block */}
            <div className="bg-white p-6 rounded-[28px] border border-stone-100 shadow-md flex flex-col gap-3 text-left">
              <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest px-1">Masukkan Nama Anda untuk Sertifikat:</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-stone-400">
                  <User size={16} />
                </div>
                <input 
                  type="text" 
                  maxLength={25}
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Ketik nama lengkap siswa..."
                  className="w-full py-4 pl-12 pr-4 bg-stone-50 border-2 border-stone-200/80 rounded-2xl text-xs font-bold focus:border-stone-900 focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Hidden Certificate in DOM to capture as image */}
            <div className="absolute left-[-9999px] top-[-9999px]">
              <div 
                ref={certRef}
                className="w-[600px] h-[450px] bg-white p-8 border-[12px] border-amber-500 shadow-2xl relative overflow-hidden flex flex-col items-center justify-between text-center select-none"
                style={{ fontFamily: '"Plus Jakarta Sans", sans-serif' }}
              >
                {/* Traditional Background Pattern inside */}
                <div className="absolute inset-0 opacity-[0.04] pointer-events-none" 
                     style={{ 
                       backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30-30-30z' fill='%23000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                       backgroundSize: '24px 24px'
                     }} 
                />

                <div className="w-full flex justify-between items-center opacity-80 border-b border-stone-200 pb-3 z-10">
                  <div className="flex items-center gap-2">
                    <img src="/Lambang_Universitas_Negeri_Medan.png" className="w-10 h-10 object-contain" alt="Logo" />
                    <div className="text-left leading-none">
                      <p className="text-[10px] font-black text-stone-900 uppercase">UNIVERSITAS NEGERI MEDAN</p>
                      <p className="text-[7.5px] font-bold text-stone-500 uppercase tracking-widest mt-0.5">PENDIDIKAN IPA INTERAKTIF</p>
                    </div>
                  </div>
                  
                  <span className="font-mono text-[8px] text-stone-400 font-bold uppercase tracking-wider">REG: UNIMED-IPA-{Date.now().toString().slice(-6)}</span>
                </div>

                <div className="space-y-4 z-10 py-4 flex-1 flex flex-col justify-center">
                  <div className="flex justify-center items-center gap-1.5 opacity-60">
                    <Trophy size={16} className="text-amber-500 fill-amber-500" />
                    <span className="text-[8.5px] font-black text-stone-500 uppercase tracking-[0.3em]">PIAGAM KELULUSAN AKADEMIK</span>
                  </div>
                  
                  <h1 className="text-4xl font-extrabold text-[#721010] uppercase tracking-tighter italic leading-none">Master Sains Sumatra</h1>

                  <div className="space-y-1.5">
                    <p className="text-[9.5px] font-bold text-stone-400 uppercase tracking-[0.2em] leading-none">Diberikan Kepada Siswa Berprestasi:</p>
                    <p className="text-2xl font-black text-stone-900 uppercase underline decoration-amber-500 decoration-3 underline-offset-4 tracking-tight">
                      {studentName || 'SISWA CONTOH'}
                    </p>
                  </div>

                  <p className="text-xs font-bold leading-relaxed text-stone-600 max-w-sm mx-auto">
                    Telah berhasil menyelesaikan pembelajaran ujian komparatif Sains Terpadu mencakup fisika inersia gempa Nias, tektonika Toba, rekayasa energi baru terbarukan, dan etnobotani perlindungan hutan adat Harangan.
                  </p>
                </div>

                <div className="w-full pt-4 border-t border-stone-100 flex justify-between items-end z-10">
                  <div className="text-left leading-none">
                    <p className="text-[8px] font-black text-[#721010] uppercase tracking-widest">KATEGORI NILAI:</p>
                    <p className="text-base font-mono font-black text-stone-900 mt-1">
                      SKOR {score} / 100
                    </p>
                  </div>

                  <div className="bg-amber-100 text-amber-800 p-2 text-stone-900 rounded-[14px] flex items-center justify-center gap-1.5 border border-amber-200">
                    <Award size={18} className="text-amber-600 animate-bounce" />
                    <span className="text-[9px] font-black uppercase tracking-widest font-sans">AGRAPANA SAINS</span>
                  </div>
                </div>

                {/* Aesthetic side glow */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />
              </div>
            </div>

            {/* Cert actions buttons */}
            <button
              onClick={handleDownload}
              disabled={!studentName.trim()}
              className={`w-full py-5 rounded-[28px] font-black text-xs shadow-xl active:scale-95 transition-all flex items-center justify-center gap-3 border-b-4 ${
                !studentName.trim()
                  ? 'bg-stone-100 text-stone-400 cursor-not-allowed border-stone-200 opacity-60'
                  : isBadgeClaimed 
                    ? 'bg-amber-500 text-stone-950 border-amber-700' 
                    : 'bg-stone-900 text-white border-stone-950 hover:bg-stone-850'
              }`}
            >
              <Download size={16} />
              {isBadgeClaimed ? 'SIMPAN SERTIFIKAT BERHASIL' : 'CETAK PIAGAM KELULUSAN'}
            </button>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={resetQuiz}
                className="py-4 bg-white border-2 border-stone-200 hover:border-stone-300 text-stone-700 font-extrabold text-xs uppercase tracking-wider rounded-2xl active:scale-95 transition"
              >
                Ulangi Kuis
              </button>
              <button
                onClick={onBack}
                className="py-4 bg-stone-150 text-stone-600 hover:bg-stone-200 font-extrabold text-xs uppercase tracking-wider rounded-2xl active:scale-95 transition"
              >
                Menu Utama
              </button>
            </div>

          </div>
        )}
      </div>

    </div>
  );
}
