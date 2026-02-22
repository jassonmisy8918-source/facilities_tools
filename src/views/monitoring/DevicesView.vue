<script setup lang="ts">
import { ref } from 'vue'
import { Wifi, WifiOff, Battery, Eye } from 'lucide-vue-next'



const devices = ref([
  { id: 'DEV-001', name: '朝阳路流量计', type: '电磁流量计', location: '朝阳路DN600', status: 'online', battery: 95, signal: 'strong', lastData: '刚刚', installDate: '2023-06-15' },
  { id: 'DEV-002', name: '民生路液位计', type: '超声波液位计', location: '民生路DN400', status: 'online', battery: 82, signal: 'medium', lastData: '2分钟前', installDate: '2023-07-20' },
  { id: 'DEV-003', name: '和平路雨量计', type: '翻斗式雨量计', location: '和平路雨量站', status: 'online', battery: 67, signal: 'strong', lastData: '5分钟前', installDate: '2023-05-01' },
  { id: 'DEV-004', name: '新华街流量计', type: '电磁流量计', location: '新华街DN800', status: 'warning', battery: 23, signal: 'weak', lastData: '30分钟前', installDate: '2022-12-10' },
  { id: 'DEV-005', name: '东湖泵站传感器组', type: '多参数传感器', location: '东湖泵站', status: 'online', battery: 100, signal: 'strong', lastData: '刚刚', installDate: '2024-01-05' },
  { id: 'DEV-006', name: '西城区水质仪', type: '在线水质分析仪', location: '西城区进水口', status: 'offline', battery: 0, signal: 'none', lastData: '3天前', installDate: '2023-03-18' },
  { id: 'DEV-007', name: '丰台路液位计', type: '压力式液位计', location: '丰台路DN500', status: 'online', battery: 88, signal: 'strong', lastData: '1分钟前', installDate: '2023-09-12' },
  { id: 'DEV-008', name: '建设大道视频', type: '智能摄像头', location: '建设大道排放口', status: 'online', battery: 100, signal: 'medium', lastData: '刚刚', installDate: '2024-02-20' },
])

function getStatusColor(s: string) { return s === 'online' ? 'bg-success' : s === 'warning' ? 'bg-warning' : 'bg-danger' }
function getStatusText(s: string) { return s === 'online' ? '在线' : s === 'warning' ? '异常' : '离线' }
function getBatteryColor(b: number) { return b > 60 ? 'text-success' : b > 25 ? 'text-warning' : 'text-danger' }
</script>

<template>
  <div class="space-y-4">
    <!-- 概览 -->
    <div class="grid grid-cols-4 gap-3">
      <div class="bg-card border border-themed rounded-lg p-3 shadow-themed text-center">
        <p class="text-2xl font-bold text-default">{{ devices.length }}</p>
        <p class="text-xs text-dim">设备总数</p>
      </div>
      <div class="bg-card border border-themed rounded-lg p-3 shadow-themed text-center">
        <p class="text-2xl font-bold text-success">{{devices.filter(d => d.status === 'online').length}}</p>
        <p class="text-xs text-dim">在线</p>
      </div>
      <div class="bg-card border border-themed rounded-lg p-3 shadow-themed text-center">
        <p class="text-2xl font-bold text-warning">{{devices.filter(d => d.status === 'warning').length}}</p>
        <p class="text-xs text-dim">异常</p>
      </div>
      <div class="bg-card border border-themed rounded-lg p-3 shadow-themed text-center">
        <p class="text-2xl font-bold text-danger">{{devices.filter(d => d.status === 'offline').length}}</p>
        <p class="text-xs text-dim">离线</p>
      </div>
    </div>

    <!-- 设备列表 -->
    <div class="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-themed">
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">设备状态</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">设备名称</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">类型</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">位置</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">电量</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">信号</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">最后数据</th>
            <th class="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="d in devices" :key="d.id"
            class="border-b border-themed/50 hover:bg-hover-themed transition-colors">
            <td class="px-4 py-2.5"><span class="flex items-center gap-1.5"><span class="w-2 h-2 rounded-full"
                  :class="getStatusColor(d.status)"></span><span class="text-[10px]">{{ getStatusText(d.status)
                  }}</span></span></td>
            <td class="px-4 py-2.5">
              <p class="text-xs font-medium text-default">{{ d.name }}</p>
              <p class="text-[10px] text-muted-themed font-mono">{{ d.id }}</p>
            </td>
            <td class="px-4 py-2.5 text-xs text-dim">{{ d.type }}</td>
            <td class="px-4 py-2.5 text-xs text-dim">{{ d.location }}</td>
            <td class="px-4 py-2.5">
              <div class="flex items-center gap-1.5">
                <Battery class="w-3.5 h-3.5" :class="getBatteryColor(d.battery)" />
                <span class="text-xs" :class="getBatteryColor(d.battery)">{{ d.battery }}%</span>
              </div>
            </td>
            <td class="px-4 py-2.5">
              <Wifi v-if="d.signal !== 'none'" class="w-3.5 h-3.5"
                :class="d.signal === 'strong' ? 'text-success' : d.signal === 'medium' ? 'text-warning' : 'text-danger'" />
              <WifiOff v-else class="w-3.5 h-3.5 text-danger" />
            </td>
            <td class="px-4 py-2.5 text-xs text-dim">{{ d.lastData }}</td>
            <td class="px-4 py-2.5">
              <button class="p-1 rounded hover:bg-primary/10 text-primary transition-colors cursor-pointer">
                <Eye class="w-3.5 h-3.5" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
