// The three playable characters. Purely cosmetic for now — they all move,
// shoot and take damage identically. `color` drives their in-game body color.
// name is what actually shows on the screen and trait it just a description on the screen
export const CHARACTERS = [
  { id: 'finn', name: 'Finn', trait: 'Curly and adventurous', color: '#e8743c', accent: '#cf5e2a', legs: '#2e8b8b' },
  { id: 'luna', name: 'Luna', trait: 'beautiful but fierce', color: '#d94f86', accent: '#be3f71', legs: '#3a4a6b' },
  { id: 'pip', name: 'Pip', trait: 'the guy with the hat', color: '#4fa33a', accent: '#3c8a2c', legs: '#6b5430' },
];

export const getCharacter = (id) => CHARACTERS.find((c) => c.id === id) || null;
