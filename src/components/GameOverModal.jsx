import React from 'react';
import { RotateCcw, HeartCrack, Users } from 'lucide-react';

export function GameOverModal({ score, character, onRestart, onChangeCharacter }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border-4 border-rose-300 p-6 sm:p-8 text-center animate-wiggle-once">
        
        {/* Icono animado */}
        <div className="w-20 h-20 mx-auto mb-4 bg-rose-100 rounded-full flex items-center justify-center text-4xl shadow-inner border-2 border-rose-200">
          <HeartCrack size={42} className="text-rose-500" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-black text-slate-800 leading-tight">
          ¡Buen intento!
        </h2>
        <p className="text-lg font-bold text-rose-600 mt-1 mb-4">
          ¡Volvé a jugar!
        </p>

        <p className="text-slate-600 font-semibold text-sm mb-6">
          Los chicos traviesos hicieron muchas cosquillas, ¡pero {character.name} lo hizo genial!
        </p>

        {/* Resumen de puntuación */}
        <div className="bg-rose-50/80 rounded-2xl p-4 border-2 border-rose-200 mb-6 flex justify-around items-center">
          <div>
            <div className="text-xs uppercase font-black text-rose-800">Golosinas</div>
            <div className="text-3xl font-black text-rose-600">{score} 🍬</div>
          </div>
          <div className="border-l-2 border-rose-200 h-10"></div>
          <div>
            <div className="text-xs uppercase font-black text-rose-800">Personaje</div>
            <div className="text-xl font-black text-slate-700">{character.name}</div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-col gap-3">
          <button
            onClick={onRestart}
            className="w-full py-4 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-2xl font-black text-lg sm:text-xl shadow-lg transition-transform active:scale-95 flex items-center justify-center gap-2"
          >
            <RotateCcw size={22} />
            <span>¡JUGAR OTRA VEZ!</span>
          </button>

          <button
            onClick={onChangeCharacter}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition flex items-center justify-center gap-2"
          >
            <Users size={18} />
            <span>Cambiar de Personaje / Nivel</span>
          </button>
        </div>

      </div>
    </div>
  );
}

