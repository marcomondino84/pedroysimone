import React from 'react';
import { Volume2, VolumeX, Pause, Play, RefreshCw, Sparkles, Heart } from 'lucide-react';

export function NavbarHUD({
  character,
  score,
  lives,
  level,
  progress,
  targetScore,
  isPaused,
  isMuted,
  onToggleMute,
  onTogglePause,
  onSwitchCharacter,
  onOpenLevelSelect
}) {
  const progressPercent = Math.min(100, Math.round((progress / targetScore) * 100));

  return (
    <header className="fixed top-2 left-0 right-0 z-40 px-2 sm:px-4 pointer-events-none select-none pt-[env(safe-area-inset-top)]">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-2 sm:gap-4">
        
        {/* Personaje y Vidas */}
        <div className="flex items-center gap-2 sm:gap-3 bg-white/90 backdrop-blur-md rounded-2xl p-2 sm:px-4 sm:py-2.5 shadow-lg border-2 border-pink-200 pointer-events-auto transition-transform hover:scale-105">
          <div 
            onClick={onSwitchCharacter} 
            title="Toca para cambiar de personaje"
            className="relative cursor-pointer group"
          >
            <img
              src={character.customPhoto || character.photo}
              alt={character.name}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 shadow-md transition-transform group-hover:scale-110"
              style={{ borderColor: character.color }}
              onError={(e) => {
                if (character.backupPhoto) e.target.src = character.backupPhoto;
              }}
            />
            <span className="absolute -bottom-1 -right-1 bg-amber-400 text-[10px] sm:text-xs font-black px-1.5 py-0.5 rounded-full shadow text-slate-900 border border-white">
              {character.name[0]}
            </span>
          </div>

          <div>
            <div className="flex items-center gap-1">
              <span className="font-extrabold text-sm sm:text-base text-slate-800">
                {character.name}
              </span>
              <button
                onClick={onSwitchCharacter}
                className="text-xs text-pink-600 hover:text-pink-700 bg-pink-50 hover:bg-pink-100 px-1.5 py-0.5 rounded-md font-bold transition flex items-center gap-0.5"
                title="Cambiar entre Pedro y Simoné"
              >
                <RefreshCw size={11} className="inline" />
                <span className="hidden md:inline">Cambiar</span>
              </button>
            </div>

            {/* Corazones de vidas */}
            <div className="flex items-center gap-1 mt-0.5">
              {[1, 2, 3].map((heartIndex) => {
                const isActive = heartIndex <= lives;
                return (
                  <Heart
                    key={heartIndex}
                    size={18}
                    className={`transition-all duration-300 ${
                      isActive
                        ? 'fill-rose-500 text-rose-500 scale-100 drop-shadow'
                        : 'fill-slate-200 text-slate-300 scale-90'
                    }`}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Nivel y Barra de Progreso */}
        <div 
          onClick={onOpenLevelSelect}
          title="Toca para elegir nivel"
          className="flex-1 max-w-xs sm:max-w-md bg-white/90 backdrop-blur-md rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2 shadow-lg border-2 border-amber-200 pointer-events-auto cursor-pointer transition hover:bg-white"
        >
          <div className="flex justify-between items-center text-xs sm:text-sm font-bold text-slate-700 mb-1">
            <span className="truncate flex items-center gap-1">
              <span>📍 {level.title}</span>
            </span>
            <span className="text-pink-600 font-extrabold ml-1">
              {progress} / {targetScore} 🍭
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 sm:h-3 rounded-full overflow-hidden border border-slate-200">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-amber-400 to-emerald-400 transition-all duration-300 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Puntaje acumulado y Botones de control */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Puntuación */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl px-3 py-1.5 sm:px-4 sm:py-2.5 shadow-lg border-2 border-purple-200 flex items-center gap-2">
            <span className="text-xl sm:text-2xl animate-bounce-slow">🍭</span>
            <div>
              <div className="text-[10px] sm:text-xs text-purple-700 font-black uppercase tracking-wider">
                Golosinas
              </div>
              <div className="text-base sm:text-xl font-black text-purple-900 leading-tight">
                {score}
              </div>
            </div>
          </div>

          {/* Botón Sonido */}
          <button
            onClick={onToggleMute}
            className="p-2 sm:p-2.5 bg-white/90 hover:bg-white text-slate-700 rounded-xl shadow-md border border-slate-200 active:scale-95 transition"
            title={isMuted ? 'Activar sonido' : 'Silenciar sonido'}
          >
            {isMuted ? <VolumeX size={20} className="text-rose-500" /> : <Volume2 size={20} className="text-emerald-600" />}
          </button>

          {/* Botón Pausa */}
          <button
            onClick={onTogglePause}
            className="p-2 sm:p-2.5 bg-white/90 hover:bg-white text-slate-700 rounded-xl shadow-md border border-slate-200 active:scale-95 transition"
            title={isPaused ? 'Reanudar juego' : 'Pausar juego'}
          >
            {isPaused ? <Play size={20} className="text-amber-500" /> : <Pause size={20} />}
          </button>
        </div>

      </div>
    </header>
  );
}

