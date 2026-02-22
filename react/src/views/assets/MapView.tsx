import { useState, useEffect, useRef, useMemo } from 'react';
import {
    Layers, MapPin, Maximize2, Minus as MinusIcon, Plus, Ruler, Search, X, Info,
    Crosshair, Camera, Bookmark, ChevronDown, ChevronRight,
    Map as MapIcon, Satellite, Moon, Flame, SlidersHorizontal, Database,
    Navigation, BookmarkPlus, Trash2, SquareSplitHorizontal
} from 'lucide-react';
import { toast } from '@/components/common/ToastNotify.store';
import ModalDialog from '@/components/common/ModalDialog';

// ===================== 高德地图 JS API 加载 =====================
const AMAP_KEY = '4093907b2a2e42e039fe25eb883e5e1e'; // 替换为你自己的高德 Key

declare global {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    interface Window { AMap: any; _AMapSecurityConfig: any; }
}

function loadAMap(): Promise<typeof window.AMap> {
    return new Promise((resolve, reject) => {
        if (window.AMap) { resolve(window.AMap); return; }
        const existing = document.getElementById('amap-script');
        if (existing) { const check = setInterval(() => { if (window.AMap) { clearInterval(check); resolve(window.AMap); } }, 100); return; }
        const script = document.createElement('script');
        script.id = 'amap-script';
        script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}`;
        script.onload = () => resolve(window.AMap);
        script.onerror = () => reject(new Error('高德地图 JS API 加载失败'));
        document.head.appendChild(script);
    });
}

// ===================== 底图配置 =====================
const baseMapStyles: Record<string, string> = {
    normal: 'amap://styles/normal',
    satellite: '',  // 用卫星图层实现
    dark: 'amap://styles/dark',
};

const baseMapTypes = [
    { key: 'normal', label: '标准', icon: MapIcon },
    { key: 'satellite', label: '卫星', icon: Satellite },
    { key: 'dark', label: '暗色', icon: Moon },
];

const mockSearchResults = [
    { id: 1, name: 'PS-001234 朝阳路DN600-P05', type: '污水管', status: '正常', coord: [116.397, 39.909] as [number, number] },
    { id: 2, name: 'MH-003456 朝阳路检查井#34', type: '检查井', status: '轻微缺陷', coord: [116.401, 39.912] as [number, number] },
    { id: 3, name: 'BZ-01 朝阳路泵站', type: '泵站', status: '运行中', coord: [116.394, 39.907] as [number, number] },
    { id: 4, name: 'JC-012 民生路流量计', type: '监测设备', status: '在线', coord: [116.410, 39.915] as [number, number] },
    { id: 5, name: 'PF-003 东湖排放口', type: '排放口', status: '正常排放', coord: [116.385, 39.920] as [number, number] },
];

const facilityStats = [
    { label: '管道总长', value: '2,847', unit: 'km' },
    { label: '检查井', value: '12,456', unit: '座' },
    { label: '雨水口', value: '8,234', unit: '个' },
    { label: '泵站', value: '18', unit: '座' },
    { label: '排放口', value: '89', unit: '个' },
    { label: '监测设备', value: '156', unit: '台' },
];

interface BookmarkItem { id: number; name: string; center: number[]; zoom: number; time: string }
interface LayerItem { key: string; label: string; color: string; visible: boolean; count: number; opacity: number; desc: string }
interface LayerGroup { name: string; expanded: boolean; layers: LayerItem[] }

export default function MapView() {
    const mapContainer = useRef<HTMLDivElement>(null);
    const mapContainer2 = useRef<HTMLDivElement>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const mapRef = useRef<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const map2Ref = useRef<any>(null);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const satelliteLayerRef = useRef<any>(null);

    const [mapReady, setMapReady] = useState(false);
    const [activeBaseMap, setActiveBaseMap] = useState('normal');
    const [layerGroups, setLayerGroups] = useState<LayerGroup[]>([
        {
            name: '基础管网', expanded: true,
            layers: [
                { key: 'rainPipe', label: '雨水管网', color: '#3B82F6', visible: true, count: 1248, opacity: 1, desc: '雨水收集管网' },
                { key: 'sewagePipe', label: '污水管网', color: '#00D4AA', visible: true, count: 987, opacity: 1, desc: '污水输送管网' },
                { key: 'combinedPipe', label: '合流管网', color: '#FFB020', visible: true, count: 412, opacity: 1, desc: '雨污合流管网' },
                { key: 'outlet', label: '排放口', color: '#F97316', visible: true, count: 89, opacity: 1, desc: '各类排放口位置及状态' },
            ]
        },
        {
            name: '监测运维', expanded: true,
            layers: [
                { key: 'pump', label: '排水泵站', color: '#FF4757', visible: true, count: 18, opacity: 1, desc: '泵站设施位置及运行状态' },
                { key: 'monitor', label: '监测设备', color: '#8B5CF6', visible: true, count: 156, opacity: 1, desc: '雨量计、流量计等设备' },
                { key: 'patrol', label: '巡查养护', color: '#06B6D4', visible: false, count: 45, opacity: 1, desc: '巡查路线与养护范围' },
                { key: 'alarm', label: '警告预警', color: '#EF4444', visible: false, count: 23, opacity: 1, desc: '实时预警点位标注' },
            ]
        },
        {
            name: '问题管理', expanded: false,
            layers: [
                { key: 'defect', label: '管网缺陷', color: '#EF4444', visible: false, count: 67, opacity: 1, desc: '缺陷位置及等级' },
                { key: 'crossConn', label: '雨污混接', color: '#EC4899', visible: false, count: 34, opacity: 1, desc: '错混接溯源信息' },
                { key: 'intrusion', label: '外水入侵', color: '#14B8A6', visible: false, count: 21, opacity: 1, desc: '外水入渗区域标识' },
                { key: 'planning', label: '排水规划', color: '#6366F1', visible: false, count: 8, opacity: 1, desc: '新建管网及改造区域' },
            ]
        },
    ]);

    const allLayers = useMemo(() => layerGroups.flatMap(g => g.layers), [layerGroups]);
    const visibleCount = useMemo(() => allLayers.filter(l => l.visible).length, [allLayers]);

    const toggleGroupAll = (groupIndex: number, val: boolean) => {
        setLayerGroups(prev => {
            const next = [...prev];
            next[groupIndex] = { ...next[groupIndex], layers: next[groupIndex].layers.map(l => ({ ...l, visible: val })) };
            return next;
        });
    };

    const updateLayer = (groupIndex: number, layerIndex: number, updates: Partial<LayerItem>) => {
        setLayerGroups(prev => {
            const next = [...prev];
            const nextLayers = [...next[groupIndex].layers];
            nextLayers[layerIndex] = { ...nextLayers[layerIndex], ...updates };
            next[groupIndex] = { ...next[groupIndex], layers: nextLayers };
            return next;
        });
    };

    const toggleGroupExpand = (groupIndex: number) => {
        setLayerGroups(prev => {
            const next = [...prev];
            next[groupIndex] = { ...next[groupIndex], expanded: !next[groupIndex].expanded };
            return next;
        });
    };

    const [showBaseMapPicker, setShowBaseMapPicker] = useState(false);
    const [showBookmarkPanel, setShowBookmarkPanel] = useState(false);
    const [activePanel, setActivePanel] = useState<'layers' | 'manage' | ''>('layers');

    const openPanel = (panel: 'layers' | 'manage') => {
        setActivePanel(prev => prev === panel ? '' : panel);
    };

    const [searchQuery, setSearchQuery] = useState('');
    const [showSearchResults, setShowSearchResults] = useState(false);

    const filteredResults = useMemo(() => {
        if (!searchQuery) return [];
        return mockSearchResults.filter(r => r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.type.includes(searchQuery));
    }, [searchQuery]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setSearchQuery(val);
        setShowSearchResults(val.length > 0);
    };

    const locateResult = (r: typeof mockSearchResults[0]) => {
        setShowSearchResults(false);
        setSearchQuery(r.name);
        if (mapRef.current) {
            mapRef.current.setZoomAndCenter(17, r.coord, false, 600);
        }
        toast.success(`已定位至 ${r.name}`);
    };

    // info popup
    const [showInfoPopup, setShowInfoPopup] = useState(true);
    const [popupInfo] = useState({
        name: '朝阳路DN600 P05-P06段', code: 'PS-001234', type: '污水管',
        material: 'HDPE', diameter: 'DN600', length: '128.5m', status: '正常', buildYear: '2018',
    });

    const [activeTool, setActiveTool] = useState('');
    const toggleTool = (tool: string) => {
        const nextTool = activeTool === tool ? '' : tool;
        setActiveTool(nextTool);
        if (nextTool) {
            const labels: Record<string, string> = {
                measure: '测量模式已开启，点击地图测距', area: '面积测量模式',
                flow: '管网流向动态展示已开启', '3d': '三维视图需加载三维地形数据'
            };
            toast.info(labels[nextTool] || '');
        }
    };

    const zoomIn = () => { mapRef.current?.zoomIn(); };
    const zoomOut = () => { mapRef.current?.zoomOut(); };
    const resetView = () => {
        mapRef.current?.setZoomAndCenter(13, [116.397428, 39.90923], false, 500);
        toast.info('已恢复全局视图');
    };

    const exportScreenshot = () => {
        toast.info('正在生成截图...');
        // AMap 截图需要使用 html2canvas 或专用插件，此处简化处理
        const canvas = mapContainer.current?.querySelector('canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = `设施一张图_${new Date().toLocaleDateString()}.png`;
            link.href = (canvas as HTMLCanvasElement).toDataURL();
            link.click();
            toast.success('地图截图已导出');
        } else {
            toast.warning('截图功能需要 canvas 渲染模式');
        }
    };

    const [bookmarks, setBookmarks] = useState<BookmarkItem[]>([
        { id: 1, name: '朝阳路泵站区域', center: [116.397, 39.909], zoom: 16, time: '03-15 14:20' },
        { id: 2, name: '东湖排放口', center: [116.385, 39.920], zoom: 17, time: '03-14 09:10' },
    ]);
    const [newBookmarkName, setNewBookmarkName] = useState('');

    const saveBookmark = () => {
        if (!mapRef.current || !newBookmarkName) return;
        const center = mapRef.current.getCenter();
        setBookmarks(prev => [...prev, {
            id: Date.now(), name: newBookmarkName,
            center: [center.lng, center.lat], zoom: mapRef.current.getZoom(),
            time: new Date().toLocaleString('zh-CN', { month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })
        }]);
        setNewBookmarkName('');
        toast.success('书签已保存');
    };
    const loadBookmark = (bm: BookmarkItem) => {
        mapRef.current?.setZoomAndCenter(bm.zoom, bm.center, false, 500);
        toast.info(`已跳转至「${bm.name}」`);
    };
    const deleteBookmark = (id: number) => {
        setBookmarks(prev => prev.filter(b => b.id !== id));
        toast.success('书签已删除');
    };

    const [dualView, setDualView] = useState(false);
    const toggleDualView = () => {
        setDualView(prev => {
            const next = !prev;
            setTimeout(async () => {
                if (next) {
                    if (mapContainer2.current && !map2Ref.current && window.AMap) {
                        map2Ref.current = new window.AMap.Map(mapContainer2.current, {
                            zoom: 15, center: [116.397428, 39.90923],
                            layers: [new window.AMap.TileLayer.Satellite()],
                        });
                    }
                    toast.info('多视窗对比已开启');
                } else {
                    if (map2Ref.current) {
                        map2Ref.current.destroy();
                        map2Ref.current = null;
                    }
                }
                // 让主地图重新计算容器尺寸
                setTimeout(() => {
                    mapRef.current?.resize();
                    map2Ref.current?.resize();
                }, 50);
            }, 0);
            return next;
        });
    };

    const [showMetadata, setShowMetadata] = useState(false);
    const [metadataLayer, setMetadataLayer] = useState<LayerItem | null>(null);
    const openMetadata = (layer: LayerItem) => {
        setMetadataLayer(layer);
        setShowMetadata(true);
    };

    const [heatmapOn, setHeatmapOn] = useState(false);
    const toggleHeatmap = () => {
        setHeatmapOn(prev => {
            const next = !prev;
            toast.info(next ? '热力图已叠加' : '热力图已关闭');
            return next;
        });
    };

    // ===================== 初始化高德地图 =====================
    useEffect(() => {
        let destroyed = false;
        loadAMap().then(AMap => {
            if (destroyed || !mapContainer.current) return;
            mapRef.current = new AMap.Map(mapContainer.current, {
                zoom: 13,
                center: [116.397428, 39.90923],
                mapStyle: 'amap://styles/normal',
                resizeEnable: true,
                zooms: [3, 20],
            });
            mapRef.current.addControl(new AMap.Scale());
            setMapReady(true);
        }).catch(() => {
            toast.error('高德地图加载失败，请检查网络或 API Key');
        });

        return () => {
            destroyed = true;
            if (mapRef.current) { mapRef.current.destroy(); mapRef.current = null; }
            if (map2Ref.current) { map2Ref.current.destroy(); map2Ref.current = null; }
        };
    }, []);

    // ===================== 底图切换 =====================
    const switchBaseMap = (key: string) => {
        setActiveBaseMap(key);
        if (!mapRef.current || !window.AMap) return;
        const AMap = window.AMap;

        // 移除卫星图层
        if (satelliteLayerRef.current) {
            mapRef.current.remove(satelliteLayerRef.current);
            satelliteLayerRef.current = null;
        }

        if (key === 'satellite') {
            satelliteLayerRef.current = new AMap.TileLayer.Satellite();
            mapRef.current.add(satelliteLayerRef.current);
            mapRef.current.setMapStyle('amap://styles/normal');
        } else {
            mapRef.current.setMapStyle(baseMapStyles[key] || 'amap://styles/normal');
        }
        const label = baseMapTypes.find(b => b.key === key)?.label || key;
        toast.info(`已切换至${label}地图`);
    };

    return (
        <div className="space-y-4 h-full flex flex-col p-4">
            {/* 统计概览 */}
            <div className="grid grid-cols-6 gap-3 shrink-0">
                {facilityStats.map(stat => (
                    <div key={stat.label} className="bg-card border border-themed rounded-lg p-3 shadow-themed flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary shrink-0" />
                        <div>
                            <p className="text-xs text-dim">{stat.label}</p>
                            <p className="text-lg font-bold text-default">{stat.value} <span className="text-xs text-muted-themed font-normal">{stat.unit}</span></p>
                        </div>
                    </div>
                ))}
            </div>

            {/* 地图区域 */}
            <div className="relative bg-card border border-themed rounded-xl shadow-themed overflow-hidden flex-1 min-h-[500px]">

                {/* 地图容器 */}
                <div className="flex w-full h-full">
                    <div ref={mapContainer} className={`h-full ${dualView ? 'w-1/2 border-r border-themed' : 'w-full'}`} />
                    <div ref={mapContainer2} className={`w-1/2 h-full ${dualView ? 'block' : 'hidden'}`} />
                </div>

                {/* 加载中提示 */}
                {!mapReady && (
                    <div className="absolute inset-0 flex items-center justify-center bg-card z-20">
                        <div className="text-center">
                            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                            <p className="text-sm text-dim">高德地图加载中...</p>
                        </div>
                    </div>
                )}

                {/* 多视窗标签 */}
                {dualView && (
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                        <span className="px-2 py-1 bg-primary/90 text-white text-[10px] rounded-md font-medium">视窗 A · 标准地图</span>
                        <span className="px-2 py-1 bg-info/90 text-white text-[10px] rounded-md font-medium">视窗 B · 卫星影像</span>
                    </div>
                )}

                {/* 搜索栏 */}
                <div className="absolute top-3 left-3 z-10 w-72">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-themed" />
                        <input
                            value={searchQuery}
                            onChange={handleSearch}
                            type="text"
                            placeholder="搜索设施编号/名称/类型..."
                            className="w-full pl-9 pr-4 py-2 bg-card border border-themed rounded-lg text-sm text-default placeholder:text-muted-themed focus:outline-none focus:border-primary shadow-themed"
                        />
                    </div>
                    {showSearchResults && filteredResults.length > 0 && (
                        <div className="mt-1 bg-card border border-themed rounded-lg shadow-themed overflow-hidden max-h-60 overflow-y-auto">
                            {filteredResults.map(r => (
                                <button key={r.id} onClick={() => locateResult(r)} className="w-full text-left px-3 py-2.5 border-b border-themed/50 last:border-0 hover:bg-hover-themed transition-colors cursor-pointer">
                                    <p className="text-xs font-medium text-default">{r.name}</p>
                                    <p className="text-[10px] text-muted-themed">{r.type} · {r.status}</p>
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* ==================== 右侧面板区 ==================== */}
                <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
                    <button onClick={() => openPanel('layers')} title="专题图层" className={`p-2 bg-card border rounded-lg shadow-themed transition-colors cursor-pointer ${activePanel === 'layers' ? 'border-primary bg-primary/10' : 'border-themed hover:bg-hover-themed'}`}>
                        <Layers className={`w-4 h-4 ${activePanel === 'layers' ? 'text-primary' : 'text-default'}`} />
                    </button>
                    <button onClick={() => openPanel('manage')} title="图层管理" className={`p-2 bg-card border rounded-lg shadow-themed transition-colors cursor-pointer ${activePanel === 'manage' ? 'border-primary bg-primary/10' : 'border-themed hover:bg-hover-themed'}`}>
                        <SlidersHorizontal className={`w-4 h-4 ${activePanel === 'manage' ? 'text-primary' : 'text-default'}`} />
                    </button>
                </div>

                {/* 专题图层面板 */}
                {activePanel === 'layers' && (
                    <div className="absolute top-3 right-14 w-60 bg-card border border-themed rounded-xl shadow-themed p-3 z-10 max-h-[calc(100%-24px)] overflow-y-auto">
                        <div className="flex items-center justify-between mb-3">
                            <div className="flex items-center gap-1.5"><Layers className="w-4 h-4 text-primary" /><span className="text-xs font-semibold text-default">专题图层</span></div>
                            <span className="text-[10px] text-muted-themed">{visibleCount}/{allLayers.length} 已启用</span>
                        </div>
                        {layerGroups.map((group, groupIndex) => (
                            <div key={group.name} className="mb-2 last:mb-0">
                                <button onClick={() => toggleGroupExpand(groupIndex)} className="flex items-center gap-1.5 w-full py-1.5 text-[11px] font-semibold text-dim hover:text-default transition-colors cursor-pointer">
                                    {group.expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                                    {group.name}
                                    <span className="ml-auto flex gap-1">
                                        <button onClick={(e) => { e.stopPropagation(); toggleGroupAll(groupIndex, true); }} className="text-[9px] text-primary hover:underline cursor-pointer">全选</button>
                                        <button onClick={(e) => { e.stopPropagation(); toggleGroupAll(groupIndex, false); }} className="text-[9px] text-muted-themed hover:underline cursor-pointer">清空</button>
                                    </span>
                                </button>
                                {group.expanded && (
                                    <div className="space-y-0.5 ml-1">
                                        {group.layers.map((layer, layerIndex) => (
                                            <label key={layer.key} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-hover-themed transition-colors cursor-pointer group">
                                                <input type="checkbox" checked={layer.visible} onChange={(e) => updateLayer(groupIndex, layerIndex, { visible: e.target.checked })} className="w-3.5 h-3.5 rounded accent-primary cursor-pointer" />
                                                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: layer.color }} />
                                                <span className="text-xs text-default flex-1">{layer.label}</span>
                                                <span className="text-[10px] text-muted-themed">{layer.count}</span>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* 图层管理面板 */}
                {activePanel === 'manage' && (
                    <div className="absolute top-3 right-14 w-64 bg-card border border-themed rounded-xl shadow-themed p-3 z-10 max-h-[calc(100%-24px)] overflow-y-auto">
                        <div className="flex items-center gap-1.5 mb-3"><SlidersHorizontal className="w-4 h-4 text-primary" /><span className="text-xs font-semibold text-default">图层管理</span></div>

                        {/* 底图切换 */}
                        <div className="mb-3">
                            <p className="text-[10px] text-dim mb-1.5 font-semibold">底图切换</p>
                            <div className="grid grid-cols-3 gap-1.5">
                                {baseMapTypes.map(bm => {
                                    const Icon = bm.icon;
                                    return (
                                        <button key={bm.key} onClick={() => switchBaseMap(bm.key)} className={`flex flex-col items-center gap-1 p-2 rounded-lg border transition-colors cursor-pointer ${activeBaseMap === bm.key ? 'border-primary bg-primary/10' : 'border-themed hover:bg-hover-themed'}`}>
                                            <Icon className={`w-4 h-4 ${activeBaseMap === bm.key ? 'text-primary' : 'text-dim'}`} />
                                            <span className={`text-[10px] ${activeBaseMap === bm.key ? 'text-primary font-medium' : 'text-dim'}`}>{bm.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* 热力图 */}
                        <div className="mb-3 flex items-center justify-between p-2 rounded-lg bg-surface">
                            <div className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-warning" /><span className="text-xs text-default">热力图叠加</span></div>
                            <button onClick={toggleHeatmap} className={`w-8 h-4.5 rounded-full transition-colors cursor-pointer relative ${heatmapOn ? 'bg-primary' : 'bg-surface border border-themed'}`}>
                                <span className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white shadow transition-all ${heatmapOn ? 'left-4' : 'left-0.5'}`} />
                            </button>
                        </div>

                        {/* 图层透明度 */}
                        <div className="mb-3">
                            <p className="text-[10px] text-dim mb-1.5 font-semibold">图层透明度</p>
                            <div className="space-y-1.5 max-h-40 overflow-y-auto">
                                {layerGroups.flatMap((g, gi) => g.layers.map((l, li) => ({ l, gi, li }))).filter(x => x.l.visible).map(({ l: layer, gi, li }) => (
                                    <div key={layer.key} className="flex items-center gap-2 p-1.5 rounded-md bg-surface">
                                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: layer.color }} />
                                        <span className="text-[10px] text-default flex-1 truncate">{layer.label}</span>
                                        <input type="range" min="0" max="100" value={layer.opacity * 100} onChange={(e) => updateLayer(gi, li, { opacity: Number(e.target.value) / 100 })} className="w-16 h-1 accent-primary cursor-pointer" />
                                        <span className="text-[9px] text-muted-themed w-6 text-right">{Math.round(layer.opacity * 100)}%</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* 图层信息 */}
                        <div>
                            <p className="text-[10px] text-dim mb-1.5 font-semibold">图层信息</p>
                            <div className="space-y-1">
                                {allLayers.map(layer => (
                                    <button key={layer.key} onClick={() => openMetadata(layer)} className="w-full flex items-center gap-2 p-1.5 rounded-md hover:bg-hover-themed transition-colors cursor-pointer text-left">
                                        <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: layer.color }} />
                                        <span className="text-[10px] text-default flex-1 truncate">{layer.label}</span>
                                        <Database className="w-3 h-3 text-muted-themed" />
                                        <span className="text-[9px] text-muted-themed">{layer.count}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* 点选信息弹窗 */}
                {showInfoPopup && (
                    <div className="absolute bottom-16 left-1/2 -translate-x-1/2 w-72 bg-card border border-themed rounded-xl shadow-themed z-10 overflow-hidden">
                        <div className="flex items-center justify-between px-3 py-2 border-b border-themed bg-surface">
                            <div className="flex items-center gap-1.5"><Info className="w-3.5 h-3.5 text-primary" /><span className="text-xs font-semibold text-default">设施信息</span></div>
                            <button onClick={() => setShowInfoPopup(false)} className="text-muted-themed hover:text-default transition-colors cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                        </div>
                        <div className="p-3 space-y-1.5 text-xs">
                            <div className="flex justify-between"><span className="text-dim">名称</span><span className="text-default font-medium">{popupInfo.name}</span></div>
                            <div className="flex justify-between"><span className="text-dim">编号</span><span className="text-primary font-mono">{popupInfo.code}</span></div>
                            <div className="flex justify-between"><span className="text-dim">类型</span><span className="text-default">{popupInfo.type}</span></div>
                            <div className="flex justify-between"><span className="text-dim">材质</span><span className="text-default">{popupInfo.material}</span></div>
                            <div className="flex justify-between"><span className="text-dim">管径</span><span className="text-default">{popupInfo.diameter}</span></div>
                            <div className="flex justify-between"><span className="text-dim">长度</span><span className="text-default">{popupInfo.length}</span></div>
                            <div className="flex justify-between"><span className="text-dim">建设年份</span><span className="text-default">{popupInfo.buildYear}</span></div>
                            <div className="flex justify-between"><span className="text-dim">状态</span><span className="text-success">{popupInfo.status}</span></div>
                        </div>
                    </div>
                )}

                {/* ==================== 左下工具栏 ==================== */}
                <div className="absolute bottom-3 left-3 z-10 flex items-end gap-1">
                    <div className="relative">
                        <button onClick={() => setShowBaseMapPicker(!showBaseMapPicker)} className="p-2 bg-card border border-themed rounded-lg shadow-themed hover:bg-hover-themed transition-colors cursor-pointer">
                            <MapIcon className="w-4 h-4 text-default" />
                        </button>
                        {showBaseMapPicker && (
                            <div className="absolute bottom-10 left-0 bg-card border border-themed rounded-lg shadow-themed p-2 flex gap-1.5">
                                {baseMapTypes.map(bm => {
                                    const Icon = bm.icon;
                                    return (
                                        <button key={bm.key} onClick={() => { switchBaseMap(bm.key); setShowBaseMapPicker(false); }} className={`flex flex-col items-center gap-0.5 p-1.5 rounded-md transition-colors cursor-pointer w-14 ${activeBaseMap === bm.key ? 'bg-primary/15' : 'hover:bg-hover-themed'}`}>
                                            <Icon className={`w-4 h-4 ${activeBaseMap === bm.key ? 'text-primary' : 'text-dim'}`} />
                                            <span className={`text-[9px] ${activeBaseMap === bm.key ? 'text-primary' : 'text-dim'}`}>{bm.label}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                </div>

                {/* ==================== 右下工具栏 ==================== */}
                <div className="absolute bottom-3 right-3 flex flex-col gap-1 z-10">
                    <div className="relative">
                        <button onClick={() => setShowBookmarkPanel(!showBookmarkPanel)} title="地图书签" className={`p-2 bg-card border rounded-lg shadow-themed transition-colors cursor-pointer ${showBookmarkPanel ? 'border-primary bg-primary/10' : 'border-themed hover:bg-hover-themed'}`}>
                            <Bookmark className={`w-4 h-4 ${showBookmarkPanel ? 'text-primary' : 'text-default'}`} />
                        </button>
                        {showBookmarkPanel && (
                            <div className="absolute bottom-10 right-0 w-56 bg-card border border-themed rounded-xl shadow-themed p-3 z-10">
                                <div className="flex items-center gap-1.5 mb-2"><Bookmark className="w-3.5 h-3.5 text-primary" /><span className="text-xs font-semibold text-default">地图书签</span></div>
                                <div className="flex gap-1 mb-2">
                                    <input value={newBookmarkName} onChange={(e) => setNewBookmarkName(e.target.value)} type="text" placeholder="输入书签名..." className="flex-1 px-2 py-1.5 bg-input border border-themed rounded-md text-[10px] text-default focus:outline-none focus:border-primary" />
                                    <button onClick={saveBookmark} className="p-1.5 bg-primary text-white rounded-md hover:bg-primary-light transition-colors cursor-pointer"><BookmarkPlus className="w-3 h-3" /></button>
                                </div>
                                <div className="space-y-1 max-h-32 overflow-y-auto">
                                    {bookmarks.map(bm => (
                                        <div key={bm.id} className="flex items-center gap-2 p-1.5 rounded-md hover:bg-hover-themed transition-colors group">
                                            <button onClick={() => loadBookmark(bm)} className="flex-1 text-left cursor-pointer">
                                                <p className="text-[10px] font-medium text-default">{bm.name}</p>
                                                <p className="text-[9px] text-muted-themed">{bm.time}</p>
                                            </button>
                                            <button onClick={() => deleteBookmark(bm.id)} className="opacity-0 group-hover:opacity-100 text-muted-themed hover:text-danger transition-all cursor-pointer"><Trash2 className="w-3 h-3" /></button>
                                        </div>
                                    ))}
                                    {bookmarks.length === 0 && <p className="text-[10px] text-muted-themed text-center py-2">暂无书签</p>}
                                </div>
                            </div>
                        )}
                    </div>

                    <button onClick={exportScreenshot} title="地图截图" className="p-2 bg-card border border-themed rounded-lg shadow-themed hover:bg-hover-themed transition-colors cursor-pointer"><Camera className="w-4 h-4 text-default" /></button>
                    <button onClick={toggleDualView} title="多视窗对比" className={`p-2 bg-card border rounded-lg shadow-themed transition-colors cursor-pointer ${dualView ? 'border-primary bg-primary/10' : 'border-themed hover:bg-hover-themed'}`}><SquareSplitHorizontal className={`w-4 h-4 ${dualView ? 'text-primary' : 'text-default'}`} /></button>
                    <button onClick={() => toggleTool('flow')} title="管网流向" className={`p-2 bg-card border rounded-lg shadow-themed transition-colors cursor-pointer ${activeTool === 'flow' ? 'border-primary bg-primary/10' : 'border-themed hover:bg-hover-themed'}`}><Navigation className={`w-4 h-4 ${activeTool === 'flow' ? 'text-primary' : 'text-default'}`} /></button>
                    <button onClick={() => toggleTool('measure')} title="测量标注" className={`p-2 bg-card border rounded-lg shadow-themed transition-colors cursor-pointer ${activeTool === 'measure' ? 'border-primary bg-primary/10' : 'border-themed hover:bg-hover-themed'}`}><Ruler className={`w-4 h-4 ${activeTool === 'measure' ? 'text-primary' : 'text-default'}`} /></button>
                    <button onClick={resetView} title="全局视图" className="p-2 bg-card border border-themed rounded-lg shadow-themed hover:bg-hover-themed transition-colors cursor-pointer"><Crosshair className="w-4 h-4 text-default" /></button>
                    <button onClick={zoomIn} title="放大" className="p-2 bg-card border border-themed rounded-lg shadow-themed hover:bg-hover-themed transition-colors cursor-pointer"><Plus className="w-4 h-4 text-default" /></button>
                    <button onClick={zoomOut} title="缩小" className="p-2 bg-card border border-themed rounded-lg shadow-themed hover:bg-hover-themed transition-colors cursor-pointer"><MinusIcon className="w-4 h-4 text-default" /></button>
                    <button onClick={resetView} title="全屏适配" className="p-2 bg-card border border-themed rounded-lg shadow-themed hover:bg-hover-themed transition-colors cursor-pointer"><Maximize2 className="w-4 h-4 text-default" /></button>
                </div>

                {/* 图层元数据弹窗 */}
                <ModalDialog show={showMetadata} title="图层元数据" onClose={() => setShowMetadata(false)} onConfirm={() => setShowMetadata(false)}>
                    {metadataLayer && (
                        <div className="space-y-2 text-xs">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: metadataLayer.color }} />
                                <span className="font-semibold text-default">{metadataLayer.label}</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 rounded-lg bg-surface"><p className="text-dim text-[10px]">描述</p><p className="text-default">{metadataLayer.desc}</p></div>
                                <div className="p-2 rounded-lg bg-surface"><p className="text-dim text-[10px]">要素数量</p><p className="text-default font-bold">{metadataLayer.count.toLocaleString()}</p></div>
                                <div className="p-2 rounded-lg bg-surface"><p className="text-dim text-[10px]">坐标系</p><p className="text-default">CGCS2000 / EPSG:4490</p></div>
                                <div className="p-2 rounded-lg bg-surface"><p className="text-dim text-[10px]">数据来源</p><p className="text-default">排水设施普查</p></div>
                                <div className="p-2 rounded-lg bg-surface"><p className="text-dim text-[10px]">更新时间</p><p className="text-default">2024-03-15</p></div>
                                <div className="p-2 rounded-lg bg-surface"><p className="text-dim text-[10px]">数据格式</p><p className="text-default">GeoJSON</p></div>
                            </div>
                        </div>
                    )}
                </ModalDialog>
            </div>
        </div>
    );
}
