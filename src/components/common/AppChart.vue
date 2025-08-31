<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import { MAX_ANIMATION_DURATION } from '@/config/charts.config'
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
const isMounted = ref(false)
let rafId: number | null = null

// Function to wait for animations to complete
const waitForAnimationsToComplete = async (chart: ChartJS): Promise<void> => {
    return new Promise((resolve) => {
        const animator = (chart as any)._animator
        if (!animator || !animator._running) {
            resolve()
            return
        }
        
        // Wait for current animations to finish
        const checkAnimations = () => {
            if (!animator._running || animator._items.size === 0) {
                resolve()
            } else {
                requestAnimationFrame(checkAnimations)
            }
        }
        
        // Fallback timeout to prevent infinite waiting
        setTimeout(resolve, MAX_ANIMATION_DURATION + 100)
        checkAnimations()
    })
}

const clone = (val: any) => {
    try {
        return val == null ? val : JSON.parse(JSON.stringify(val))
    } catch {
        return val
    }
}

const createChart = async () => {
    if (!chartCanvas.value) {
        return
    }

    if (chartInstance.value) {
        try { 
            // Wait for animations to complete before destroying
            await waitForAnimationsToComplete(chartInstance.value)
            chartInstance.value.destroy()
        } catch (e) {
            // Silent error handling
        } finally {
            chartInstance.value = null
        }
    }

    const config: ChartConfiguration = {
        type: props.type,
        data: clone(props.data) as any,
        options: {
            responsive: props.responsive,
            maintainAspectRatio: false,
            ...(clone(props.options) as any),
            // Keep animations enabled - we'll handle synchronization properly
            animation: true as any,
        },
        // Clone plugins to avoid external mutation while animations run
        plugins: props.plugins ? (Array.isArray(props.plugins) ? [...props.plugins] : [props.plugins]) : []
    }

    const ctx = (chartCanvas.value as HTMLCanvasElement).getContext?.('2d')
    if (!ctx) {
        return
    }
    chartInstance.value = new ChartJS(ctx as any, config)
}

const updateChart = async () => {
    if (chartInstance.value) {
        const nextData = clone(props.data) as any
        chartInstance.value.data = nextData
        if (props.options) {
            chartInstance.value.options = {
                responsive: props.responsive,
                maintainAspectRatio: false,
                ...(clone(props.options) as any),
                animation: true as any,
            }
        }
        // Plugins are not safely mutable at runtime; we don't change them here
        try {
            ;(chartInstance.value as any).update()
        } catch (err) { }
    } else {
        await createChart()
    }
}

// Safe scheduling helpers
const schedule = (fn: () => void | Promise<void>) => {
    if (!isMounted.value) return
    if (rafId) {
        cancelAnimationFrame(rafId)
        rafId = null
    }
    nextTick(() => {
        rafId = requestAnimationFrame(async () => {
            await fn()
            rafId = null
        })
    })
}

// Update data/options without full recreate to reduce race conditions (keep animations)
watch(() => [props.data, props.options], () => {
    schedule(async () => await updateChart())
}, { flush: 'post' })

// Recreate only if the chart type changes
watch(() => props.type, () => {
    schedule(async () => await createChart())
})

// Note: avoid reacting to plugins reference changes. Provide stable arrays from callers instead.

// Note: Avoid watching plugins to prevent unnecessary re-creations.

onMounted(() => {
    isMounted.value = true
    schedule(async () => await createChart())
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

onBeforeUnmount(async () => {
    isMounted.value = false
    if (rafId) {
        try { cancelAnimationFrame(rafId) } catch {}
        rafId = null
    }
    if (chartInstance.value) {
        try { 
            // Wait for animations to complete before destroying
            await waitForAnimationsToComplete(chartInstance.value)
            chartInstance.value.destroy()
        } catch (e) {
            // Silent error handling
        } finally {
            chartInstance.value = null
        }
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


