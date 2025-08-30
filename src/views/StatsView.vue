<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, markRaw } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import AppChart from '@/components/common/AppChart.vue'
import AppTooltip from '@/components/common/AppTooltip.vue'
import type { ChartData, ChartOptions, ChartType } from 'chart.js'
import { statsService } from '@/service/Stats.service'
import type { StatsPeriod, Statistic } from '@/types/stats.types'
import useFetching from '@/composables/useFetching'
import AppLoader from '@/components/features/AppLoader.vue'
import AppTable from '@/components/common/AppTable.vue'

const selectedPeriod = ref<StatsPeriod>('today')
const { isLoading, error, data, execute } = useFetching(statsService.getStatsByPeriod)
const stats = computed<Statistic | null>(() => (data.value ? (data.value as any).data : null))
const isFirstLoad = ref(true)
const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)

const chartDimensions = computed(() => {
    const width = windowWidth.value

    if (width < 640) {
        return { width: width - 80, height: 280 }
    } else if (width < 768) {
        return { width: width - 100, height: 320 }
    } else if (width < 1024) {
        return { width: width - 120, height: 380 }
    } else if (width < 1280) {
        return { width: Math.min(600, (width - 200) / 2), height: 400 }
    } else {
        return { width: Math.min(700, (width - 250) / 2), height: 450 }
    }
})

// Chart de time series - usa todo el ancho disponible
const timeSeriesChartDimensions = computed(() => {
    const width = windowWidth.value

    if (width < 640) {
        return { width: width - 80, height: 280 }
    } else if (width < 768) {
        return { width: width - 100, height: 320 }
    } else if (width < 1024) {
        return { width: width - 120, height: 380 }
    } else if (width < 1280) {
        return { width: width - 200, height: 400 }
    } else {
        return { width: width - 250, height: 500 }
    }
})

const updateDimensions = () => {
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
}

const periodDateRange = computed(() => {
    const dates = stats.value?.visitsByDate?.map(p => p.date) || []
    if (!dates.length) return null
    const sorted = [...dates].sort()
    return { start: sorted[0], end: sorted[sorted.length - 1] }
})

const statsTextSummary = computed(() => {
    const s = stats.value
    if (!s) {
        return {
            period: '', totalVisits: 0, dailyAverage: '0',
            predominantGender: { name: '-', percentage: '0', count: 0 },
            predominantAgeBand: { name: '-', percentage: '0', count: 0 }
        }
    }

    const total = s.totalVisits || 0

    const entriesG = Object.entries(s.genderDistribution)
    const maxGender = entriesG.reduce((a, b) => a[1] > b[1] ? a : b)
    const genderNames: Record<string, string> = { F: 'femenino', M: 'masculino', O: 'otro' }
    const genderPercentage = total > 0 ? ((maxGender[1] / total) * 100).toFixed(1) : '0.0'

    const entriesA = Object.entries(s.ageRangeDistribution)
    const maxAgeBand = entriesA.reduce((a, b) => a[1] > b[1] ? a : b)
    const ageBandLabelMap: Record<string, string> = {
        infancia: 'infancia (0-14 años)',
        juventud: 'juventud (15-24 años)',
        adultez_joven: 'adultez joven (25-44 años)',
        adultez_media: 'adultez media (45-64 años)',
        vejez: 'vejez (65+ años)'
    }
    const ageBandPercentage = total > 0 ? ((maxAgeBand[1] / total) * 100).toFixed(1) : '0.0'

    const startDate = periodDateRange.value?.start
        ? new Date(periodDateRange.value.start).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
        : ''
    const endDate = periodDateRange.value?.end
        ? new Date(periodDateRange.value.end).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })
        : ''

    const days = Math.max(1, s.visitsByDate?.length || 1)
    const dailyAverage = (total / days).toFixed(1)

    return {
        period: startDate && endDate ? `${startDate} al ${endDate}` : '',
        totalVisits: total,
        dailyAverage,
        predominantGender: {
            name: genderNames[maxGender[0]] || '-',
            percentage: genderPercentage,
            count: maxGender[1]
        },
        predominantAgeBand: {
            name: ageBandLabelMap[maxAgeBand[0]] || '-',
            percentage: ageBandPercentage,
            count: maxAgeBand[1]
        }
    }
})

const valueLabelPlugin = markRaw({
    id: 'valueLabelPlugin',
    afterDatasetsDraw(chart: any) {
        const ctx = chart?.ctx
        if (!ctx || typeof ctx.save !== 'function') return
        try {
            ctx.save()
            const datasets = Array.isArray(chart?.data?.datasets) ? chart.data.datasets : []
            datasets.forEach((dataset: any, i: number) => {
                const meta = typeof chart.getDatasetMeta === 'function' ? chart.getDatasetMeta(i) : null
                if (!meta || meta.hidden || !Array.isArray(meta.data)) return
                meta.data.forEach((element: any, index: number) => {
                    const value = Array.isArray(dataset?.data) ? dataset.data[index] : null
                    if (value == null || Number.isNaN(Number(value))) return
                    if (!element || typeof element.tooltipPosition !== 'function') return
                    const pos = element.tooltipPosition()
                    if (!pos) return
                    ctx.font = '12px Montserrat, sans-serif'
                    ctx.fillStyle = '#111827'
                    ctx.textAlign = 'center'
                    ctx.textBaseline = 'middle'
                    const safeY = Math.max(14, pos.y - 12)
                    ctx.fillText(String(value), pos.x, safeY)
                })
            })
        } finally {
            ctx.restore()
        }
    }
})

const genderChartType: ChartType = 'pie'
const genderChartData = computed<ChartData<'pie'>>(() => ({
    labels: ['Femenino', 'Masculino', 'Otro'],
    datasets: [
        {
            label: 'Por género',
            data: [
                stats.value?.genderDistribution.F || 0,
                stats.value?.genderDistribution.M || 0,
                stats.value?.genderDistribution.O || 0
            ],
            backgroundColor: ['#3b82f6', '#64748b', '#0ea5e9'],
            borderColor: ['#2563eb', '#475569', '#0284c7'],
            borderWidth: 2,
        },
    ],
}))
const genderChartOptions = computed<ChartOptions<'pie'>>(() => markRaw({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        animateRotate: true,
        animateScale: true,
        duration: 1000,
    },
    layout: {
        padding: 10
    },
    plugins: {
        legend: {
            position: 'bottom',
            labels: {
                padding: 15,
                usePointStyle: true,
                boxWidth: 12,
            }
        },
        tooltip: {
            backgroundColor: '#1f2937',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#374151',
            borderWidth: 1,
        }
    }
}))

const ageBandChartType: ChartType = 'bar'
const ageBandChartData = computed<ChartData<'bar'>>(() => ({
    labels: ['Infancia', 'Juventud', 'Adultez joven', 'Adultez media', 'Vejez'],
    datasets: [
        {
            label: 'Por rango etario',
            data: [
                stats.value?.ageRangeDistribution.infancia || 0,
                stats.value?.ageRangeDistribution.juventud || 0,
                stats.value?.ageRangeDistribution.adultez_joven || 0,
                stats.value?.ageRangeDistribution.adultez_media || 0,
                stats.value?.ageRangeDistribution.vejez || 0,
            ],
            backgroundColor: ['#059669', '#3b82f6', '#0ea5e9', '#f59e0b', '#dc2626'],
            borderColor: ['#047857', '#2563eb', '#0284c7', '#d97706', '#b91c1c'],
            borderWidth: 2,
            borderRadius: 4,
        },
    ],
}))
const ageBandChartOptions = computed<ChartOptions<'bar'>>(() => markRaw({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 1200,
        easing: 'easeOutQuart',
    },
    layout: {
        padding: {
            top: 24,
            bottom: 10,
            left: 10,
            right: 10
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                color: '#f3f4f6',
            },
            ticks: {
                color: '#6b7280',
                maxTicksLimit: 6
            }
        },
        x: {
            grid: {
                display: false,
            },
            ticks: {
                color: '#6b7280',
                maxRotation: 0
            }
        }
    },
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            backgroundColor: '#1f2937',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#374151',
            borderWidth: 1,
        }
    }
}))

const timeSeriesChartType: ChartType = 'line'
const timeSeriesChartData = computed<ChartData<'line'>>(() => ({
    labels: (stats.value?.visitsByDate || []).map((p) => p.hour ? `${p.hour}:00` : p.date),
    datasets: [
        {
            label: 'Visitas por día',
            data: (stats.value?.visitsByDate || []).map((p) => p.count),
            borderColor: '#0ea5e9',
            backgroundColor: 'rgba(14,165,233,0.2)',
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: '#0ea5e9',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
        },
    ],
}))
const timeSeriesChartOptions = computed<ChartOptions<'line'>>(() => markRaw({
    responsive: true,
    maintainAspectRatio: false,
    animation: {
        duration: 1500,
        easing: 'easeInOutCubic',
    },
    layout: {
        padding: {
            top: 10,
            bottom: 10,
            left: 10,
            right: 10
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                color: '#f3f4f6',
            },
            ticks: {
                color: '#6b7280',
                maxTicksLimit: 6
            }
        },
        x: {
            grid: {
                color: '#f3f4f6',
            },
            ticks: {
                color: '#6b7280',
                maxRotation: 45,
                maxTicksLimit: 8
            }
        }
    },
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            backgroundColor: '#1f2937',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#374151',
            borderWidth: 1,
        }
    }
}))

const topModulesChartType: ChartType = 'bar'
const topModulesChartData = computed<ChartData<'bar'>>(() => {
    const labels = (stats.value?.topModules || []).map(m => m.name)
    const data = (stats.value?.topModules || []).map(m => m.visitCount)
    return {
        labels,
        datasets: [
            {
                label: 'Top módulos',
                data,
                backgroundColor: '#3b82f6',
                borderColor: '#2563eb',
                borderWidth: 2,
                borderRadius: 4,
            }
        ]
    }
})
const topModulesChartOptions = computed<ChartOptions<'bar'>>(() => markRaw({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    animation: {
        duration: 800,
        easing: 'easeOutCubic',
    },
    layout: { padding: { top: 10, bottom: 10, left: 10, right: 10 } },
    scales: {
        x: {
            beginAtZero: true,
            grid: { color: '#f3f4f6' },
            ticks: { color: '#6b7280', maxTicksLimit: 6 }
        },
        y: {
            grid: { display: false },
            ticks: { color: '#6b7280' }
        }
    },
    plugins: {
        legend: { display: false },
        tooltip: {
            backgroundColor: '#1f2937',
            titleColor: '#ffffff',
            bodyColor: '#ffffff',
            borderColor: '#374151',
            borderWidth: 1,
        }
    }
}))

const topUsersColumns: { key: string; label: string; sortable?: boolean; width?: string; align?: 'left' | 'center' | 'right' }[] = [
    { key: 'userName', label: 'Usuario', sortable: true },
    { key: 'visitCount', label: 'Visitas', align: 'right', sortable: true },
]
const topUsersData = computed(() => (stats.value?.topUsers || []))

const handlePrint = () => {
    setTimeout(() => {
        window.print()
    }, 100)
}

const setPeriod = (type: StatsPeriod) => {
    selectedPeriod.value = type
    execute(selectedPeriod.value)
}

onMounted(async () => {
    await execute(selectedPeriod.value)
    isFirstLoad.value = false
    window.addEventListener('resize', updateDimensions)
})

onUnmounted(() => {
    window.removeEventListener('resize', updateDimensions)
})
</script>

<template>
    <div class="min-h-screen bg-background flex flex-col">
        <div class="bg-background backdrop-blur supports-[backdrop-filter]:bg-background/70 sticky top-16 z-10">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                <h1 class="text-xl font-semibold text-text-primary">Estadísticas de visitas</h1>
                <div class="flex gap-2">
                    <AppButton :button-props="{ variant: 'secondary', text: 'Hoy', onClick: () => setPeriod('today') }"
                        customStyle="w-1/4 md:w-full text-xs sm:text-base" />
                    <AppButton :button-props="{ variant: 'secondary', text: 'Mes', onClick: () => setPeriod('month') }"
                        customStyle="w-1/4 md:w-full text-xs sm:text-base" />
                    <AppButton :button-props="{ variant: 'secondary', text: 'Año', onClick: () => setPeriod('year') }"
                        customStyle="w-1/4 md:w-full text-xs sm:text-base" />
                    <AppButton
                        :button-props="{ variant: 'primary', text: 'Imprimir/Exportar', icon: 'icon-[lucide--printer] text-white', onClick: handlePrint }"
                        customStyle="w-1/4 md:w-full text-xs sm:text-base" />
                </div>
            </div>
        </div>

        <div class="bg-background p-4 space-y-4">
            <div v-if="isFirstLoad && isLoading" class="bg-white rounded-lg border border-secondary">
                <AppLoader message="Cargando estadísticas..." />
            </div>
            <div class="bg-white rounded-lg border border-secondary p-4">
                <div class="flex items-center gap-2 mb-2">
                    <span class="icon-[lucide--settings-2] text-lg text-primary"></span>
                    <h2 class="text-lg font-medium text-text-primary">Período</h2>
                </div>
                <div class="flex flex-wrap gap-3 items-center text-sm text-gray-600">
                    <span>Seleccionado: <strong>{{ selectedPeriod }}</strong></span>
                    <span v-if="periodDateRange"
                        class="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                        {{ periodDateRange.start }} – {{ periodDateRange.end }}
                    </span>
                    <span v-if="!isFirstLoad && isLoading" class="text-gray-500">Actualizando…</span>
                    <span v-if="error" class="text-error">Ocurrió un error al cargar.</span>
                </div>
            </div>
        </div>

        <div class="p-4 space-y-4">
            <div class="bg-white rounded-lg border border-secondary p-4">
                <div class="flex items-center gap-2 mb-3">
                    <span class="icon-[lucide--file-text] text-lg text-primary"></span>
                    <h3 class="text-lg font-medium text-text-primary">Resumen del período</h3>
                </div>
                <div class="prose prose-sm max-w-none text-gray-700 leading-relaxed">
                    <p class="mb-3">
                        <strong>Período analizado:</strong> {{ statsTextSummary.period }}
                    </p>
                    <p class="mb-3">
                        Durante este período se registraron <strong class="text-primary">{{ statsTextSummary.totalVisits
                            }} visitas</strong>,
                        con un promedio de <strong>{{ statsTextSummary.dailyAverage }} visitas por día</strong>.
                    </p>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div class="bg-blue-50 p-3 rounded-lg border-l-4 border-blue-500">
                            <p class="text-sm">
                                <strong>Género predominante:</strong><br>
                                {{ statsTextSummary.predominantGender.name }} con {{
                                    statsTextSummary.predominantGender.count }} visitas
                                ({{ statsTextSummary.predominantGender.percentage }}% del total)
                            </p>
                        </div>
                        <div class="bg-green-50 p-3 rounded-lg border-l-4 border-green-500">
                            <p class="text-sm">
                                <strong>Grupo etario predominante:</strong><br>
                                {{ statsTextSummary.predominantAgeBand.name }} con {{
                                    statsTextSummary.predominantAgeBand.count }} visitas
                                ({{ statsTextSummary.predominantAgeBand.percentage }}% del total)
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg border border-secondary p-4">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-3">
                        <div class="p-3 bg-primary/10 rounded-full">
                            <span class="icon-[lucide--users] text-2xl text-primary"></span>
                        </div>
                        <div>
                            <div class="flex items-center gap-2">
                                <h3 class="text-base font-medium text-text-primary">Total visitas</h3>
                                <AppTooltip
                                    content="Número total de visitantes únicos registrados en el período seleccionado"
                                    size="xl">
                                    <span
                                        class="icon-[lucide--info] text-sm text-gray-400 hover:text-primary transition-colors cursor-help"></span>
                                </AppTooltip>
                            </div>
                            <p class="text-3xl font-bold text-primary mt-1">{{ stats?.totalVisits || 0 }}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                        <span class="icon-[lucide--calendar] text-base"></span>
                        <span class="hidden sm:inline">{{ periodDateRange?.start || '-' }} - {{ periodDateRange?.end ||
                            '-' }}</span>
                    </div>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 print-grid">
                <div class="bg-white rounded-lg border border-secondary p-4 chart-section">
                    <div class="flex items-center gap-2 mb-4">
                        <span class="icon-[lucide--pie-chart] text-lg text-primary"></span>
                        <h3 class="text-lg font-medium text-text-primary">Por género</h3>
                        <AppTooltip content="Distribución de visitantes por identidad de género registrada" size="xl">
                            <span
                                class="icon-[lucide--info] text-sm text-gray-400 hover:text-primary transition-colors cursor-help no-print"></span>
                        </AppTooltip>
                    </div>
                    <div class="w-full max-w-full overflow-hidden" :style="{ height: chartDimensions.height + 'px' }">
                        <AppChart v-if="stats" :type="genderChartType" :data="genderChartData"
                            :options="genderChartOptions" :plugins="[valueLabelPlugin]" :width="chartDimensions.width"
                            :height="chartDimensions.height" :responsive="true" />
                    </div>
                </div>

                <div class="bg-white rounded-lg border border-secondary p-4 chart-section">
                    <div class="flex items-center gap-2 mb-4">
                        <span class="icon-[lucide--bar-chart-3] text-lg text-primary"></span>
                        <h3 class="text-lg font-medium text-text-primary">Por rango etario</h3>
                        <AppTooltip
                            content="Distribución de visitantes agrupados por rangos de edad (Infancia: 0-14, Juventud: 15-24, Adultez joven: 25-44, Adultez media: 45-64, Vejez: 65+)"
                            size="xl">
                            <span
                                class="icon-[lucide--info] text-sm text-gray-400 hover:text-primary transition-colors cursor-help no-print"></span>
                        </AppTooltip>
                    </div>
                    <div class="w-full max-w-full overflow-hidden"
                        :style="{ height: (chartDimensions.height + 60) + 'px' }">
                        <AppChart v-if="stats" :type="ageBandChartType" :data="ageBandChartData"
                            :options="ageBandChartOptions" :plugins="[valueLabelPlugin]" :width="chartDimensions.width"
                            :height="chartDimensions.height + 60" :responsive="true" />
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg border border-secondary p-4 chart-section">
                <div class="flex items-center gap-2 mb-4">
                    <span class="icon-[lucide--trending-up] text-lg text-primary"></span>
                    <h3 class="text-lg font-medium text-text-primary">Visitas por día</h3>
                    <AppTooltip content="Evolución temporal del número de visitas diarias en el período seleccionado"
                        size="xl">
                        <span
                            class="icon-[lucide--info] text-sm text-gray-400 hover:text-primary transition-colors cursor-help no-print"></span>
                    </AppTooltip>
                </div>
                <div class="w-full max-w-full overflow-hidden"
                    :style="{ height: timeSeriesChartDimensions.height + 'px' }">
                    <AppChart v-if="stats" :type="timeSeriesChartType" :data="timeSeriesChartData"
                        :options="timeSeriesChartOptions" :width="timeSeriesChartDimensions.width"
                        :height="timeSeriesChartDimensions.height" :responsive="true" />
                </div>
            </div>

            <div class="bg-white rounded-lg border border-secondary p-4 chart-section">
                <div class="flex items-center gap-2 mb-4">
                    <span class="icon-[lucide--list-ordered] text-lg text-primary"></span>
                    <h3 class="text-lg font-medium text-text-primary">Top módulos</h3>
                    <AppTooltip content="Módulos más visitados en el período seleccionado" size="xl">
                        <span
                            class="icon-[lucide--info] text-sm text-gray-400 hover:text-primary transition-colors cursor-help no-print"></span>
                    </AppTooltip>
                </div>
                <div class="w-full max-w-full overflow-hidden" :style="{ height: chartDimensions.height + 'px' }">
                    <AppChart v-if="stats" :type="topModulesChartType" :data="topModulesChartData"
                        :options="topModulesChartOptions" :width="chartDimensions.width"
                        :height="chartDimensions.height" :responsive="true" />
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div class="bg-white rounded-lg border border-secondary p-4">
                    <div class="flex items-center gap-3">
                        <div class="p-3 bg-primary/10 rounded-full">
                            <span class="icon-[lucide--user-check] text-2xl text-primary"></span>
                        </div>
                        <div>
                            <h3 class="text-base font-medium text-text-primary">Total usuarios</h3>
                            <p class="text-3xl font-bold text-primary mt-1">{{ stats?.totalUsers || 0 }}</p>
                        </div>
                    </div>
                </div>
                <div class="bg-white rounded-lg border border-secondary p-4">
                    <div class="flex items-center gap-3">
                        <div class="p-3 bg-primary/10 rounded-full">
                            <span class="icon-[lucide--gauge] text-2xl text-primary"></span>
                        </div>
                        <div>
                            <h3 class="text-base font-medium text-text-primary">Edad promedio</h3>
                            <p class="text-3xl font-bold text-primary mt-1">{{ stats?.averageAge || 0 }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div class="bg-white rounded-lg border border-secondary p-4">
                <div class="flex items-center gap-2 mb-4">
                    <span class="icon-[lucide--users-round] text-lg text-primary"></span>
                    <h3 class="text-lg font-medium text-text-primary">Top usuarios</h3>
                </div>
                <AppTable :columns="topUsersColumns" :data="topUsersData" :loading="false"
                    :pagination="{ enabled: false }" />
            </div>
        </div>
    </div>
</template>

<style scoped>
@media print {
    .report-header {
        display: block !important;
        margin-bottom: 1rem;
    }
}

@media print {

    .bg-white,
    .border {
        box-shadow: none !important;
    }

    .chart-section {
        page-break-inside: avoid;
        break-inside: avoid;
    }

    .chart-section>div:last-child,
    .chart-container {
        width: 100% !important;
        height: 360px !important;
        overflow: hidden !important;
    }

    .chart-container canvas {
        width: 100% !important;
        height: 100% !important;
    }

    .no-print {
        display: none !important;
    }

    .chart-section {
        page-break-inside: avoid;
        margin-bottom: 1rem;
    }

    .print-grid {
        display: block !important;
    }

    .print-grid>div {
        margin-bottom: 1.5rem;
        page-break-inside: avoid;
    }
}
</style>