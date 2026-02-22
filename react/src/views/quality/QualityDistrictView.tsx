import ReactECharts from 'echarts-for-react';

const districts = [
    { id: 'D-001', name: '朝阳分区', area: 12.5, population: 85000, pipeLength: 45.2, pipeType: '合流制', stormDensity: 3.6, outlets: 8, pumpStations: 1, loadRate: 78 },
    { id: 'D-002', name: '海淀分区', area: 18.3, population: 120000, pipeLength: 62.8, pipeType: '分流制', stormDensity: 3.4, outlets: 12, pumpStations: 2, loadRate: 65 },
    { id: 'D-003', name: '西城分区', area: 8.2, population: 56000, pipeLength: 28.5, pipeType: '合流制', stormDensity: 3.5, outlets: 5, pumpStations: 1, loadRate: 92 },
    { id: 'D-004', name: '东城分区', area: 6.8, population: 48000, pipeLength: 22.3, pipeType: '分流制', stormDensity: 3.3, outlets: 4, pumpStations: 0, loadRate: 55 },
    { id: 'D-005', name: '丰台分区', area: 22.1, population: 95000, pipeLength: 58.6, pipeType: '混合制', stormDensity: 2.7, outlets: 10, pumpStations: 1, loadRate: 70 },
];

const chartOption = {
    backgroundColor: 'transparent', tooltip: { trigger: 'axis' as const },
    legend: { top: 0, textStyle: { color: '#8899AA', fontSize: 10 } },
    grid: { top: 30, right: 15, bottom: 30, left: 45 },
    xAxis: { type: 'category' as const, data: districts.map(d => d.name), axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
    yAxis: [
        { type: 'value' as const, name: 'km', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
        { type: 'value' as const, name: '%', nameTextStyle: { color: '#5A6B7C' }, max: 100, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { show: false } },
    ],
    series: [
        { name: '管网长度(km)', type: 'bar' as const, data: districts.map(d => d.pipeLength), itemStyle: { color: '#3B82F6', borderRadius: [3, 3, 0, 0] } },
        { name: '负载率(%)', type: 'line' as const, yAxisIndex: 1, data: districts.map(d => d.loadRate), lineStyle: { color: '#FFB020' }, itemStyle: { color: '#FFB020' } },
    ]
};

function ptCls(t: string) { return t === '分流制' ? 'bg-success/15 text-success' : t === '合流制' ? 'bg-warning/15 text-warning' : 'bg-info/15 text-info'; }

export default function QualityDistrictView() {
    return (
        <div className="space-y-4 p-4">
            <div className="bg-card border border-themed rounded-xl shadow-themed overflow-hidden"><table className="w-full text-sm"><thead><tr className="border-b border-themed">{['分区名称', '面积(km²)', '服务人口', '管网(km)', '排水体制', '管网密度', '排放口', '泵站', '负载率'].map(h => <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">{h}</th>)}</tr></thead><tbody>{districts.map(d => <tr key={d.id} className="border-b border-themed/50 hover:bg-hover-themed transition-colors"><td className="px-4 py-2.5 text-xs font-medium text-primary">{d.name}</td><td className="px-4 py-2.5 text-xs text-default">{d.area}</td><td className="px-4 py-2.5 text-xs text-default">{d.population.toLocaleString()}</td><td className="px-4 py-2.5 text-xs text-default">{d.pipeLength}</td><td className="px-4 py-2.5"><span className={`text-[10px] px-2 py-0.5 rounded-md ${ptCls(d.pipeType)}`}>{d.pipeType}</span></td><td className="px-4 py-2.5 text-xs text-dim">{d.stormDensity} km/km²</td><td className="px-4 py-2.5 text-xs text-default">{d.outlets}</td><td className="px-4 py-2.5 text-xs text-default">{d.pumpStations}</td><td className="px-4 py-2.5"><div className="flex items-center gap-2"><div className="w-14 bg-surface rounded-full h-1.5"><div className={`h-1.5 rounded-full ${d.loadRate > 85 ? 'bg-danger' : d.loadRate > 70 ? 'bg-warning' : 'bg-success'}`} style={{ width: `${d.loadRate}%` }} /></div><span className={`text-[10px] ${d.loadRate > 85 ? 'text-danger' : 'text-dim'}`}>{d.loadRate}%</span></div></td></tr>)}</tbody></table></div>
            <div className="bg-card border border-themed rounded-xl p-4 shadow-themed"><h4 className="text-sm font-semibold text-default mb-2">分区管网概况</h4><div className="h-52"><ReactECharts option={chartOption} style={{ height: '100%', width: '100%' }} /></div></div>
        </div>
    );
}
