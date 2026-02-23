import { useState, useMemo } from 'react';
import { Search, Download, Plus, ChevronLeft, ChevronRight, Eye, Database, Trash2 } from 'lucide-react';
import ModalDialog from '@/components/common/ModalDialog';
import { toast } from '@/components/common/ToastNotify.store';

// 台账类别 Tab —— 需求 9.1.1.4.2 的12种台账
const ledgerTabs = [
    { key: 'pipe', label: '排水管网' },
    { key: 'well', label: '检查井' },
    { key: 'rainInlet', label: '雨水口' },
    { key: 'user', label: '排水户' },
    { key: 'pump', label: '泵站' },
    { key: 'sewagePlant', label: '污水厂' },
    { key: 'gate', label: '闸门' },
    { key: 'interceptor', label: '截留设施' },
    { key: 'weir', label: '溢流堰' },
    { key: 'valve', label: '阀门' },
    { key: 'outlet', label: '排放口' },
    { key: 'device', label: '监测设备' },
];

// 每种台账的表头定义
const tabColumns: Record<string, { key: string; label: string }[]> = {
    pipe: [
        { key: 'code', label: '编号' }, { key: 'name', label: '管段名称' }, { key: 'type', label: '管道类型' },
        { key: 'material', label: '材质' }, { key: 'diameter', label: '管径' }, { key: 'length', label: '长度(m)' },
        { key: 'district', label: '区域' }, { key: 'buildYear', label: '建设年份' }, { key: 'status', label: '状态' },
    ],
    well: [
        { key: 'code', label: '编号' }, { key: 'name', label: '井名称' }, { key: 'wellType', label: '井类型' },
        { key: 'depth', label: '井深(m)' }, { key: 'material', label: '井盖材质' }, { key: 'district', label: '区域' },
        { key: 'buildYear', label: '建设年份' }, { key: 'status', label: '状态' },
    ],
    rainInlet: [
        { key: 'code', label: '编号' }, { key: 'name', label: '名称' }, { key: 'inletType', label: '雨水口类型' },
        { key: 'size', label: '尺寸' }, { key: 'district', label: '区域' }, { key: 'road', label: '所在道路' },
        { key: 'status', label: '状态' },
    ],
    user: [
        { key: 'code', label: '编号' }, { key: 'name', label: '排水户名称' }, { key: 'userType', label: '类型' },
        { key: 'permit', label: '排水许可证' }, { key: 'dailyVolume', label: '日排水量(m³)' },
        { key: 'district', label: '区域' }, { key: 'status', label: '状态' },
    ],
    pump: [
        { key: 'code', label: '编号' }, { key: 'name', label: '泵站名称' }, { key: 'capacity', label: '设计流量(m³/h)' },
        { key: 'pumpCount', label: '水泵数' }, { key: 'power', label: '装机功率(kW)' },
        { key: 'district', label: '区域' }, { key: 'buildYear', label: '建设年份' }, { key: 'status', label: '状态' },
    ],
    sewagePlant: [
        { key: 'code', label: '编号' }, { key: 'name', label: '污水厂名称' }, { key: 'capacity', label: '处理规模(万m³/d)' },
        { key: 'process', label: '处理工艺' }, { key: 'district', label: '区域' }, { key: 'status', label: '状态' },
    ],
    gate: [
        { key: 'code', label: '编号' }, { key: 'name', label: '闸门名称' }, { key: 'gateType', label: '类型' },
        { key: 'size', label: '尺寸' }, { key: 'district', label: '区域' }, { key: 'status', label: '状态' },
    ],
    interceptor: [
        { key: 'code', label: '编号' }, { key: 'name', label: '设施名称' }, { key: 'intType', label: '类型' },
        { key: 'capacity', label: '截流能力(m³/h)' }, { key: 'district', label: '区域' }, { key: 'status', label: '状态' },
    ],
    weir: [
        { key: 'code', label: '编号' }, { key: 'name', label: '溢流堰名称' }, { key: 'weirType', label: '类型' },
        { key: 'elevation', label: '堰顶高程(m)' }, { key: 'district', label: '区域' }, { key: 'status', label: '状态' },
    ],
    valve: [
        { key: 'code', label: '编号' }, { key: 'name', label: '阀门名称' }, { key: 'valveType', label: '类型' },
        { key: 'diameter', label: '口径' }, { key: 'district', label: '区域' }, { key: 'status', label: '状态' },
    ],
    outlet: [
        { key: 'code', label: '编号' }, { key: 'name', label: '排放口名称' }, { key: 'outletType', label: '类型' },
        { key: 'receiver', label: '受纳水体' }, { key: 'district', label: '区域' }, { key: 'status', label: '状态' },
    ],
    device: [
        { key: 'code', label: '编号' }, { key: 'name', label: '设备名称' }, { key: 'devType', label: '设备类型' },
        { key: 'model', label: '型号' }, { key: 'installDate', label: '安装日期' },
        { key: 'district', label: '区域' }, { key: 'status', label: '状态' },
    ],
};

const PAGE_SIZE = 15;

// 生成 mock 数据
function generateData(tab: string): Record<string, unknown>[] {
    const districts = ['雨花区', '海淀区', '侯家塘区', '东城区', '丰台区'];
    const statuses = ['正常', '正常', '正常', '轻微缺陷', '需维修'];
    const prefix: Record<string, string> = {
        pipe: 'PS', well: 'MH', rainInlet: 'RI', user: 'DU', pump: 'BZ', sewagePlant: 'SP',
        gate: 'GT', interceptor: 'IC', weir: 'WR', valve: 'VL', outlet: 'OT', device: 'DV',
    };
    const count: Record<string, number> = {
        pipe: 120, well: 80, rainInlet: 60, user: 45, pump: 18, sewagePlant: 6,
        gate: 24, interceptor: 12, weir: 15, valve: 35, outlet: 42, device: 56,
    };
    const n = count[tab] || 30;
    return Array.from({ length: n }, (_, i) => {
        const base: Record<string, unknown> = {
            id: i + 1,
            code: `${prefix[tab]}-${String(i + 1).padStart(6, '0')}`,
            name: `${districts[i % 5]}${ledgerTabs.find(t => t.key === tab)?.label}${i + 1}`,
            district: districts[i % 5],
            status: statuses[i % 5],
            buildYear: 2010 + (i % 14),
        };
        if (tab === 'pipe') Object.assign(base, { type: ['雨水管', '污水管', '合流管'][i % 3], material: ['PE', 'HDPE', '钢筋混凝土'][i % 3], diameter: `DN${[300, 400, 600][i % 3]}`, length: (Math.random() * 500 + 10).toFixed(1) });
        if (tab === 'well') Object.assign(base, { wellType: ['圆形检查井', '矩形检查井', '跌水井'][i % 3], depth: (1.5 + Math.random() * 4).toFixed(1), material: ['球墨铸铁', '复合材料', '混凝土'][i % 3] });
        if (tab === 'rainInlet') Object.assign(base, { inletType: ['平箅式', '立箅式', '联合式'][i % 3], size: ['680×380', '750×450', '900×500'][i % 3], road: ['雨花路', '民生路', '和平街'][i % 3] });
        if (tab === 'user') Object.assign(base, { userType: ['工业', '商业', '餐饮', '医疗'][i % 4], permit: `PWP-2024-${String(i + 1).padStart(4, '0')}`, dailyVolume: (50 + Math.random() * 500).toFixed(0) });
        if (tab === 'pump') Object.assign(base, { capacity: [200, 350, 500][i % 3], pumpCount: [2, 3, 4][i % 3], power: [30, 55, 110][i % 3] });
        if (tab === 'sewagePlant') Object.assign(base, { capacity: [5, 10, 20][i % 3], process: ['AAO', 'MBR', 'SBR'][i % 3] });
        if (tab === 'gate') Object.assign(base, { gateType: ['平板闸门', '拍门', '蝶阀'][i % 3], size: ['1000×800', '800×600', '600×400'][i % 3] });
        if (tab === 'interceptor') Object.assign(base, { intType: ['截流井', '截流闸', '调蓄池'][i % 3], capacity: [100, 200, 500][i % 3] });
        if (tab === 'weir') Object.assign(base, { weirType: ['矩形堰', '三角堰', 'V型堰'][i % 3], elevation: (2 + Math.random() * 3).toFixed(2) });
        if (tab === 'valve') Object.assign(base, { valveType: ['蝶阀', '闸阀', '止回阀'][i % 3], diameter: `DN${[100, 200, 300][i % 3]}` });
        if (tab === 'outlet') Object.assign(base, { outletType: ['雨水排放口', '溢流排放口', '合流排放口'][i % 3], receiver: ['东湖', '北河', '南溪'][i % 3] });
        if (tab === 'device') Object.assign(base, { devType: ['流量计', '液位计', '雨量计', '水质分析仪'][i % 4], model: ['FM-200', 'LS-100', 'RG-50', 'WQ-300'][i % 4], installDate: `202${i % 4}-0${(i % 9) + 1}-${10 + (i % 20)}` });
        return base;
    });
}

function getStatusClass(status: string) {
    if (status === '正常') return 'bg-success/15 text-success';
    if (status === '轻微缺陷') return 'bg-warning/15 text-warning';
    return 'bg-danger/15 text-danger';
}

export default function LedgerView() {
    const [activeTab, setActiveTab] = useState('pipe');
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);

    // 用 state 缓存 mock 数据
    const [tabDataCache, setTabDataCache] = useState<Record<string, Record<string, unknown>[]>>({});
    const currentData = useMemo(() => {
        if (!tabDataCache[activeTab]) {
            const generated = generateData(activeTab);
            // 延迟更新 cache，避免 render 中 setState
            setTimeout(() => setTabDataCache(prev => ({ ...prev, [activeTab]: generated })), 0);
            return generated;
        }
        return tabDataCache[activeTab];
    }, [activeTab, tabDataCache]);

    const columns = tabColumns[activeTab] || tabColumns.pipe;

    const filteredData = useMemo(() => {
        const q = searchQuery.toLowerCase();
        if (!q) return currentData;
        return currentData.filter(f => String(f.name).toLowerCase().includes(q) || String(f.code).toLowerCase().includes(q));
    }, [currentData, searchQuery]);


    const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
    const pagedData = filteredData.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

    function switchTab(key: string) {
        setActiveTab(key);
        setCurrentPage(1);
        setSearchQuery('');
    }

    // 新增弹窗
    const [showAddModal, setShowAddModal] = useState(false);
    const [addForm, setAddForm] = useState<Record<string, string>>({ name: '', district: '雨花区' });
    function openAdd() { setAddForm({ name: '', district: '雨花区' }); setShowAddModal(true); }
    function doAdd() {
        if (!addForm.name) { toast.warning('请输入名称'); return; }
        toast.success('新增成功');
        setShowAddModal(false);
    }

    // 查看弹窗
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [detailItem, setDetailItem] = useState<Record<string, unknown>>({});
    function viewDetail(item: Record<string, unknown>) { setDetailItem(item); setShowDetailModal(true); }

    // 删除
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingId, setDeletingId] = useState(0);
    function confirmDelete(id: number) { setDeletingId(id); setShowDeleteModal(true); }
    function doDelete() {
        setTabDataCache(prev => ({
            ...prev,
            [activeTab]: (prev[activeTab] ?? []).filter(i => i.id !== deletingId)
        }));
        setShowDeleteModal(false);
        toast.success('删除成功');
    }

    function handleExport() { toast.info('数据导出中，请稍候...'); }

    return (
        <div className="space-y-4 p-4">
            {/* 台账类型 Tab */}
            <div className="bg-card border border-themed rounded-xl shadow-themed p-1.5 overflow-x-auto">
                <div className="flex items-center gap-0.5 min-w-max">
                    {ledgerTabs.map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => switchTab(tab.key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap cursor-pointer ${activeTab === tab.key ? 'bg-primary text-white shadow-sm' : 'text-dim hover:text-default hover:bg-hover-themed'}`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* 工具栏 */}
            <div className="flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-themed" />
                    <input
                        value={searchQuery}
                        onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                        type="text"
                        placeholder="搜索编号或名称..."
                        className="w-full pl-9 pr-4 py-2 bg-input border border-themed rounded-lg text-sm text-default placeholder-(--text-muted) focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 transition-colors"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-themed">
                        <Database className="w-3.5 h-3.5 inline mr-1" />共 {currentData.length} 条
                    </span>
                    <button onClick={handleExport} className="flex items-center gap-1.5 px-3 py-2 bg-card border border-themed rounded-lg text-xs text-dim hover:text-default hover:bg-hover-themed transition-colors cursor-pointer">
                        <Download className="w-3.5 h-3.5" /> 导出
                    </button>
                    <button onClick={openAdd} className="flex items-center gap-1.5 px-3 py-2 bg-primary text-white rounded-lg text-xs font-medium hover:bg-primary-light transition-colors cursor-pointer">
                        <Plus className="w-3.5 h-3.5" /> 新增
                    </button>
                </div>
            </div>

            {/* 数据表格 */}
            <div className="bg-card border border-themed rounded-xl shadow-themed overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-themed">
                                {columns.map(col => (
                                    <th key={col.key} className="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface whitespace-nowrap">{col.label}</th>
                                ))}
                                <th className="text-left px-4 py-3 text-xs font-semibold text-dim bg-surface">操作</th>
                            </tr>
                        </thead>
                        <tbody>
                            {pagedData.map(item => (
                                <tr key={String(item.id)} className="border-b border-themed/50 hover:bg-hover-themed transition-colors">
                                    {columns.map(col => (
                                        <td
                                            key={col.key}
                                            className={`px-4 py-2.5 text-xs whitespace-nowrap ${col.key === 'code' ? 'font-mono text-primary' : col.key === 'name' ? 'text-default' : col.key === 'status' ? '' : 'text-dim'}`}
                                        >
                                            {col.key === 'status' ? (
                                                <span className={`text-[10px] px-2 py-0.5 rounded-md ${getStatusClass(String(item[col.key]))}`}>{String(item[col.key])}</span>
                                            ) : (
                                                <span>{String(item[col.key] ?? '')}</span>
                                            )}
                                        </td>
                                    ))}
                                    <td className="px-4 py-2.5">
                                        <div className="flex items-center gap-1">
                                            <button onClick={() => viewDetail(item)} className="p-1 rounded hover:bg-primary/10 text-primary transition-colors cursor-pointer" title="查看">
                                                <Eye className="w-3.5 h-3.5" />
                                            </button>
                                            <button onClick={() => confirmDelete(item.id as number)} className="p-1 rounded hover:bg-danger/10 text-dim hover:text-danger transition-colors cursor-pointer" title="删除">
                                                <Trash2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* 分页 */}
                <div className="flex items-center justify-between px-4 py-3 border-t border-themed">
                    <p className="text-xs text-muted-themed">共 {filteredData.length} 条，第 {currentPage} / {totalPages} 页</p>
                    <div className="flex items-center gap-1">
                        <button
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                            disabled={currentPage === 1}
                            className="p-1.5 rounded-md border border-themed text-dim hover:bg-hover-themed disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                        >
                            <ChevronLeft className="w-3.5 h-3.5" />
                        </button>
                        <button
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                            disabled={currentPage === totalPages}
                            className="p-1.5 rounded-md border border-themed text-dim hover:bg-hover-themed disabled:opacity-30 transition-colors cursor-pointer disabled:cursor-not-allowed"
                        >
                            <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* 新增弹窗 */}
            <ModalDialog show={showAddModal} title={`新增${ledgerTabs.find(t => t.key === activeTab)?.label || ''}`} onClose={() => setShowAddModal(false)} onConfirm={doAdd}>
                <div className="space-y-3">
                    <div>
                        <label className="text-xs text-dim mb-1 block">名称 <span className="text-danger">*</span></label>
                        <input
                            value={addForm.name}
                            onChange={(e) => setAddForm(f => ({ ...f, name: e.target.value }))}
                            type="text"
                            className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary"
                            placeholder="请输入名称"
                        />
                    </div>
                    <div>
                        <label className="text-xs text-dim mb-1 block">区域</label>
                        <select
                            value={addForm.district}
                            onChange={(e) => setAddForm(f => ({ ...f, district: e.target.value }))}
                            className="w-full bg-input border border-themed rounded-md px-3 py-2 text-xs text-default focus:outline-none focus:border-primary"
                        >
                            <option>雨花区</option>
                            <option>海淀区</option>
                            <option>侯家塘区</option>
                            <option>东城区</option>
                            <option>丰台区</option>
                        </select>
                    </div>
                </div>
            </ModalDialog>

            {/* 查看详情弹窗 */}
            <ModalDialog show={showDetailModal} title={String(detailItem.name || '详情')} onClose={() => setShowDetailModal(false)} onConfirm={() => setShowDetailModal(false)}>
                <div className="grid grid-cols-2 gap-3">
                    {columns.map(col => (
                        <div key={col.key} className="text-xs">
                            <span className="text-dim">{col.label}：</span>
                            <span className="text-default font-medium">{String(detailItem[col.key] ?? '')}</span>
                        </div>
                    ))}
                </div>
            </ModalDialog>

            {/* 删除确认 */}
            <ModalDialog show={showDeleteModal} title="确认删除" onClose={() => setShowDeleteModal(false)} onConfirm={doDelete}>
                <p className="text-xs text-dim">确定要删除该记录吗？此操作不可撤销。</p>
            </ModalDialog>
        </div>
    );
}
