/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion } from 'motion/react';
import { Flower2, Bug, Sun, Sprout, CheckCircle2, ArrowRight } from 'lucide-react';

// Helper component to display fractions nicely
const Fraction = ({ n, d }: { n: number; d: number }) => (
  <span className="inline-flex flex-col items-center align-middle font-bold mx-1 text-xl">
    <span className="border-b-2 border-current px-1 leading-tight">{n}</span>
    <span className="leading-tight">{d}</span>
  </span>
);

export default function App() {
  // State for Task 1
  const [task1Answer, setTask1Answer] = useState<string | null>(null);
  
  // State for Task 2
  const [task2Answer, setTask2Answer] = useState<string | null>(null);

  // State for Task 3 (Bouquet Game)
  const bouquetFractions = [3, 7, 1, 9, 5, 2];
  const correctOrder = [1, 2, 3, 5, 7, 9];
  const [picked, setPicked] = useState<number[]>([]);
  const [shake, setShake] = useState<number | null>(null);

  // State for Task 4
  const [task4Answer, setTask4Answer] = useState<string | null>(null);

  // State for Task 5
  const [task5Answers, setTask5Answers] = useState<Record<number, string | null>>({
    1: null,
    2: null,
    3: null
  });

  const handleTask5Answer = (questionId: number, answer: string) => {
    setTask5Answers(prev => ({ ...prev, [questionId]: answer }));
  };

  const handlePickFlower = (num: number) => {
    if (picked.includes(num)) return;
    
    const nextCorrect = correctOrder[picked.length];
    if (num === nextCorrect) {
      setPicked([...picked, num]);
    } else {
      setShake(num);
      setTimeout(() => setShake(null), 500);
    }
  };

  const resetBouquet = () => setPicked([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 text-slate-800 font-sans pb-20">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500 p-2 rounded-xl text-white">
              <Sprout size={28} />
            </div>
            <h1 className="text-2xl font-bold text-emerald-800">Математика Гүлзары</h1>
          </div>
          <Sun className="text-amber-400 animate-[spin_10s_linear_infinite]" size={32} />
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 mt-8 space-y-12">
        
        {/* Intro */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-extrabold text-emerald-900">
            Жай бөлшектерді салыстыру
          </h2>
          <p className="text-lg text-emerald-700 max-w-2xl mx-auto">
            Бағбан атаның сиқырлы гүлзарына қош келдіңіз! Бүгін біз гүлдер мен аралардың көмегімен бөлшектерді салыстыруды үйренеміз.
          </p>
        </div>

        {/* Task 1: Same Denominator */}
        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-emerald-200/50 border border-emerald-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-rose-100 p-3 rounded-full text-rose-500">
              <Flower2 size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">1. Кімнің күлтесі көп?</h3>
          </div>
          
          <p className="text-lg mb-8">
            Бағбан екі сиқырлы раушан өсірді. Біріншісінің <Fraction n={5} d={9} /> бөлігі, ал екіншісінің <Fraction n={2} d={9} /> бөлігі қызыл. Қай раушанның қызыл күлтелері көбірек?
          </p>

          <div className="flex flex-col md:flex-row items-center justify-center gap-12 mb-8">
            {/* Flower 1 */}
            <div className="flex flex-col items-center gap-4">
              <div className="grid grid-cols-3 gap-2 w-32 h-32 p-2 bg-rose-50 rounded-2xl">
                {Array.from({ length: 9 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`rounded-full ${i < 5 ? 'bg-rose-500 shadow-sm' : 'bg-white'}`}
                  />
                ))}
              </div>
              <div className="text-2xl"><Fraction n={5} d={9} /></div>
            </div>

            {/* Comparison Logic */}
            <div className="flex gap-4">
              <button 
                onClick={() => setTask1Answer('>')}
                className={`w-16 h-16 text-3xl font-bold rounded-2xl transition-all ${task1Answer === '>' ? 'bg-emerald-500 text-white shadow-lg scale-110' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
              >
                &gt;
              </button>
              <button 
                onClick={() => setTask1Answer('<')}
                className={`w-16 h-16 text-3xl font-bold rounded-2xl transition-all ${task1Answer === '<' ? 'bg-rose-500 text-white shadow-lg scale-110' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}
              >
                &lt;
              </button>
            </div>

            {/* Flower 2 */}
            <div className="flex flex-col items-center gap-4">
              <div className="grid grid-cols-3 gap-2 w-32 h-32 p-2 bg-rose-50 rounded-2xl">
                {Array.from({ length: 9 }).map((_, i) => (
                  <motion.div 
                    key={i}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`rounded-full ${i < 2 ? 'bg-rose-500 shadow-sm' : 'bg-white'}`}
                  />
                ))}
              </div>
              <div className="text-2xl"><Fraction n={2} d={9} /></div>
            </div>
          </div>

          {task1Answer === '>' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="text-emerald-500" />
              <p><strong>Дұрыс!</strong> Бөлімдері бірдей болғанда, алымы үлкен бөлшек үлкен болады. 5 күлте 2 күлтеден көп!</p>
            </motion.div>
          )}
          {task1Answer === '<' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-rose-50 text-rose-700 p-4 rounded-xl">
              Қайта ойланып көріңізші. 5 күлте көп пе, әлде 2 күлте ме?
            </motion.div>
          )}
        </section>

        {/* Task 2: Same Numerator */}
        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-emerald-200/50 border border-emerald-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-amber-100 p-3 rounded-full text-amber-500">
              <Bug size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">2. Араның таңдауы</h3>
          </div>
          
          <p className="text-lg mb-8">
            Ара екі гүлге қонды. Бірінші гүл 2 үлкен күлтеден тұрады, ара оның <Fraction n={1} d={2} /> бөлігінен шырын ішті. Екінші гүл 6 кішкентай күлтеден тұрады, ара оның <Fraction n={1} d={6} /> бөлігінен шырын ішті. Ара қай гүлден көбірек шырын ішті?
          </p>

          <div className="space-y-8 mb-8">
            {/* Bar 1 */}
            <div className="flex items-center gap-6">
              <div className="w-20 text-right text-2xl"><Fraction n={1} d={2} /></div>
              <div className="flex-1 h-16 flex rounded-2xl overflow-hidden border-4 border-amber-100 bg-white">
                <div className="flex-1 bg-amber-400 border-r-4 border-amber-100 flex items-center justify-center">
                  <Bug className="text-amber-900 opacity-50" />
                </div>
                <div className="flex-1 bg-slate-50"></div>
              </div>
            </div>

            {/* Bar 2 */}
            <div className="flex items-center gap-6">
              <div className="w-20 text-right text-2xl"><Fraction n={1} d={6} /></div>
              <div className="flex-1 h-16 flex rounded-2xl overflow-hidden border-4 border-amber-100 bg-white">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className={`flex-1 border-r-4 border-amber-100 last:border-r-0 flex items-center justify-center ${i === 0 ? 'bg-amber-400' : 'bg-slate-50'}`}>
                    {i === 0 && <Bug className="text-amber-900 opacity-50" size={16} />}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <button 
              onClick={() => setTask2Answer('>')}
              className={`px-8 py-4 text-2xl font-bold rounded-2xl transition-all ${task2Answer === '>' ? 'bg-emerald-500 text-white shadow-lg scale-105' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              <Fraction n={1} d={2} /> &gt; <Fraction n={1} d={6} />
            </button>
            <button 
              onClick={() => setTask2Answer('<')}
              className={`px-8 py-4 text-2xl font-bold rounded-2xl transition-all ${task2Answer === '<' ? 'bg-rose-500 text-white shadow-lg scale-105' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              <Fraction n={1} d={2} /> &lt; <Fraction n={1} d={6} />
            </button>
          </div>

          {task2Answer === '>' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="text-emerald-500 shrink-0" />
              <p><strong>Өте тамаша!</strong> Гүлді неғұрлым АЗ бөлікке бөлсек (бөлімі кіші болса), оның әрбір күлтесі соғұрлым ҮЛКЕН болады!</p>
            </motion.div>
          )}
          {task2Answer === '<' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-rose-50 text-rose-700 p-4 rounded-xl">
              Суретке мұқият қараңызшы. Қай сары бөлік үлкенірек көрінеді?
            </motion.div>
          )}
        </section>

        {/* Task 3: Bouquet Ordering */}
        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-emerald-200/50 border border-emerald-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-full text-purple-500">
                <Flower2 size={24} />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">3. Сиқырлы гүл шоғы</h3>
            </div>
            {picked.length === 6 && (
              <button onClick={resetBouquet} className="text-sm bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg font-medium transition-colors">
                Қайта бастау
              </button>
            )}
          </div>
          
          <p className="text-lg mb-8">
            Бағбанға гүл шоғын жинауға көмектес! Гүлдерді <strong>кішісінен үлкеніне қарай (өсу ретімен)</strong> басып шық.
          </p>

          {/* Target Area */}
          <div className="h-32 bg-purple-50 rounded-2xl border-2 border-dashed border-purple-200 mb-8 flex items-center justify-center gap-2 p-4">
            {picked.length === 0 ? (
              <span className="text-purple-300 font-medium">Гүлдер осында жиналады...</span>
            ) : (
              picked.map((num, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ scale: 0, rotate: -20 }}
                  animate={{ scale: 1, rotate: 0 }}
                  className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-purple-200"
                >
                  <Fraction n={num} d={10} />
                </motion.div>
              ))
            )}
          </div>

          {/* Flowers to pick */}
          <div className="flex flex-wrap justify-center gap-4">
            {bouquetFractions.map((num) => {
              const isPicked = picked.includes(num);
              const isShaking = shake === num;
              
              return (
                <motion.button
                  key={num}
                  animate={isShaking ? { x: [-10, 10, -10, 10, 0] } : {}}
                  transition={{ duration: 0.4 }}
                  onClick={() => handlePickFlower(num)}
                  disabled={isPicked}
                  className={`relative w-24 h-24 rounded-full flex items-center justify-center text-xl transition-all duration-300
                    ${isPicked 
                      ? 'bg-slate-100 text-slate-300 scale-90 border-2 border-slate-200' 
                      : 'bg-white border-4 border-purple-400 text-purple-700 hover:bg-purple-50 hover:scale-105 shadow-md hover:shadow-xl cursor-pointer'
                    }
                  `}
                >
                  <Fraction n={num} d={10} />
                  {!isPicked && (
                    <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-sm">
                      <Flower2 size={16} className="text-pink-400" />
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>

          {picked.length === 6 && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl text-center shadow-lg">
              <h4 className="text-2xl font-bold mb-2 flex items-center justify-center gap-2">
                <Sun className="text-yellow-300" /> Керемет! <Sun className="text-yellow-300" />
              </h4>
              <p className="text-lg">Сен сиқырлы гүл шоғын дұрыс жинадың!</p>
            </motion.div>
          )}
        </section>

        {/* Task 4: Whole vs Fraction */}
        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-emerald-200/50 border border-emerald-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-blue-100 p-3 rounded-full text-blue-500">
              <Sprout size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">4. Бағбанның суарғышы</h3>
          </div>
          
          <p className="text-lg mb-8">
            Бағбан екі гүлзарға су құйды. Бірінші гүлзардағы қызғалдақтардың <Fraction n={7} d={7} /> бөлігі (яғни толықтай) гүлдеді. Ал екінші гүлзардағы қызғалдақтардың тек <Fraction n={4} d={7} /> бөлігі ғана гүлдеді. Қай гүлзар көбірек гүлдеді?
          </p>

          <div className="space-y-8 mb-8">
            {/* Flowerbed 1 */}
            <div className="flex items-center gap-6">
              <div className="w-20 text-right text-2xl"><Fraction n={7} d={7} /></div>
              <div className="flex-1 h-16 flex rounded-2xl overflow-hidden border-4 border-blue-100 bg-white">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className="flex-1 border-r-4 border-blue-100 last:border-r-0 bg-blue-400"></div>
                ))}
              </div>
            </div>

            {/* Flowerbed 2 */}
            <div className="flex items-center gap-6">
              <div className="w-20 text-right text-2xl"><Fraction n={4} d={7} /></div>
              <div className="flex-1 h-16 flex rounded-2xl overflow-hidden border-4 border-blue-100 bg-white">
                {Array.from({ length: 7 }).map((_, i) => (
                  <div key={i} className={`flex-1 border-r-4 border-blue-100 last:border-r-0 ${i < 4 ? 'bg-blue-400' : 'bg-slate-50'}`}></div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-6">
            <button 
              onClick={() => setTask4Answer('>')}
              className={`px-8 py-4 text-2xl font-bold rounded-2xl transition-all ${task4Answer === '>' ? 'bg-emerald-500 text-white shadow-lg scale-105' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              <Fraction n={7} d={7} /> &gt; <Fraction n={4} d={7} />
            </button>
            <button 
              onClick={() => setTask4Answer('<')}
              className={`px-8 py-4 text-2xl font-bold rounded-2xl transition-all ${task4Answer === '<' ? 'bg-rose-500 text-white shadow-lg scale-105' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}
            >
              <Fraction n={7} d={7} /> &lt; <Fraction n={4} d={7} />
            </button>
          </div>

          {task4Answer === '>' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="text-emerald-500 shrink-0" />
              <p><strong>Дұрыс!</strong> Алымы мен бөлімі тең бөлшек 1 бүтінге (толық гүлзарға) тең!</p>
            </motion.div>
          )}
          {task4Answer === '<' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-rose-50 text-rose-700 p-4 rounded-xl">
              Қайта ойланып көріңізші. Толық гүлзар үлкен бе, әлде оның бір бөлігі ме?
            </motion.div>
          )}
        </section>

        {/* Task 5: Find the Error */}
        <section className="bg-white rounded-3xl p-6 md:p-8 shadow-xl shadow-emerald-200/50 border border-emerald-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-teal-100 p-3 rounded-full text-teal-500">
              <Bug size={24} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800">5. Тентек көбелектің жұмбағы</h3>
          </div>
          
          <p className="text-lg mb-8">
            Гүлзарға ұшып келген тентек көбелек бағбанның жазып қойған тақтайшаларындағы салыстыру белгілерін шатастырып кетті. Қатені тауып, дұрыс белгіні таңдаңыз:
          </p>

          <div className="space-y-6 mb-8">
            {/* Question 1 */}
            <div className="flex flex-col md:flex-row items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-4 text-2xl mb-4 md:mb-0">
                <span>1)</span>
                <Fraction n={3} d={8} /> 
                <span className="text-rose-500 font-bold line-through mx-2">&gt;</span> 
                <Fraction n={5} d={8} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleTask5Answer(1, '>')} className={`px-4 py-2 text-xl font-bold rounded-xl ${task5Answers[1] === '>' ? 'bg-rose-500 text-white' : 'bg-white border-2 border-slate-200 hover:bg-slate-100'}`}>&gt;</button>
                <button onClick={() => handleTask5Answer(1, '<')} className={`px-4 py-2 text-xl font-bold rounded-xl ${task5Answers[1] === '<' ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-200 hover:bg-slate-100'}`}>&lt;</button>
                <button onClick={() => handleTask5Answer(1, '=')} className={`px-4 py-2 text-xl font-bold rounded-xl ${task5Answers[1] === '=' ? 'bg-rose-500 text-white' : 'bg-white border-2 border-slate-200 hover:bg-slate-100'}`}>=</button>
              </div>
            </div>

            {/* Question 2 */}
            <div className="flex flex-col md:flex-row items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-4 text-2xl mb-4 md:mb-0">
                <span>2)</span>
                <Fraction n={1} d={4} /> 
                <span className="text-slate-400 font-bold mx-2">?</span> 
                <Fraction n={1} d={5} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleTask5Answer(2, '>')} className={`px-4 py-2 text-xl font-bold rounded-xl ${task5Answers[2] === '>' ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-200 hover:bg-slate-100'}`}>&gt;</button>
                <button onClick={() => handleTask5Answer(2, '<')} className={`px-4 py-2 text-xl font-bold rounded-xl ${task5Answers[2] === '<' ? 'bg-rose-500 text-white' : 'bg-white border-2 border-slate-200 hover:bg-slate-100'}`}>&lt;</button>
                <button onClick={() => handleTask5Answer(2, '=')} className={`px-4 py-2 text-xl font-bold rounded-xl ${task5Answers[2] === '=' ? 'bg-rose-500 text-white' : 'bg-white border-2 border-slate-200 hover:bg-slate-100'}`}>=</button>
              </div>
            </div>

            {/* Question 3 */}
            <div className="flex flex-col md:flex-row items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex items-center gap-4 text-2xl mb-4 md:mb-0">
                <span>3)</span>
                <Fraction n={6} d={11} /> 
                <span className="text-rose-500 font-bold line-through mx-2">&lt;</span> 
                <Fraction n={2} d={11} />
              </div>
              <div className="flex gap-2">
                <button onClick={() => handleTask5Answer(3, '>')} className={`px-4 py-2 text-xl font-bold rounded-xl ${task5Answers[3] === '>' ? 'bg-emerald-500 text-white' : 'bg-white border-2 border-slate-200 hover:bg-slate-100'}`}>&gt;</button>
                <button onClick={() => handleTask5Answer(3, '<')} className={`px-4 py-2 text-xl font-bold rounded-xl ${task5Answers[3] === '<' ? 'bg-rose-500 text-white' : 'bg-white border-2 border-slate-200 hover:bg-slate-100'}`}>&lt;</button>
                <button onClick={() => handleTask5Answer(3, '=')} className={`px-4 py-2 text-xl font-bold rounded-xl ${task5Answers[3] === '=' ? 'bg-rose-500 text-white' : 'bg-white border-2 border-slate-200 hover:bg-slate-100'}`}>=</button>
              </div>
            </div>
          </div>

          {task5Answers[1] === '<' && task5Answers[2] === '>' && task5Answers[3] === '>' && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-emerald-50 text-emerald-700 p-4 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="text-emerald-500 shrink-0" />
              <p><strong>Жарайсың!</strong> Барлық қателерді дұрыстадың. Сен нағыз математиксің!</p>
            </motion.div>
          )}
        </section>

        {/* Rule Summary */}
        <section className="bg-emerald-800 text-emerald-50 rounded-3xl p-6 md:p-8 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4">
            <Sprout size={200} />
          </div>
          
          <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
            <span className="bg-emerald-700 p-2 rounded-lg">💡</span> Бағбанның кеңесі
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6 relative z-10">
            <div className="bg-emerald-900/50 p-6 rounded-2xl border border-emerald-700/50">
              <h4 className="font-bold text-emerald-300 mb-3 text-lg">Бөлімдері бірдей болса:</h4>
              <p className="leading-relaxed">
                Қайсысының алымы (боялған бөлігі) көп болса, сол бөлшек үлкен болады.
              </p>
              <div className="mt-4 bg-emerald-950/50 inline-block px-4 py-2 rounded-lg font-mono text-lg">
                5/9 &gt; 2/9
              </div>
            </div>
            
            <div className="bg-emerald-900/50 p-6 rounded-2xl border border-emerald-700/50">
              <h4 className="font-bold text-emerald-300 mb-3 text-lg">Алымдары бірдей болса:</h4>
              <p className="leading-relaxed">
                Гүл неғұрлым АЗ бөлікке бөлінсе (бөлімі кіші болса), оның әр бөлігі соғұрлым ҮЛКЕН болады.
              </p>
              <div className="mt-4 bg-emerald-950/50 inline-block px-4 py-2 rounded-lg font-mono text-lg">
                1/2 &gt; 1/6
              </div>
            </div>
            
            <div className="bg-emerald-900/50 p-6 rounded-2xl border border-emerald-700/50 md:col-span-2">
              <h4 className="font-bold text-emerald-300 mb-3 text-lg">Бүтін гүлзар:</h4>
              <p className="leading-relaxed">
                Егер бөлшектің алымы мен бөлімі бірдей болса, ол толық 1 бүтінді білдіреді!
              </p>
              <div className="mt-4 bg-emerald-950/50 inline-block px-4 py-2 rounded-lg font-mono text-lg">
                7/7 = 1
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}

