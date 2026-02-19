<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { Cloud, CloudRain, Wind, Thermometer, Eye, Droplets, AlertTriangle, Radar } from 'lucide-vue-next'

const currentWeather = ref({
  temp: 15, humidity: 72, windSpeed: 3.2, windDir: '东南',
  visibility: 8.5, pressure: 1013, condition: '多云', rainToday: 2.4,
})

const forecast = ref([
  { day: '今天', high: 17, low: 10, condition: '多云转小雨', rain: 60, icon: '🌦' },
  { day: '明天', high: 14, low: 8, condition: '小雨', rain: 80, icon: '🌧' },
  { day: '后天', high: 16, low: 9, condition: '多云', rain: 20, icon: '⛅' },
  { day: '周四', high: 19, low: 11, condition: '晴', rain: 5, icon: '☀️' },
  { day: '周五', high: 20, low: 12, condition: '晴转多云', rain: 15, icon: '🌤' },
  { day: '周六', high: 18, low: 10, condition: '多云', rain: 30, icon: '⛅' },
  { day: '周日', high: 15, low: 7, condition: '中雨', rain: 85, icon: '🌧' },
])

// 气象雷达/卫星云图/台风
const radarInfo = ref({ updateTime: '2024-03-15 14:30', mode: '降水量', range: '250km' })
const typhoonInfo = ref({ name: '暂无台风预警', active: false })

const rainChartRef = ref<HTMLElement>()
let rainChart: echarts.ECharts | null = null

onMounted(() => {
  if (rainChartRef.value) {
    rainChart = echarts.init(rainChartRef.value)
    const hours = Array.from({ length: 48 }, (_, i) => `${Math.floor(i / 2).toString().padStart(2, '0')}:${i % 2 === 0 ? '00' : '30'}`)
    rainChart.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis' },
      legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
      grid: { top: 30, right: 50, bottom: 25, left: 50 },
      xAxis: { type: 'category', data: hours, axisLabel: { color: '#5A6B7C', fontSize: 10, interval: 5 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
      yAxis: [
        { type: 'value', name: '降雨量(mm)', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
        { type: 'value', name: '累计(mm)', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { show: false } },
      ],
      series: [
        { name: '小时雨量', type: 'bar', data: hours.map(() => +(Math.random() * 4).toFixed(1)), itemStyle: { color: 'rgba(59,130,246,0.7)' } },
        { name: '累计雨量', type: 'line', yAxisIndex: 1, data: hours.map((_, i) => +(i * 0.1 + Math.random() * 0.5).toFixed(1)), lineStyle: { color: '#00D4AA', width: 2 }, itemStyle: { color: '#00D4AA' }, symbol: 'none' },
      ]
    })
  }
  window.addEventListener('resize', () => rainChart?.resize())
})

onUnmounted(() => { rainChart?.dispose() })
</script>

<template>
  <div class="space-y-4">
    <!-- 当前天气 + 指标 -->
    <div class="grid grid-cols-4 gap-3">
      <!-- 天气概况 -->
      <div class="bg-card border border-themed rounded-xl p-4 shadow-themed col-span-1">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs text-dim">当前天气</span>
          <Cloud class="w-4 h-4 text-info" />
        </div>
        <p class="text-3xl font-bold text-default">{{ currentWeather.temp }}°C</p>
        <p class="text-xs text-dim mt-1">{{ currentWeather.condition }} · 湿度 {{ currentWeather.humidity }}%</p>
      </div>
      <div class="bg-card border border-themed rounded-xl p-4 shadow-themed flex items-center gap-3">
        <Wind class="w-5 h-5 text-info shrink-0" />
        <div>
          <p class="text-xs text-dim">风速/风向</p>
          <p class="text-lg font-bold text-default">{{ currentWeather.windSpeed }} <span
              class="text-xs font-normal text-dim">m/s</span></p>
          <p class="text-xs text-muted-themed">{{ currentWeather.windDir }}</p>
        </div>
      </div>
      <div class="bg-card border border-themed rounded-xl p-4 shadow-themed flex items-center gap-3">
        <Droplets class="w-5 h-5 text-primary shrink-0" />
        <div>
          <p class="text-xs text-dim">今日降水</p>
          <p class="text-lg font-bold text-default">{{ currentWeather.rainToday }} <span
              class="text-xs font-normal text-dim">mm</span></p>
          <p class="text-xs text-muted-themed">气压 {{ currentWeather.pressure }} hPa</p>
        </div>
      </div>
      <div class="bg-card border border-themed rounded-xl p-4 shadow-themed flex items-center gap-3">
        <Eye class="w-5 h-5 text-success shrink-0" />
        <div>
          <p class="text-xs text-dim">能见度</p>
          <p class="text-lg font-bold text-default">{{ currentWeather.visibility }} <span
              class="text-xs font-normal text-dim">km</span></p>
          <p class="text-xs text-muted-themed">良好</p>
        </div>
      </div>
    </div>

    <!-- 7日预报 -->
    <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
      <h4 class="text-sm font-semibold text-default mb-3">7日天气预报</h4>
      <div class="grid grid-cols-7 gap-2">
        <div v-for="f in forecast" :key="f.day" class="text-center p-2 rounded-lg bg-surface">
          <p class="text-xs text-dim mb-1">{{ f.day }}</p>
          <p class="text-2xl mb-1">{{ f.icon }}</p>
          <p class="text-xs text-default font-medium">{{ f.high }}° / {{ f.low }}°</p>
          <p class="text-[10px] text-dim mt-0.5">{{ f.condition }}</p>
          <div class="flex items-center justify-center gap-0.5 mt-1">
            <Droplets class="w-2.5 h-2.5 text-info" />
            <span class="text-[10px]" :class="f.rain > 60 ? 'text-warning' : 'text-dim'">{{ f.rain }}%</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 雷达/云图/台风 行 -->
    <div class="grid grid-cols-3 gap-4">
      <!-- 气象雷达 -->
      <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
        <h4 class="text-sm font-semibold text-default mb-3 flex items-center gap-2">
          <Radar class="w-4 h-4 text-primary" /> 气象雷达
        </h4>
        <div class="aspect-square bg-[#0a1929] rounded-lg flex items-center justify-center mb-2">
          <div class="text-center text-muted-themed">
            <Radar class="w-12 h-12 mx-auto opacity-20 mb-2" />
            <p class="text-xs">雷达回波图</p>
          </div>
        </div>
        <p class="text-[10px] text-muted-themed">更新: {{ radarInfo.updateTime }} · {{ radarInfo.mode }} · {{
          radarInfo.range }}</p>
      </div>
      <!-- 卫星云图 -->
      <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
        <h4 class="text-sm font-semibold text-default mb-3 flex items-center gap-2">
          <Cloud class="w-4 h-4 text-info" /> 卫星云图
        </h4>
        <div class="aspect-square bg-[#0a1929] rounded-lg flex items-center justify-center mb-2">
          <div class="text-center text-muted-themed">
            <Cloud class="w-12 h-12 mx-auto opacity-20 mb-2" />
            <p class="text-xs">卫星云图</p>
          </div>
        </div>
        <p class="text-[10px] text-muted-themed">可见光云图 · 1小时前更新</p>
      </div>
      <!-- 台风信息 -->
      <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
        <h4 class="text-sm font-semibold text-default mb-3 flex items-center gap-2">
          <AlertTriangle class="w-4 h-4 text-warning" /> 台风信息
        </h4>
        <div class="aspect-square bg-[#0a1929] rounded-lg flex items-center justify-center mb-2">
          <div class="text-center text-muted-themed">
            <AlertTriangle class="w-12 h-12 mx-auto opacity-20 mb-2" />
            <p class="text-xs">{{ typhoonInfo.name }}</p>
          </div>
        </div>
        <p class="text-[10px] text-success">当前无台风影响</p>
      </div>
    </div>

    <!-- 48h降雨趋势 -->
    <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
      <h4 class="text-sm font-semibold text-default mb-2">48小时降雨趋势</h4>
      <div ref="rainChartRef" class="h-48"></div>
    </div>
  </div>
</template>
