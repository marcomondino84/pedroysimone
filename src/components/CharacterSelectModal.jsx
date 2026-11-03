import React, { useRef } from 'react';
import { CHARACTERS } from '../data/gameConfig';
import { Sparkles, Upload, Play, Trophy, User, Users, Check } from 'lucide-react';

export function CharacterSelectModal({
  selectedCharacter,
  gameMode = 'solo',
  onSelectCharacter,
  onSelectGameMode,
  onUpdateCustomPhoto,
  onStartGame
}) {
  const fileInputRef = useRef(null);

  const handleFileUpload = (e, charId) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUpdateCustomPhoto(charId, event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border-4 border-pink-300 p-5 sm:p-7 text-center animate-wiggle-once relative my-auto">
        
        {/* Título Principal */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-black text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-md uppercase tracking-wider mb-2">
          <Sparkles size={16} /> ¡Aventura de Golosinas!
        </div>

        <h1 className="text-3xl sm:text-4xl font-black text-slate-800 tracking-tight leading-tight mb-3">
          Pedro y Simoné
        </h1>

        {/* SELECTOR DE MODO DE JUEGO (SOLO vs DUELO) */}
        <div className="bg-slate-100 p-1.5 rounded-2xl flex items-center justify-center gap-2 max-w-md mx-auto mb-4 border border-slate-200">
          <button
            onClick={() => onSelectGameMode('solo')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
              gameMode === 'solo'
                ? 'bg-white text-slate-800 shadow-md border-2 border-pink-400 scale-102'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <User size={16} className={gameMode === 'solo' ? 'text-pink-500' : ''} />
            <span>1 Jugador (Aventura)</span>
          </button>

          <button
            onClick={() => onSelectGameMode('duel')}
            className={`flex-1 py-2.5 px-3 rounded-xl font-black text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all ${
              gameMode === 'duel'
                ? 'bg-white text-slate-800 shadow-md border-2 border-amber-400 scale-102'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            <Trophy size={16} className={gameMode === 'duel' ? 'text-amber-500' : ''} />
            <span>Duelo (Pedro vs Simoné)</span>
          </button>
        </div>

        {/* Explicación según modo elegido */}
        {gameMode === 'solo' ? (
          <p className="text-slate-600 font-bold text-xs sm:text-sm mb-4">
            🎮 <b>Modo 1 Jugador:</b> Elegí con quién querés jugar. Tenés 3 vidas, juguitos 🧃 para recargar energía y escudo 🛡️ para batir tu propio récord.
          </p>
        ) : (
          <p className="text-slate-600 font-bold text-xs sm:text-sm mb-4">
            🏆 <b>Modo Duelo:</b> 3 vidas para cada uno, jugando 1 vida por turno de forma intercalada. Elegí quién empieza primero:
          </p>
        )}

        {/* Tarjetas de Selección */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-5">
          {CHARACTERS.map((char) => {
            const isSelected = selectedCharacter.id === char.id;
            return (
              <div
                key={char.id}
                onClick={() => onSelectCharacter(char)}
                className={`relative rounded-3xl p-4 sm:p-5 border-4 cursor-pointer transition-all duration-300 flex flex-col items-center text-center ${
                  isSelected
                    ? 'border-pink-500 bg-pink-50/70 shadow-2xl scale-103 ring-4 ring-pink-200'
                    : 'border-slate-200 bg-slate-50/70 hover:border-pink-300 hover:shadow-lg'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-pink-500 text-white p-1 rounded-full shadow-md animate-bounce-slow">
                    <Check size={18} className="stroke-[3]" />
                  </div>
                )}

                <div className="relative mb-2">
                  <div
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full overflow-hidden border-4 shadow-xl p-1 bg-white"
                    style={{ borderColor: char.color }}
                  >
                    <img
                      src={char.customPhoto || char.photo}
                      alt={char.name}
                      className="w-full h-full object-cover rounded-full"
                      onError={(e) => {
                        if (char.backupPhoto) e.target.src = char.backupPhoto;
                      }}
                    />
                  </div>
                  <span
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[11px] font-black text-white px-2.5 py-0.5 rounded-full shadow-md whitespace-nowrap"
                    style={{ backgroundColor: char.color }}
                  >
                    {char.nickname}
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-black text-slate-800 mt-2">
                  {char.name}
                </h3>
                <p className="text-xs text-slate-600 font-semibold mt-0.5">
                  {char.tagline}
                </p>

                <label
                  onClick={(e) => e.stopPropagation()}
                  className="mt-2.5 inline-flex items-center gap-1.5 text-[11px] font-bold text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-xl cursor-pointer transition shadow-sm"
                >
                  <Upload size={12} />
                  <span>Subir otra foto</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleFileUpload(e, char.id)}
                  />
                </label>
              </div>
            );
          })}
        </div>

        {/* Botón para Iniciar Partida */}
        <button
          onClick={onStartGame}
          className="w-full py-3.5 sm:py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-black text-lg sm:text-xl shadow-xl transition-transform active:scale-95 flex items-center justify-center gap-2"
        >
          <Play size={24} className="fill-white" />
          <span>
            {gameMode === 'solo'
              ? `¡JUGAR AVENTURA CON ${selectedCharacter.name.toUpperCase()}!`
              : `¡INICIAR DUELO CON ${selectedCharacter.name.toUpperCase()}!`}
          </span>
        </button>

      </div>
    </div>
  );
}
