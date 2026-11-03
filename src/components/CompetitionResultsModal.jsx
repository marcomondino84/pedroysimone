import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Crown, RotateCcw, Sparkles } from 'lucide-react';

export function CompetitionResultsModal({
  pedroScore,
  simoneScore,
  characters,
  onRestart
}) {
  const pedro = characters.find((c) => c.id === 'pedro') || characters[0];
  const simone = characters.find((c) => c.id === 'simone') || characters[1];

  const isTie = pedroScore === simoneScore;
  const winner = pedroScore > simoneScore ? pedro : simone;
  const isPedroWinner = pedroScore > simoneScore;

  useEffect(() => {
    // Ráfaga doble de confeti
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 60,
        origin: { x: 0 }
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 60,
        origin: { x: 1 }
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/90 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full border-4 border-yellow-300 p-6 sm:p-8 text-center animate-wiggle-once relative">
        
        {/* Trofeo / Corona superior */}
        <div className="w-20 h-20 mx-auto mb-3 bg-yellow-100 rounded-full flex items-center justify-center text-4xl shadow-inner border-2 border-yellow-300 animate-bounce-slow">
          <Trophy size={42} className="text-yellow-500" />
        </div>

        <div className="inline-flex items-center gap-1.5 bg-yellow-100 text-yellow-800 font-black text-xs sm:text-sm px-4 py-1 rounded-full uppercase tracking-wider mb-2">
          <Sparkles size={16} /> ¡FIN DE LA COMPETENCIA!
        </div>

        {/* Título de Ganador o Empate */}
        {isTie ? (
          <div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-800 leading-tight">
              ¡EMPATE DULCE!
            </h2>
            <p className="text-pink-600 font-extrabold text-base mt-1 mb-5">
              ¡Ambos son unos super campeones recolectores de golosinas! 🍬🎉
            </p>
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-center gap-2">
              <Crown size={28} className="text-amber-500 fill-amber-400" />
              <h2 className="text-3xl sm:text-4xl font-black text-slate-800 leading-tight">
                ¡GANÓ {winner.name.toUpperCase()}!
              </h2>
              <Crown size={28} className="text-amber-500 fill-amber-400" />
            </div>
            <p className="text-emerald-600 font-extrabold text-base mt-1 mb-5">
              ¡Juntó la mayor cantidad de golosinas de la competencia!
            </p>
          </div>
        )}

        {/* Marcador Frente a Frente */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
          {/* Tarjeta Pedro */}
          <div
            className={`rounded-2xl p-4 border-3 flex flex-col items-center relative ${
              isPedroWinner && !isTie
                ? 'border-sky-500 bg-sky-50 shadow-xl ring-2 ring-sky-300 scale-102'
                : 'border-slate-200 bg-slate-50'
            }`}
          >
            {isPedroWinner && !isTie && (
              <span className="absolute -top-3 bg-sky-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase shadow">
                👑 Ganador
              </span>
            )}
            <img
              src={pedro.customPhoto || pedro.photo}
              alt={pedro.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-3 shadow-md mb-2"
              style={{ borderColor: pedro.color }}
              onError={(e) => {
                if (pedro.backupPhoto) e.target.src = pedro.backupPhoto;
              }}
            />
            <h4 className="font-black text-lg text-slate-800">{pedro.name}</h4>
            <div className="text-2xl sm:text-3xl font-black text-sky-600 mt-1">
              {pedroScore} 🍬
            </div>
            <span className="text-[11px] font-bold text-slate-500">Golosinas en 3 vidas</span>
          </div>

          {/* Tarjeta Simoné */}
          <div
            className={`rounded-2xl p-4 border-3 flex flex-col items-center relative ${
              !isPedroWinner && !isTie
                ? 'border-pink-500 bg-pink-50 shadow-xl ring-2 ring-pink-300 scale-102'
                : 'border-slate-200 bg-slate-50'
            }`}
          >
            {!isPedroWinner && !isTie && (
              <span className="absolute -top-3 bg-pink-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase shadow">
                👑 Ganadora
              </span>
            )}
            <img
              src={simone.customPhoto || simone.photo}
              alt={simone.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-3 shadow-md mb-2"
              style={{ borderColor: simone.color }}
              onError={(e) => {
                if (simone.backupPhoto) e.target.src = simone.backupPhoto;
              }}
            />
            <h4 className="font-black text-lg text-slate-800">{simone.name}</h4>
            <div className="text-2xl sm:text-3xl font-black text-pink-600 mt-1">
              {simoneScore} 🍬
            </div>
            <span className="text-[11px] font-bold text-slate-500">Golosinas en 3 vidas</span>
          </div>
        </div>

        {/* Botón de Revancha */}
        <button
          onClick={onRestart}
          className="w-full py-4 bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500 hover:from-emerald-600 hover:to-sky-600 text-white rounded-2xl font-black text-xl shadow-xl transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
          <RotateCcw size={24} />
          <span>¡JUGAR LA REVANCHA AHORA!</span>
        </button>

      </div>
    </div>
  );
}
