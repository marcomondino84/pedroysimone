import React from 'react';
import { Volume2, VolumeX, Pause, Play, Shield, Zap, Heart, RotateCcw, Sparkles } from 'lucide-react';

export function NavbarHUD({
  gameMode = 'solo',
  activeChar,
  soloScore = 0,
  soloLives = 3,
  pedroScore,
  simoneScore,
  pedroLives,
  simoneLives,
  energy,
  shieldSeconds,
  level,
  levelProgress = 0,
  targetScore = 20,
  isPaused,
  isMuted,
  characters,
  onToggleMute,
  onTogglePause,
  onOpenLevelSelect,
  onOpenModeSelect
}) {
  const pedro = characters.find((c) => c.id === 'pedro') || characters[0];
  const simone = characters.find((c) => c.id === 'simone') || characters[1];
  const isPedroActive = activeChar.id === 'pedro';
  const progressPercent = Math.min(100, Math.round((levelProgress / targetScore) * 100));

  return (
    <header className="fixed top-2 left-0 right-0 z-40 px-2 sm:px-4 pointer-events-none select-none pt-[env(safe-area-inset-top)]">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
        
        {/* CONDICIONAL: MODO SOLO vs MODO DUELO */}
        {gameMode === 'solo' ? (
          /* MODO INDIVIDUAL */
          <div className="flex items-center gap-2 sm:gap-3 pointer-events-auto">
            {/* Tarjeta del Jugador y Vidas */}
            <div className="flex items-center gap-2 sm:gap-3 bg-white/95 backdrop-blur-md rounded-2xl p-1.5 sm:px-3 sm:py-2 shadow-lg border-2 border-pink-200">
              <div 
                onClick={onOpenModeSelect}
                title="Toca para cambiar de personaje o modo"
                className="relative cursor-pointer group"
              >
                <img
                  src={activeChar.customPhoto || activeChar.photo}
                  alt={activeChar.name}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 shadow-md transition-transform group-hover:scale-110"
                  style={{ borderColor: activeChar.color }}
                  onError={(e) => {
                    if (activeChar.backupPhoto) e.target.src = activeChar.backupPhoto;
                  }}
                />
                <span className="absolute -bottom-1 -right-1 bg-amber-400 text-[10px] font-black px-1 rounded-full shadow text-slate-900 border border-white">
                  {activeChar.name[0]}
                </span>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-sm sm:text-base text-slate-800">
                    {activeChar.name}
                  </span>
                  <button
                    onClick={onOpenModeSelect}
                    className="text-[10px] sm:text-xs text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-1.5 py-0.5 rounded-md font-bold transition flex items-center gap-0.5"
                    title="Cambiar personaje o modo"
                  >
                    <span>Cambiar</span>
                  </button>
                </div>

                {/* Vidas restantes en Modo Solo */}
                <div className="flex items-center gap-1 mt-0.5">
                  {[1, 2, 3].map((heart) => (
                    <Heart
                      key={heart}
                      size={16}
                      className={`transition-all duration-300 ${
                        heart <= soloLives
                          ? 'fill-rose-500 text-rose-500 drop-shadow'
                          : 'fill-slate-200 text-slate-300'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Marcador de Caramelos en Modo Solo */}
            <div className="bg-white/95 backdrop-blur-md rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 shadow-lg border-2 border-purple-200 flex items-center gap-2">
              <span className="text-xl sm:text-2xl animate-bounce-slow">🍬</span>
              <div>
                <div className="text-[9px] sm:text-[10px] text-purple-700 font-black uppercase">
                  Golosinas
                </div>
                <div className="text-base sm:text-lg font-black text-purple-900 leading-tight">
                  {soloScore}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* MODO DUELO: Pedro vs Simoné */
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
        )}

        {/* BARRA DE ENERGÍA Y ESTADO */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Barra de Energía */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl px-3 py-1.5 sm:py-2 border-2 border-emerald-300 shadow-md min-w-[130px] sm:min-w-[160px]">
            <div className="flex justify-between items-center text-[10px] sm:text-xs font-black text-slate-700 mb-1">
              <span className="flex items-center gap-1 text-emerald-800">
                <Zap size={14} className="fill-emerald-500 text-emerald-600" />
                Energía
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

          {/* Indicador de Escudo 🛡️ */}
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
