import { create } from 'zustand';

interface Toast {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info' | 'warning';
}

interface ToastState {
    toasts: Toast[];
    show: (message: string, type?: Toast['type']) => void;
    remove: (id: number) => void;
}

let nextId = 0;

export const useToastStore = create<ToastState>((set, get) => ({
    toasts: [],
    show: (message, type = 'success') => {
        const id = ++nextId;
        set((state) => ({ toasts: [...state.toasts, { id, message, type }] }));
        setTimeout(() => {
            get().remove(id);
        }, 3000);
    },
    remove: (id) =>
        set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}));

// 对外暴露一个更方便使用的对象，用来取代原有 ref 的 invoke 方式
export const toast = {
    success: (message: string) => useToastStore.getState().show(message, 'success'),
    error: (message: string) => useToastStore.getState().show(message, 'error'),
    info: (message: string) => useToastStore.getState().show(message, 'info'),
    warning: (message: string) => useToastStore.getState().show(message, 'warning'),
};
