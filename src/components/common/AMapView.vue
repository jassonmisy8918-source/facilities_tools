<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

interface MapMarker {
    lng: number
    lat: number
    title: string
    label?: string
    color?: string
}

const props = withDefaults(defineProps<{
    markers?: MapMarker[]
    center?: [number, number]
    zoom?: number
    height?: string
}>(), {
    markers: () => [],
    center: () => [116.397428, 39.90923],
    zoom: 12,
    height: '280px',
})

const mapContainer = ref<HTMLDivElement>()
let mapInstance: any = null
let markerInstances: any[] = []

const AMAP_KEY = '4093860e30a4f5e0e4e8571d1c4046fc'

function loadAMapSDK(): Promise<void> {
    return new Promise((resolve, reject) => {
        if ((window as any).AMap) { resolve(); return }
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
    if (props.markers.length > 1) {
        mapInstance.setFitView(markerInstances, false, [60, 60, 60, 60])
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
            mapStyle: 'amap://styles/dark',
            resizeEnable: true,
        })
        AMap.plugin(['AMap.Scale'], () => {
            mapInstance.addControl(new AMap.Scale())
        })
        updateMarkers()
    } catch (e) {
        console.error('AMap init failed:', e)
    }
}

watch(() => props.markers, updateMarkers, { deep: true })

onMounted(initMap)

onBeforeUnmount(() => {
    if (mapInstance) { mapInstance.destroy(); mapInstance = null }
})
</script>

<template>
    <div ref="mapContainer" class="w-full rounded-lg overflow-hidden border border-themed/30" :style="{ height }"></div>
</template>
