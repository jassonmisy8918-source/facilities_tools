import { useState } from 'react';
import * as echarts from 'echarts';
import ReactECharts from 'echarts-for-react';
import { Zap, Leaf, Lightbulb, ArrowDown, ArrowUp, Droplets, Download } from 'lucide-react';
import { toast } from '@/components/common/ToastNotify.store';

const timeRanges = [{ key: 'week', label: '本周' }, { key: 'month', label: '本月' }, { key: 'quarter', label: '本季度' }, { key: 'year', label: '本年' }];

const energyKPIs = [
    { label: '今日用电', value: '3,248', unit: 'kWh', change: '-5.2%', trend: 'down', Icon: Zap, color: '#3B82F6' },
    { label: '本月累计', value: '82,450', unit: 'kWh', change: '+2.1%', trend: 'up', Icon: Zap, color: '#FFB020' },
    { label: '单位水量电耗', value: '0.42', unit: 'kWh/m³', change: '-3.8%', trend: 'down', Icon: Droplets, color: '#00D4AA' },
    { label: '月碳排放', value: '56.8', unit: '吨CO₂', change: '-4.5%', trend: 'down', Icon: Leaf, color: '#14B8A6' },
];

const stationEnergy = [
    { name: '朝阳路泵站', daily: 1250, monthly: 32800, unitCost: 0.38, load: 78 },
    { name: '东湖泵站', daily: 1450, monthly: 38200, unitCost: 0.45, load: 92 },
    { name: '和平路泵站', daily: 380, monthly: 8650, unitCost: 0.52, load: 45 },
    { name: '民生路泵站', daily: 168, monthly: 2800, unitCost: 0.35, load: 35 },
];

const suggestions = [
    { id: 1, title: '东湖泵站运行优化', content: '建议在23:00-6:00低谷时段增加运行台数，利用峰谷电价差降低成本。', savings: '预计月节省 ¥3,200', priority: 'high' },
    { id: 2, title: '和平路泵站变频调速', content: '2号泵长期在低负载运行，建议加装变频器实现按需调节。', savings: '预计月节省 ¥1,800', priority: 'medium' },
    { id: 3, title: '老旧电机更换计划', content: '朝阳路泵站1号泵电机效率偏低(86%)，建议更换为高效电机(IE3级)。', savings: '预计年节省 ¥12,000', priority: 'low' },
];

const days = Array.from({ length: 30 }, (_, i) => `${(i + 1).toString().padStart(2, '0')}日`);
const trendOption = {
    backgroundColor: 'transparent', tooltip: { trigger: 'axis' as const },
    legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
    grid: { top: 30, right: 15, bottom: 25, left: 50 },
    xAxis: { type: 'category' as const, data: days, axisLabel: { color: '#5A6B7C', fontSize: 10, interval: 4 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
    yAxis: { type: 'value' as const, name: 'kWh', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
    series: [
        { name: '日用电量', type: 'bar' as const, data: Array.from({ length: 30 }, () => Math.round(2800 + Math.random() * 800)), itemStyle: { color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{ offset: 0, color: '#3B82F6' }, { offset: 1, color: 'rgba(59,130,246,0.2)' }]) } },
        { name: '日均基线', type: 'line' as const, data: Array(30).fill(3200), lineStyle: { color: '#FF4757', type: 'dashed' as const, width: 1 }, itemStyle: { color: '#FF4757' }, symbol: 'none' as const },
    ]
};

const pieOption = {
    backgroundColor: 'transparent', tooltip: { trigger: 'item' as const },
    color: ['#3B82F6', '#00D4AA', '#FFB020', '#8B5CF6'],
    series: [{ type: 'pie' as const, radius: ['45%', '70%'], center: ['50%', '50%'], label: { color: '#8899AA', fontSize: 10 }, data: [{ value: 32800, name: '朝阳路泵站' }, { value: 38200, name: '东湖泵站' }, { value: 8650, name: '和平路泵站' }, { value: 2800, name: '民生路泵站' }] }]
};

const pumpOption = {
    backgroundColor: 'transparent', tooltip: { trigger: 'axis' as const },
    grid: { top: 15, right: 15, bottom: 30, left: 50 },
    xAxis: { type: 'category' as const, data: ['朝阳P1', '朝阳P2', '朝阳P3', '东湖P1', '东湖P2', '东湖P3', '和平P1', '和平P3', '民生P1'], axisLabel: { color: '#5A6B7C', fontSize: 9, rotate: 30 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
    yAxis: { type: 'value' as const, name: 'kWh/h', nameTextStyle: { color: '#5A6B7C', fontSize: 10 }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
    series: [{ type: 'bar' as const, data: [12.5, 11.8, 10.2, 18.5, 17.6, 16.8, 8.5, 8.2, 5.6], itemStyle: { color: (params: { value: number }) => params.value > 15 ? '#FF4757' : params.value > 10 ? '#FFB020' : '#00D4AA', borderRadius: [3, 3, 0, 0] } }]
};

function prCls(p: string) { return p === 'high' ? 'border-danger/30 bg-danger/5' : p === 'medium' ? 'border-warning/30 bg-warning/5' : 'border-themed'; }

export default function EnergyView() {
    const [timeRange, setTimeRange] = useState('month');
    return (
        <div className="space-y-4 p-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-1 bg-card border border-themed rounded-lg p-0.5">{timeRanges.map(tr => <button key={tr.key} onClick={() => { setTimeRange(tr.key); toast.info(`已切换至${tr.label}`); }} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${timeRange === tr.key ? 'bg-primary text-white' : 'text-dim hover:text-default hover:bg-hover-themed'}`}>{tr.label}</button>)}</div>
                <button onClick={() => toast.info('能耗数据导出中...')} className="flex items-center gap-1.5 px-3 py-1.5 bg-card border border-themed rounded-md text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer"><Download className="w-3 h-3" /> 导出报表</button>
            </div>

            <div className="grid grid-cols-4 gap-3">{energyKPIs.map(k => (
                <div key={k.label} className="bg-card border border-themed rounded-xl p-4 shadow-themed">
                    <div className="flex items-center justify-between mb-2"><span className="text-xs text-dim">{k.label}</span><k.Icon className="w-4 h-4" style={{ color: k.color }} /></div>
                    <p className="text-2xl font-bold text-default">{k.value}</p>
                    <div className="flex items-center justify-between mt-1"><span className="text-xs text-muted-themed">{k.unit}</span><span className={`text-xs flex items-center gap-0.5 ${k.trend === 'down' ? 'text-success' : 'text-danger'}`}>{k.trend === 'down' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />}{k.change}</span></div>
                </div>
            ))}</div>

            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 bg-card border border-themed rounded-xl p-4 shadow-themed"><h4 className="text-sm font-semibold text-default mb-2">30日用电趋势</h4><div className="h-48"><ReactECharts option={trendOption} style={{ height: '100%', width: '100%' }} /></div></div>
                <div className="bg-card border border-themed rounded-xl p-4 shadow-themed"><h4 className="text-sm font-semibold text-default mb-2">泵站能耗占比</h4><div className="h-48"><ReactECharts option={pieOption} style={{ height: '100%', width: '100%' }} /></div></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-card border border-themed rounded-xl p-4 shadow-themed"><h4 className="text-sm font-semibold text-default mb-2">单泵电耗对比</h4><div className="h-44"><ReactECharts option={pumpOption} style={{ height: '100%', width: '100%' }} /></div></div>
                <div className="bg-card border border-themed rounded-xl shadow-themed overflow-hidden"><table className="w-full text-sm"><thead><tr className="border-b border-themed">{['泵站', '日耗电', '月耗电', '单位水量电耗', '负载率'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">{h}</th>)}</tr></thead><tbody>{stationEnergy.map(st => <tr key={st.name} className="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                    <td className="px-4 py-2.5 text-xs font-medium text-default">{st.name}</td><td className="px-4 py-2.5 text-xs text-default">{st.daily.toLocaleString()} kWh</td><td className="px-4 py-2.5 text-xs text-default">{st.monthly.toLocaleString()} kWh</td><td className={`px-4 py-2.5 text-xs font-medium ${st.unitCost > 0.45 ? 'text-danger' : 'text-success'}`}>{st.unitCost} kWh/m³</td>
                    <td className="px-4 py-2.5"><div className="flex items-center gap-2"><div className="w-12 bg-surface rounded-full h-1.5"><div className={`h-1.5 rounded-full ${st.load > 85 ? 'bg-danger' : st.load > 60 ? 'bg-primary' : 'bg-success'}`} style={{ width: `${st.load}%` }} /></div><span className="text-[10px] text-muted-themed">{st.load}%</span></div></td>
                </tr>)}</tbody></table></div>
            </div>

            <div className="bg-card border border-themed rounded-xl p-4 shadow-themed">
                <h4 className="text-sm font-semibold text-default mb-3 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-warning" /> 节能优化建议</h4>
                <div className="space-y-2">{suggestions.map(s => <div key={s.id} className={`p-3 rounded-lg border transition-colors ${prCls(s.priority)}`}><div className="flex items-start justify-between"><div><h5 className="text-xs font-semibold text-default">{s.title}</h5><p className="text-xs text-dim mt-1">{s.content}</p></div><span className="text-[10px] text-success font-medium whitespace-nowrap ml-4">{s.savings}</span></div></div>)}</div>
            </div>
        </div>
    );
}
