<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

interface MapMarker {
    lng: number
    lat: number
    title: string
    label?: string
    color?: string
}

interface MapPolyline {
    path: [number, number][]  // [lng, lat]
    color?: string
    weight?: number
    label?: string
}

const props = withDefaults(defineProps<{
    markers?: MapMarker[]
    polylines?: MapPolyline[]
    center?: [number, number]
    zoom?: number
    height?: string
}>(), {
    markers: () => [],
    polylines: () => [],
    center: () => [113.032549, 28.141],
    zoom: 12,
    height: '280px',
})

const mapContainer = ref<HTMLDivElement>()
let mapInstance: any = null
let markerInstances: any[] = []
let polylineInstances: any[] = []

const AMAP_KEY = '2831a4407f599a6815d9fa2608676c9e'
const AMAP_SECURITY_CODE = '01051b2c2a2b850b592d80160a115710' // TODO: 从高德控制台获取安全密钥填在这里

function loadAMapSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
        if ((window as any).AMap) { resolve(); return }
        // 高德 JS API 2.0 安全验证
        if (AMAP_SECURITY_CODE) {
            (window as any)._AMapSecurityConfig = { securityJsCode: AMAP_SECURITY_CODE }
        }
        const existing = document.getElementById('amap-sdk')
        if (existing) {
            existing.addEventListener('load', () => resolve())
            existing.addEventListener('error', () => reject(new Error('AMap SDK load failed')))
            return
        }
        const script = document.createElement('script')
        script.id = 'amap-sdk'
        script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}`
        script.onload = () => resolve()
        script.onerror = () => reject(new Error('AMap SDK load failed'))
        document.head.appendChild(script)
    })
}

function updateMarkers() {
    if (!mapInstance) return
    markerInstances.forEach(m => mapInstance.remove(m))
    markerInstances = []
    const AMap = (window as any).AMap
    props.markers.forEach(m => {
        const marker = new AMap.Marker({
            position: [m.lng, m.lat],
            title: m.title,
            label: m.label ? { content: `<span style="font-size:11px;background:rgba(0,0,0,0.7);color:#fff;padding:2px 6px;border-radius:4px;white-space:nowrap">${m.label}</span>`, direction: 'top', offset: new AMap.Pixel(0, -4) } : undefined,
        })
        if (m.color) {
            marker.setIcon(new AMap.Icon({
                size: new AMap.Size(25, 34),
                image: `https://webapi.amap.com/theme/v1.3/markers/n/mark_r.png`,
                imageSize: new AMap.Size(25, 34),
            }))
        }
        markerInstances.push(marker)
        mapInstance.add(marker)
    })
    if (props.markers.length > 1 && props.polylines.length === 0) {
        mapInstance.setFitView(markerInstances, false, [60, 60, 60, 60])
    }
}

function updatePolylines() {
    if (!mapInstance) return
    const AMap = (window as any).AMap
    polylineInstances.forEach(p => mapInstance.remove(p))
    polylineInstances = []
    const allOverlays: any[] = []
    props.polylines.forEach(pl => {
        const path = pl.path.map(([lng, lat]) => new AMap.LngLat(lng, lat))
        const polyline = new AMap.Polyline({
            path,
            strokeColor: pl.color || '#3B82F6',
            strokeWeight: pl.weight || 4,
            strokeOpacity: 0.9,
            lineJoin: 'round',
            lineCap: 'round',
            showDir: true,
        })
        mapInstance.add(polyline)
        polylineInstances.push(polyline)
        allOverlays.push(polyline)
        // 起点标记
        if (pl.path.length > 0) {
            const startMarker = new AMap.Marker({
                position: pl.path[0],
                label: { content: `<span style="font-size:10px;background:${pl.color || '#3B82F6'};color:#fff;padding:1px 5px;border-radius:3px">起</span>`, direction: 'top', offset: new AMap.Pixel(0, -4) },
            })
            const endMarker = new AMap.Marker({
                position: pl.path[pl.path.length - 1],
                label: { content: `<span style="font-size:10px;background:${pl.color || '#3B82F6'};color:#fff;padding:1px 5px;border-radius:3px">${pl.label || '终'}</span>`, direction: 'top', offset: new AMap.Pixel(0, -4) },
            })
            mapInstance.add(startMarker)
            mapInstance.add(endMarker)
            polylineInstances.push(startMarker, endMarker)
            allOverlays.push(startMarker, endMarker)
        }
    })
    if (allOverlays.length > 0) {
        mapInstance.setFitView([...allOverlays, ...markerInstances], false, [40, 40, 40, 40])
    }
}

async function initMap() {
    if (!mapContainer.value) return
    try {
        await loadAMapSDK()
        const AMap = (window as any).AMap
        mapInstance = new AMap.Map(mapContainer.value, {
            zoom: props.zoom,
            center: props.center,
            mapStyle: 'amap://styles/normal',
            resizeEnable: true,
        })
        AMap.plugin(['AMap.Scale'], () => {
            mapInstance.addControl(new AMap.Scale())
        })
        updateMarkers()
        updatePolylines()
    } catch (e) {
        console.error('AMap init failed:', e)
    }
}

watch(() => props.markers, updateMarkers, { deep: true })
watch(() => props.polylines, updatePolylines, { deep: true })

onMounted(initMap)

onBeforeUnmount(() => {
    if (mapInstance) { mapInstance.destroy(); mapInstance = null }
})
</script>

<template>
    <div ref="mapContainer" class="w-full rounded-lg overflow-hidden border border-themed/30" :style="{ height }"></div>
</template>
