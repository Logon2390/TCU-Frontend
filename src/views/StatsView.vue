<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, markRaw, watch } from 'vue'
import AppInput from '@/components/common/AppInput.vue'
import AppSelect from '@/components/common/AppSelect.vue'
import AppButton from '@/components/common/AppButton.vue'
import AppChart from '@/components/common/AppChart.vue'
import AppTooltip from '@/components/common/AppTooltip.vue'
import type { StatsQuery } from '@/types/admin.types'
import { AGE_BANDS, type AgeBandId, type GenderId } from '@/types/admin.types'
import { generateMockVisits, filterRecords, aggregateStats } from '@/mocks/stats.mock'
import type { ChartData, ChartOptions, ChartType } from 'chart.js'

const todayISO = new Date().toISOString().slice(0, 10)
const firstOfMonth = (() => {
    const d = new Date()
    d.setDate(1)
    return d.toISOString().slice(0, 10)
})()

const query = ref<StatsQuery>({
    range: { start: firstOfMonth, end: todayISO },
    gender: '',
    exactAge: null,
    ageBandId: '',
})

const genderOptions = [
    { id: '', name: 'Todos' },
    { id: 'F', name: 'Femenino' },
    { id: 'M', name: 'Masculino' },
    { id: 'O', name: 'Otro' },
]

const ageBandOptions = [{ id: '', name: 'Todos' }, ...AGE_BANDS.map((b) => ({ id: b.id, name: b.name }))]

const allRecords = ref(generateMockVisits(query.value.range, 600))

// Debounce de filtros para evitar recálculos excesivos
const debouncedQuery = ref<StatsQuery>({ ...query.value })
let debounceTimer: number | null = null
watch(query, (val) => {
    if (debounceTimer) window.clearTimeout(debounceTimer)
    debounceTimer = window.setTimeout(() => {
        debouncedQuery.value = { ...val }
    }, 350)
}, { deep: true })

const filteredRecords = computed(() => filterRecords(allRecords.value, debouncedQuery.value))
const stats = computed(() => aggregateStats(filteredRecords.value))

// Reactive viewport dimensions
const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)

// Chart dimensions based on viewport - para charts en grid (2 columnas en lg+)
const chartDimensions = computed(() => {
    const width = windowWidth.value

    if (width < 640) { // mobile
        return { width: width - 80, height: 280 }
    } else if (width < 768) { // sm
        return { width: width - 100, height: 320 }
    } else if (width < 1024) { // md
        return { width: width - 120, height: 380 }
    } else if (width < 1280) { // lg - 2 columnas, necesita menos ancho por chart
        return { width: Math.min(600, (width - 200) / 2), height: 400 }
    } else { // xl - 2 columnas, más espacio
        return { width: Math.min(700, (width - 250) / 2), height: 450 }
    }
})

// Chart de time series - usa todo el ancho disponible
const timeSeriesChartDimensions = computed(() => {
    const width = windowWidth.value

    if (width < 640) { // mobile
        return { width: width - 80, height: 280 }
    } else if (width < 768) { // sm
        return { width: width - 100, height: 320 }
    } else if (width < 1024) { // md
        return { width: width - 120, height: 380 }
    } else if (width < 1280) { // lg
        return { width: width - 200, height: 400 }
    } else { // xl
        return { width: width - 250, height: 500 }
    }
})

const updateDimensions = () => {
    windowWidth.value = window.innerWidth
    windowHeight.value = window.innerHeight
}

// Resumen textual de estadísticas
const statsTextSummary = computed(() => {
    const { gender, ageBands, total } = stats.value

    // Género predominante
    const maxGender = Object.entries(gender).reduce((a, b) => a[1] > b[1] ? a : b)
    const genderNames = { F: 'femenino', M: 'masculino', O: 'otro' }
    const genderPercentage = ((maxGender[1] / total) * 100).toFixed(1)

    // Rango etario predominante
    const maxAgeBand = Object.entries(ageBands).reduce((a, b) => a[1] > b[1] ? a : b)
    const ageBandNames = {
        '0-14': 'infancia (0-14 años)',
        '15-24': 'juventud (15-24 años)',
        '25-44': 'adultez joven (25-44 años)',
        '45-64': 'adultez media (45-64 años)',
        '65+': 'vejez (65+ años)'
    }
    const ageBandPercentage = ((maxAgeBand[1] / total) * 100).toFixed(1)

    // Período de análisis
    const startDate = new Date(query.value.range.start).toLocaleDateString('es-ES', {
        day: 'numeric', month: 'long', year: 'numeric'
    })
    const endDate = new Date(query.value.range.end).toLocaleDateString('es-ES', {
        day: 'numeric', month: 'long', year: 'numeric'
    })

    // Promedio diario
    const days = Math.max(1, Math.ceil((new Date(query.value.range.end).getTime() - new Date(query.value.range.start).getTime()) / (1000 * 60 * 60 * 24)) + 1)
    const dailyAverage = (total / days).toFixed(1)

    return {
        period: `${startDate} al ${endDate}`,
        totalVisits: total,
        dailyAverage,
        predominantGender: {
            name: genderNames[maxGender[0] as keyof typeof genderNames],
            percentage: genderPercentage,
            count: maxGender[1]
        },
        predominantAgeBand: {
            name: ageBandNames[maxAgeBand[0] as keyof typeof ageBandNames],
            percentage: ageBandPercentage,
            count: maxAgeBand[1]
        }
    }
})

// Plugin sencillo de data labels para Chart.js (porcentaje/valor)
const valueLabelPlugin = markRaw({
    id: 'valueLabelPlugin',
    afterDatasetsDraw(chart: any) {
        const { ctx } = chart
        ctx.save()
        chart.data.datasets.forEach((dataset: any, i: number) => {
            const meta = chart.getDatasetMeta(i)
            if (!meta || meta.hidden) return
            meta.data.forEach((element: any, index: number) => {
                const value = dataset.data[index]
                if (value == null) return
                const pos = element.tooltipPosition()
                ctx.font = '12px Montserrat, sans-serif'
                ctx.fillStyle = '#111827'
                ctx.textAlign = 'center'
                ctx.textBaseline = 'middle'
                ctx.fillText(String(value), pos.x, pos.y - 12)
            })
        })
        ctx.restore()
    }
})

const genderChartType: ChartType = 'pie'
const genderChartData = computed<ChartData<'pie'>>(() => ({
    labels: ['Femenino', 'Masculino', 'Otro'],
    datasets: [
        {
            label: 'Por género',
            data: [stats.value.gender.F, stats.value.gender.M, stats.value.gender.O],
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
    labels: ['0-14', '15-24', '25-44', '45-64', '65+'],
    datasets: [
        {
            label: 'Por rango etario',
            data: [
                stats.value.ageBands['0-14'],
                stats.value.ageBands['15-24'],
                stats.value.ageBands['25-44'],
                stats.value.ageBands['45-64'],
                stats.value.ageBands['65+'],
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
    labels: stats.value.timeSeries.map((p) => p.date),
    datasets: [
        {
            label: 'Visitas por día',
            data: stats.value.timeSeries.map((p) => p.count),
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

const handleGenderChange = (e: Event) => {
    const target = e.target as HTMLSelectElement
    query.value.gender = target.value as '' | GenderId
}

const handleAgeBandChange = (e: Event) => {
    const target = e.target as HTMLSelectElement
    query.value.ageBandId = target.value as '' | AgeBandId
}

const handlePrint = () => {
    // Pequeño delay para asegurar que los charts estén completamente renderizados
    setTimeout(() => {
        window.print()
    }, 100)
}

const setDateRange = (type: 'day' | 'week' | 'month' | 'semester') => {
    const today = new Date()
    const start = new Date(today)

    switch (type) {
        case 'day':
            break // start = today
        case 'week':
            start.setDate(today.getDate() - 7)
            break
        case 'month':
            start.setMonth(today.getMonth() - 1)
            break
        case 'semester':
            start.setMonth(today.getMonth() - 6)
            break
    }

    query.value.range = {
        start: start.toISOString().slice(0, 10),
        end: today.toISOString().slice(0, 10)
    }
    allRecords.value = generateMockVisits(query.value.range, 600)
}

const resetFilters = () => {
    query.value = {
        range: { start: firstOfMonth, end: todayISO },
        gender: '',
        exactAge: null,
        ageBandId: '',
    }
    allRecords.value = generateMockVisits(query.value.range, 600)
}

onMounted(() => {
    // Regenerate data if date range changes across months
    window.addEventListener('resize', updateDimensions)
})

onUnmounted(() => {
    window.removeEventListener('resize', updateDimensions)
})
</script>

<template>
    <div class="min-h-screen bg-background flex flex-col">
        <!-- Header -->
        <div class="bg-white border-b border-secondary">
            <div class="flex flex-col sm:flex-row sm:items-center justify-between p-4 gap-4">
                <h1 class="text-xl font-semibold text-text-primary">Estadísticas de visitas</h1>
                <div class="flex flex-col sm:flex-row gap-2">
                    <AppButton
                        :button-props="{ variant: 'primary', text: 'Imprimir/Exportar', icon: 'icon-[lucide--printer] text-white', onClick: handlePrint }"
                        customStyle="w-full sm:w-auto px-3 py-2" />
                </div>
            </div>
        </div>

        <!-- Filters -->
        <div class="bg-background p-4 space-y-4">
            <div class="bg-white rounded-lg border border-secondary p-4">
                <h2 class="text-lg font-medium text-text-primary mb-4">Filtros</h2>

                <!-- Quick Date Range Buttons -->
                <div class="mb-4">
                    <label class="block text-sm font-medium text-text-primary mb-2">Rango rápido</label>
                    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        <AppButton
                            :button-props="{ variant: 'secondary', text: 'Día', onClick: () => setDateRange('day') }"
                            customStyle="w-full px-3 py-2 text-sm" />
                        <AppButton
                            :button-props="{ variant: 'secondary', text: 'Semana', onClick: () => setDateRange('week') }"
                            customStyle="w-full px-3 py-2 text-sm" />
                        <AppButton
                            :button-props="{ variant: 'secondary', text: 'Mes', onClick: () => setDateRange('month') }"
                            customStyle="w-full px-3 py-2 text-sm" />
                        <AppButton
                            :button-props="{ variant: 'secondary', text: 'Semestre', onClick: () => setDateRange('semester') }"
                            customStyle="w-full px-3 py-2 text-sm" />
                    </div>
                </div>

                <!-- Custom Filters -->
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    <AppInput :label-props="{ id: 'startDate', label: 'Fecha inicio' }"
                        :input-props="{ type: 'date', required: true }" v-model="query.range.start" />
                    <AppInput :label-props="{ id: 'endDate', label: 'Fecha fin' }"
                        :input-props="{ type: 'date', required: true }" v-model="query.range.end" />
                    <AppSelect :label-props="{ id: 'gender', label: 'Género' }"
                        :select-props="{ placeholder: 'Todos', options: genderOptions, onChange: handleGenderChange }"
                        :error-props="{ onError: false }" v-model="query.gender" />
                    <AppInput :label-props="{ id: 'exactAge', label: 'Edad exacta (opcional)' }"
                        :input-props="{ type: 'number', placeholder: 'Ej. 27' }" v-model="(query.exactAge as any)" />
                    <AppSelect :label-props="{ id: 'ageBand', label: 'Rango etario' }"
                        :select-props="{ placeholder: 'Todos', options: ageBandOptions, onChange: handleAgeBandChange }"
                        :error-props="{ onError: false }" v-model="query.ageBandId" />
                </div>

                <!-- Chips de filtros activos -->
                <div class="flex flex-wrap gap-2 mt-4">
                    <span
                        class="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                        {{ query.range.start }} – {{ query.range.end }}
                    </span>
                    <span v-if="query.gender"
                        class="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs bg-info/10 text-info border border-info/20">
                        Género: {{ query.gender }}
                        <button class="ml-1" @click="query.gender = ''" aria-label="Quitar género">✕</button>
                    </span>
                    <span v-if="query.exactAge !== null"
                        class="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs bg-success/10 text-success border border-success/20">
                        Edad: {{ query.exactAge }}
                        <button class="ml-1" @click="query.exactAge = null" aria-label="Quitar edad">✕</button>
                    </span>
                    <span v-if="query.ageBandId"
                        class="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs bg-warning/10 text-warning border border-warning/20">
                        Rango: {{ query.ageBandId }}
                        <button class="ml-1" @click="query.ageBandId = ''" aria-label="Quitar rango">✕</button>
                    </span>
                    <button
                        class="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs bg-gray-100 text-gray-600 border border-gray-200 hover:bg-gray-200"
                        @click="resetFilters">
                        Limpiar filtros
                    </button>
                </div>
            </div>
        </div>

        <!-- Stats Content -->
        <div class="p-4 space-y-4">
            <!-- Resumen Textual -->
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

            <!-- Total Visits Card -->
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
                            <p class="text-3xl font-bold text-primary mt-1">{{ stats.total }}</p>
                        </div>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-500">
                        <span class="icon-[lucide--calendar] text-base"></span>
                        <span class="hidden sm:inline">{{ query.range.start }} - {{ query.range.end }}</span>
                    </div>
                </div>
            </div>

            <!-- Charts Grid -->
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
                        <AppChart :type="genderChartType" :data="genderChartData" :options="genderChartOptions"
                            :plugins="[valueLabelPlugin]" :width="chartDimensions.width"
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
                    <div class="w-full max-w-full overflow-hidden" :style="{ height: chartDimensions.height + 'px' }">
                        <AppChart :type="ageBandChartType" :data="ageBandChartData" :options="ageBandChartOptions"
                            :plugins="[valueLabelPlugin]" :width="chartDimensions.width"
                            :height="chartDimensions.height" :responsive="true" />
                    </div>
                </div>
            </div>

            <!-- Time Series Chart (Full Width) -->
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
                    <AppChart :type="timeSeriesChartType" :data="timeSeriesChartData" :options="timeSeriesChartOptions"
                        :width="timeSeriesChartDimensions.width" :height="timeSeriesChartDimensions.height"
                        :responsive="true" />
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Encabezado para impresión */
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

    /* Asegurar que los charts se muestren completos en impresión */
    .chart-section {
        page-break-inside: avoid;
        break-inside: avoid;
    }

    /* Forzar tamaño estable del contenedor del canvas para evitar desbordes */
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

    /* Ocultar elementos interactivos en impresión */
    .no-print {
        display: none !important;
    }

    /* Asegurar que las secciones no se corten */
    .chart-section {
        page-break-inside: avoid;
        margin-bottom: 1rem;
    }

    /* Grid específico para impresión */
    .print-grid {
        display: block !important;
    }

    .print-grid>div {
        margin-bottom: 1.5rem;
        page-break-inside: avoid;
    }
}
</style>