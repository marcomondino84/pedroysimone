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

  // Listeners de Teclado PC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!engineRef.current) return;

      const code = e.code;
      if (code === 'ArrowLeft' || code === 'KeyA') {
        engineRef.current.setControl('left', true);
      } else if (code === 'ArrowRight' || code === 'KeyD') {
        engineRef.current.setControl('right', true);
      } else if (code === 'ArrowDown' || code === 'KeyS') {
        engineRef.current.setControl('down', true);
      } else if (code === 'Space' || code === 'ArrowUp' || code === 'KeyW') {
        e.preventDefault();
        engineRef.current.setControl('jump', true);
      } else if (code === 'KeyP') {
        togglePause();
      } else if (code === 'KeyM') {
        toggleMute();
      }
    };

    const handleKeyUp = (e) => {
      if (!engineRef.current) return;

      const code = e.code;
      if (code === 'ArrowLeft' || code === 'KeyA') {
        engineRef.current.setControl('left', false);
      } else if (code === 'ArrowRight' || code === 'KeyD') {
        engineRef.current.setControl('right', false);
      } else if (code === 'ArrowDown' || code === 'KeyS') {
        engineRef.current.setControl('down', false);
      } else if (code === 'Space' || code === 'ArrowUp' || code === 'KeyW') {
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
      // Si completó todos, vuelve al primero con la puntuación acumulada
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

  const handleTouchControl = (action, active) => {
    if (engineRef.current) {
      engineRef.current.setControl(action, active);
    }
  };

  const hasNextLevel = LEVELS.findIndex((l) => l.id === currentLevel.id) < LEVELS.length - 1;

  return (
    <div className="relative w-screen h-screen bg-slate-900 overflow-hidden select-none flex flex-col items-center justify-center">
      
      {/* Contenedor del Juego y Canvas */}
      <div className="relative w-full h-full max-w-7xl max-h-[900px] flex items-center justify-center overflow-hidden bg-black shadow-2xl">
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-pointer"
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

        {/* Controles Táctiles en Pantalla */}
        {isGameStarted && !isPaused && !isGameOver && !isVictory && (
          <TouchControls onControl={handleTouchControl} />
        )}

        {/* Pantalla de Pausa */}
        {isPaused && (
          <div className="absolute inset-0 z-40 bg-slate-900/60 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4">
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
