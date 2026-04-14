import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const currentNav = ref('bom')
  const currentOption = ref('list')

  function setCurrentNav(nav: string) {
    currentNav.value = nav
  }

  function setCurrentOption(option: string) {
    currentOption.value = option
  }

  function resetToDefault() {
    currentNav.value = 'bom'
    currentOption.value = 'list'
  }

  return {
    currentNav,
    currentOption,
    setCurrentNav,
    setCurrentOption,
    resetToDefault,
  }
})
