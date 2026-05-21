import React from 'react';
import { motion } from 'motion/react';
import { 
  Home, 
  Flame, 
  Leaf, 
  Trees, 
  HelpCircle, 
  BookOpen, 
  ChevronRight,
  Compass,
  Sparkles,
  Award
} from 'lucide-react';

interface MainMenuProps {
  onSelect: (phase: 'nias' | 'toba' | 'hijau' | 'harangan' | 'kuis') => void;
}

export default function MainMenu({ onSelect }: MainMenuProps) {
  const menus = [
    {
      id: 'nias' as const,
      title: 'Rahasia "Rumah Anti-Goyang" Nias',
      desc: 'Eksplorasi etnosains Omo Hada, struktur kayu ajaib penakluk gempa dengan simulasi 3D.',
      icon: Home,
      accent: 'text-red-600',
      bgRing: 'ring-red-100',
      bgColor: 'bg-red-50',
      bannerColor: 'bg-gradient-to-r from-red-600 to-amber-600',
      badge: 'ETNOSAINS & FISIKA'
    },
    {
      id: 'toba' as const,
      title: 'Amukan Raksasa Toba',
      desc: 'Dahsyatnya erupsi supervulkan purba, pembentukan kaldera mega-besar & ilmu vulkanologi.',
      icon: Flame,
      accent: 'text-orange-600',
      bgRing: 'ring-orange-100',
      bgColor: 'bg-orange-50',
      bannerColor: 'bg-gradient-to-r from-orange-600 to-red-600',
      badge: 'GEOLOGI & VOLKANOLOGI'
    },
    {
      id: 'hijau' as const,
      title: 'Panggung Hijau',
      desc: 'Transisi energi bersih khas Sumatra utara: Geotermal, Hidroelektrik, & kestabilan ekologi.',
      icon: Leaf,
      accent: 'text-emerald-600',
      bgRing: 'ring-emerald-100',
      bgColor: 'bg-emerald-50',
      bannerColor: 'bg-gradient-to-r from-emerald-600 to-teal-600',
      badge: 'ENERGI BARU TERBARUKAN'
    },
    {
      id: 'harangan' as const,
      title: 'Kearifan Hutan Larangan (Harangan)',
      desc: 'Sistem zonasi hutan adat Batak, konservasi iklim mikro, & pelestarian keanekaragaman hayati.',
      icon: Trees,
      accent: 'text-teal-700',
      bgRing: 'ring-teal-100',
      bgColor: 'bg-teal-50',
      bannerColor: 'bg-gradient-to-r from-teal-700 to-emerald-700',
      badge: 'EKOLOGI & BIODIVERSITAS'
    }
  ];

  const playClick = () => {
    try {
      const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
      audio.volume = 0.3;
      audio.play().catch(() => {});
    } catch {}
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="p-6 space-y-8 h-full bg-cream-bg relative overflow-y-auto no-scrollbar"
    >
      {/* Repeating Nias/Batak Geometric Pattern Background */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none -z-10" 
           style={{ 
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30-30-30z' fill='%23000' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
             backgroundSize: '30px 30px'
           }} 
      />

      {/* Floating abstract decorative shapes */}
      <div className="absolute -top-12 -left-12 w-48 h-48 bg-brick-red/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      <div className="absolute top-[40%] -right-16 w-56 h-56 bg-emerald-600/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header Panel */}
      <header className="flex flex-col items-center text-center space-y-4 pt-4 border-b-2 border-dashed border-stone-300/40 pb-6">
        <div className="flex items-center gap-3">
          <img 
            src="/Lambang_Universitas_Negeri_Medan.png" 
            alt="UNIMED" 
            className="w-12 h-12 object-contain drop-shadow-sm" 
          />
          <div className="text-left">
            <h3 className="text-stone-900 font-extrabold text-[11px] leading-tight tracking-tight uppercase italic">UNIVERSITAS NEGERI MEDAN</h3>
            <p className="text-[9px] font-black tracking-widest text-[#721010] uppercase">PENDIDIKAN IPA</p>
          </div>
        </div>
        
        <div className="space-y-1">
          <h1 className="text-3xl font-black text-stone-900 tracking-tighter leading-none italic uppercase">
            Sains <span className="text-[#721010]">Sumatrawala</span>
          </h1>
          <p className="text-[10px] font-bold text-stone-500 uppercase tracking-widest px-4 max-w-sm mx-auto">
            Metode Pembelajaran IPA Berbasis Kearifan Lokal & Eksplorasi Fenomena Alam
          </p>
        </div>
      </header>

      {/* Main Roadmap Options */}
      <div className="space-y-5">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Compass size={16} className="text-[#721010]" />
            <h2 className="text-xs font-black uppercase tracking-widest text-stone-800">Pilih Jalur Belajar IPA</h2>
          </div>
          <span className="text-[9px] font-bold px-2.5 py-0.5 bg-stone-200 text-stone-600 rounded-full tracking-widest uppercase">
            4 JALUR
          </span>
        </div>

        <div className="space-y-4">
          {menus.map((menu, index) => {
            const Icon = menu.icon;
            return (
              <motion.button
                key={menu.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.08, type: 'spring', stiffness: 260, damping: 20 }}
                whileHover={{ y: -4, scale: 1.015 }}
                whileTap={{ scale: 0.985 }}
                onClick={() => {
                  playClick();
                  onSelect(menu.id);
                }}
                className="w-full text-left bg-white rounded-[28px] border border-stone-200/60 p-5 shadow-sm hover:shadow-xl active:shadow-md transition-shadow duration-300 relative overflow-hidden group flex gap-4 items-start"
              >
                {/* Background Banner accent color on hover */}
                <div className="absolute top-0 left-0 w-1.5 h-full transition-all group-hover:w-3 duration-300" style={{ backgroundColor: 'currentColor' }} />
                
                {/* Visual Icon Container */}
                <div className={`p-4 rounded-2xl ring-4 ${menu.bgRing} ${menu.bgColor} ${menu.accent} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shrink-0`}>
                  <Icon size={24} strokeWidth={2.5} />
                </div>

                {/* Text Block */}
                <div className="space-y-1.5 flex-1 pr-6 relative">
                  <div className="flex items-center gap-2">
                    <span className="text-[8px] font-black tracking-widest text-stone-400 bg-stone-100 px-2 py-0.5 rounded-full uppercase">
                      {menu.badge}
                    </span>
                    {menu.id === 'nias' && (
                      <span className="text-[8px] font-black tracking-widest text-white bg-amber-500 px-2 py-0.5 rounded-full uppercase flex items-center gap-1">
                        <Sparkles size={8} className="fill-white" />
                        3D MODEL
                      </span>
                    )}
                  </div>
                  <h3 className="text-base font-black text-stone-900 leading-tight tracking-tight pr-4">
                    {menu.title}
                  </h3>
                  <p className="text-[10px] text-stone-600 font-bold leading-normal pr-4">
                    {menu.desc}
                  </p>
                </div>

                {/* Circle Arrow on hover */}
                <div className="absolute bottom-5 right-5 w-8 h-8 rounded-full bg-stone-50 border border-stone-100 flex items-center justify-center text-stone-300 group-hover:bg-stone-900 group-hover:text-white group-hover:border-stone-900 transition-all duration-300 shadow-sm shrink-0">
                  <ChevronRight size={16} strokeWidth={3} />
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Credit Footer */}
      <footer className="pt-8 pb-4 text-center space-y-2">
        <p className="text-[8px] font-bold text-stone-400 max-w-xs mx-auto leading-relaxed">
          Dirancang untuk pembelajaran mitigasi, etnosains, dan konservasi alam wilayah Sumatera Utara secara digital interaktif.
        </p>
      </footer>
    </motion.div>
  );
}
