import { CANDY_TYPES, NAUGHTY_KIDS } from '../data/gameConfig';
import { sounds } from '../utils/soundEffects';

export class GameEngine {
  constructor(canvas, character, level, callbacks = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.character = character;
    this.level = level;
    this.callbacks = callbacks;

    // Estado de juego
    this.isRunning = false;
    this.isPaused = false;
    this.autoRun = false;
    this.score = 0;
    this.lives = 3;
    this.levelProgress = 0;
    this.gameTime = 0;
    this.targetScore = level.targetScore || 20;

    // Dimensiones virtuales lógicas
    this.width = 960;
    this.height = 540;

    // Jugador
    this.player = {
      x: 120,
      y: 380,
      w: 64,
      h: 84,
      vx: 0,
      vy: 0,
      speed: character.speed || 6.5,
      jumpForce: character.jumpForce || 13.5,
      isGrounded: false,
      jumpsLeft: 2, // Permite doble salto para que sea súper divertido
      facing: 'right',
      invulnerableTimer: 0,
      crouching: false,
      runCycle: 0
    };

    // Entidades
    this.candies = [];
    this.enemies = [];
    this.particles = [];
    this.floatTexts = [];
    this.platforms = [];

    // Controles
    this.keys = {
      left: false,
      right: false,
      up: false,
      down: false,
      jump: false
    };

    // Scroll de cámara y fondo
    this.scrollX = 0;

    // Carga de imagen del jugador
    this.playerImg = new Image();
    this.playerImgLoaded = false;
    this.loadPlayerImage();

    // Spawn timers
    this.candySpawnTimer = 0;
    this.enemySpawnTimer = 0;

    this.initPlatforms();
    this.resizeCanvas();
  }

  loadPlayerImage() {
    this.playerImg.crossOrigin = 'anonymous';
    this.playerImg.src = this.character.customPhoto || this.character.photo;
    this.playerImg.onload = () => {
      this.playerImgLoaded = true;
    };
    this.playerImg.onerror = () => {
      if (this.character.backupPhoto && this.playerImg.src !== this.character.backupPhoto) {
        this.playerImg.src = this.character.backupPhoto;
      } else {
        this.playerImgLoaded = false;
      }
    };
  }

  updateCharacter(newChar) {
    this.character = newChar;
    this.loadPlayerImage();
  }

  updateLevel(newLevel) {
    this.level = newLevel;
    this.targetScore = newLevel.targetScore;
    this.levelProgress = 0;
    this.enemies = [];
    this.candies = [];
    this.initPlatforms();
  }

  initPlatforms() {
    this.platforms = [
      // Plataformas flotantes en alturas alcanzables
      { x: 300, y: 340, w: 140, h: 22, type: 'cloud' },
      { x: 540, y: 260, w: 160, h: 22, type: 'wood' },
      { x: 780, y: 320, w: 130, h: 22, type: 'cloud' },
      { x: 1050, y: 250, w: 150, h: 22, type: 'wood' },
      { x: 1300, y: 330, w: 140, h: 22, type: 'cloud' }
    ];
    this.lastPlatformX = 1300;
  }

  resizeCanvas() {
    if (!this.canvas) return;
    const parent = this.canvas.parentElement;
    if (!parent) return;

    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    this.canvas.width = rect.width * dpr;
    this.canvas.height = rect.height * dpr;
    this.canvas.style.width = `${rect.width}px`;
    this.canvas.style.height = `${rect.height}px`;

    this.scale = Math.min(this.canvas.width / this.width, this.canvas.height / this.height);
    this.offsetX = (this.canvas.width - this.width * this.scale) / 2;
    this.offsetY = (this.canvas.height - this.height * this.scale) / 2;
  }

  start() {
    this.isRunning = true;
    this.isPaused = false;
    this.loop();
    sounds.startBgm();
  }

  pause() {
    this.isPaused = !this.isPaused;
  }

  stop() {
    this.isRunning = false;
    sounds.stopBgm();
  }

  toggleAutoRun() {
    this.autoRun = !this.autoRun;
    return this.autoRun;
  }

  // Métodos de control táctil o externo
  setControl(action, active) {
    if (action === 'left') this.keys.left = active;
    if (action === 'right') this.keys.right = active;
    if (action === 'down') this.keys.down = active;
    if (action === 'jump') {
      if (active && !this.keys.jump) {
        this.triggerJump();
      }
      this.keys.jump = active;
    }
  }

  triggerJump() {
    if (this.player.jumpsLeft > 0) {
      this.player.vy = -this.player.jumpForce;
      this.player.isGrounded = false;
      this.player.jumpsLeft--;
      sounds.playJump();

      // Partículas al saltar
      this.createPuff(this.player.x + this.player.w / 2, this.player.y + this.player.h, 6, '#FFFFFF');
    }
  }

  loop = () => {
    if (!this.isRunning) return;

    if (!this.isPaused) {
      this.update();
      this.render();
    }

    requestAnimationFrame(this.loop);
  };

  update() {
    this.gameTime++;

    // Movimiento horizontal
    let targetVx = 0;
    if (this.keys.left) {
      targetVx -= this.player.speed;
      this.player.facing = 'left';
    }
    if (this.keys.right || this.autoRun) {
      targetVx += this.player.speed;
      this.player.facing = 'right';
    }

    this.player.vx += (targetVx - this.player.vx) * 0.25;
    this.player.x += this.player.vx;

    // Agacharse
    this.player.crouching = this.keys.down && this.player.isGrounded;

    // Gravedad
    this.player.vy += 0.65; // gravedad suave
    if (this.player.vy > 14) this.player.vy = 14;
    this.player.y += this.player.vy;

    // Ciclo de animación al correr
    if (Math.abs(this.player.vx) > 0.5 && this.player.isGrounded) {
      this.player.runCycle += 0.2;
    } else {
      this.player.runCycle = 0;
    }

    // Colisión con el suelo (y = 440 suelo base)
    const floorY = 440;
    const playerBottom = this.player.y + this.player.h;

    this.player.isGrounded = false;

    if (playerBottom >= floorY) {
      this.player.y = floorY - this.player.h;
      this.player.vy = 0;
      this.player.isGrounded = true;
      this.player.jumpsLeft = 2;
    }

    // Colisiones con plataformas flotantes
    for (const plat of this.platforms) {
      // Detección cuando viene cayendo por arriba
      if (
        this.player.vy >= 0 &&
        this.player.x + this.player.w * 0.7 > plat.x &&
        this.player.x + this.player.w * 0.3 < plat.x + plat.w &&
        playerBottom >= plat.y &&
        playerBottom <= plat.y + 16
      ) {
        this.player.y = plat.y - this.player.h;
        this.player.vy = 0;
        this.player.isGrounded = true;
        this.player.jumpsLeft = 2;
      }
    }

    // Límites de pantalla virtual (solo límite izquierdo, la derecha es infinita)
    if (this.player.x < 20) this.player.x = 20;

    // Generar plataformas continuamente hacia adelante
    while (this.lastPlatformX < this.player.x + 1600) {
      this.lastPlatformX += 240 + Math.random() * 120;
      const py = Math.random() > 0.5 ? 320 : 250;
      const type = Math.random() > 0.5 ? 'cloud' : 'wood';
      this.platforms.push({
        x: this.lastPlatformX,
        y: py,
        w: 130 + Math.random() * 40,
        h: 22,
        type
      });
    }
    // Descartar plataformas viejas que quedaron muy atrás
    this.platforms = this.platforms.filter(p => p.x > this.scrollX - 400);

    // Suavizado de cámara según posición de Pedro/Simoné
    const targetScroll = this.player.x - this.width * 0.35;
    this.scrollX += (targetScroll - this.scrollX) * 0.08;
    if (this.scrollX < 0) this.scrollX = 0;

    // Temporizador de invulnerabilidad tras colisión
    if (this.player.invulnerableTimer > 0) {
      this.player.invulnerableTimer--;
    }

    // Spawner de golosinas
    this.candySpawnTimer++;
    if (this.candySpawnTimer > 65) {
      this.candySpawnTimer = 0;
      this.spawnCandy();
    }

    // Spawner de chicos traviesos (enemigos amigables)
    this.enemySpawnTimer++;
    const currentRate = this.level.spawnRate || 85;
    if (this.enemySpawnTimer > currentRate) {
      this.enemySpawnTimer = 0;
      this.spawnEnemy();
    }

    // Actualizar golosinas
    for (let i = this.candies.length - 1; i >= 0; i--) {
      const c = this.candies[i];
      c.wobble += 0.06;
      c.floatY = Math.sin(c.wobble) * 8;

      // Colisión con el jugador
      const px = this.player.x + this.player.w / 2;
      const py = this.player.y + this.player.h / 2;
      const dist = Math.hypot(px - c.x, py - (c.y + c.floatY));

      if (dist < 46) {
        // Recolectada!
        this.score += c.points;
        this.levelProgress += c.points;
        sounds.playCollect(c.kind);

        this.addFloatText(`+${c.points}`, c.x, c.y - 10, c.color);
        this.createSparkles(c.x, c.y, 10, c.color);

        if (this.callbacks.onScoreChange) {
          this.callbacks.onScoreChange(this.score);
        }
        if (this.callbacks.onProgress) {
          this.callbacks.onProgress(this.levelProgress, this.targetScore);
        }

        // Revisar si completó el nivel
        if (this.levelProgress >= this.targetScore) {
          this.triggerLevelWin();
        }

        this.candies.splice(i, 1);
        continue;
      }

      // Eliminar golosinas muy atrás
      if (c.x < this.scrollX - 200) {
        this.candies.splice(i, 1);
      }
    }

    // Actualizar enemigos amigables
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const e = this.enemies[i];
      e.x -= e.speed;
      e.animFrame += 0.15;
      e.jumpTimer += 0.05;

      // Saltito simpático de vez en cuando
      if (e.isJumper) {
        e.yOffset = Math.abs(Math.sin(e.jumpTimer)) * -25;
      } else {
        e.yOffset = 0;
      }

      // Colisión con el jugador
      const pBox = {
        x: this.player.x + 12,
        y: this.player.y + 10,
        w: this.player.w - 24,
        h: this.player.h - 10
      };
      const eBox = {
        x: e.x + 10,
        y: e.y + e.yOffset + 10,
        w: e.w - 20,
        h: e.h - 10
      };

      const isColliding =
        pBox.x < eBox.x + eBox.w &&
        pBox.x + pBox.w > eBox.x &&
        pBox.y < eBox.y + eBox.h &&
        pBox.y + pBox.h > eBox.y;

      if (isColliding && this.player.invulnerableTimer === 0) {
        // ¡Ouch! Cosquillas / te roban 1 vida y un par de golosinas
        this.handlePlayerHit(e);
      }

      // Remover enemigos que ya pasaron de largo
      if (e.x < this.scrollX - 200) {
        this.enemies.splice(i, 1);
      }
    }

    // Actualizar partículas
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity || 0.1;
      p.alpha -= p.fadeSpeed || 0.02;
      p.size *= 0.97;

      if (p.alpha <= 0 || p.size <= 0.5) {
        this.particles.splice(i, 1);
      }
    }

    // Textos flotantes
    for (let i = this.floatTexts.length - 1; i >= 0; i--) {
      const ft = this.floatTexts[i];
      ft.y -= 1.2;
      ft.alpha -= 0.02;
      if (ft.alpha <= 0) {
        this.floatTexts.splice(i, 1);
      }
    }
  }

  handlePlayerHit(enemy) {
    this.player.invulnerableTimer = 100; // ~1.7 segundos
    this.lives--;
    sounds.playOuch();

    // Pierde 2 golosinas si tiene
    const lostPoints = Math.min(2, this.score);
    this.score = Math.max(0, this.score - lostPoints);
    if (this.callbacks.onScoreChange) {
      this.callbacks.onScoreChange(this.score);
    }
    if (this.callbacks.onLivesChange) {
      this.callbacks.onLivesChange(this.lives);
    }

    this.addFloatText("¡Oops! -1 ❤️", this.player.x + 20, this.player.y - 15, '#EF4444');
    this.createPuff(this.player.x + this.player.w / 2, this.player.y + this.player.h / 2, 12, '#FCA5A5');

    // Impulso hacia atrás cómico
    this.player.vx = -4;
    this.player.vy = -5;

    if (this.lives <= 0) {
      this.triggerGameOver();
    }
  }

  spawnCandy() {
    const types = CANDY_TYPES;
    // Ponderación: más comunes los caramelos normales, más raros chupetines y estrellas
    const rand = Math.random();
    let picked;
    if (rand < 0.45) picked = types[0]; // pink
    else if (rand < 0.7) picked = types[1]; // blue
    else if (rand < 0.85) picked = types[3]; // choc
    else if (rand < 0.95) picked = types[4]; // lollipop
    else picked = types[5]; // estrella dorada

    // Alturas posibles: en el piso o flotando arriba de plataformas
    const spawnY = Math.random() > 0.4 ? 385 : (Math.random() > 0.5 ? 290 : 210);
    const spawnX = this.scrollX + this.width + 50 + Math.random() * 200;

    this.candies.push({
      x: spawnX,
      y: spawnY,
      wobble: Math.random() * Math.PI * 2,
      floatY: 0,
      points: picked.points,
      color: picked.color,
      name: picked.name,
      kind: picked.type.includes('star') ? 'star' : (picked.type.includes('lollipop') ? 'lollipop' : (picked.type.includes('choc') ? 'chocolate' : 'candy'))
    });
  }

  spawnEnemy() {
    const kidData = NAUGHTY_KIDS[Math.floor(Math.random() * NAUGHTY_KIDS.length)];
    const speed = (this.level.enemySpeed || 3.0) + (Math.random() * 0.8 - 0.4);

    this.enemies.push({
      x: this.scrollX + this.width + 60,
      y: 375,
      w: 56,
      h: 68,
      speed: speed,
      isJumper: Math.random() > 0.6,
      jumpTimer: 0,
      animFrame: 0,
      name: kidData.name,
      capColor: kidData.capColor,
      clothesColor: kidData.clothesColor,
      hat: kidData.hat,
      phrase: kidData.phrase
    });
  }

  triggerLevelWin() {
    this.isRunning = false;
    sounds.stopBgm();
    sounds.playWin();
    if (this.callbacks.onLevelComplete) {
      this.callbacks.onLevelComplete(this.level.id, this.score);
    }
  }

  triggerGameOver() {
    this.isRunning = false;
    sounds.stopBgm();
    sounds.playGameOver();
    if (this.callbacks.onGameOver) {
      this.callbacks.onGameOver(this.score);
    }
  }

  // Creación de partículas
  createSparkles(x, y, count, color) {
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      this.particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: 4 + Math.random() * 5,
        alpha: 1,
        color: color || '#FBBF24',
        gravity: 0.05,
        fadeSpeed: 0.03
      });
    }
  }

  createPuff(x, y, count, color) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x,
        y,
        vx: (Math.random() - 0.5) * 3,
        vy: -Math.random() * 2.5,
        size: 6 + Math.random() * 8,
        alpha: 0.8,
        color: color || '#E2E8F0',
        gravity: -0.02,
        fadeSpeed: 0.035
      });
    }
  }

  addFloatText(text, x, y, color) {
    this.floatTexts.push({
      text,
      x,
      y,
      alpha: 1,
      color: color || '#FFFFFF'
    });
  }

  // RENDERIZADO PRINCIPAL
  render() {
    const { ctx } = this;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    ctx.save();
    // Aplicar escala y centrado para mantener aspecto en cualquier pantalla
    ctx.translate(this.offsetX, this.offsetY);
    ctx.scale(this.scale, this.scale);

    // 1. Fondo según el escenario (Parque, Ciudad o Peatonal)
    this.drawBackground(ctx);

    // 2. Plataformas flotantes
    this.drawPlatforms(ctx);

    // 3. Golosinas
    this.drawCandies(ctx);

    // 4. Enemigos amigables
    this.drawEnemies(ctx);

    // 5. Jugador (Pedro o Simoné con su foto real y cuerpo animado)
    this.drawPlayer(ctx);

    // 6. Partículas y textos flotantes
    this.drawParticles(ctx);
    this.drawFloatTexts(ctx);

    ctx.restore();
  }

  drawBackground(ctx) {
    const lvl = this.level;

    // Cielo degradado
    const skyGrad = ctx.createLinearGradient(0, 0, 0, 440);
    skyGrad.addColorStop(0, lvl.skyColorTop);
    skyGrad.addColorStop(1, lvl.skyColorBottom);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, this.width, this.height);

    // Elementos de fondo específicos según el tema
    if (lvl.theme === 'park') {
      this.drawParkBackground(ctx);
    } else if (lvl.theme === 'city') {
      this.drawCityBackground(ctx);
    } else if (lvl.theme === 'mall') {
      this.drawMallBackground(ctx);
    }

    // Suelo
    ctx.fillStyle = lvl.groundColor;
    ctx.fillRect(0, 440, this.width, 100);

    // Detalle de pasto o cordón de vereda
    ctx.fillStyle = lvl.groundSubColor;
    ctx.fillRect(0, 440, this.width, 12);

    // Detalles decorativos en el suelo que se mueven con scroll
    ctx.save();
    const groundOffset = (this.scrollX * 0.8) % 80;
    for (let x = -80; x < this.width + 80; x += 60) {
      const realX = x - groundOffset;
      if (lvl.theme === 'park') {
        // Pequeñas flores
        ctx.fillStyle = '#F43F5E';
        ctx.beginPath();
        ctx.arc(realX, 458, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FEF08A';
        ctx.beginPath();
        ctx.arc(realX, 458, 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (lvl.theme === 'city') {
        // Líneas de calle
        ctx.fillStyle = '#F1F5F9';
        ctx.fillRect(realX, 475, 30, 6);
      } else {
        // Patrón de baldosas de shopping
        ctx.fillStyle = 'rgba(255,255,255,0.2)';
        ctx.fillRect(realX, 445, 25, 45);
      }
    }
    ctx.restore();
  }

  drawParkBackground(ctx) {
    // Sol sonriente
    ctx.fillStyle = '#FBBF24';
    ctx.beginPath();
    ctx.arc(120, 90, 42, 0, Math.PI * 2);
    ctx.fill();
    // Rayos
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 4;
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4 + this.gameTime * 0.005;
      ctx.beginPath();
      ctx.moveTo(120 + Math.cos(a) * 48, 90 + Math.sin(a) * 48);
      ctx.lineTo(120 + Math.cos(a) * 62, 90 + Math.sin(a) * 62);
      ctx.stroke();
    }
    // Carita sonriente del sol
    ctx.fillStyle = '#78350F';
    ctx.beginPath();
    ctx.arc(108, 85, 3, 0, Math.PI * 2);
    ctx.arc(132, 85, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(120, 92, 12, 0.2, Math.PI - 0.2);
    ctx.stroke();

    // Nubes con parallax
    const cloudOffset = (this.scrollX * 0.2 + this.gameTime * 0.3) % 1200;
    this.drawCloud(ctx, 300 - cloudOffset, 80, 1.1);
    this.drawCloud(ctx, 750 - cloudOffset, 110, 0.9);
    this.drawCloud(ctx, 1200 - cloudOffset, 70, 1.2);

    // Árboles con parallax medio
    const treeOffset = (this.scrollX * 0.5) % 400;
    for (let x = -200; x < this.width + 400; x += 280) {
      const rx = x - treeOffset;
      // Tronco
      ctx.fillStyle = '#92400E';
      ctx.fillRect(rx + 35, 310, 20, 130);
      // Copa frondosa
      ctx.fillStyle = '#15803D';
      ctx.beginPath();
      ctx.arc(rx + 45, 290, 48, 0, Math.PI * 2);
      ctx.arc(rx + 25, 270, 36, 0, Math.PI * 2);
      ctx.arc(rx + 65, 270, 36, 0, Math.PI * 2);
      ctx.fill();
    }

    // Juegos de plaza (un tobogán simpático y columpios al fondo)
    const parkItemOffset = (this.scrollX * 0.7) % 650;
    const itemX = 500 - parkItemOffset;
    // Tobogán amarillo
    ctx.strokeStyle = '#EAB308';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(itemX, 440);
    ctx.lineTo(itemX + 50, 340);
    ctx.lineTo(itemX + 110, 440);
    ctx.stroke();
    ctx.fillStyle = '#EF4444';
    ctx.fillRect(itemX + 45, 335, 12, 6);
  }

  drawCityBackground(ctx) {
    // Silueta de edificios coloridos
    const bldgOffset = (this.scrollX * 0.3) % 600;
    const colors = ['#60A5FA', '#F472B6', '#34D399', '#FBBF24', '#A78BFA'];
    for (let i = 0; i < 7; i++) {
      const bx = i * 130 - bldgOffset;
      const bw = 110;
      const bh = 180 + (i % 3) * 60;
      const by = 440 - bh;

      ctx.fillStyle = colors[i % colors.length];
      ctx.fillRect(bx, by, bw, bh);

      // Ventanitas iluminadas
      ctx.fillStyle = '#FEF9C3';
      for (let wy = by + 20; wy < 420; wy += 35) {
        for (let wx = bx + 15; wx < bx + bw - 15; wx += 25) {
          ctx.fillRect(wx, wy, 14, 18);
        }
      }
    }

    // Semáforos y postes de luz
    const postOffset = (this.scrollX * 0.7) % 500;
    for (let x = 100; x < this.width + 400; x += 350) {
      const px = x - postOffset;
      ctx.fillStyle = '#334155';
      ctx.fillRect(px, 310, 8, 130);
      // Foco redondo
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(px + 4, 305, 14, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  drawMallBackground(ctx) {
    // Paseo comercial con vidrieras, toldos de colores y globos
    const shopOffset = (this.scrollX * 0.4) % 650;
    const shopColors = ['#F43F5E', '#8B5CF6', '#06B6D4', '#10B981'];

    for (let i = 0; i < 4; i++) {
      const sx = i * 220 - shopOffset;
      // Fachada
      ctx.fillStyle = '#F8FAFC';
      ctx.fillRect(sx, 220, 200, 220);

      // Toldo a rayas
      ctx.fillStyle = shopColors[i % shopColors.length];
      ctx.fillRect(sx - 10, 210, 220, 35);
      ctx.fillStyle = '#FFFFFF';
      for (let tx = sx - 10; tx < sx + 210; tx += 40) {
        ctx.fillRect(tx, 210, 20, 35);
      }

      // Vidriera
      ctx.fillStyle = 'rgba(147, 197, 253, 0.45)';
      ctx.fillRect(sx + 15, 270, 170, 150);
      ctx.strokeStyle = '#94A3B8';
      ctx.lineWidth = 3;
      ctx.strokeRect(sx + 15, 270, 170, 150);

      // Cartel luminoso
      ctx.fillStyle = '#FDE047';
      ctx.fillRect(sx + 30, 248, 140, 18);
      ctx.fillStyle = '#1E293B';
      ctx.font = 'bold 11px sans-serif';
      ctx.fillText(i % 2 === 0 ? '🍬 GOLOSINAS' : '🎈 JUGUETES', sx + 45, 262);
    }

    // Guirnaldas de banderines flotantes
    ctx.strokeStyle = 'rgba(100,100,100,0.3)';
    ctx.beginPath();
    ctx.moveTo(0, 120);
    ctx.quadraticCurveTo(this.width / 2, 160, this.width, 120);
    ctx.stroke();

    const flagOffset = (this.scrollX * 0.2) % 40;
    for (let fx = 20; fx < this.width; fx += 40) {
      const rx = fx - flagOffset;
      ctx.fillStyle = fx % 80 === 0 ? '#EC4899' : (fx % 60 === 0 ? '#3B82F6' : '#EAB308');
      ctx.beginPath();
      ctx.moveTo(rx, 135);
      ctx.lineTo(rx + 15, 155);
      ctx.lineTo(rx + 30, 135);
      ctx.fill();
    }
  }

  drawCloud(ctx, x, y, scale = 1) {
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scale, scale);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.88)';
    ctx.beginPath();
    ctx.arc(40, 30, 24, 0, Math.PI * 2);
    ctx.arc(65, 25, 30, 0, Math.PI * 2);
    ctx.arc(95, 30, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  drawPlatforms(ctx) {
    for (const plat of this.platforms) {
      const drawX = plat.x - this.scrollX;
      if (drawX + plat.w < -50 || drawX > this.width + 50) continue;

      if (plat.type === 'cloud') {
        // Nube esponjosa como plataforma mágica
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.roundRect(drawX, plat.y, plat.w, plat.h, 12);
        ctx.fill();
        ctx.strokeStyle = '#BAE6FD';
        ctx.lineWidth = 3;
        ctx.stroke();
      } else {
        // Banco de madera o toldo
        ctx.fillStyle = '#F59E0B';
        ctx.beginPath();
        ctx.roundRect(drawX, plat.y, plat.w, plat.h, 6);
        ctx.fill();
        ctx.fillStyle = '#D97706';
        ctx.fillRect(drawX + 8, plat.y + 4, plat.w - 16, 4);
      }
    }
  }

  drawCandies(ctx) {
    for (const c of this.candies) {
      const drawX = c.x - this.scrollX;
      const drawY = c.y + c.floatY;

      if (drawX < -60 || drawX > this.width + 60) continue;

      ctx.save();
      ctx.translate(drawX, drawY);

      // Resplandor
      ctx.shadowColor = c.color;
      ctx.shadowBlur = 10;

      if (c.kind === 'candy') {
        // Caramelo envuelto
        ctx.fillStyle = c.color;
        // Cuerpo ovalado
        ctx.beginPath();
        ctx.ellipse(0, 0, 16, 11, 0, 0, Math.PI * 2);
        ctx.fill();
        // Envoltorios en los extremos
        ctx.beginPath();
        ctx.moveTo(-14, 0);
        ctx.lineTo(-24, -8);
        ctx.lineTo(-24, 8);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(14, 0);
        ctx.lineTo(24, -8);
        ctx.lineTo(24, 8);
        ctx.closePath();
        ctx.fill();

        // Rayita decorativa
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, 0, 8, -0.6, 0.6);
        ctx.stroke();
      } else if (c.kind === 'chocolate') {
        // Tableta de chocolate
        ctx.fillStyle = '#78350F';
        ctx.beginPath();
        ctx.roundRect(-16, -12, 32, 24, 4);
        ctx.fill();
        // Cuadraditos
        ctx.fillStyle = '#92400E';
        ctx.fillRect(-12, -8, 10, 8);
        ctx.fillRect(2, -8, 10, 8);
        ctx.fillRect(-12, 2, 10, 8);
        ctx.fillRect(2, 2, 10, 8);
      } else if (c.kind === 'lollipop') {
        // Chupetín redondo en espiral con palito
        ctx.strokeStyle = '#F8FAFC';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 8);
        ctx.lineTo(0, 26);
        ctx.stroke();

        ctx.fillStyle = '#EC4899';
        ctx.beginPath();
        ctx.arc(0, -2, 16, 0, Math.PI * 2);
        ctx.fill();

        // Espiral blanco
        ctx.strokeStyle = '#FFFFFF';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.arc(0, -2, 10, 0, Math.PI * 1.5);
        ctx.stroke();
      } else if (c.kind === 'star') {
        // Estrella Arcoíris mágica
        ctx.fillStyle = '#F59E0B';
        this.drawStar(ctx, 0, 0, 5, 20, 9);
        ctx.fill();
        ctx.fillStyle = '#FEF08A';
        this.drawStar(ctx, 0, 0, 5, 12, 5);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = (Math.PI / 2) * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
  }

  drawEnemies(ctx) {
    for (const e of this.enemies) {
      const drawX = e.x - this.scrollX;
      const drawY = e.y + e.yOffset;

      if (drawX < -70 || drawX > this.width + 70) continue;

      ctx.save();
      ctx.translate(drawX + e.w / 2, drawY + e.h / 2);

      // Animación de correr
      const legAngle = Math.sin(e.animFrame) * 0.45;

      // Piernas
      ctx.strokeStyle = '#1E293B';
      ctx.lineWidth = 5;
      ctx.beginPath();
      // Pierna izquierda
      ctx.moveTo(-8, 14);
      ctx.lineTo(-8 - Math.sin(legAngle) * 12, 32);
      // Pierna derecha
      ctx.moveTo(8, 14);
      ctx.lineTo(8 + Math.sin(legAngle) * 12, 32);
      ctx.stroke();

      // Zapatillas
      ctx.fillStyle = '#EF4444';
      ctx.beginPath();
      ctx.arc(-8 - Math.sin(legAngle) * 12 - 2, 32, 6, 0, Math.PI * 2);
      ctx.arc(8 + Math.sin(legAngle) * 12 + 2, 32, 6, 0, Math.PI * 2);
      ctx.fill();

      // Cuerpo / Remera divertida
      ctx.fillStyle = e.clothesColor;
      ctx.beginPath();
      ctx.roundRect(-16, -4, 32, 24, 6);
      ctx.fill();

      // Brazos agitándose
      ctx.strokeStyle = '#FDBA74';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(-14, 0);
      ctx.lineTo(-22, -10 + Math.sin(e.animFrame) * 8);
      ctx.stroke();

      // Si es cazador tiene red, si es patinador va sonriendo
      if (e.hat === 'bow') {
        // Red simpática
        ctx.strokeStyle = '#38BDF8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(-24, -14, 9, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Cabeza
      ctx.fillStyle = '#FDBA74'; // Tono de piel de caricatura
      ctx.beginPath();
      ctx.arc(0, -18, 16, 0, Math.PI * 2);
      ctx.fill();

      // Gorrita hacia atrás o accesorio simpático
      ctx.fillStyle = e.capColor;
      ctx.beginPath();
      ctx.arc(0, -22, 17, Math.PI, 0);
      ctx.fill();
      // Visera de la gorra
      ctx.fillRect(8, -25, 14, 6);

      // Ojos traviesos (mirando a Pedro/Simoné)
      ctx.fillStyle = '#0F172A';
      ctx.beginPath();
      ctx.arc(-6, -17, 3, 0, Math.PI * 2);
      ctx.arc(4, -17, 3, 0, Math.PI * 2);
      ctx.fill();

      // Sonrisa pícara
      ctx.strokeStyle = '#0F172A';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-1, -12, 6, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Nombre del chico sobre su cabeza
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 4;
      ctx.fillText(e.name, 0, -40);

      ctx.restore();
    }
  }

  // DIBUJO DEL PROTAGONISTA (Pedro o Simoné)
  drawPlayer(ctx) {
    const p = this.player;
    const drawX = p.x - this.scrollX;
    const drawY = p.y;

    ctx.save();
    ctx.translate(drawX + p.w / 2, drawY + p.h / 2);

    // Efecto de parpadeo si es invulnerable tras recibir cosquillas
    if (p.invulnerableTimer > 0 && Math.floor(p.invulnerableTimer / 6) % 2 === 0) {
      ctx.globalAlpha = 0.45;
    }

    // Orientación hacia donde camina
    if (p.facing === 'left') {
      ctx.scale(-1, 1);
    }

    // Animación de piernas y brazos al correr
    const legAngle = Math.sin(p.runCycle) * 0.55;

    // Piernas (Pantalón corto y zapatillas)
    ctx.strokeStyle = '#1E3A8A';
    ctx.lineWidth = 6;
    ctx.beginPath();
    // Pierna trasera
    ctx.moveTo(-8, 16);
    ctx.lineTo(-8 - Math.sin(legAngle) * 16, 36);
    // Pierna delantera
    ctx.moveTo(8, 16);
    ctx.lineTo(8 + Math.sin(legAngle) * 16, 36);
    ctx.stroke();

    // Zapatillas deportivas con color del personaje
    ctx.fillStyle = this.character.color;
    ctx.beginPath();
    ctx.arc(-8 - Math.sin(legAngle) * 16 - 2, 36, 7, 0, Math.PI * 2);
    ctx.arc(8 + Math.sin(legAngle) * 16 + 2, 36, 7, 0, Math.PI * 2);
    ctx.fill();

    // Cuerpo (Remera con color del personaje)
    ctx.fillStyle = this.character.shirtColor;
    ctx.beginPath();
    ctx.roundRect(-16, -6, 32, 26, 8);
    ctx.fill();

    // Detalle de estrella o logo en la remera
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(this.character.id === 'pedro' ? 'P' : 'S', 0, 12);

    // Brazos con manitos
    ctx.strokeStyle = '#FED7AA';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-14, 0);
    ctx.lineTo(-20, 10 - Math.sin(p.runCycle) * 12);
    ctx.moveTo(14, 0);
    ctx.lineTo(20, 10 + Math.sin(p.runCycle) * 12);
    ctx.stroke();

    // CABEZA / ROSTRO REAL CON MARCO CIRCULAR AMIGABLE
    const headRadius = 24;
    const headCenterY = -22;

    // Resplandor o borde festivo alrededor del rostro
    ctx.beginPath();
    ctx.arc(0, headCenterY, headRadius + 3, 0, Math.PI * 2);
    ctx.fillStyle = this.character.color;
    ctx.fill();

    // Si la imagen real está cargada, la recortamos circularmente
    if (this.playerImgLoaded && this.playerImg.complete && this.playerImg.naturalWidth > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, headCenterY, headRadius, 0, Math.PI * 2);
      ctx.clip();

      // Ajuste de zoom y centrado sobre la carita
      const cropSize = Math.min(this.playerImg.naturalWidth, this.playerImg.naturalHeight);
      const cropX = (this.playerImg.naturalWidth - cropSize) / 2;
      // Para Pedro y Simoné, su carita está en el tercio superior/medio
      const cropY = (this.playerImg.naturalHeight - cropSize) * 0.25;

      ctx.drawImage(
        this.playerImg,
        cropX,
        cropY,
        cropSize,
        cropSize,
        -headRadius,
        headCenterY - headRadius,
        headRadius * 2,
        headRadius * 2
      );
      ctx.restore();
    } else {
      // Dibujo de respaldo si la foto aún está cargando
      ctx.fillStyle = '#FED7AA';
      ctx.beginPath();
      ctx.arc(0, headCenterY, headRadius, 0, Math.PI * 2);
      ctx.fill();
      // Ojos y sonrisa
      ctx.fillStyle = '#1E293B';
      ctx.beginPath();
      ctx.arc(-7, headCenterY - 2, 3, 0, Math.PI * 2);
      ctx.arc(7, headCenterY - 2, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#DC2626';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.arc(0, headCenterY + 4, 8, 0, Math.PI);
      ctx.stroke();
    }

    // Cartelito con el nombre del personaje sobre la cabeza
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.shadowColor = 'rgba(0,0,0,0.7)';
    ctx.shadowBlur = 4;
    ctx.fillText(this.character.name, 0, headCenterY - headRadius - 6);

    ctx.restore();
  }

  drawParticles(ctx) {
    for (const p of this.particles) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x - this.scrollX, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  drawFloatTexts(ctx) {
    for (const ft of this.floatTexts) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, ft.alpha);
      ctx.fillStyle = ft.color;
      ctx.font = 'bold 20px "Fredoka", sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.5)';
      ctx.shadowBlur = 6;
      ctx.fillText(ft.text, ft.x - this.scrollX, ft.y);
      ctx.restore();
    }
  }
}

