import { Wifi, WifiOff, Battery, Eye } from 'lucide-react';

const devices = [
    { id: 'DEV-001', name: '朝阳路流量计', type: '电磁流量计', location: '朝阳路DN600', status: 'online', battery: 95, signal: 'strong', lastData: '刚刚' },
    { id: 'DEV-002', name: '民生路液位计', type: '超声波液位计', location: '民生路DN400', status: 'online', battery: 82, signal: 'medium', lastData: '2分钟前' },
    { id: 'DEV-003', name: '和平路雨量计', type: '翻斗式雨量计', location: '和平路雨量站', status: 'online', battery: 67, signal: 'strong', lastData: '5分钟前' },
    { id: 'DEV-004', name: '新华街流量计', type: '电磁流量计', location: '新华街DN800', status: 'warning', battery: 23, signal: 'weak', lastData: '30分钟前' },
    { id: 'DEV-005', name: '东湖泵站传感器组', type: '多参数传感器', location: '东湖泵站', status: 'online', battery: 100, signal: 'strong', lastData: '刚刚' },
    { id: 'DEV-006', name: '西城区水质仪', type: '在线水质分析仪', location: '西城区进水口', status: 'offline', battery: 0, signal: 'none', lastData: '3天前' },
    { id: 'DEV-007', name: '丰台路液位计', type: '压力式液位计', location: '丰台路DN500', status: 'online', battery: 88, signal: 'strong', lastData: '1分钟前' },
    { id: 'DEV-008', name: '建设大道视频', type: '智能摄像头', location: '建设大道排放口', status: 'online', battery: 100, signal: 'medium', lastData: '刚刚' },
];

function getStatusColor(s: string) { return s === 'online' ? 'bg-success' : s === 'warning' ? 'bg-warning' : 'bg-danger'; }
function getStatusText(s: string) { return s === 'online' ? '在线' : s === 'warning' ? '异常' : '离线'; }
function getBatteryColor(b: number) { return b > 60 ? 'text-success' : b > 25 ? 'text-warning' : 'text-danger'; }

export default function DevicesView() {
    const onlineCount = devices.filter(d => d.status === 'online').length;
    const warningCount = devices.filter(d => d.status === 'warning').length;
    const offlineCount = devices.filter(d => d.status === 'offline').length;
    return (
        <div className="space-y-4 p-4">
            <div className="grid grid-cols-4 gap-3">
                <div className="bg-card border border-themed rounded-lg p-3 shadow-themed text-center"><p className="text-2xl font-bold text-default">{devices.length}</p><p className="text-xs text-dim">设备总数</p></div>
                <div className="bg-card border border-themed rounded-lg p-3 shadow-themed text-center"><p className="text-2xl font-bold text-success">{onlineCount}</p><p className="text-xs text-dim">在线</p></div>
                <div className="bg-card border border-themed rounded-lg p-3 shadow-themed text-center"><p className="text-2xl font-bold text-warning">{warningCount}</p><p className="text-xs text-dim">异常</p></div>
                <div className="bg-card border border-themed rounded-lg p-3 shadow-themed text-center"><p className="text-2xl font-bold text-danger">{offlineCount}</p><p className="text-xs text-dim">离线</p></div>
            </div>
            <div className="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <table className="w-full text-sm">
                    <thead><tr className="border-b border-themed">
                        {['设备状态', '设备名称', '类型', '位置', '电量', '信号', '最后数据', '操作'].map(h => (
                            <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">{h}</th>
                        ))}
                    </tr></thead>
                    <tbody>
                        {devices.map(d => (
                            <tr key={d.id} className="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                                <td className="px-4 py-2.5"><span className="flex items-center gap-1.5"><span className={`w-2 h-2 rounded-full ${getStatusColor(d.status)}`}></span><span className="text-[10px]">{getStatusText(d.status)}</span></span></td>
                                <td className="px-4 py-2.5"><p className="text-xs font-medium text-default">{d.name}</p><p className="text-[10px] text-muted-themed font-mono">{d.id}</p></td>
                                <td className="px-4 py-2.5 text-xs text-dim">{d.type}</td>
                                <td className="px-4 py-2.5 text-xs text-dim">{d.location}</td>
                                <td className="px-4 py-2.5"><div className="flex items-center gap-1.5"><Battery className={`w-3.5 h-3.5 ${getBatteryColor(d.battery)}`} /><span className={`text-xs ${getBatteryColor(d.battery)}`}>{d.battery}%</span></div></td>
                                <td className="px-4 py-2.5">{d.signal !== 'none' ? <Wifi className={`w-3.5 h-3.5 ${d.signal === 'strong' ? 'text-success' : d.signal === 'medium' ? 'text-warning' : 'text-danger'}`} /> : <WifiOff className="w-3.5 h-3.5 text-danger" />}</td>
                                <td className="px-4 py-2.5 text-xs text-dim">{d.lastData}</td>
                                <td className="px-4 py-2.5"><button className="p-1 rounded hover:bg-primary/10 text-primary transition-colors cursor-pointer"><Eye className="w-3.5 h-3.5" /></button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
