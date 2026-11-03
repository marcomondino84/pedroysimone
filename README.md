# 🍭 Pedro y Simoné: La Aventura de las Golosinas 🍬

Un videojuego web 2D lleno de color, música y diversión, diseñado especialmente para chicos y apto para toda la familia. Creado con **React**, **Vite**, **Tailwind CSS** y un motor gráfico en **HTML5 Canvas** de 60 FPS.

---

## 🌟 Características Principales

### 1. Protagonistas con Fotos Reales
- **Pedro ("El Veloz"):** Super saltos y energía inagotable.
- **Simoné ("La Brillante"):** Doble salto mágico y estrellitas.
- Sus rostros reales están integrados en el juego desde `public/assets/pedro.png` y `public/assets/simone.png`.
- **Selector de Personaje:** Permite elegir a Pedro o a Simoné, alternar entre ambos durante la partida (modo cooperativo / por turnos), o incluso **subir cualquier foto propia desde el dispositivo** con vista previa inmediata.

### 2. Tres Escenarios Detallados (Niveles Progresivos)
- 🌳 **Nivel 1 - El Parque de los Juegos:** Plaza verde con árboles, toboganes, columpios, sol sonriente y flores.
- 🏙️ **Nivel 2 - La Gran Avenida:** Calle colorida con edificios, farolas, semáforos y autos divertidos.
- 🛍️ **Nivel 3 - La Peatonal de Fantasía:** Paseo de compras con vidrieras llenas de juguetes, toldos a rayas, globos y carteles luminosos.

### 3. Enemigos Amigables (Chicos Traviesos)
- Antagonistas caricaturescos y simpáticos (Tomás con gorra hacia atrás, Lula con red de cazar mariposas y Nico en patineta).
- **Mecánica no violenta:** Si te alcanzan, te hacen cosquillas / te roban un par de golosinas y te descuentan 1 vida (de 3). Cuentas con un período de invulnerabilidad parpadeante para recuperarte.
- Al perder las 3 vidas, aparece la pantalla amigable: *"¡Buen intento! Volvé a jugar"*.

### 4. Golosinas Coleccionables
- 🍬 Caramelos de frutilla y limón (+1 punto).
- 🍫 Tabletas de chocolate (+3 puntos).
- 🍭 Chupetines en espiral (+5 puntos).
- ⭐ Estrellas Mágicas Arcoíris (+10 puntos y chispas).

### 5. Audio Dinámico con Web Audio API
- Efectos de sonido sintetizados en tiempo real: saltos tipo arcade, tintineo dulce de caramelos, risas/cosquillas y fanfarrias triunfales.
- Melodía de fondo alegre y suave, con botón de silenciar en el HUD.
- **100% autónomo:** No depende de archivos de audio externos que puedan fallar por CORS o rutas rotas.

### 6. Controles Multiplataforma
- **Teclado en PC:**
  - `Flechas Izquierda / Derecha` o teclas `A / D` para desplazarse.
  - `Barra Espaciadora`, `Flecha Arriba` o `W` para saltar (¡incluye **doble salto**!).
  - `Flecha Abajo` o `S` para agacharse.
  - Tecla `P` para Pausa.
  - Tecla `M` para Silenciar / Activar audio.
- **Móviles y Tablets (Pantallas Táctiles):**
  - Botones virtuales grandes en pantalla con excelente respuesta táctil y prevención de gestos no deseados.

---

## 🚀 Instalación y Ejecución Local

Para correr el juego en tu computadora:

1. **Clonar o descargar el repositorio:**
   ```bash
   git clone <URL_DEL_REPOSITORIO>
   cd "Pedro Simo"
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en modo de desarrollo:**
   ```bash
   npm run dev
   ```
   Abre automáticamente tu navegador en `http://localhost:3000`.

4. **Compilar para producción:**
   ```bash
   npm run build
   ```
   Genera una carpeta `dist/` optimizada y lista para desplegar en cualquier hosting web estático.

---

## 🌐 Cómo Desplegar en GitHub Pages y Netlify

### Opción A: Despliegue en Netlify (¡En 1 Minuto!)
1. Entra a [Netlify](https://www.netlify.com/).
2. Haz clic en **"Add new site"** > **"Import an existing project"** y conecta tu repositorio de GitHub.
3. En la configuración de Build:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
4. Haz clic en **Deploy Site**. ¡Listo!

*(O también puedes arrastrar la carpeta `dist` directamente a Netlify Drop).*

---

### Opción B: Despliegue en GitHub Pages

El proyecto ya tiene configurado `base: './'` en `vite.config.js`, por lo que funcionará perfecto en GitHub Pages sin problemas de rutas.

1. Sube tu código a un repositorio en GitHub:
   ```bash
   git init
   git add .
   git commit -m "¡Primer commit del juego Pedro y Simoné!"
   git branch -M main
   git remote add origin https://github.com/TU_USUARIO/TU_REPOSITORIO.git
   git push -u origin main
   ```

2. En tu repositorio en GitHub:
   - Ve a **Settings** > **Pages**.
   - En **Build and deployment** > **Source**, selecciona **GitHub Actions**.
   - O si prefieres desplegar mediante rama:
     Instala el paquete gh-pages con `npm install --save-dev gh-pages` y añade `"deploy": "gh-pages -d dist"` a tus scripts en `package.json`.

---

## 📂 Estructura del Proyecto

```text
├── public/
│   └── assets/
│       ├── pedro.png       # Foto real de Pedro
│       ├── pedro.jpg
│       ├── simone.png      # Foto real de Simoné
│       └── simone.jpg
├── src/
│   ├── components/
│   │   ├── CharacterSelectModal.jsx  # Pantalla de inicio y selector
│   │   ├── GameOverModal.jsx         # Pantalla de fin amigable
│   │   ├── LevelSelectModal.jsx      # Selector de escenarios
│   │   ├── NavbarHUD.jsx             # Barra superior de vidas, golosinas y nivel
│   │   ├── TouchControls.jsx         # Controles táctiles virtuales para móvil
│   │   └── VictoryModal.jsx          # Felicitaciones y confeti
│   ├── data/
│   │   └── gameConfig.js             # Configuración de personajes, niveles y golosinas
│   ├── game/
│   │   └── GameEngine.js             # Motor 2D en Canvas, física, colisiones y cámara
│   ├── utils/
│   │   └── soundEffects.js           # Sintetizador Web Audio API sin dependencias
│   ├── App.jsx                       # Componente principal interactivo
│   ├── index.css                     # Tailwind CSS y utilidades
│   └── main.jsx                      # Punto de entrada de React
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

¡Que disfruten jugando y recolectando golosinas con Pedro y Simoné! 🍭✨

