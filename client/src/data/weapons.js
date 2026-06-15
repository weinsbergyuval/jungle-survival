// Three weapons — purely cosmetic for now (same fire rate, damage and range).
// `color` will tint the muzzle flash / tracer when the game is built.
export const WEAPONS = [
  { id: 'blaster', name: 'Blaster', color: '#5fbf3f', note: 'Chunky and green' },
  { id: 'zapper', name: 'Zapper', color: '#5cc4f2', note: 'Sleek and blue' },
  { id: 'flare', name: 'Flare', color: '#f2a33c', note: 'Stubby and orange' },
];

export const getWeapon = (id) => WEAPONS.find((w) => w.id === id) || null;
