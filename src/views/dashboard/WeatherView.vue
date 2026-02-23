<script setup lang="ts">
import { ref } from 'vue'
import { CloudRain, Radio as RadarIcon } from 'lucide-vue-next'

const activeFunc = ref('forecast')
const funcTabs = [{ key: 'forecast', label: '气象预报' }, { key: 'radar', label: '雷达预报' }]

const forecast = ref([
    { time: '今天', temp: '12~18°C', weather: '多云', rain: '0mm', wind: '东南3级', humidity: '55%' },
    { time: '明天', temp: '10~20°C', weather: '小雨', rain: '5mm', wind: '南4级', humidity: '78%' },
    { time: '后天', temp: '8~15°C', weather: '中雨', rain: '18mm', wind: '南5级', humidity: '88%' },
    { time: '大后天', temp: '10~16°C', weather: '阴', rain: '2mm', wind: '东3级', humidity: '65%' },
])
</script>

<template>
    <div class="space-y-4">
        <div class="flex items-center gap-0.5 bg-card border border-themed rounded-lg p-0.5">
            <button v-for="ft in funcTabs" :key="ft.key" @click="activeFunc = ft.key"
                class="px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors cursor-pointer whitespace-nowrap"
                :class="activeFunc === ft.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'">{{
                ft.label }}</button>
        </div>
        <template v-if="activeFunc === 'forecast'">
            <div class="flex items-center gap-2 mb-1">
                <CloudRain class="w-4 h-4 text-info" /><span class="text-sm font-semibold text-default">气象预报</span>
            </div>
            <div class="grid grid-cols-4 gap-3">
                <div v-for="f in forecast" :key="f.time"
                    class="bg-card border border-themed rounded-xl shadow-themed p-4 text-center">
                    <p class="text-xs font-bold text-default mb-1">{{ f.time }}</p>
                    <p class="text-lg font-bold" :class="f.weather.includes('雨') ? 'text-info' : 'text-default'">{{
                        f.weather }}</p>
                    <p class="text-[10px] text-dim mt-1">{{ f.temp }}</p>
                    <p class="text-[10px] mt-1"
                        :class="parseFloat(f.rain) > 10 ? 'text-warning font-bold' : 'text-dim'">🌧 {{ f.rain }}</p>
                    <p class="text-[10px] text-dim">{{ f.wind }} · {{ f.humidity }}</p>
                </div>
            </div>
        </template>
        <template v-if="activeFunc === 'radar'">
            <div class="flex items-center gap-2 mb-1">
                <RadarIcon class="w-4 h-4 text-primary" /><span class="text-sm font-semibold text-default">雷达预报</span>
            </div>
            <div class="bg-card border border-themed rounded-xl shadow-themed p-4 text-center">
                <div class="w-full h-80 bg-surface rounded-lg flex items-center justify-center text-dim text-xs">雷达回波动态图
                    — 实时降水回波监测（对接气象局雷达数据接口）</div>
            </div>
        </template>
    </div>
</template>
