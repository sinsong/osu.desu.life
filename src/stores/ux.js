import { defineStore } from 'pinia'

export const useUXStore = defineStore({
  id: 'ux',
  state: () => {
    return {
      focus: false
    }
  },
  actions: {
    updateFocus (state) {
      this.focus = state
    }
  }
})
