import ReactECharts from 'echarts-for-react';
import { MapPin, Users, Droplets, ArrowUpDown } from 'lucide-react';

const districts = [
    { id: 1, name: '朝阳排水分区', area: '12.5 km²', pipeLength: '486 km', population: '32万', coverage: 95, type: '分流制' },
    { id: 2, name: '海淀排水分区', area: '18.3 km²', pipeLength: '612 km', population: '45万', coverage: 92, type: '分流制' },
    { id: 3, name: '西城排水分区', area: '8.7 km²', pipeLength: '324 km', population: '28万', coverage: 88, type: '合流制' },
    { id: 4, name: '东城排水分区', area: '6.2 km²', pipeLength: '256 km', population: '22万', coverage: 91, type: '合流制' },
    { id: 5, name: '丰台排水分区', area: '22.8 km²', pipeLength: '578 km', population: '38万', coverage: 85, type: '混合制' },
    { id: 6, name: '石景山排水分区', area: '15.1 km²', pipeLength: '391 km', population: '25万', coverage: 93, type: '分流制' },
];

function getChartOption() {
    return {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
        grid: { top: 30, right: 20, bottom: 30, left: 80 },
        xAxis: { type: 'value', name: 'km', axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
        yAxis: { type: 'category', data: districts.map(d => d.name).reverse(), axisLabel: { color: '#8899AA', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
        series: [
            { name: '雨水管', type: 'bar', stack: 'total', data: [195, 220, 85, 120, 260, 170].reverse(), itemStyle: { color: '#3B82F6' } },
            { name: '污水管', type: 'bar', stack: 'total', data: [185, 240, 140, 90, 200, 145].reverse(), itemStyle: { color: '#00D4AA' } },
            { name: '合流管', type: 'bar', stack: 'total', data: [106, 152, 99, 46, 118, 76].reverse(), itemStyle: { color: '#FFB020' } },
        ]
    };
}

export default function DistrictView() {
    return (
        <div className="space-y-4 p-4">
            {/* 分区卡片 */}
            <div className="grid grid-cols-3 gap-3">
                {districts.map(d => (
                    <div key={d.id} className="bg-card border border-themed rounded-xl p-4 shadow-themed hover:shadow-themed-md transition-shadow cursor-pointer">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-default">{d.name}</h4>
                            <span className="text-[10px] px-2 py-0.5 rounded-md bg-primary/15 text-primary">{d.type}</span>
                        </div>
                        <div className="grid grid-cols-2 gap-y-2 text-xs">
                            <div className="flex items-center gap-1.5 text-dim"><MapPin className="w-3 h-3" /> {d.area}</div>
                            <div className="flex items-center gap-1.5 text-dim"><Droplets className="w-3 h-3" /> {d.pipeLength}</div>
                            <div className="flex items-center gap-1.5 text-dim"><Users className="w-3 h-3" /> {d.population}</div>
                            <div className="flex items-center gap-1.5 text-dim"><ArrowUpDown className="w-3 h-3" /> 覆盖率 {d.coverage}%</div>
                        </div>
                        <div className="mt-3 flex items-center gap-2">
                            <div className="flex-1 bg-surface rounded-full h-1.5">
                                <div className="h-1.5 rounded-full bg-primary" style={{ width: `${d.coverage}%` }}></div>
                            </div>
                            <span className="text-[10px] text-primary font-medium">{d.coverage}%</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* 管道类型分布图 */}
            <div className="bg-card border border-themed rounded-xl p-4 shadow-themed">
                <h3 className="text-sm font-semibold text-default mb-2">各分区管道类型分布</h3>
                <div className="h-64">
                    <ReactECharts option={getChartOption()} style={{ height: '100%', width: '100%' }} />
                </div>
            </div>
        </div>
    );
}
