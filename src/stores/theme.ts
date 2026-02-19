import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
    const isDark = ref(true)

    function toggle() {
        isDark.value = !isDark.value
    }

    watch(isDark, (dark) => {
        if (dark) {
            document.documentElement.classList.remove('light')
        } else {
            document.documentElement.classList.add('light')
        }
        localStorage.setItem('theme', dark ? 'dark' : 'light')
    }, { immediate: true })

    // 初始化：读取 localStorage
    const saved = localStorage.getItem('theme')
    if (saved === 'light') isDark.value = false

    return { isDark, toggle }
})
