<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, toRaw } from 'vue'
import type { ChartProps } from '@/types/component.types'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    RadialLinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    BarController,
    LineController,
    DoughnutController,
    PieController,
    RadarController,
    PolarAreaController,
    ScatterController,
    type ChartConfiguration
} from 'chart.js'

ChartJS.register(
    CategoryScale,
    LinearScale,
    RadialLinearScale,
    BarElement,
    LineElement,
    PointElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
    BarController,
    LineController,
    DoughnutController,
    PieController,
    RadarController,
    PolarAreaController,
    ScatterController
)

const props = withDefaults(defineProps<ChartProps>(), {
    responsive: true,
    width: 400,
    height: 200
})

const chartCanvas = ref<HTMLCanvasElement | null>(null)
const chartInstance = ref<ChartJS | null>(null)

const clone = (val: any) => {
    try {
        return val == null ? val : JSON.parse(JSON.stringify(val))
    } catch {
        return val
    }
}

const createChart = () => {
    if (!chartCanvas.value) {
        return
    }

    if (chartInstance.value) {
        try { (chartInstance.value as any).stop?.() } catch {}
        chartInstance.value.destroy()
        chartInstance.value = null
    }

    const config: ChartConfiguration = {
        type: props.type,
        data: clone(props.data) as any,
        options: {
            responsive: props.responsive,
            maintainAspectRatio: false,
            ...(clone(props.options) as any)
        },
        plugins: props.plugins ? (Array.isArray(props.plugins) ? [...props.plugins] : [props.plugins]) : []
    }

    const ctx = (chartCanvas.value as HTMLCanvasElement).getContext?.('2d')
    if (!ctx) {
        return
    }
    chartInstance.value = new ChartJS(ctx as any, config)
}

const updateChart = () => {
    if (chartInstance.value) {
        chartInstance.value.data = clone(props.data) as any
        if (props.options) {
            chartInstance.value.options = {
                responsive: props.responsive,
                maintainAspectRatio: false,
                ...(clone(props.options) as any)
            }
        }
        // Plugins are not safely mutable at runtime; handled via separate recreate watcher
        try {
            // Update without animations to avoid timing issues with ctx
            ;(chartInstance.value as any).update('none')
        } catch (err) { }
    }
}

// Recreate on data/options changes to avoid Chart.js resolver recursion issues
watch(() => [props.data, props.options], () => {
    createChart()
}, { flush: 'post' })

// Recreate only if the chart type changes
watch(() => props.type, () => {
    createChart()
})

// Note: Avoid watching plugins to prevent unnecessary re-creations.

onMounted(() => {
    createChart()
    // Ensure proper sizing for print
    const handleBeforeAfterPrint = () => {
        if (chartInstance.value) {
            try {
                chartInstance.value.resize()
            } catch { }
        }
    }
    window.addEventListener('beforeprint', handleBeforeAfterPrint)
    window.addEventListener('afterprint', handleBeforeAfterPrint)
        // store to remove later
        ; (onBeforeUnmount as any)(() => {
            window.removeEventListener('beforeprint', handleBeforeAfterPrint)
            window.removeEventListener('afterprint', handleBeforeAfterPrint)
        })
})

onBeforeUnmount(() => {
    if (chartInstance.value) {
        try { (chartInstance.value as any).stop?.() } catch {}
        chartInstance.value.destroy()
    }
})

defineExpose({
    updateChart,
    chartInstance: chartInstance.value
})
</script>

<template>
    <div class="chart-container" :style="{ width: width + 'px', height: height + 'px' }">
        <canvas ref="chartCanvas"></canvas>
    </div>
</template>

<style scoped>
.chart-container {
    position: relative;
    display: block;
}

.chart-container canvas {
    display: block;
    width: 100% !important;
    height: 100% !important;
}
</style>

