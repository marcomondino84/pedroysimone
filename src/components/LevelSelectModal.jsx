import React from 'react';
import { LEVELS } from '../data/gameConfig';
import { MapPin, X, Star } from 'lucide-react';

export function LevelSelectModal({ currentLevel, onSelectLevel, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full border-4 border-amber-300 p-5 sm:p-7 relative text-center">
        
        {/* Botón Cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
        >
          <X size={20} />
        </button>

        <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-800 text-xs sm:text-sm font-black px-3 py-1 rounded-full mb-2">
          <MapPin size={16} /> Escenarios del Juego
        </div>

        <h2 className="text-2xl sm:text-4xl font-black text-slate-800 mb-2">
          Elegí tu Escenario
        </h2>
        <p className="text-slate-600 text-sm font-medium mb-6">
          Seleccioná dónde querés recolectar golosinas hoy:
        </p>

        <div className="space-y-3.5 mb-6 text-left">
          {LEVELS.map((lvl) => {
            const isCurrent = currentLevel.id === lvl.id;
            return (
              <div
                key={lvl.id}
                onClick={() => {
                  onSelectLevel(lvl);
                  onClose();
                }}
                className={`p-4 rounded-2xl border-3 cursor-pointer transition-all duration-200 flex items-center justify-between ${
                  isCurrent
                    ? 'border-amber-500 bg-amber-50/80 shadow-md ring-2 ring-amber-300 scale-101'
                    : 'border-slate-200 hover:border-amber-300 hover:bg-slate-50'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {lvl.theme === 'park' ? '🌳' : (lvl.theme === 'city' ? '🏙️' : '🛍️')}
                    </span>
                    <h3 className="font-black text-lg sm:text-xl text-slate-800">
                      {lvl.title}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
                    {lvl.subtitle}
                  </p>
                  <div className="text-xs text-pink-600 font-extrabold mt-1">
                    Meta: {lvl.targetScore} golosinas 🍬
                  </div>
                </div>

                <button
                  className={`px-4 py-2 rounded-xl font-black text-xs sm:text-sm shadow transition ${
                    isCurrent
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-200 hover:bg-slate-300 text-slate-700'
                  }`}
                >
                  {isCurrent ? 'Jugando' : 'Elegir'}
                </button>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl font-black text-base transition"
        >
          Volver a la partida
        </button>

      </div>
    </div>
  );
}
