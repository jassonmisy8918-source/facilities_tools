import { useState } from 'react';
import ReactECharts from 'echarts-for-react';
import { GitBranch, ArrowRight, Layers, Ruler, TrendingDown } from 'lucide-react';

const analysisTypes = [
    { key: 'connectivity', label: '连通性分析', icon: GitBranch },
    { key: 'slope', label: '坡度分析', icon: TrendingDown },
    { key: 'section', label: '断面分析', icon: Layers },
    { key: 'distance', label: '距离量测', icon: Ruler },
];

const connectivityResults = [
    { from: '检查井 #A001', to: '检查井 #A015', path: 14, distance: '1,245m', status: '连通' },
    { from: '检查井 #B003', to: '检查井 #B021', path: 18, distance: '2,130m', status: '连通' },
    { from: '检查井 #C007', to: '检查井 #C012', path: 0, distance: '-', status: '断开' },
    { from: '检查井 #D002', to: '排放口 OUT-005', path: 22, distance: '3,450m', status: '连通' },
];

function getSlopeOption() {
    return {
        backgroundColor: 'transparent',
        tooltip: { trigger: 'axis' },
        grid: { top: 30, right: 20, bottom: 30, left: 50 },
        xAxis: { type: 'category', data: Array.from({ length: 20 }, (_, i) => `P${i + 1}`), axisLabel: { color: '#5A6B7C', fontSize: 10 }, axisLine: { lineStyle: { color: '#2A3F54' } } },
        yAxis: { type: 'value', name: '坡度(‰)', nameTextStyle: { color: '#5A6B7C' }, axisLabel: { color: '#5A6B7C', fontSize: 10 }, splitLine: { lineStyle: { color: '#1E3348' } } },
        series: [
            {
                type: 'bar',
                data: [3.2, 2.8, 4.1, 1.5, 3.8, 2.2, 5.0, 0.8, 3.5, 4.2, 2.1, 3.7, 1.2, 4.5, 2.9, 3.3, 0.5, 4.8, 2.6, 3.1],
                itemStyle: {
                    color: (params: { data: number }) => params.data < 1 ? '#FF4757' : params.data < 2 ? '#FFB020' : '#3B82F6',
                    borderRadius: [3, 3, 0, 0]
                }
            },
            { type: 'line', data: Array(20).fill(1), lineStyle: { color: '#FF4757', type: 'dashed', width: 1 }, symbol: 'none', name: '最小坡度' },
        ],
    };
}

export default function AnalysisView() {
    const [analysisType, setAnalysisType] = useState('connectivity');

    return (
        <div className="space-y-4 p-4">
            {/* 分析类型选择 */}
            <div className="grid grid-cols-4 gap-3">
                {analysisTypes.map(at => {
                    const Icon = at.icon;
                    return (
                        <button
                            key={at.key}
                            onClick={() => setAnalysisType(at.key)}
                            className={`bg-card border rounded-xl p-4 shadow-themed flex items-center gap-3 transition-all cursor-pointer ${analysisType === at.key ? 'border-primary bg-primary/10' : 'border-themed hover:bg-hover-themed'}`}
                        >
                            <Icon className={`w-5 h-5 ${analysisType === at.key ? 'text-primary' : 'text-dim'}`} />
                            <span className={`text-sm font-medium ${analysisType === at.key ? 'text-primary' : 'text-default'}`}>{at.label}</span>
                        </button>
                    );
                })}
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* 连通性结果 */}
                <div className="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                    <div className="px-4 py-3 border-b border-themed">
                        <h3 className="text-sm font-semibold text-default">连通性分析结果</h3>
                    </div>
                    <div className="p-3 space-y-2">
                        {connectivityResults.map(item => (
                            <div key={item.from} className="flex items-center gap-3 p-3 rounded-lg bg-surface">
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 text-xs">
                                        <span className="text-default font-medium">{item.from}</span>
                                        <ArrowRight className="w-3 h-3 text-dim" />
                                        <span className="text-default font-medium">{item.to}</span>
                                    </div>
                                    <p className="text-[10px] text-muted-themed mt-1">经过 {item.path} 个节点 · {item.distance}</p>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded-md ${item.status === '连通' ? 'bg-success/15 text-success' : 'bg-danger/15 text-danger'}`}>{item.status}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 坡度分析图 */}
                <div className="bg-card border border-themed rounded-xl p-4 shadow-themed">
                    <h3 className="text-sm font-semibold text-default mb-2">管段坡度分布</h3>
                    <div className="h-64">
                        <ReactECharts option={getSlopeOption()} style={{ height: '100%', width: '100%' }} />
                    </div>
                    <p className="text-[10px] text-muted-themed mt-2">红色虚线为最小坡度标准线（1‰），低于标准的管段需重点关注</p>
                </div>
            </div>
        </div>
    );
}
