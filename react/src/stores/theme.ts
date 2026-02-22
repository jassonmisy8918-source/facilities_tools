import { create } from 'zustand';

interface ThemeState {
    isDark: boolean;
    toggle: () => void;
}

const getInitialTheme = () => {
    const saved = localStorage.getItem('theme');
    return saved ? saved === 'dark' : true; // 默认深色
};

export const useThemeStore = create<ThemeState>((set) => {
    // 初始处理 DOM Class
    const initIsDark = getInitialTheme();
    if (!initIsDark) {
        document.documentElement.classList.add('light');
    }

    return {
        isDark: initIsDark,
        toggle: () => set((state) => {
            const nextDark = !state.isDark;
            if (nextDark) {
                document.documentElement.classList.remove('light');
            } else {
                document.documentElement.classList.add('light');
            }
            localStorage.setItem('theme', nextDark ? 'dark' : 'light');
            return { isDark: nextDark };
        }),
    };
});
