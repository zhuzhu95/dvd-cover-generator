import { Disc3, CassetteTape, HardDrive, Box, CircleDot, Music, Square } from 'lucide-react';

const products = [
  { name: 'Betamax', icon: CassetteTape, free: false },
  { name: 'VHS标签', icon: CassetteTape, free: true },
  { name: 'Blockbuster', icon: Box, free: true },
  { name: '套封', icon: Square, free: false },
  { name: '蓝光封面', icon: Disc3, free: false },
  { name: '卡带', icon: CassetteTape, free: false },
  { name: '黑胶标签', icon: Music, free: false },
  { name: 'CD', icon: CircleDot, free: false },
  { name: 'MD标签', icon: HardDrive, free: false },
  { name: '卡盒', icon: Box, free: false },
];

export default function HeroSection() {
  return (
    <section className="w-full py-6 px-4">
      <div className="max-w-4xl mx-auto text-center">
        {/* 3D Title */}
        <h1
          className="text-5xl md:text-7xl font-black tracking-tight mb-3"
          style={{
            background: 'linear-gradient(135deg, #0d9488 0%, #06b6d4 50%, #0891b2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            filter: 'drop-shadow(3px 3px 0px rgba(6, 182, 212, 0.3)) drop-shadow(6px 6px 0px rgba(6, 182, 212, 0.2))',
          }}
        >
          DVD 封面生成器
        </h1>
        <p className="text-slate-500 text-sm mb-6">制作可打印的DVD盒套</p>

        {/* Product Navigation */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          {products.map((product) => (
            <button
              key={product.name}
              className="relative flex flex-col items-center gap-1 group transition-transform hover:scale-105"
            >
              <div className="w-12 h-16 bg-gradient-to-b from-slate-700 to-slate-900 rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden">
                <product.icon className="w-6 h-6 text-slate-300" />
                {product.free && (
                  <span className="absolute top-0.5 right-0.5 bg-sky-400 text-white text-[8px] font-bold px-1 rounded">
                    FREE
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-500 group-hover:text-slate-700 transition-colors">
                {product.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
