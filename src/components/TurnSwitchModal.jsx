import React from 'react';
import { Play, Sparkles, Heart } from 'lucide-react';

export function TurnSwitchModal({
  finishedChar,
  roundPoints,
  finishedTotalScore,
  nextChar,
  nextLifeNumber,
  totalLives = 3,
  onContinue
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full border-4 border-amber-300 p-6 sm:p-8 text-center animate-wiggle-once relative">
        
        {/* Badge de Ronda */}
        <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 font-black text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-md uppercase tracking-wider mb-3">
          <Sparkles size={16} /> ¡CAMBIO DE TURNO INTERCALADO!
        </div>

        {/* Resumen de quién acaba de jugar */}
        <div className="bg-slate-50 rounded-2xl p-3 border border-slate-200 mb-4 flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <img
              src={finishedChar.customPhoto || finishedChar.photo}
              alt={finishedChar.name}
              className="w-12 h-12 rounded-full object-cover border-2 shadow"
              style={{ borderColor: finishedChar.color }}
              onError={(e) => {
                if (finishedChar.backupPhoto) e.target.src = finishedChar.backupPhoto;
              }}
            />
            <div>
              <div className="text-xs font-bold text-slate-500">Terminó su vida</div>
              <div className="text-base font-black text-slate-800">{finishedChar.name}</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-slate-500">Sumó en este turno</div>
            <div className="text-lg font-black text-pink-600">+{roundPoints} 🍬</div>
            <div className="text-[11px] font-extrabold text-slate-400">Total: {finishedTotalScore}</div>
          </div>
        </div>

        <div className="my-2 text-2xl font-black text-slate-700">
          👇 ¡Ahora le toca a... 👇
        </div>

        {/* Presentación del siguiente jugador */}
        <div
          className="rounded-3xl p-5 border-4 mb-5 flex flex-col items-center justify-center shadow-lg"
          style={{
            borderColor: nextChar.color,
            backgroundColor: `${nextChar.color}15`
          }}
        >
          <div className="relative mb-2">
            <div
              className="w-24 h-24 rounded-full overflow-hidden border-4 shadow-xl p-1 bg-white animate-bounce-slow"
              style={{ borderColor: nextChar.color }}
            >
              <img
                src={nextChar.customPhoto || nextChar.photo}
                alt={nextChar.name}
                className="w-full h-full object-cover rounded-full"
                onError={(e) => {
                  if (nextChar.backupPhoto) e.target.src = nextChar.backupPhoto;
                }}
              />
            </div>
          </div>

          <h3 className="text-3xl font-black text-slate-800">
            ¡{nextChar.name}!
          </h3>
          <p className="text-xs sm:text-sm font-bold text-slate-600 mt-0.5">
            {nextChar.tagline}
          </p>

          {/* Vidas restantes de quien entra */}
          <div className="flex items-center gap-1.5 mt-3 bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-200">
            <span className="text-xs font-bold text-slate-600 mr-1">
              Vida {nextLifeNumber} de {totalLives}:
            </span>
            {[1, 2, 3].map((heart) => (
              <Heart
                key={heart}
                size={18}
                className={`transition-all ${
                  heart <= totalLives - (nextLifeNumber - 1)
                    ? 'fill-rose-500 text-rose-500 drop-shadow'
                    : 'fill-slate-200 text-slate-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Tip divertido */}
        <p className="text-xs text-slate-500 font-semibold mb-5">
          💡 Recordá agarrar los juguitos 🧃 para recargar energía y las burbujas 🛡️ para ser invencible.
        </p>

        {/* Botón para iniciar el turno */}
        <button
          onClick={onContinue}
          className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-black text-xl shadow-xl transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
          <Play size={24} className="fill-white" />
          <span>¡ESTOY LISTO/A, VAMOS!</span>
        </button>

      </div>
    </div>
  );
}

