// The three playable characters. Purely cosmetic for now — they all move,
// shoot and take damage identically. `color` drives their in-game body color.
export const CHARACTERS = [
  { id: 'finn', name: 'Finn', trait: 'Curly', color: '#e8743c', accent: '#cf5e2a', legs: '#2e8b8b' },
  { id: 'luna', name: 'Luna', trait: 'Long hair', color: '#d94f86', accent: '#be3f71', legs: '#3a4a6b' },
  { id: 'pip', name: 'Pip', trait: 'Explorer hat', color: '#4fa33a', accent: '#3c8a2c', legs: '#6b5430' },
];

export const getCharacter = (id) => CHARACTERS.find((c) => c.id === id) || null;
