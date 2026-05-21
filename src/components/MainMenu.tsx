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
            Media Pembelajaran IPA Berbasis Kearifan Lokal & Eksplorasi Fenomena Alam
          </p>
        </div>
      </header>

      {/* Main Roadmap Options */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-1.5">
            <Compass size={16} className="text-[#721010]" />
            <h2 className="text-xs font-black uppercase tracking-widest text-stone-800">Pilih Jalur Belajar IPA</h2>
          </div>
          <span className="text-[9px] font-bold px-2.5 py-0.5 bg-stone-200 text-stone-600 rounded-full tracking-widest uppercase">
            4 JALUR
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {menus.map((menu, index) => {
            const Icon = menu.icon;
            return (
              <motion.button
                key={menu.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, type: 'spring', stiffness: 200, damping: 15 }}
                whileHover={{ y: -4, scale: 1.02, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.04)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => {
                  playClick();
                  onSelect(menu.id);
                }}
                className="group relative flex flex-col justify-between items-start p-4 bg-white rounded-[24px] border border-stone-200/60 aspect-square text-left overflow-hidden transition-all duration-300 shadow-sm cursor-pointer hover:border-stone-300"
              >
                {/* Decorative background accent blob */}
                <div className="absolute -right-4 -bottom-4 w-16 h-16 rounded-full opacity-[0.03] group-hover:scale-150 group-hover:opacity-[0.08] transition-all duration-500" style={{ backgroundColor: 'currentColor' }} />
                
                {/* Icon Panel */}
                <div className="flex justify-between items-start w-full">
                  <div className={`p-3 rounded-2xl ring-4 ${menu.bgRing} ${menu.bgColor} ${menu.accent} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    <Icon size={20} strokeWidth={2.5} />
                  </div>
                  <div className="text-stone-300 group-hover:text-stone-800 group-hover:translate-x-0.5 transition-all duration-300">
                    <ChevronRight size={16} strokeWidth={3} />
                  </div>
                </div>

                {/* Info block */}
                <div className="space-y-1 mt-auto">
                  <div className="flex flex-wrap items-center gap-1 mb-0.5">
                    <span className="text-[7.5px] font-black tracking-wider text-stone-400 bg-stone-100 px-1.5 py-0.5 rounded uppercase">
                      {menu.badge.split(' & ')[0]}
                    </span>
                    {menu.id === 'nias' && (
                      <span className="text-[7.5px] font-black tracking-wider text-white bg-[#721010] px-1.5 py-0.5 rounded uppercase flex items-center gap-0.5">
                        <Sparkles size={6} className="fill-white" />
                        3D
                      </span>
                    )}
                  </div>
                  <h3 className="text-xs font-black text-stone-900 leading-tight tracking-tight">
                    {menu.title}
                  </h3>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Credit Footer */}
      <footer className="pt-4 pb-2 text-center">
        <p className="text-[8px] font-bold text-stone-400 max-w-xs mx-auto leading-relaxed">
          Dirancang untuk pembelajaran mitigasi, etnosains, dan konservasi alam wilayah Sumatera Utara secara digital interaktif.
        </p>
      </footer>
    </motion.div>
  );
}
