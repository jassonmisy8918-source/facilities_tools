<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import { MapPin, Users, Droplets, ArrowUpDown } from 'lucide-vue-next'

const districts = ref([
  { id: 1, name: '朝阳排水分区', area: '12.5 km²', pipeLength: '486 km', population: '32万', coverage: 95, type: '分流制' },
  { id: 2, name: '海淀排水分区', area: '18.3 km²', pipeLength: '612 km', population: '45万', coverage: 92, type: '分流制' },
  { id: 3, name: '西城排水分区', area: '8.7 km²', pipeLength: '324 km', population: '28万', coverage: 88, type: '合流制' },
  { id: 4, name: '东城排水分区', area: '6.2 km²', pipeLength: '256 km', population: '22万', coverage: 91, type: '合流制' },
  { id: 5, name: '丰台排水分区', area: '22.8 km²', pipeLength: '578 km', population: '38万', coverage: 85, type: '混合制' },
  { id: 6, name: '石景山排水分区', area: '15.1 km²', pipeLength: '391 km', population: '25万', coverage: 93, type: '分流制' },
])

const chartRef = ref<HTMLElement>()
let chart: echarts.ECharts | null = null

onMounted(() => {
  if (chartRef.value) {
    chart = echarts.init(chartRef.value)
    chart.setOption({
      backgroundColor: 'transparent',
      tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
      grid: { top: 30, right: 20, bottom: 30, left: 80 },
      xAxis: { type: 'value', name: 'km', axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
      yAxis: { type: 'category', data: districts.value.map(d => d.name).reverse(), axisLabel: { color: '#8899AA', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
      series: [
        { name: '雨水管', type: 'bar', stack: 'total', data: [195, 220, 85, 120, 260, 170].reverse(), itemStyle: { color: '#3B82F6' } },
        { name: '污水管', type: 'bar', stack: 'total', data: [185, 240, 140, 90, 200, 145].reverse(), itemStyle: { color: '#00D4AA' } },
        { name: '合流管', type: 'bar', stack: 'total', data: [106, 152, 99, 46, 118, 76].reverse(), itemStyle: { color: '#FFB020' } },
      ]
    })
    window.addEventListener('resize', () => chart?.resize())
  }
})

onUnmounted(() => { chart?.dispose(); chart = null })
</script>

<template>
  <div class="space-y-4">
    <!-- 分区卡片 -->
    <div class="grid grid-cols-3 gap-3">
      <div v-for="d in districts" :key="d.id"
        class="bg-card border border-themed rounded-xl p-4 shadow-themed hover:shadow-themed-md transition-shadow cursor-pointer">
        <div class="flex items-center justify-between mb-3">
          <h4 class="text-sm font-semibold text-default">{{ d.name }}</h4>
          <span class="text-[10px] px-2 py-0.5 rounded-md bg-primary/15 text-primary">{{ d.type }}</span>
        </div>
        <div class="grid grid-cols-2 gap-y-2 text-xs">
          <div class="flex items-center gap-1.5 text-dim">
            <MapPin class="w-3 h-3" /> {{ d.area }}
          </div>
          <div class="flex items-center gap-1.5 text-dim">
            <Droplets class="w-3 h-3" /> {{ d.pipeLength }}
          </div>
          <div class="flex items-center gap-1.5 text-dim">
            <Users class="w-3 h-3" /> {{ d.population }}
          </div>
          <div class="flex items-center gap-1.5 text-dim">
            <ArrowUpDown class="w-3 h-3" /> 覆盖率 {{ d.coverage }}%
          </div>
        </div>
        <div class="mt-3 flex items-center gap-2">
          <div class="flex-1 bg-surface rounded-full h-1.5">
            <div class="h-1.5 rounded-full bg-primary" :style="{ width: d.coverage + '%' }"></div>
          </div>
          <span class="text-[10px] text-primary font-medium">{{ d.coverage }}%</span>
        </div>
      </div>
    </div>

    <!-- 管道类型分布图 -->
    <div class="bg-card border border-themed rounded-xl p-4 shadow-themed">
      <h3 class="text-sm font-semibold text-default mb-2">各分区管道类型分布</h3>
      <div ref="chartRef" class="h-64"></div>
    </div>
  </div>
</template>
