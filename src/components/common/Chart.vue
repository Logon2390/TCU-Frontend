<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
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

const createChart = () => {
    if (!chartCanvas.value) return

    if (chartInstance.value) {
        chartInstance.value.destroy()
    }

    const config: ChartConfiguration = {
        type: props.type,
        data: props.data,
        options: {
            responsive: props.responsive,
            maintainAspectRatio: false,
            ...props.options
        }
    }

    chartInstance.value = new ChartJS(chartCanvas.value, config)
}

const updateChart = () => {
    if (chartInstance.value) {
        chartInstance.value.data = props.data
        if (props.options) {
            chartInstance.value.options = {
                responsive: props.responsive,
                maintainAspectRatio: false,
                ...props.options
            }
        }
        chartInstance.value.update()
    }
}

watch(() => props.data, updateChart, { deep: true })
watch(() => props.options, updateChart, { deep: true })

onMounted(() => {
    createChart()
})

onBeforeUnmount(() => {
    if (chartInstance.value) {
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
