import { motion } from 'motion/react';
import { Flower2, Sprout, ChevronRight } from 'lucide-react';

export default function MainMenu() {
  const games = [
    {
      id: 1,
      title: "Математическая Ромашка",
      desc: "Игра на сложение и вычитание дробей с одинаковыми знаменателями.",
      icon: <Flower2 className="text-[#ffb300]" size={28} />,
      bg: "bg-[#fffde7]",
      border: "border-[#ffd54f]",
      link: "/game1",
      topic: "Сложение / Вычитание"
    },
    {
      id: 2,
      title: "Математика Гүлзары",
      desc: "Интерактивные задания от бағбан-ата на сравнение жай бөлшектер (дробей).",
      icon: <Sprout className="text-emerald-500" size={28} />,
      bg: "bg-emerald-50",
      border: "border-emerald-300",
      link: "/game2",
      topic: "Салыстыру (Сравнение)"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fdfcf0] flex flex-col items-center py-16 px-4 font-sans text-slate-800">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-extrabold text-[#5a5a40] mb-3">Список Заданий</h1>
        <p className="text-md text-[#8a8a60]">
          Выберите математическую игру для развития навыков работы с дробями
        </p>
      </motion.div>

      <div className="w-full max-w-2xl flex flex-col gap-4">
        {games.map((game, index) => (
          <motion.a 
            key={game.id}
            href={game.link}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex items-center gap-6 bg-white rounded-2xl p-5 shadow-sm border-2 ${game.border} hover:shadow-md transition-all group`}
          >
            <div className={`p-4 rounded-xl ${game.bg} group-hover:scale-110 transition-transform`}>
              {game.icon}
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-1 gap-2">
                <h2 className="text-xl font-bold text-[#4a4a4a]">{game.title}</h2>
                <span className="text-xs font-bold uppercase tracking-wider text-[#8a8a60] bg-[#f0f0e0] px-2 py-1 rounded-md self-start sm:self-auto text-center whitespace-nowrap">
                  {game.topic}
                </span>
              </div>
              <p className="text-sm text-[#8a8a60] leading-relaxed pr-2">{game.desc}</p>
            </div>
            <div className="text-[#d4d4a0] group-hover:text-[#5a5a40] transition-colors pr-2 hidden sm:block">
              <ChevronRight size={24} />
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  );
}
