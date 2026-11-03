import React from 'react';
import { Volume2, VolumeX, Pause, Play, Shield, Zap, Heart } from 'lucide-react';

export function NavbarHUD({
  activeChar,
  pedroScore,
  simoneScore,
  pedroLives,
  simoneLives,
  energy,
  shieldSeconds,
  level,
  isPaused,
  isMuted,
  characters,
  onToggleMute,
  onTogglePause,
  onOpenLevelSelect
}) {
  const pedro = characters.find((c) => c.id === 'pedro') || characters[0];
  const simone = characters.find((c) => c.id === 'simone') || characters[1];
  const isPedroActive = activeChar.id === 'pedro';

  return (
    <header className="fixed top-2 left-0 right-0 z-40 px-2 sm:px-4 pointer-events-none select-none pt-[env(safe-area-inset-top)]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        
        {/* MARCADOR DUAL: Pedro vs Simoné */}
        <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
          {/* Jugador Pedro */}
          <div
            className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-2xl border-2 transition-all duration-300 backdrop-blur-md shadow-md ${
              isPedroActive
                ? 'bg-sky-50/95 border-sky-400 ring-2 ring-sky-300 scale-102'
                : 'bg-white/80 border-slate-200 opacity-80'
            }`}
          >
            <div className="relative">
              <img
                src={pedro.customPhoto || pedro.photo}
                alt={pedro.name}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border-2 shadow"
                style={{ borderColor: pedro.color }}
                onError={(e) => {
                  if (pedro.backupPhoto) e.target.src = pedro.backupPhoto;
                }}
              />
              {isPedroActive && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-[9px] font-black px-1 rounded-full border border-white text-slate-900 animate-pulse">
                  TURNO
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-black text-xs sm:text-sm text-slate-800">
                  {pedro.name}
                </span>
                <span className="text-xs sm:text-sm font-black text-sky-600">
                  {pedroScore} 🍬
                </span>
              </div>
              {/* Vidas restantes de Pedro */}
              <div className="flex items-center gap-0.5 mt-0.5">
                {[1, 2, 3].map((heart) => (
                  <Heart
                    key={heart}
                    size={14}
                    className={`${
                      heart <= pedroLives
                        ? 'fill-rose-500 text-rose-500'
                        : 'fill-slate-200 text-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          <span className="text-xs sm:text-sm font-black text-slate-700 bg-white/80 px-2 py-1 rounded-xl shadow border border-slate-200">
            VS
          </span>

          {/* Jugadora Simoné */}
          <div
            className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-2 rounded-2xl border-2 transition-all duration-300 backdrop-blur-md shadow-md ${
              !isPedroActive
                ? 'bg-pink-50/95 border-pink-400 ring-2 ring-pink-300 scale-102'
                : 'bg-white/80 border-slate-200 opacity-80'
            }`}
          >
            <div className="relative">
              <img
                src={simone.customPhoto || simone.photo}
                alt={simone.name}
                className="w-9 h-9 sm:w-11 sm:h-11 rounded-full object-cover border-2 shadow"
                style={{ borderColor: simone.color }}
                onError={(e) => {
                  if (simone.backupPhoto) e.target.src = simone.backupPhoto;
                }}
              />
              {!isPedroActive && (
                <span className="absolute -top-1 -right-1 bg-yellow-400 text-[9px] font-black px-1 rounded-full border border-white text-slate-900 animate-pulse">
                  TURNO
                </span>
              )}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-black text-xs sm:text-sm text-slate-800">
                  {simone.name}
                </span>
                <span className="text-xs sm:text-sm font-black text-pink-600">
                  {simoneScore} 🍬
                </span>
              </div>
              {/* Vidas restantes de Simoné */}
              <div className="flex items-center gap-0.5 mt-0.5">
                {[1, 2, 3].map((heart) => (
                  <Heart
                    key={heart}
                    size={14}
                    className={`${
                      heart <= simoneLives
                        ? 'fill-rose-500 text-rose-500'
                        : 'fill-slate-200 text-slate-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* BARRA DE ENERGÍA Y ESTADO DEL JUGADOR ACTUAL */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Barra de Energía */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl px-3 py-1.5 sm:py-2 border-2 border-emerald-300 shadow-md min-w-[140px] sm:min-w-[170px]">
            <div className="flex justify-between items-center text-[10px] sm:text-xs font-black text-slate-700 mb-1">
              <span className="flex items-center gap-1 text-emerald-800">
                <Zap size={14} className="fill-emerald-500 text-emerald-600" />
                Energía ({activeChar.name})
              </span>
              <span className="font-extrabold text-slate-900">{Math.round(energy)}%</span>
            </div>
            <div className="w-full bg-slate-100 h-2 sm:h-2.5 rounded-full overflow-hidden border border-slate-200">
              <div
                className={`h-full transition-all duration-200 rounded-full ${
                  energy > 50
                    ? 'bg-gradient-to-r from-emerald-400 to-teal-500'
                    : energy > 25
                    ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                    : 'bg-gradient-to-r from-rose-500 to-red-600 animate-pulse'
                }`}
                style={{ width: `${energy}%` }}
              />
            </div>
          </div>

          {/* Indicador de Escudo 🛡️ (Si está activo) */}
          {shieldSeconds > 0 && (
            <div className="bg-cyan-500 text-white font-black text-xs sm:text-sm px-3 py-1.5 rounded-2xl shadow-lg border-2 border-white flex items-center gap-1.5 animate-bounce-slow">
              <Shield size={16} className="fill-white" />
              <span>¡ESCUDO: {shieldSeconds}s!</span>
            </div>
          )}

          {/* Botón Escenario */}
          <button
            onClick={onOpenLevelSelect}
            className="p-2 sm:px-3 sm:py-2 bg-white/90 hover:bg-white text-slate-700 rounded-xl shadow border border-slate-200 text-xs font-black transition hidden md:flex items-center gap-1"
            title="Elegir escenario"
          >
            <span>📍 {level.title}</span>
          </button>

          {/* Botón Sonido */}
          <button
            onClick={onToggleMute}
            className="p-2 bg-white/90 hover:bg-white text-slate-700 rounded-xl shadow border border-slate-200 active:scale-95 transition"
            title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
          >
            {isMuted ? <VolumeX size={18} className="text-rose-500" /> : <Volume2 size={18} className="text-emerald-600" />}
          </button>

          {/* Botón Pausa */}
          <button
            onClick={onTogglePause}
            className="p-2 bg-white/90 hover:bg-white text-slate-700 rounded-xl shadow border border-slate-200 active:scale-95 transition"
            title={isPaused ? 'Reanudar' : 'Pausar'}
          >
            {isPaused ? <Play size={18} className="text-amber-500" /> : <Pause size={18} />}
          </button>
        </div>

      </div>
    </header>
  );
}
