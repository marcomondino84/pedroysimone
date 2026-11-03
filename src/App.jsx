import React, { useState, useEffect, useRef } from 'react';
import { CHARACTERS, LEVELS } from './data/gameConfig';
import { GameEngine } from './game/GameEngine';
import { NavbarHUD } from './components/NavbarHUD';
import { TouchControls } from './components/TouchControls';
import { CharacterSelectModal } from './components/CharacterSelectModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { TurnSwitchModal } from './components/TurnSwitchModal';
import { CompetitionResultsModal } from './components/CompetitionResultsModal';
import { VictoryModal } from './components/VictoryModal';
import { sounds } from './utils/soundEffects';

export function App() {
  const canvasRef = useRef(null);
  const engineRef = useRef(null);

  // Lista de personajes con soporte de fotos personalizadas
  const [characterList, setCharacterList] = useState(CHARACTERS);
  const [activeChar, setActiveChar] = useState(CHARACTERS[0]);
  const [currentLevel, setCurrentLevel] = useState(LEVELS[0]);

  // Marcadores de Competencia Intercalada
  const [pedroScore, setPedroScore] = useState(0);
  const [simoneScore, setSimoneScore] = useState(0);
  const [pedroLives, setPedroLives] = useState(3);
  const [simoneLives, setSimoneLives] = useState(3);

  // Estado del turno activo
  const [currentTurnScore, setCurrentTurnScore] = useState(0);
  const [energy, setEnergy] = useState(100);
  const [shieldSeconds, setShieldSeconds] = useState(0);
  const [levelProgress, setLevelProgress] = useState(0);

  // Estados de control y UI
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [autoRun, setAutoRun] = useState(false);
  const [showHelperHint, setShowHelperHint] = useState(true);

  // Modales
  const [showCharModal, setShowCharModal] = useState(true);
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showTurnModal, setShowTurnModal] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);

  // Datos para el cambio de turno
  const [turnSwitchData, setTurnSwitchData] = useState({
    finishedChar: CHARACTERS[0],
    roundPoints: 0,
    finishedTotalScore: 0,
    nextChar: CHARACTERS[1],
    nextLifeNumber: 1
  });

  // Inicializar o reiniciar motor con un personaje específico
  const startTurn = (charToUse = activeChar, levelToUse = currentLevel) => {
    if (!canvasRef.current) return;

    if (engineRef.current) {
      engineRef.current.stop();
    }

    setCurrentTurnScore(0);
    setEnergy(100);
    setShieldSeconds(0);
    setLevelProgress(0);
    setIsPaused(false);
    setAutoRun(false);
    setShowHelperHint(true);

    const engine = new GameEngine(canvasRef.current, charToUse, levelToUse, {
      onScoreChange: (score) => {
        setCurrentTurnScore(score);
      },
      onEnergyChange: (curEnergy) => {
        setEnergy(curEnergy);
      },
      onShieldChange: (seconds) => {
        setShieldSeconds(seconds);
      },
      onProgress: (cur, target) => {
        setLevelProgress(cur);
      },
      onTurnOver: (finalRoundScore) => {
        handleTurnEnd(finalRoundScore, charToUse);
      },
      onLevelComplete: (lvlId, finalRoundScore) => {
        setShowVictoryModal(true);
      }
    });

    engineRef.current = engine;
    engine.start();
  };

  // Manejador del fin de turno (cuando pierde su vida actual)
  const handleTurnEnd = (roundPointsEarned, finishedChar) => {
    sounds.playTurnSwitch();

    let newPedroLives = pedroLives;
    let newSimoneLives = simoneLives;
    let newPedroScore = pedroScore;
    let newSimoneScore = simoneScore;

    if (finishedChar.id === 'pedro') {
      newPedroLives = Math.max(0, pedroLives - 1);
      newPedroScore = pedroScore + roundPointsEarned;
      setPedroLives(newPedroLives);
      setPedroScore(newPedroScore);
    } else {
      newSimoneLives = Math.max(0, simoneLives - 1);
      newSimoneScore = simoneScore + roundPointsEarned;
      setSimoneLives(newSimoneLives);
      setSimoneScore(newSimoneScore);
    }

    // Comprobar si ambos jugadores ya consumieron sus 3 vidas
    if (newPedroLives === 0 && newSimoneLives === 0) {
      setShowResultsModal(true);
      return;
    }

    // Determinar quién juega el siguiente turno intercalado
    const pedroObj = characterList.find((c) => c.id === 'pedro') || characterList[0];
    const simoneObj = characterList.find((c) => c.id === 'simone') || characterList[1];

    let nextChar;
    let nextLifeNumber;

    if (finishedChar.id === 'pedro') {
      if (newSimoneLives > 0) {
        nextChar = simoneObj;
        nextLifeNumber = 3 - newSimoneLives + 1;
      } else {
        // Simoné ya no tiene vidas, sigue Pedro si aún le quedan
        nextChar = pedroObj;
        nextLifeNumber = 3 - newPedroLives + 1;
      }
    } else {
      if (newPedroLives > 0) {
        nextChar = pedroObj;
        nextLifeNumber = 3 - newPedroLives + 1;
      } else {
        nextChar = simoneObj;
        nextLifeNumber = 3 - newSimoneLives + 1;
      }
    }

    setTurnSwitchData({
      finishedChar: finishedChar,
      roundPoints: roundPointsEarned,
      finishedTotalScore: finishedChar.id === 'pedro' ? newPedroScore : newSimoneScore,
      nextChar: nextChar,
      nextLifeNumber: nextLifeNumber
    });

    setShowTurnModal(true);
  };

  // Confirmar cambio de turno y reanudar con el siguiente jugador
  const handleContinueNextTurn = () => {
    setShowTurnModal(false);
    const nextPlayer = turnSwitchData.nextChar;
    setActiveChar(nextPlayer);
    startTurn(nextPlayer, currentLevel);
  };

  // Reiniciar la competencia completa (Revancha)
  const handleRestartFullMatch = () => {
    setPedroScore(0);
    setSimoneScore(0);
    setPedroLives(3);
    setSimoneLives(3);
    setShowResultsModal(false);
    setShowTurnModal(false);
    setShowVictoryModal(false);

    // Arranca Pedro en el primer turno
    const firstChar = characterList.find((c) => c.id === 'pedro') || characterList[0];
    setActiveChar(firstChar);
    startTurn(firstChar, currentLevel);
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

  const handleStartGame = () => {
    setShowCharModal(false);
    setIsGameStarted(true);
    setPedroScore(0);
    setSimoneScore(0);
    setPedroLives(3);
    setSimoneLives(3);
    startTurn(activeChar, currentLevel);
  };

  const handleSelectCharacter = (char) => {
    setActiveChar(char);
  };

  const handleUpdateCustomPhoto = (charId, photoDataUrl) => {
    const updated = characterList.map((c) =>
      c.id === charId ? { ...c, customPhoto: photoDataUrl } : c
    );
    setCharacterList(updated);
    const curr = updated.find((c) => c.id === activeChar.id) || updated[0];
    setActiveChar(curr);
    if (engineRef.current) {
      engineRef.current.updateCharacter(curr);
    }
  };

  const handleSelectLevel = (lvl) => {
    setCurrentLevel(lvl);
    if (engineRef.current) {
      engineRef.current.updateLevel(lvl);
      setLevelProgress(0);
    }
  };

  const handleNextLevel = () => {
    const nextIndex = LEVELS.findIndex((l) => l.id === currentLevel.id) + 1;
    if (nextIndex < LEVELS.length) {
      const nextLvl = LEVELS[nextIndex];
      setCurrentLevel(nextLvl);
      startTurn(activeChar, nextLvl);
    } else {
      startTurn(activeChar, LEVELS[0]);
    }
    setShowVictoryModal(false);
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

  const handleCanvasPointerDown = (e) => {
    if (!canvasRef.current || !engineRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const relativeX = x / rect.width;
    const relativeY = y / rect.height;

    setShowHelperHint(false);

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

  // Marcadores combinados para el HUD
  const displayPedroScore = activeChar.id === 'pedro' ? pedroScore + currentTurnScore : pedroScore;
  const displaySimoneScore = activeChar.id === 'simone' ? simoneScore + currentTurnScore : simoneScore;

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

        {/* HUD Superior (Marcador Dual Pedro vs Simoné + Barra de Energía + Escudo) */}
        {isGameStarted && (
          <NavbarHUD
            activeChar={activeChar}
            pedroScore={displayPedroScore}
            simoneScore={displaySimoneScore}
            pedroLives={pedroLives}
            simoneLives={simoneLives}
            energy={energy}
            shieldSeconds={shieldSeconds}
            level={currentLevel}
            isPaused={isPaused}
            isMuted={isMuted}
            characters={characterList}
            onToggleMute={toggleMute}
            onTogglePause={togglePause}
            onOpenLevelSelect={() => setShowLevelModal(true)}
          />
        )}

        {/* Cartelito de ayuda para chicos */}
        {isGameStarted && showHelperHint && !isPaused && !showTurnModal && !showResultsModal && (
          <div className="fixed top-24 sm:top-20 left-1/2 -translate-x-1/2 z-30 bg-amber-400 text-slate-900 font-black text-xs sm:text-sm px-4 py-2 rounded-2xl shadow-xl border-2 border-white animate-bounce-slow pointer-events-none text-center">
            👉 ¡Tocá la derecha para correr, arriba para saltar y juntá juguitos 🧃 para recargar energía!
          </div>
        )}

        {/* Controles Táctiles en Pantalla */}
        {isGameStarted && !isPaused && !showTurnModal && !showResultsModal && (
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

      {/* MODAL 1: Pantalla de Inicio / Selección de Quién Empieza */}
      {showCharModal && (
        <CharacterSelectModal
          selectedCharacter={activeChar}
          onSelectCharacter={handleSelectCharacter}
          onUpdateCustomPhoto={handleUpdateCustomPhoto}
          onStartGame={handleStartGame}
        />
      )}

      {/* MODAL 2: Cambio de Turno Intercalado (1 vida por turno) */}
      {showTurnModal && (
        <TurnSwitchModal
          finishedChar={turnSwitchData.finishedChar}
          roundPoints={turnSwitchData.roundPoints}
          finishedTotalScore={turnSwitchData.finishedTotalScore}
          nextChar={turnSwitchData.nextChar}
          nextLifeNumber={turnSwitchData.nextLifeNumber}
          totalLives={3}
          onContinue={handleContinueNextTurn}
        />
      )}

      {/* MODAL 3: Gran Final de Competencia (Ganador, Podio y Revancha) */}
      {showResultsModal && (
        <CompetitionResultsModal
          pedroScore={pedroScore}
          simoneScore={simoneScore}
          characters={characterList}
          onRestart={handleRestartFullMatch}
        />
      )}

      {/* MODAL 4: Selector de Nivel / Escenarios */}
      {showLevelModal && (
        <LevelSelectModal
          currentLevel={currentLevel}
          onSelectLevel={handleSelectLevel}
          onClose={() => setShowLevelModal(false)}
        />
      )}

      {/* MODAL 5: Victoria de Nivel */}
      {showVictoryModal && (
        <VictoryModal
          score={currentTurnScore}
          level={currentLevel}
          hasNextLevel={true}
          character={activeChar}
          onNextLevel={handleNextLevel}
          onRestart={() => {
            setShowVictoryModal(false);
            startTurn(activeChar, currentLevel);
          }}
        />
      )}

    </div>
  );
}

export default App;
