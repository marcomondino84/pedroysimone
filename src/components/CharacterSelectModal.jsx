import React, { useRef } from 'react';
import { CHARACTERS } from '../data/gameConfig';
import { Sparkles, Upload, Play, Trophy, Check } from 'lucide-react';

export function CharacterSelectModal({
  selectedCharacter,
  onSelectCharacter,
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full border-4 border-pink-300 p-5 sm:p-8 text-center animate-wiggle-once relative">
        
        {/* Título Principal */}
        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 text-white font-black text-xs sm:text-sm px-4 py-1.5 rounded-full shadow-md uppercase tracking-wider mb-2">
          <Trophy size={16} /> ¡GRAN DUELO DE GOLOSINAS!
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-800 tracking-tight leading-tight">
          Pedro vs Simoné
        </h1>
        <p className="text-slate-600 font-bold text-sm sm:text-base mt-1 mb-2">
          ¡3 vidas para cada uno, jugando 1 vida por turno de forma intercalada!
        </p>

        {/* Explicación rápida de mecánicas */}
        <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 text-xs sm:text-sm text-amber-900 font-bold mb-5 flex flex-col sm:flex-row items-center justify-around gap-2 text-left">
          <div>🧃 <b>Juguitos:</b> Recargan energía al instante.</div>
          <div>🛡️ <b>Burbuja Escudo:</b> 5s de invulnerabilidad.</div>
          <div>🏆 <b>Meta:</b> Juntar más golosinas en 3 vidas.</div>
        </div>

        <div className="text-slate-700 font-extrabold text-sm mb-3">
          👇 Elegí quién comienza en el Turno 1:
        </div>

        {/* Tarjetas de Selección */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6">
          {CHARACTERS.map((char) => {
            const isSelected = selectedCharacter.id === char.id;
            return (
              <div
                key={char.id}
                onClick={() => onSelectCharacter(char)}
                className={`relative rounded-3xl p-5 border-4 cursor-pointer transition-all duration-300 flex flex-col items-center text-center ${
                  isSelected
                    ? 'border-pink-500 bg-pink-50/70 shadow-2xl scale-105 ring-4 ring-pink-200'
                    : 'border-slate-200 bg-slate-50/70 hover:border-pink-300 hover:shadow-lg hover:scale-102'
                }`}
              >
                {isSelected && (
                  <div className="absolute top-3 right-3 bg-pink-500 text-white p-1 rounded-full shadow-md animate-bounce-slow">
                    <Check size={18} className="stroke-[3]" />
                  </div>
                )}

                <div className="relative mb-3">
                  <div
                    className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 shadow-xl p-1 bg-white"
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
                    className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs font-black text-white px-3 py-0.5 rounded-full shadow-md whitespace-nowrap"
                    style={{ backgroundColor: char.color }}
                  >
                    {char.nickname}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-slate-800 mt-2">
                  {char.name}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 font-semibold mt-1">
                  {char.tagline}
                </p>

                <label
                  onClick={(e) => e.stopPropagation()}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 bg-white hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-xl cursor-pointer transition shadow-sm"
                >
                  <Upload size={13} />
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

        {/* Botón para Empezar la Competencia */}
        <button
          onClick={onStartGame}
          className="w-full py-4 px-6 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-2xl font-black text-xl sm:text-2xl shadow-xl transition-transform active:scale-95 flex items-center justify-center gap-3"
        >
          <Play size={28} className="fill-white" />
          <span>¡INICIAR COMPETENCIA CON {selectedCharacter.name.toUpperCase()}!</span>
        </button>

      </div>
    </div>
  );
}
