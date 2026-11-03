import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, ArrowRight, RotateCcw } from 'lucide-react';

export function VictoryModal({
  score,
  level,
  hasNextLevel,
  character,
  onNextLevel,
  onRestart
}) {
  useEffect(() => {
    // Lanzar ráfagas de confeti multicolor
    const duration = 2.5 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border-4 border-yellow-300 p-6 sm:p-8 text-center animate-wiggle-once">
        
        {/* Trofeo animado */}
        <div className="w-20 h-20 mx-auto mb-4 bg-yellow-100 rounded-full flex items-center justify-center text-4xl shadow-inner border-2 border-yellow-300 animate-bounce-slow">
          <Trophy size={42} className="text-yellow-500" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-slate-800 leading-tight">
          ¡NIVEL COMPLETADO!
        </h2>
        <p className="text-lg font-bold text-emerald-600 mt-1 mb-2">
          ¡Super Recolector de Golosinas!
        </p>

        <p className="text-slate-600 font-semibold text-sm mb-6">
          {character.name} juntó todas las golosinas necesarias en {level.title}. ¡Excelente trabajo en equipo!
        </p>

        {/* Resumen */}
        <div className="bg-amber-50 rounded-2xl p-4 border-2 border-amber-200 mb-6 flex justify-around items-center">
          <div>
            <div className="text-xs uppercase font-black text-amber-800">Total Dulces</div>
            <div className="text-3xl font-black text-amber-600">{score} 🍭</div>
          </div>
          <div className="border-l-2 border-amber-200 h-10"></div>
          <div>
            <div className="text-xs uppercase font-black text-amber-800">Escenario</div>
            <div className="text-lg font-black text-slate-700">{level.title}</div>
          </div>
        </div>

        {/* Botones */}
        <div className="flex flex-col gap-3">
          {hasNextLevel ? (
            <button
              onClick={onNextLevel}
              className="w-full py-4 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-black text-lg sm:text-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>¡SIGUIENTE NIVEL!</span>
              <ArrowRight size={24} />
            </button>
          ) : (
            <button
              onClick={onRestart}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-600 hover:to-indigo-600 text-white rounded-2xl font-black text-lg sm:text-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
            >
              <RotateCcw size={22} />
              <span>¡JUGAR DE NUEVO!</span>
            </button>
          )}

          <button
            onClick={onRestart}
            className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition"
          >
            Rejugar este escenario
          </button>
        </div>

      </div>
    </div>
  );
}

