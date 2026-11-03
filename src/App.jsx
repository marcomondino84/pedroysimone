import React, { useState, useEffect, useRef } from 'react';
import { CHARACTERS, LEVELS } from './data/gameConfig';
import { GameEngine } from './game/GameEngine';
import { NavbarHUD } from './components/NavbarHUD';
import { TouchControls } from './components/TouchControls';
import { CharacterSelectModal } from './components/CharacterSelectModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { GameOverModal } from './components/GameOverModal';
import { VictoryModal } from './components/VictoryModal';
import { sounds } from './utils/soundEffects';

export function App() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  // Estados del juego
  const [characterList, setCharacterList] = useState(CHARACTERS);
  const [selectedChar, setSelectedChar] = useState(CHARACTERS[0]);
  const [currentLevel, setCurrentLevel] = useState(LEVELS[0]);

  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [progress, setProgress] = useState(0);

  // Estados de control y UI
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [autoRun, setAutoRun] = useState(false);
  const [showHelperHint, setShowHelperHint] = useState(true);

  // Modales
  const [showCharModal, setShowCharModal] = useState(true);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isVictory, setIsVictory] = useState(false);

  // Inicializar o reiniciar motor de juego
  const initEngine = (charToUse = selectedChar, levelToUse = currentLevel) => {
    if (!canvasRef.current) return;

    if (engineRef.current) {
      engineRef.current.stop();
    }

    const engine = new GameEngine(canvasRef.current, charToUse, levelToUse, {
      onScoreChange: (newScore) => setScore(newScore),
      onLivesChange: (newLives) => setLives(newLives),
      onProgress: (cur, target) => setProgress(cur),
      onLevelComplete: (lvlId, finalScore) => {
        setIsVictory(true);
      },
      onGameOver: (finalScore) => {
        setIsGameOver(true);
      }
    });

    engineRef.current = engine;
    setScore(0);
    setLives(3);
    setProgress(0);
    setIsGameOver(false);
    setIsVictory(false);
    setIsPaused(false);
    setAutoRun(false);
    setShowHelperHint(true);

    engine.start();
  };

  // Resize listener
  useEffect(() => {
    const handleResize = () => {
      if (engineRef.current) {
        engineRef.current.resizeCanvas();
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Listeners de Teclado PC (Acepta tanto code como key para teclados en español/latinoamericanos)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!engineRef.current) return;

      const code = e.code;
      const key = e.key;

      if (code === 'ArrowLeft' || key === 'ArrowLeft' || key === 'Left' || code === 'KeyA' || key === 'a' || key === 'A') {
        engineRef.current.setControl('left', true);
        setShowHelperHint(false);
      } else if (code === 'ArrowRight' || key === 'ArrowRight' || key === 'Right' || code === 'KeyD' || key === 'd' || key === 'D') {
        engineRef.current.setControl('right', true);
        setShowHelperHint(false);
      } else if (code === 'ArrowDown' || key === 'ArrowDown' || key === 'Down' || code === 'KeyS' || key === 's' || key === 'S') {
        engineRef.current.setControl('down', true);
      } else if (code === 'Space' || key === ' ' || code === 'ArrowUp' || key === 'ArrowUp' || key === 'Up' || code === 'KeyW' || key === 'w' || key === 'W') {
        e.preventDefault();
        engineRef.current.setControl('jump', true);
        setShowHelperHint(false);
      } else if (code === 'KeyP' || key === 'p' || key === 'P') {
        togglePause();
      } else if (code === 'KeyM' || key === 'm' || key === 'M') {
        toggleMute();
      }
    };

    const handleKeyUp = (e) => {
      if (!engineRef.current) return;

      const code = e.code;
      const key = e.key;

      if (code === 'ArrowLeft' || key === 'ArrowLeft' || key === 'Left' || code === 'KeyA' || key === 'a' || key === 'A') {
        engineRef.current.setControl('left', false);
      } else if (code === 'ArrowRight' || key === 'ArrowRight' || key === 'Right' || code === 'KeyD' || key === 'd' || key === 'D') {
        engineRef.current.setControl('right', false);
      } else if (code === 'ArrowDown' || key === 'ArrowDown' || key === 'Down' || code === 'KeyS' || key === 's' || key === 'S') {
        engineRef.current.setControl('down', false);
      } else if (code === 'Space' || key === ' ' || code === 'ArrowUp' || key === 'ArrowUp' || key === 'Up' || code === 'KeyW' || key === 'w' || key === 'W') {
        engineRef.current.setControl('jump', false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Handlers
  const handleStartGame = () => {
    setShowCharModal(false);
    setIsGameStarted(true);
    initEngine(selectedChar, currentLevel);
  };

  const handleSelectCharacter = (char) => {
    setSelectedChar(char);
  };

  const handleUpdateCustomPhoto = (charId, photoDataUrl) => {
    const updated = characterList.map((c) =>
      c.id === charId ? { ...c, customPhoto: photoDataUrl } : c
    );
    setCharacterList(updated);
    const curr = updated.find((c) => c.id === selectedChar.id) || updated[0];
    setSelectedChar(curr);
    if (engineRef.current) {
      engineRef.current.updateCharacter(curr);
    }
  };

  // Alternar rápidamente entre Pedro y Simoné (Modo cooperativo / relevo)
  const handleSwitchCharacter = () => {
    const nextChar = selectedChar.id === 'pedro' 
      ? characterList.find(c => c.id === 'simone') 
      : characterList.find(c => c.id === 'pedro');
    
    if (nextChar) {
      setSelectedChar(nextChar);
      if (engineRef.current) {
        engineRef.current.updateCharacter(nextChar);
        engineRef.current.addFloatText(`¡Vamos ${nextChar.name}! ⭐`, engineRef.current.player.x, engineRef.current.player.y - 30, nextChar.color);
      }
    }
  };

  const handleSelectLevel = (lvl) => {
    setCurrentLevel(lvl);
    if (engineRef.current) {
      engineRef.current.updateLevel(lvl);
      setProgress(0);
    }
  };

  const handleNextLevel = () => {
    const nextIndex = LEVELS.findIndex((l) => l.id === currentLevel.id) + 1;
    if (nextIndex < LEVELS.length) {
      const nextLvl = LEVELS[nextIndex];
      setCurrentLevel(nextLvl);
      initEngine(selectedChar, nextLvl);
    } else {
      initEngine(selectedChar, LEVELS[0]);
    }
  };

  const handleRestart = () => {
    initEngine(selectedChar, currentLevel);
  };

  const togglePause = () => {
    if (engineRef.current) {
      engineRef.current.pause();
      setIsPaused(engineRef.current.isPaused);
    }
  };

  const toggleMute = () => {
    const muted = sounds.toggleMute();
    setIsMuted(muted);
  };

  const toggleAutoRun = () => {
    if (engineRef.current) {
      const state = engineRef.current.toggleAutoRun();
      setAutoRun(state);
      setShowHelperHint(false);
    }
  };

  const handleTouchControl = (action, active) => {
    if (engineRef.current) {
      engineRef.current.setControl(action, active);
      setShowHelperHint(false);
    }
  };

  // Soporte para tocar o hacer clic directamente en la pantalla de juego
  const handleCanvasPointerDown = (e) => {
    if (!canvasRef.current || !engineRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const relativeX = x / rect.width;
    const relativeY = y / rect.height;

    setShowHelperHint(false);

    // Si toca en la parte superior -> saltar
    if (relativeY < 0.45) {
      engineRef.current.triggerJump();
    } else if (relativeX < 0.4) {
      engineRef.current.setControl('left', true);
    } else {
      engineRef.current.setControl('right', true);
    }
  };

  const handleCanvasPointerUp = () => {
    if (!engineRef.current) return;
    engineRef.current.setControl('left', false);
    if (!autoRun) {
      engineRef.current.setControl('right', false);
    }
  };

  const hasNextLevel = LEVELS.findIndex((l) => l.id === currentLevel.id) < LEVELS.length - 1;

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-slate-900 overflow-hidden select-none flex flex-col items-center justify-center">
      
      {/* Contenedor del Juego y Canvas */}
      <div 
        className="relative w-full h-full flex items-center justify-center overflow-hidden bg-sky-200"
        onPointerDown={handleCanvasPointerDown}
        onPointerUp={handleCanvasPointerUp}
      >
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-pointer touch-none"
        />

        {/* HUD Superior (Vidas, Golosinas, Nivel, Audio) */}
        {isGameStarted && (
          <NavbarHUD
            character={selectedChar}
            score={score}
            lives={lives}
            level={currentLevel}
            progress={progress}
            targetScore={currentLevel.targetScore}
            isPaused={isPaused}
            isMuted={isMuted}
            onToggleMute={toggleMute}
            onTogglePause={togglePause}
            onSwitchCharacter={handleSwitchCharacter}
            onOpenLevelSelect={() => setShowLevelModal(true)}
          />
        )}

        {/* Cartelito de ayuda para chicos (desaparece al tocar) */}
        {isGameStarted && showHelperHint && !isPaused && (
          <div className="fixed top-20 left-1/2 -translate-x-1/2 z-30 bg-amber-400 text-slate-900 font-black text-xs sm:text-sm px-4 py-2 rounded-2xl shadow-xl border-2 border-white animate-bounce-slow pointer-events-none text-center">
            👉 ¡Tocá la derecha para avanzar, la izquierda para volver o arriba para saltar! 🍬
          </div>
        )}

        {/* Controles Táctiles en Pantalla (Siempre visibles y flotantes) */}
        {isGameStarted && !isPaused && !isGameOver && !isVictory && (
          <TouchControls 
            onControl={handleTouchControl} 
            autoRun={autoRun}
            onToggleAutoRun={toggleAutoRun}
          />
        )}

        {/* Pantalla de Pausa */}
        {isPaused && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4">
            <h2 className="text-4xl sm:text-5xl font-black mb-4 animate-bounce-slow">
              ⏸️ JUEGO EN PAUSA
            </h2>
            <p className="text-lg font-bold mb-6 text-slate-200">
              Tomate un respiro y volvé cuando quieras.
            </p>
            <button
              onClick={togglePause}
              className="px-8 py-3.5 bg-emerald-500 hover:bg-emerald-600 rounded-2xl font-black text-xl shadow-lg transition transform active:scale-95"
            >
              ¡CONTINUAR!
            </button>
          </div>
        )}
      </div>

      {/* MODAL 1: Pantalla de Inicio / Selección de Personaje */}
      {showCharModal && (
        <CharacterSelectModal
          selectedCharacter={selectedChar}
          onSelectCharacter={handleSelectCharacter}
          onUpdateCustomPhoto={handleUpdateCustomPhoto}
          onStartGame={handleStartGame}
        />
      )}

      {/* MODAL 2: Selector de Nivel / Escenarios */}
      {showLevelModal && (
        <LevelSelectModal
          currentLevel={currentLevel}
          onSelectLevel={handleSelectLevel}
          onClose={() => setShowLevelModal(false)}
        />
      )}

      {/* MODAL 3: Game Over Amigable */}
      {isGameOver && (
        <GameOverModal
          score={score}
          character={selectedChar}
          onRestart={handleRestart}
          onChangeCharacter={() => {
            setIsGameOver(false);
            setShowCharModal(true);
          }}
        />
      )}

      {/* MODAL 4: Victoria / Nivel Completado */}
      {isVictory && (
        <VictoryModal
          score={score}
          level={currentLevel}
          hasNextLevel={hasNextLevel}
          character={selectedChar}
          onNextLevel={handleNextLevel}
          onRestart={handleRestart}
        />
      )}

    </div>
  );
}

export default App;
