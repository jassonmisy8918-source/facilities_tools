<script setup lang="ts">
import { ref } from 'vue'
import { AlertTriangle, Wind, Droplets, Navigation, Clock, Shield } from 'lucide-vue-next'

const hasTyphoon = ref(true)

const typhoon = ref({
  name: '杜苏芮',
  id: '2305',
  category: '超强台风',
  level: 17,
  windSpeed: 58,
  pressure: 925,
  moveDir: '西北偏西',
  moveSpeed: 22,
  center: '24.5°N, 120.3°E',
  updateTime: '2024-03-15 14:00',
  distanceToCity: 680,
})

// 台风路径预测
const pathForecast = ref([
  { time: '03/15 14:00', lat: '24.5°N', lon: '120.3°E', intensity: '超强台风', wind: 58, press: 925 },
  { time: '03/15 20:00', lat: '25.0°N', lon: '119.5°E', intensity: '超强台风', wind: 55, press: 930 },
  { time: '03/16 02:00', lat: '25.8°N', lon: '118.8°E', intensity: '强台风', wind: 50, press: 940 },
  { time: '03/16 08:00', lat: '26.5°N', lon: '118.0°E', intensity: '强台风', wind: 45, press: 950 },
  { time: '03/16 14:00', lat: '27.2°N', lon: '117.5°E', intensity: '台风', wind: 38, press: 965 },
  { time: '03/16 20:00', lat: '28.0°N', lon: '117.0°E', intensity: '强热带风暴', wind: 30, press: 975 },
])

// 对排水系统影响评估
const impacts = ref([
  { item: '预计降雨量', value: '200-350mm', level: 'high', desc: '24小时内可能出现暴雨到特大暴雨' },
  { item: '风力影响', value: '阵风9-12级', level: 'high', desc: '可能导致排水设施损坏、树木倒伏堵塞管道' },
  { item: '风暴潮', value: '0.8-1.5m', level: 'medium', desc: '沿海地区排水口可能出现顶托现象' },
  { item: '城市内涝', value: '高风险', level: 'high', desc: '低洼地区排水系统可能超负荷运行' },
  { item: '泵站运行', value: '需满负荷', level: 'medium', desc: '建议提前启动应急排水预案' },
])

const levelColor: Record<string, string> = { low: 'text-success', medium: 'text-warning', high: 'text-danger' }
const levelBg: Record<string, string> = { low: 'bg-success/10', medium: 'bg-warning/10', high: 'bg-danger/10' }

const categoryColor = (cat: string) => {
  if (cat.includes('超强')) return 'text-danger'
  if (cat.includes('强台风')) return 'text-warning'
  if (cat.includes('台风')) return 'text-info'
  return 'text-default'
}
</script>

<template>
  <div class="space-y-4">
    <template v-if="hasTyphoon">
      <!-- 台风概况 -->
      <div class="grid grid-cols-5 gap-3">
        <div class="bg-card border border-themed rounded-xl p-4 shadow-themed col-span-1">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-dim">台风名称</span>
            <AlertTriangle class="w-4 h-4 text-danger" />
          </div>
          <p class="text-xl font-bold text-default">{{ typhoon.name }}</p>
          <p class="text-xs mt-1"><span class="text-dim">编号 </span><span class="text-primary">{{ typhoon.id }}</span></p>
          <p class="text-xs font-bold mt-1" :class="categoryColor(typhoon.category)">{{ typhoon.category }}</p>
        </div>
        <div class="bg-card border border-themed rounded-xl p-4 shadow-themed flex items-center gap-3">
          <Wind class="w-5 h-5 text-danger shrink-0" />
          <div>
            <p class="text-xs text-dim">最大风速 / 风级</p>
            <p class="text-lg font-bold text-default">{{ typhoon.windSpeed }} <span class="text-xs font-normal text-dim">m/s</span></p>
            <p class="text-xs text-muted-themed">{{ typhoon.level }}级</p>
          </div>
        </div>
        <div class="bg-card border border-themed rounded-xl p-4 shadow-themed flex items-center gap-3">
          <Navigation class="w-5 h-5 text-info shrink-0" />
          <div>
            <p class="text-xs text-dim">移动方向 / 速度</p>
            <p class="text-sm font-bold text-default">{{ typhoon.moveDir }}</p>
            <p class="text-xs text-muted-themed">{{ typhoon.moveSpeed }} km/h</p>
          </div>
        </div>
        <div class="bg-card border border-themed rounded-xl p-4 shadow-themed flex items-center gap-3">
          <Droplets class="w-5 h-5 text-primary shrink-0" />
          <div>
            <p class="text-xs text-dim">中心气压</p>
            <p class="text-lg font-bold text-default">{{ typhoon.pressure }} <span class="text-xs font-normal text-dim">hPa</span></p>
            <p class="text-xs text-muted-themed">{{ typhoon.center }}</p>
          </div>
        </div>
        <div class="bg-card border border-themed rounded-xl p-4 shadow-themed flex items-center gap-3">
          <Clock class="w-5 h-5 text-warning shrink-0" />
          <div>
            <p class="text-xs text-dim">距本市距离</p>
            <p class="text-lg font-bold text-default">{{ typhoon.distanceToCity }} <span class="text-xs font-normal text-dim">km</span></p>
            <p class="text-xs text-muted-themed">{{ typhoon.updateTime }}</p>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-2 gap-4">
        <!-- 台风路径预测 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
          <div class="px-4 py-3 border-b border-themed">
            <h4 class="text-sm font-semibold text-default flex items-center gap-2">
              <Navigation class="w-4 h-4 text-primary" /> 台风路径预测
            </h4>
          </div>
          <!-- 路径地图占位 -->
          <div class="h-48 bg-[#0a1929] flex items-center justify-center">
            <div class="text-center text-muted-themed">
              <Navigation class="w-12 h-12 mx-auto opacity-20 mb-2" />
              <p class="text-xs">台风路径图</p>
            </div>
          </div>
          <!-- 路径时间表 -->
          <div class="p-3 overflow-x-auto">
            <table class="w-full text-[11px]">
              <thead>
                <tr class="border-b border-themed">
                  <th class="text-left px-2 py-1.5 text-dim font-medium">时间</th>
                  <th class="text-center px-2 py-1.5 text-dim font-medium">位置</th>
                  <th class="text-center px-2 py-1.5 text-dim font-medium">强度</th>
                  <th class="text-center px-2 py-1.5 text-dim font-medium">风速</th>
                  <th class="text-center px-2 py-1.5 text-dim font-medium">气压</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in pathForecast" :key="p.time" class="border-b border-themed/30">
                  <td class="px-2 py-1.5 text-dim">{{ p.time }}</td>
                  <td class="text-center px-2 py-1.5 text-default">{{ p.lat }}, {{ p.lon }}</td>
                  <td class="text-center px-2 py-1.5 font-medium" :class="categoryColor(p.intensity)">{{ p.intensity }}</td>
                  <td class="text-center px-2 py-1.5 text-default">{{ p.wind }}m/s</td>
                  <td class="text-center px-2 py-1.5 text-default">{{ p.press }}hPa</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- 排水系统影响评估 -->
        <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
          <div class="px-4 py-3 border-b border-themed">
            <h4 class="text-sm font-semibold text-default flex items-center gap-2">
              <Shield class="w-4 h-4 text-warning" /> 排水系统影响评估
            </h4>
          </div>
          <div class="p-3 space-y-2">
            <div v-for="imp in impacts" :key="imp.item" class="p-3 rounded-lg bg-surface">
              <div class="flex items-center justify-between mb-1.5">
                <span class="text-xs font-medium text-default">{{ imp.item }}</span>
                <span class="text-xs font-bold px-2 py-0.5 rounded-full" :class="[levelColor[imp.level], levelBg[imp.level]]">
                  {{ imp.value }}
                </span>
              </div>
              <p class="text-[10px] text-muted-themed">{{ imp.desc }}</p>
            </div>
          </div>
        </div>
      </div>
    </template>

    <!-- 无台风状态 -->
    <template v-else>
      <div class="bg-card border border-themed rounded-xl shadow-themed p-12">
        <div class="text-center">
          <div class="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4">
            <Shield class="w-8 h-8 text-success" />
          </div>
          <h3 class="text-lg font-semibold text-default mb-2">当前无台风预警</h3>
          <p class="text-sm text-dim">管理区域内暂无台风影响，排水系统运行正常。</p>
          <p class="text-xs text-muted-themed mt-3">系统将持续监测气象数据，如有台风生成将自动预警。</p>
        </div>
      </div>
    </template>
  </div>
</template>
