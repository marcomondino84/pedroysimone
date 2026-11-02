import React from 'react';
import { ArrowLeft, ArrowRight, ArrowDown, ArrowUp } from 'lucide-react';

export function TouchControls({ onControl }) {
  const handleTouch = (action, active, e) => {
    if (e) {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
    }
    onControl(action, active);
  };

  return (
    <div className="absolute bottom-3 left-0 right-0 z-30 px-3 sm:px-6 pointer-events-none select-none flex justify-between items-end">
      
      {/* Botones de Dirección (Izquierda / Abajo / Derecha) */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <button
          onTouchStart={(e) => handleTouch('left', true, e)}
          onTouchEnd={(e) => handleTouch('left', false, e)}
          onMouseDown={(e) => handleTouch('left', true, e)}
          onMouseUp={(e) => handleTouch('left', false, e)}
          onMouseLeave={(e) => handleTouch('left', false, e)}
          className="w-14 h-14 sm:w-16 sm:h-16 bg-white/85 active:bg-white text-slate-800 rounded-2xl shadow-xl border-3 border-sky-400 active:scale-95 flex items-center justify-center transition-transform backdrop-blur-md"
          aria-label="Mover a la izquierda"
        >
          <ArrowLeft size={30} className="stroke-[3] text-sky-600" />
        </button>

        <button
          onTouchStart={(e) => handleTouch('down', true, e)}
          onTouchEnd={(e) => handleTouch('down', false, e)}
          onMouseDown={(e) => handleTouch('down', true, e)}
          onMouseUp={(e) => handleTouch('down', false, e)}
          onMouseLeave={(e) => handleTouch('down', false, e)}
          className="w-12 h-12 sm:w-14 sm:h-14 bg-white/85 active:bg-white text-slate-800 rounded-2xl shadow-xl border-3 border-amber-400 active:scale-95 flex items-center justify-center transition-transform backdrop-blur-md"
          aria-label="Agacharse"
        >
          <ArrowDown size={26} className="stroke-[3] text-amber-600" />
        </button>

        <button
          onTouchStart={(e) => handleTouch('right', true, e)}
          onTouchEnd={(e) => handleTouch('right', false, e)}
          onMouseDown={(e) => handleTouch('right', true, e)}
          onMouseUp={(e) => handleTouch('right', false, e)}
          onMouseLeave={(e) => handleTouch('right', false, e)}
          className="w-14 h-14 sm:w-16 sm:h-16 bg-white/85 active:bg-white text-slate-800 rounded-2xl shadow-xl border-3 border-sky-400 active:scale-95 flex items-center justify-center transition-transform backdrop-blur-md"
          aria-label="Mover a la derecha"
        >
          <ArrowRight size={30} className="stroke-[3] text-sky-600" />
        </button>
      </div>

      {/* Botón de Salto Gigante */}
      <div className="pointer-events-auto">
        <button
          onTouchStart={(e) => handleTouch('jump', true, e)}
          onTouchEnd={(e) => handleTouch('jump', false, e)}
          onMouseDown={(e) => handleTouch('jump', true, e)}
          onMouseUp={(e) => handleTouch('jump', false, e)}
          onMouseLeave={(e) => handleTouch('jump', false, e)}
          className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-pink-500 to-rose-400 active:from-pink-600 active:to-rose-500 text-white rounded-3xl shadow-2xl border-4 border-white active:scale-90 flex flex-col items-center justify-center transition-transform backdrop-blur-md"
          aria-label="Saltar"
        >
          <ArrowUp size={34} className="stroke-[3.5] animate-bounce-slow" />
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider mt-0.5">
            ¡SALTAR!
          </span>
        </button>
      </div>

    </div>
  );
}
