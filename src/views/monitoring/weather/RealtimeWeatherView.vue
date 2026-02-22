<script setup lang="ts">
import { ref } from 'vue'
import { Cloud, Wind, Eye, Droplets, MapPin, Search, RefreshCw } from 'lucide-vue-next'

const currentWeather = ref({
  temp: 15, humidity: 72, windSpeed: 3.2, windDir: '东南',
  visibility: 8.5, pressure: 1013, condition: '多云', rainToday: 2.4,
  feelsLike: 13, uvIndex: 3, aqi: 68, aqiLevel: '良',
  updateTime: '2024-03-15 14:30',
})

const searchArea = ref('')
const selectedArea = ref('全市')
const areas = ['全市', '朝阳区', '海淀区', '东城区', '西城区', '丰台区', '通州区']

const forecast = ref([
  { day: '今天', high: 17, low: 10, condition: '多云转小雨', rain: 60, icon: '🌦' },
  { day: '明天', high: 14, low: 8, condition: '小雨', rain: 80, icon: '🌧' },
  { day: '后天', high: 16, low: 9, condition: '多云', rain: 20, icon: '⛅' },
  { day: '周四', high: 19, low: 11, condition: '晴', rain: 5, icon: '☀️' },
  { day: '周五', high: 20, low: 12, condition: '晴转多云', rain: 15, icon: '🌤' },
  { day: '周六', high: 18, low: 10, condition: '多云', rain: 30, icon: '⛅' },
  { day: '周日', high: 15, low: 7, condition: '中雨', rain: 85, icon: '🌧' },
])

const hourlyForecast = ref(
  Array.from({ length: 24 }, (_, i) => ({
    hour: `${i.toString().padStart(2, '0')}:00`,
    temp: Math.round(12 + 6 * Math.sin((i - 6) * Math.PI / 12)),
    condition: i >= 6 && i <= 18 ? '多云' : '晴',
    icon: i >= 6 && i <= 18 ? '⛅' : '🌙',
    rain: Math.max(0, Math.round(Math.random() * 30)),
  }))
)

function refreshData() { /* 刷新数据 */ }
</script>

<template>
  <div class="space-y-4">
    <!-- 区域查询栏 -->
    <div class="bg-card border border-themed rounded-xl shadow-themed p-3">
      <div class="flex items-center gap-3">
        <MapPin class="w-4 h-4 text-primary shrink-0" />
        <select v-model="selectedArea"
          class="bg-input border border-themed rounded-lg px-3 py-1.5 text-xs text-default focus:outline-none focus:border-primary">
          <option v-for="a in areas" :key="a" :value="a">{{ a }}</option>
        </select>
        <div class="relative flex-1 max-w-xs">
          <Search class="w-3.5 h-3.5 text-dim absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input v-model="searchArea" type="text" placeholder="搜索区域..."
            class="w-full bg-input border border-themed rounded-lg pl-8 pr-3 py-1.5 text-xs text-default placeholder:text-muted-themed focus:outline-none focus:border-primary" />
        </div>
        <button @click="refreshData"
          class="flex items-center gap-1.5 px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-xs font-medium hover:bg-primary/20 transition-colors cursor-pointer">
          <RefreshCw class="w-3.5 h-3.5" /> 刷新
        </button>
        <span class="text-[10px] text-muted-themed ml-auto">更新时间: {{ currentWeather.updateTime }}</span>
      </div>
    </div>

    <!-- 当前天气指标卡 -->
    <div class="grid grid-cols-5 gap-3">
      <div class="bg-card border border-themed rounded-xl p-4 shadow-themed col-span-1">
        <div class="flex items-center justify-between mb-3">
          <span class="text-xs text-dim">当前天气</span>
          <Cloud class="w-4 h-4 text-info" />
        </div>
        <p class="text-3xl font-bold text-default">{{ currentWeather.temp }}°C</p>
        <p class="text-xs text-dim mt-1">{{ currentWeather.condition }} · 体感 {{ currentWeather.feelsLike }}°C</p>
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
          <p class="text-xs text-dim">今日降水 / 湿度</p>
          <p class="text-lg font-bold text-default">{{ currentWeather.rainToday }} <span
              class="text-xs font-normal text-dim">mm</span></p>
          <p class="text-xs text-muted-themed">湿度 {{ currentWeather.humidity }}%</p>
        </div>
      </div>
      <div class="bg-card border border-themed rounded-xl p-4 shadow-themed flex items-center gap-3">
        <Eye class="w-5 h-5 text-success shrink-0" />
        <div>
          <p class="text-xs text-dim">能见度 / 气压</p>
          <p class="text-lg font-bold text-default">{{ currentWeather.visibility }} <span
              class="text-xs font-normal text-dim">km</span></p>
          <p class="text-xs text-muted-themed">{{ currentWeather.pressure }} hPa</p>
        </div>
      </div>
      <div class="bg-card border border-themed rounded-xl p-4 shadow-themed flex items-center gap-3">
        <div class="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
          :class="currentWeather.aqi <= 50 ? 'bg-success/20 text-success' : currentWeather.aqi <= 100 ? 'bg-warning/20 text-warning' : 'bg-danger/20 text-danger'">
          AQ
        </div>
        <div>
          <p class="text-xs text-dim">空气质量</p>
          <p class="text-lg font-bold text-default">{{ currentWeather.aqi }}</p>
          <p class="text-xs text-muted-themed">{{ currentWeather.aqiLevel }} · UV {{ currentWeather.uvIndex }}</p>
        </div>
      </div>
    </div>

    <!-- 逐时预报 -->
    <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
      <h4 class="text-sm font-semibold text-default mb-3">逐时预报（今日）</h4>
      <div class="flex gap-2 overflow-x-auto pb-1">
        <div v-for="h in hourlyForecast" :key="h.hour"
          class="text-center p-2 rounded-lg bg-surface min-w-[52px] shrink-0">
          <p class="text-[10px] text-dim mb-1">{{ h.hour }}</p>
          <p class="text-lg mb-0.5">{{ h.icon }}</p>
          <p class="text-xs text-default font-medium">{{ h.temp }}°</p>
          <div class="flex items-center justify-center gap-0.5 mt-0.5">
            <Droplets class="w-2 h-2 text-info" />
            <span class="text-[10px] text-dim">{{ h.rain }}%</span>
          </div>
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
  </div>
</template>
