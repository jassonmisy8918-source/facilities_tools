<script setup lang="ts">
import { ref } from 'vue'
import { AlertCircle, Camera, MapPin, Clock, User, Image } from 'lucide-vue-next'

const issues = ref([
  { id: 'IS-001', title: '管道破裂渗水', location: '朝阳路DN600 P05-P06段', reporter: '张伟', time: '2024-03-15 10:23', severity: 'high', category: '结构缺陷', photos: 3, status: 'pending' },
  { id: 'IS-002', title: '检查井盖缺失', location: '民生路 检查井#34', reporter: '李明', time: '2024-03-15 09:45', severity: 'urgent', category: '安全隐患', photos: 2, status: 'processing' },
  { id: 'IS-003', title: '雨水口堵塞', location: '和平路 SW-028', reporter: '王强', time: '2024-03-14 16:30', severity: 'medium', category: '功能缺陷', photos: 1, status: 'resolved' },
  { id: 'IS-004', title: '管道沉积严重', location: '新华街DN800 P12-P15段', reporter: '赵刚', time: '2024-03-14 14:15', severity: 'medium', category: '功能缺陷', photos: 4, status: 'pending' },
  { id: 'IS-005', title: '排放口违规排放', location: '东湖排放口 OUT-003', reporter: '陈静', time: '2024-03-14 11:00', severity: 'high', category: '违规事件', photos: 5, status: 'processing' },
  { id: 'IS-006', title: '路面塌陷', location: '建设大道 检查井#67附近', reporter: '周磊', time: '2024-03-13 15:20', severity: 'urgent', category: '安全隐患', photos: 6, status: 'resolved' },
])

function getSeverityClass(s: string) { return s === 'urgent' ? 'bg-danger text-white' : s === 'high' ? 'bg-warning/15 text-warning' : 'bg-info/15 text-info' }
function getSeverityText(s: string) { return s === 'urgent' ? '紧急' : s === 'high' ? '严重' : '一般' }
function getStatusText(s: string) { return s === 'pending' ? '待处理' : s === 'processing' ? '处理中' : '已解决' }
function getStatusClass(s: string) { return s === 'pending' ? 'text-warning' : s === 'processing' ? 'text-info' : 'text-success' }
</script>

<template>
  <div class="space-y-4">
    <div class="flex items-center justify-between">
      <h2 class="text-sm font-semibold text-default flex items-center gap-2">
        <AlertCircle class="w-4 h-4 text-warning" /> 问题上报
      </h2>
    </div>

    <div class="grid grid-cols-2 gap-3">
      <div v-for="issue in issues" :key="issue.id"
        class="bg-card border border-themed rounded-xl p-4 shadow-themed hover:shadow-themed-md transition-shadow">
        <div class="flex items-start justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-xs font-mono text-primary">{{ issue.id }}</span>
            <span class="text-[10px] px-1.5 py-0.5 rounded" :class="getSeverityClass(issue.severity)">{{
              getSeverityText(issue.severity) }}</span>
          </div>
          <span class="text-[10px]" :class="getStatusClass(issue.status)">{{ getStatusText(issue.status) }}</span>
        </div>
        <h4 class="text-sm font-medium text-default mb-2">{{ issue.title }}</h4>
        <div class="space-y-1 text-[10px] text-dim">
          <p class="flex items-center gap-1.5">
            <MapPin class="w-3 h-3" /> {{ issue.location }}
          </p>
          <p class="flex items-center gap-1.5">
            <User class="w-3 h-3" /> {{ issue.reporter }} ·
            <Clock class="w-3 h-3" /> {{ issue.time }}
          </p>
          <p class="flex items-center gap-1.5">
            <Image class="w-3 h-3" /> {{ issue.photos }} 张现场照片
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
