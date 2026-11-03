// Generador de audio sintetizado por Web Audio API
// Sin descargas externas, 100% compatible y con respuesta inmediata en cualquier navegador

class SoundController {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.musicNotes = [
      261.63, 293.66, 329.63, 349.23, 392.00, 440.00, 523.25, 392.00,
      329.63, 392.00, 523.25, 440.00, 392.00, 349.23, 329.63, 293.66
    ];
    this.noteIdx = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBgm();
    } else {
      this.startBgm();
    }
    return this.isMuted;
  }

  playTone(freq, type = 'sine', duration = 0.1, gainVal = 0.15) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio playTone error", e);
    }
  }

  // Sonido de salto alegre
  playJump() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(450, now + 0.18);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.2);
    } catch (e) {
      console.warn(e);
    }
  }

  // Sonido al atrapar una golosina
  playCollect(kind = 'candy') {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const baseFreq = kind === 'star' ? 880 : (kind === 'lollipop' ? 659.25 : (kind === 'chocolate' ? 587.33 : 523.25));

    this.playTone(baseFreq, 'sine', 0.12, 0.2);
    setTimeout(() => {
      this.playTone(baseFreq * 1.25, 'triangle', 0.15, 0.22);
    }, 50);

    if (kind === 'star' || kind === 'lollipop') {
      setTimeout(() => {
        this.playTone(baseFreq * 1.5, 'sine', 0.2, 0.25);
      }, 100);
    }
  }

  // Sonido cómico de choque / cosquillas (amigable)
  playOuch() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.linearRampToValueAtTime(140, now + 0.25);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.25);
    } catch (e) {
      console.warn(e);
    }
  }

  // Sonido de victoria / pasar de nivel
  playWin() {
    if (this.isMuted) return;
    this.init();
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.25, 0.25);
      }, idx * 120);
    });
  }

  // Sonido de fin de partida (amable, animador)
  playGameOver() {
    if (this.isMuted) return;
    this.init();
    const notes = [440, 392, 349.23, 293.66];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.3, 0.18);
      }, idx * 150);
    });
  }

  // Sonido al tomar juguito / recuperar energía
  playJuice() {
    if (this.isMuted) return;
    this.init();
    const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'sine', 0.15, 0.2);
      }, idx * 60);
    });
  }

  // Sonido de activación de escudo burbuja
  playShield() {
    if (this.isMuted) return;
    this.init();
    const notes = [587.33, 739.99, 880, 1174.66]; // D5, F#5, A5, D6
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.18, 0.22);
      }, idx * 70);
    });
  }

  // Sonido de cambio de turno
  playTurnSwitch() {
    if (this.isMuted) return;
    this.init();
    const notes = [392, 523.25, 659.25];
    notes.forEach((freq, idx) => {
      setTimeout(() => {
        this.playTone(freq, 'triangle', 0.2, 0.2);
      }, idx * 100);
    });
  }

  // Música de fondo sintetizada (Loop rítmico alegre y suave)
  startBgm() {
    if (this.bgmPlaying || this.isMuted) return;
    this.bgmPlaying = true;
    this.init();

    const loop = () => {
      if (!this.bgmPlaying || this.isMuted) return;
      const note = this.musicNotes[this.noteIdx % this.musicNotes.length];
      this.playTone(note, 'sine', 0.16, 0.04);

      // Acompañamiento rítmico de bajo
      if (this.noteIdx % 2 === 0) {
        this.playTone(note / 2, 'triangle', 0.2, 0.05);
      }

      this.noteIdx++;
      this.bgmTimer = setTimeout(loop, 220);
    };

    loop();
  }

  stopBgm() {
    this.bgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }
}

export const sounds = new SoundController();

