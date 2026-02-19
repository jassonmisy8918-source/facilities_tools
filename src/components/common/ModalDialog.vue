<script setup lang="ts">
import { X } from 'lucide-vue-next'

defineProps<{
    show: boolean
    title: string
    width?: string
}>()

const emit = defineEmits<{
    close: []
    confirm: []
}>()
</script>

<template>
    <Teleport to="body">
        <Transition name="modal">
            <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center p-4"
                @click.self="emit('close')">
                <!-- backdrop -->
                <div class="absolute inset-0 bg-black/50 backdrop-blur-sm"></div>
                <!-- content -->
                <div class="relative bg-card border border-themed rounded-xl shadow-2xl w-full"
                    :style="{ maxWidth: width || '480px' }">
                    <div class="flex items-center justify-between px-5 py-4 border-b border-themed">
                        <h3 class="text-sm font-semibold text-default">{{ title }}</h3>
                        <button @click="emit('close')"
                            class="p-1 rounded-md text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer">
                            <X class="w-4 h-4" />
                        </button>
                    </div>
                    <div class="px-5 py-4">
                        <slot />
                    </div>
                    <div class="flex items-center justify-end gap-2 px-5 py-3 border-t border-themed">
                        <slot name="footer">
                            <button @click="emit('close')"
                                class="px-4 py-2 text-xs font-medium text-dim bg-surface border border-themed rounded-lg hover:bg-hover-themed transition-colors cursor-pointer">
                                取消
                            </button>
                            <button @click="emit('confirm')"
                                class="px-4 py-2 text-xs font-medium text-white bg-primary rounded-lg hover:bg-primary-light transition-colors cursor-pointer">
                                确定
                            </button>
                        </slot>
                    </div>
                </div>
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
    transition: opacity 0.2s ease;
}

.modal-enter-active .relative,
.modal-leave-active .relative {
    transition: transform 0.2s ease;
}

.modal-enter-from,
.modal-leave-to {
    opacity: 0;
}

.modal-enter-from .relative {
    transform: scale(0.95) translateY(10px);
}

.modal-leave-to .relative {
    transform: scale(0.95) translateY(10px);
}
</style>
