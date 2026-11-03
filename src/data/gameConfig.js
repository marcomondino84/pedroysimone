export const CHARACTERS = [
  {
    id: 'pedro',
    name: 'Pedro',
    nickname: 'El Veloz',
    photo: './assets/pedro.png',
    backupPhoto: './assets/pedro.jpg',
    color: '#0EA5E9', // Sky blue
    secondaryColor: '#38BDF8',
    shirtColor: '#1E40AF',
    tagline: '¡Super saltos y energía infinita!',
    speed: 6.5,
    jumpForce: 13.5
  },
  {
    id: 'simone',
    name: 'Simoné',
    nickname: 'La Brillante',
    photo: './assets/simone.png',
    backupPhoto: './assets/simone.jpg',
    color: '#EC4899', // Pink
    secondaryColor: '#F472B6',
    shirtColor: '#A855F7',
    tagline: '¡Doble salto mágico y brillitos!',
    speed: 6.5,
    jumpForce: 13.5
  }
];

export const LEVELS = [
  {
    id: 1,
    title: 'Parque de los Juegos',
    subtitle: 'Nivel 1: Plaza con árboles, toboganes y pajaritos',
    targetScore: 15,
    theme: 'park',
    skyColorTop: '#BAE6FD',
    skyColorBottom: '#E0F2FE',
    groundColor: '#4ADE80',
    groundSubColor: '#22C55E',
    elements: ['tree', 'swing', 'flowers', 'birds', 'clouds'],
    enemySpeed: 2.8,
    spawnRate: 90 // frames
  },
  {
    id: 2,
    title: 'La Gran Avenida',
    subtitle: 'Nivel 2: Calles coloridas, semáforos y autos divertidos',
    targetScore: 25,
    theme: 'city',
    skyColorTop: '#FDBA74',
    skyColorBottom: '#FED7AA',
    groundColor: '#94A3B8',
    groundSubColor: '#64748B',
    elements: ['buildings', 'trafficLight', 'friendlyCar', 'crosswalk'],
    enemySpeed: 3.4,
    spawnRate: 80
  },
  {
    id: 3,
    title: 'Peatonal de Fantasía',
    subtitle: 'Nivel 3: Paseo de compras, globos y jugueterías',
    targetScore: 35,
    theme: 'mall',
    skyColorTop: '#DDD6FE',
    skyColorBottom: '#F3E8FF',
    groundColor: '#F472B6',
    groundSubColor: '#DB2777',
    elements: ['shopWindows', 'balloons', 'iceCreamStand', 'neonSigns'],
    enemySpeed: 4.0,
    spawnRate: 70
  }
];

export const CANDY_TYPES = [
  { type: 'candy_pink', name: 'Caramelo de Frutilla', points: 1, color: '#FB7185', icon: '🍬' },
  { type: 'candy_blue', name: 'Caramelo Ácido', points: 1, color: '#38BDF8', icon: '🍬' },
  { type: 'candy_yellow', name: 'Caramelo de Limón', points: 1, color: '#FACC15', icon: '🍬' },
  { type: 'chocolate', name: 'Tableta de Chocolate', points: 3, color: '#78350F', icon: '🍫' },
  { type: 'lollipop', name: 'Chupetín Espiral', points: 5, color: '#A855F7', icon: '🍭' },
  { type: 'star_candy', name: 'Estrella Arcoíris Mágica', points: 10, color: '#F59E0B', icon: '⭐' }
];

export const NAUGHTY_KIDS = [
  { name: 'Tomás', capColor: '#EF4444', clothesColor: '#F97316', hat: 'cap_backward', phrase: '¡Dame un caramelo!' },
  { name: 'Lula', capColor: '#8B5CF6', clothesColor: '#10B981', hat: 'bow', phrase: '¡Cosquillas!' },
  { name: 'Nico', capColor: '#06B6D4', clothesColor: '#EAB308', hat: 'skate_helmet', phrase: '¡Por aquí!' }
];

