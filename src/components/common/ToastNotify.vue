<script setup lang="ts">
import { ref } from 'vue'
import { CheckCircle, AlertCircle, X, Info } from 'lucide-vue-next'

interface Toast {
    id: number
    message: string
    type: 'success' | 'error' | 'info' | 'warning'
}

const toasts = ref<Toast[]>([])
let nextId = 0

function show(message: string, type: Toast['type'] = 'success') {
    const id = nextId++
    toasts.value.push({ id, message, type })
    setTimeout(() => remove(id), 3000)
}
function remove(id: number) {
    toasts.value = toasts.value.filter(t => t.id !== id)
}

defineExpose({ show })

const iconMap = { success: CheckCircle, error: AlertCircle, info: Info, warning: AlertCircle }
const colorMap = { success: 'border-green-500 bg-green-500/10 text-green-400', error: 'border-red-500 bg-red-500/10 text-red-400', info: 'border-blue-500 bg-blue-500/10 text-blue-400', warning: 'border-yellow-500 bg-yellow-500/10 text-yellow-400' }
</script>

<template>
    <Teleport to="body">
        <div class="fixed top-16 right-4 z-[60] space-y-2 min-w-[280px]">
            <TransitionGroup name="toast">
                <div v-for="t in toasts" :key="t.id"
                    class="flex items-center gap-2 px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm"
                    :class="colorMap[t.type]">
                    <component :is="iconMap[t.type]" class="w-4 h-4 shrink-0" />
                    <span class="text-xs font-medium flex-1">{{ t.message }}</span>
                    <button @click="remove(t.id)" class="p-0.5 hover:opacity-70 cursor-pointer">
                        <X class="w-3 h-3" />
                    </button>
                </div>
            </TransitionGroup>
        </div>
    </Teleport>
</template>

<style scoped>
.toast-enter-active {
    transition: all 0.3s ease-out;
}

.toast-leave-active {
    transition: all 0.2s ease-in;
}

.toast-enter-from {
    transform: translateX(100%);
    opacity: 0;
}

.toast-leave-to {
    transform: translateX(100%);
    opacity: 0;
}
</style>
