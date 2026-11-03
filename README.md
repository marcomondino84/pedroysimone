# 🍭 Pedro y Simoné: La Aventura de las Golosinas 🍬

Un videojuego web 2D lleno de color, música y diversión, diseñado especialmente para chicos y apto para toda la familia. Creado con **React**, **Vite**, **Tailwind CSS** y un motor gráfico en **HTML5 Canvas** de 60 FPS.

---

## 🌟 Características Principales

### 1. Modo Competencia por Rondas Intercaladas (Pedro vs Simoné)
- **3 vidas para cada uno, jugando 1 vida por turno:**
  - Juega Pedro su primera vida sumando golosinas. Al agotarse su energía, ¡cambio de turno para Simoné!
  - Juega Simoné su primera vida para sumar a su propio marcador.
  - Se intercalan en las rondas 2 y 3.
  - Al agotar sus 3 vidas, aparece la **Gran Pantalla Final de Competencia** con podio, corona al ganador/a y opción de revancha inmediata.

### 2. Sistema de Energía y Recuperación
- **Barra de Energía (100%):** En cada vida, los chicos traviesos descuentan un 34% de energía al hacer cosquillas (3 impactos por vida).
- 🧃 **Juguito de Frutas Fresco:** Aparece flotando en el recorrido. Al agarrarlo, ¡recupera **+40% de energía** al instante con sonido y destellos verdes!
- 🛡️ **Burbuja Protectora (Escudo 5s):** Otorga un escudo brillante iridiscente durante **5 segundos** en el que las cosquillas no hacen daño y los enemigos rebotan cómicamente.

### 3. Protagonistas con Fotos Reales
- **Pedro ("El Veloz"):** Super saltos y energía inagotable.
- **Simoné ("La Brillante"):** Doble salto mágico y estrellitas.
- Sus rostros reales están integrados en el juego desde `public/assets/pedro.png` y `public/assets/simone.png`.
- **Selector de Personaje:** Permite elegir a Pedro o a Simoné, o subir cualquier foto propia desde el dispositivo.

### 4. Tres Escenarios Detallados (Niveles Progresivos)
- 🌳 **Nivel 1 - El Parque de los Juegos:** Plaza verde con árboles, toboganes, columpios, sol sonriente y flores.
- 🏙️ **Nivel 2 - La Gran Avenida:** Calle colorida con edificios, farolas, semáforos y autos divertidos.
- 🛍️ **Nivel 3 - La Peatonal de Fantasía:** Paseo de compras con vidrieras llenas de juguetes, toldos a rayas, globos y carteles luminosos.

### 5. Golosinas Coleccionables
- 🍬 Caramelos de frutilla y limón (+1 punto).
- 🍫 Tabletas de chocolate (+3 puntos).
- 🍭 Chupetines en espiral (+5 puntos).
- ⭐ Estrellas Mágicas Arcoíris (+10 puntos y chispas).

### 6. Audio Dinámico con Web Audio API
- Efectos de sonido sintetizados en tiempo real: saltos arcade, tintineo dulce de caramelos, sorbo de juguito 🧃, activación de escudo 🛡️, silbato de cambio de turno y fanfarria de ganadores.
- Melodía de fondo alegre y suave, con botón de silenciar en el HUD.
- **100% autónomo:** Cero dependencias externas.

### 7. Controles Multiplataforma
- **Teclado en PC:**
  - `Flechas Izquierda / Derecha` o teclas `A / D` para desplazarse.
  - `Barra Espaciadora`, `Flecha Arriba` o `W` para saltar (¡incluye **doble salto**!).
  - `Flecha Abajo` o `S` para agacharse.
  - Tecla `P` para Pausa.
  - Tecla `M` para Silenciar / Activar audio.
- **Móviles y Tablets (Pantallas Táctiles):**
  - Botones virtuales flotantes fijos en pantalla (`ATRÁS`, `AVANZAR`, `¡SALTAR!`).
  - Botón **"AUTO RUN" ⚡** para carrera automática.
  - Toque táctil directo en la pantalla del juego.

---

## 🚀 Instalación y Ejecución Local

1. **Clonar o descargar el repositorio:**
   ```bash
   git clone https://github.com/marcomondino84/pedroysimone.git
   cd pedroysimone
   ```

2. **Instalar dependencias:**
   ```bash
   npm install
   ```

3. **Ejecutar en modo de desarrollo:**
   ```bash
   npm run dev
   ```

4. **Compilar para producción:**
   ```bash
   npm run build
   ```

---

## 🌐 Enlace del Juego en Vivo

El juego se encuentra desplegado y listo para jugar en:
👉 **[https://marcomondino84.github.io/pedroysimone/](https://marcomondino84.github.io/pedroysimone/)**
