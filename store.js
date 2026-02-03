import { create } from 'zustand'

export const useStore = create((set) => ({
  // Активна частина крісла для редагування
  activePart: 'Сидіння',
  
  // Кольори для кожної частини
  colors: {
    'Сидіння': '#222222',      // Подушка (Cushion)
    'Спинка': '#ff0000',        // Спинка (Backrest)
    'Колеса': '#111111',        // База і колеса (Base)
  },

  // Встановити активну частину
  setActivePart: (part) => set({ activePart: part }),

  // Встановити колір для конкретної частини
  setColor: (part, color) => set((state) => ({
    colors: { ...state.colors, [part]: color }
  })),

  // Отримати колір активної частини
  getActiveColor: (state) => state.colors[state.activePart],
}))