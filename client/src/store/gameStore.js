import { create } from 'zustand';

// Light global state shared across React screens. The actual real-time game
// (player, monsters, bullets) runs inside the Three.js loop and reports up to
// here via setHud / setGameOver.
export const useGameStore = create((set) => ({
  selectedCharacter: null,
  selectedWeapon: null,
  hud: null, // { hp, maxHp, wave, score, kills, ammo, maxAmmo, reloading }
  gameOver: null, // { score, wave, kills }

  setSelectedCharacter: (selectedCharacter) => set({ selectedCharacter }),
  setSelectedWeapon: (selectedWeapon) => set({ selectedWeapon }),
  setHud: (hud) => set({ hud }),
  setGameOver: (gameOver) => set({ gameOver }),
  resetGame: () => set({ hud: null, gameOver: null }),
}));
