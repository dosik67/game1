import { motion } from 'motion/react';
import { Flower2, Sprout } from 'lucide-react';

export default function MainMenu() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex flex-col items-center justify-center p-4 font-sans text-slate-800">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-extrabold text-emerald-900 mb-4">Математические Игры</h1>
        <p className="text-lg text-emerald-700 max-w-xl mx-auto">
          Выберите игру для развития математических навыков! Обе игры помогут вам лучше понять дроби.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-5xl w-full">
        {/* Game 1 Card */}
        <motion.a 
          href="/game1"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white rounded-[32px] p-8 md:p-12 shadow-xl border-4 border-[#ffd54f] flex flex-col items-center text-center group transition-all"
        >
          <div className="bg-[#fffde7] p-6 rounded-full mb-6 group-hover:rotate-12 transition-transform duration-300">
            <Flower2 size={64} className="text-[#ffb300]" />
          </div>
          <h2 className="text-3xl font-bold text-[#5a5a40] mb-4">Математическая Ромашка</h2>
          <p className="text-[#8a8a60] text-lg">Сложи и вычти дроби с одинаковыми знаменателями соревнуясь с друзьями!</p>
        </motion.a>

        {/* Game 2 Card */}
        <motion.a 
          href="/game2"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white rounded-[32px] p-8 md:p-12 shadow-xl border-4 border-emerald-300 flex flex-col items-center text-center group transition-all"
        >
          <div className="bg-emerald-50 p-6 rounded-full mb-6 group-hover:-rotate-12 transition-transform duration-300">
            <Sprout size={64} className="text-emerald-500" />
          </div>
          <h2 className="text-3xl font-bold text-emerald-800 mb-4">Математика Гүлзары</h2>
          <p className="text-emerald-600 text-lg">Жай бөлшектерді салыстыруды үйрен! Интерактивті бағбанның тапсырмалары.</p>
        </motion.a>
      </div>
    </div>
  );
}
