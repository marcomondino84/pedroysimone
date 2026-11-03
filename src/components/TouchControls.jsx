import React from 'react';
import { ArrowLeft, ArrowRight, ArrowDown, ArrowUp, Zap } from 'lucide-react';

export function TouchControls({ onControl, autoRun, onToggleAutoRun }) {
  const handleTouch = (action, active, e) => {
    if (e) {
      if (e.cancelable) e.preventDefault();
      e.stopPropagation();
    }
    onControl(action, active);
  };

  return (
    <div className="fixed bottom-2 sm:bottom-4 left-0 right-0 z-40 px-3 sm:px-6 pointer-events-none select-none flex justify-between items-end pb-[env(safe-area-inset-bottom)]">

      {/* Botones de Dirección (Izquierda / Auto-run / Derecha) */}
      <div className="flex items-center gap-2 pointer-events-auto bg-white/40 backdrop-blur-md p-1.5 rounded-3xl border-2 border-white/50 shadow-2xl">
        {/* Botón Izquierda */}
        <button
          onTouchStart={(e) => handleTouch('left', true, e)}
          onTouchEnd={(e) => handleTouch('left', false, e)}
          onTouchCancel={(e) => handleTouch('left', false, e)}
          onMouseDown={(e) => handleTouch('left', true, e)}
          onMouseUp={(e) => handleTouch('left', false, e)}
          onMouseLeave={(e) => handleTouch('left', false, e)}
          className="w-14 h-14 sm:w-16 sm:h-16 bg-white/95 active:bg-sky-200 text-slate-800 rounded-2xl shadow-lg border-3 border-sky-400 active:scale-95 flex flex-col items-center justify-center transition-transform touch-none"
          aria-label="Mover a la izquierda"
        >
          <ArrowLeft size={28} className="stroke-[3] text-sky-600" />
          <span className="text-[10px] font-black text-sky-700">ATRÁS</span>
        </button>

        {/* Botón Auto-Carrera para chicos */}
        <button
          onClick={onToggleAutoRun}
          className={`h-14 px-2 sm:px-3 rounded-2xl shadow-lg border-3 flex flex-col items-center justify-center transition-all active:scale-95 touch-none ${autoRun
              ? 'bg-emerald-500 border-emerald-300 text-white animate-pulse-fast'
              : 'bg-white/95 border-emerald-400 text-emerald-800'
            }`}
          title="Activar avance automático para no tener que mantener apretado"
        >
          <Zap size={20} className={autoRun ? 'fill-yellow-300 text-yellow-300' : 'text-emerald-600'} />
          <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-tight">
            {autoRun ? 'AUTO ON' : 'AUTO RUN'}
          </span>
        </button>

        {/* Botón Derecha */}
        <button
          onTouchStart={(e) => handleTouch('right', true, e)}
          onTouchEnd={(e) => handleTouch('right', false, e)}
          onTouchCancel={(e) => handleTouch('right', false, e)}
          onMouseDown={(e) => handleTouch('right', true, e)}
          onMouseUp={(e) => handleTouch('right', false, e)}
          onMouseLeave={(e) => handleTouch('right', false, e)}
          className="w-14 h-14 sm:w-16 sm:h-16 bg-white/95 active:bg-sky-200 text-slate-800 rounded-2xl shadow-lg border-3 border-sky-400 active:scale-95 flex flex-col items-center justify-center transition-transform touch-none"
          aria-label="Mover a la derecha"
        >
          <ArrowRight size={28} className="stroke-[3] text-sky-600" />
          <span className="text-[10px] font-black text-sky-700">AVANZAR</span>
        </button>
      </div>

      {/* Botón de Salto Gigante */}
      <div className="pointer-events-auto bg-white/40 backdrop-blur-md p-1.5 rounded-3xl border-2 border-white/50 shadow-2xl">
        <button
          onTouchStart={(e) => handleTouch('jump', true, e)}
          onTouchEnd={(e) => handleTouch('jump', false, e)}
          onTouchCancel={(e) => handleTouch('jump', false, e)}
          onMouseDown={(e) => handleTouch('jump', true, e)}
          onMouseUp={(e) => handleTouch('jump', false, e)}
          onMouseLeave={(e) => handleTouch('jump', false, e)}
          className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 active:from-pink-600 active:to-rose-600 text-white rounded-2xl shadow-xl border-4 border-white active:scale-90 flex flex-col items-center justify-center transition-transform touch-none"
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
