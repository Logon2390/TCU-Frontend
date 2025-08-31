<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, markRaw } from 'vue'
import AppButton from '@/components/common/AppButton.vue'
import AppChart from '@/components/common/AppChart.vue'
import AppTooltip from '@/components/common/AppTooltip.vue'
import AppInput from '@/components/common/AppInput.vue'
import AppSelect from '@/components/common/AppSelect.vue'
import type { ChartData, ChartOptions, ChartType } from 'chart.js'
import {
    valueLabelPlugin,
    getGenderChartData,
    getGenderChartOptions,
    getAgeBandChartData,
    getAgeBandChartOptions,
    getTimeSeriesChartData,
    getTimeSeriesChartOptions,
    getTopModulesChartData,
    getTopModulesChartOptions,
    topUsersColumns,
} from '@/config/charts.config'
import { statsService } from '@/service/Stats.service'
import type { StatsPeriod, Statistic } from '@/types/stats.types'
import { GENDER_OPTIONS } from '@/types/form.types'
import useFetching from '@/composables/useFetching'
import AppLoader from '@/components/features/AppLoader.vue'
import AppTable from '@/components/common/AppTable.vue'
import modulesService from '@/service/Modules.service'
import { useModal } from '@/composables/useModal'

const modal = useModal()
const selectedPeriod = ref<StatsPeriod | 'custom'>('today')
const isPeriodChanging = ref(false)
const lastPeriodChangeTime = ref(0)
const { isLoading, error, data, execute } = useFetching(statsService.getStatsByPeriod)
const { error: modulesError, data: modulesData, execute: executeModules } = useFetching(modulesService.getModules)
const { isLoading: isCustomLoading, error: customError, data: customApiData, execute: executeCustom, reset: resetCustom } = useFetching(statsService.getCustomStats)
const periodCache = ref<Record<'today' | 'month' | 'year' | 'custom', Statistic | null>>({ today: null, month: null, year: null, custom: null })

const stats = computed<Statistic | null>(() => {
    const custom = customApiData.value ? (customApiData.value as any).data : null
    if (custom) return custom
    return periodCache.value[selectedPeriod.value] || (data.value ? (data.value as any).data : null)
})
const isFirstLoad = ref(true)
const windowWidth = ref(window.innerWidth)
const windowHeight = ref(window.innerHeight)

// Custom report form state
const startDate = ref<string>('')
const endDate = ref<string>('')
const gender = ref<string>('')
const genderLabel = ref<string>('')
const moduleLabel = ref<string>('')
const minAge = ref<string>('')
const maxAge = ref<string>('')
const userId = ref<string>('')
const ageRange = ref<string>('')
const ageRangeLabel = ref<string>('')
const moduleId = ref<string>('')

const AGE_BAND_LABEL_MAP: Record<string, string> = {
    infancia: 'infancia (0-14 años)',
    juventud: 'juventud (15-24 años)',
    adultez_joven: 'adultez joven (25-44 años)',
    adultez_media: 'adultez media (45-64 años)',
    vejez: 'vejez (65+ años)'
}
const ageRangeOptions = Object.values(AGE_BAND_LABEL_MAP)

const onGenderChange = (e: Event) => {
    const selectedLabel = (e.target as HTMLSelectElement).value
    genderLabel.value = selectedLabel
    gender.value = (GENDER_OPTIONS.find(option => option.label === selectedLabel)?.value || '')
}
const onAgeRangeChange = (e: Event) => {
    const selectedLabel = (e.target as HTMLSelectElement).value
    ageRangeLabel.value = selectedLabel
    ageRange.value = (Object.entries(AGE_BAND_LABEL_MAP).find(([key, label]) => label === selectedLabel)?.[0] || '')
}

const onModuleChange = (event: Event) => {
    const moduleName = (event.target as HTMLSelectElement).value
    moduleLabel.value = moduleName
    const selectedModule = modulesData.value?.data.find(module => module.name === moduleName)
    moduleId.value = selectedModule?.id.toString() || ''
}

const onNumberChange = (event: Event) => {
    const age = Number((event.target as HTMLInputElement).value)

    switch ((event.target as HTMLInputElement).id) {
        case 'minAge':
            minAge.value = age > 0 ? age : "" as any
            break
        case 'maxAge':
            maxAge.value = age > 0 ? age : "" as any
            break

        case 'userId':
            userId.value = age > 0 ? age : "" as any
            break
    }
}

const mapPeriodToLabel = (period: StatsPeriod) => {
    switch (period) {
        case 'today':
            return 'Hoy'
        case 'month':
            return 'Mes'
        case 'year':
            return 'Año'
        case 'custom':
            return 'Período personalizado'
    }
}

const clearCustomResults = () => {
    resetCustom()
}

const validateForm = (): boolean => {
    if (!startDate.value || !endDate.value) {
        modal.showToast('error', 'Seleccione fecha de inicio y fin.')
        return false
    }
    const sd = new Date(startDate.value)
    const ed = new Date(endDate.value)
    if (sd > ed) {
        modal.showToast('error', 'La fecha de inicio no puede ser mayor a la fecha fin.')
        return false
    }
    return true
}

const handleGenerateReport = async () => {
    if (!validateForm()) return
    const payload: any = {
        startDate: startDate.value,
        endDate: endDate.value,
    }
    if (gender.value) payload.gender = gender.value
    if (ageRange.value) payload.ageRange = ageRange.value
    if (minAge.value) payload.minAge = Number(minAge.value)
    if (maxAge.value) payload.maxAge = Number(maxAge.value)
    if (userId.value) payload.userId = Number(userId.value)
    if (moduleId.value) payload.moduleId = Number(moduleId.value)

    await executeCustom(payload)

    if (customError) {
        modal.showToast('error', 'Error al generar el reporte')
    } else {
        selectedPeriod.value = 'custom'
        const payloadData = (customApiData.value as any)?.data as Statistic | undefined
        if (payloadData) {
            periodCache.value.custom = payloadData
        }
    }
}

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

const genderChartType: ChartType = 'pie'
const genderChartData = computed<ChartData<'pie'>>(() => {
    return getGenderChartData(stats.value)
})
const genderChartOptions = computed<ChartOptions<'pie'>>(() => getGenderChartOptions())
const chartPlugins = markRaw([valueLabelPlugin])

const ageBandChartType: ChartType = 'bar'
const ageBandChartData = computed<ChartData<'bar'>>(() => {
    return getAgeBandChartData(stats.value)
})
const ageBandChartOptions = computed<ChartOptions<'bar'>>(() => getAgeBandChartOptions())

const timeSeriesChartType: ChartType = 'line'
const timeSeriesChartData = computed<ChartData<'line'>>(() => {
    return getTimeSeriesChartData(stats.value)
})
const timeSeriesChartOptions = computed<ChartOptions<'line'>>(() => getTimeSeriesChartOptions())

const topModulesChartType: ChartType = 'bar'
const topModulesChartData = computed<ChartData<'bar'>>(() => {
    return getTopModulesChartData(stats.value)
})
const topModulesChartOptions = computed<ChartOptions<'bar'>>(() => getTopModulesChartOptions())

const topUsersData = computed(() => (stats.value?.topUsers || []))

const handlePrint = () => {
    setTimeout(() => {
        window.print()
    }, 100)
}

const setPeriod = async (type: StatsPeriod) => {
    // Prevenir cambios múltiples rápidos con debounce
    const now = Date.now()
    if (isPeriodChanging.value || (now - lastPeriodChangeTime.value) < 200) {
        return
    }
    lastPeriodChangeTime.value = now

    if (periodCache.value[type]) {
        // Agregar un pequeño delay incluso para datos cacheados para dar tiempo a Chart.js
        isPeriodChanging.value = true
        await new Promise(resolve => setTimeout(resolve, 100))
        selectedPeriod.value = type
        await new Promise(resolve => setTimeout(resolve, 50)) // Delay adicional después del cambio
        isPeriodChanging.value = false
        return
    }

    isPeriodChanging.value = true
    try {
        const resp = await execute(type)
        const payload = (resp as any)?.data as Statistic | undefined
        if (payload) {
            periodCache.value[type] = payload
            // Solo cambiar el período DESPUÉS de que los datos estén listos
            selectedPeriod.value = type
        }
    } catch (error) {
        // Silent error handling
    } finally {
        isPeriodChanging.value = false
    }
}

onMounted(async () => {
    // load modules select
    if (!modulesData.value) {
        await executeModules()
    }
    if (!periodCache.value[selectedPeriod.value]) {
        const resp = await execute(selectedPeriod.value)
        const payload = (resp as any)?.data as Statistic | undefined
        if (payload) {
            periodCache.value[selectedPeriod.value] = payload
        }
    }
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
                    <AppButton
                        :button-props="{ variant: 'secondary', text: 'Hoy', onClick: () => { clearCustomResults(); setPeriod('today') }, disabled: isPeriodChanging || selectedPeriod === 'today' }"
                        customStyle="w-1/4 md:w-full text-xs sm:text-base" />
                    <AppButton
                        :button-props="{ variant: 'secondary', text: 'Mes', onClick: () => { clearCustomResults(); setPeriod('month') }, disabled: isPeriodChanging || selectedPeriod === 'month' }"
                        customStyle="w-1/4 md:w-full text-xs sm:text-base" />
                    <AppButton
                        :button-props="{ variant: 'secondary', text: 'Año', onClick: () => { clearCustomResults(); setPeriod('year') }, disabled: isPeriodChanging || selectedPeriod === 'year' }"
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
                    <span>Seleccionado: <strong>{{ mapPeriodToLabel(selectedPeriod) }}</strong></span>
                    <span v-if="periodDateRange"
                        class="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-full text-xs bg-primary/10 text-primary border border-primary/20">
                        {{ new Date(periodDateRange.start || '').toLocaleDateString('es-ES') }} – {{
                            new Date(periodDateRange.end || '').toLocaleDateString('es-ES') }}
                    </span>
                    <span v-if="!isFirstLoad && (isLoading || isPeriodChanging)"
                        class="text-gray-500">Actualizando…</span>
                    <span v-if="error" class="text-error">Ocurrió un error al cargar.</span>
                </div>
            </div>
            <div class="bg-white rounded-lg border border-secondary p-4">
                <div class="flex items-center gap-2 mb-2">
                    <span class="icon-[lucide--filter] text-lg text-primary"></span>
                    <h2 class="text-lg font-medium text-text-primary">Reporte personalizado</h2>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <AppInput v-model="startDate"
                        :label-props="{ id: 'startDate', label: 'Fecha inicio', icon: 'icon-[lucide--calendar]' }"
                        :input-props="{ type: 'date', placeholder: 'YYYY-MM-DD' }" />
                    <AppInput v-model="endDate"
                        :label-props="{ id: 'endDate', label: 'Fecha fin', icon: 'icon-[lucide--calendar]' }"
                        :input-props="{ type: 'date', placeholder: 'YYYY-MM-DD' }" />
                    <AppSelect v-model="genderLabel" :label-props="{ id: 'gender', label: 'Género' }"
                        :select-props="{ options: GENDER_OPTIONS.map(option => option.label), placeholder: 'Todos', onChange: onGenderChange }" />
                    <AppSelect v-model="ageRangeLabel" :label-props="{ id: 'ageRange', label: 'Rango etario' }"
                        :select-props="{ options: ageRangeOptions, placeholder: 'Todos', onChange: onAgeRangeChange }" />
                    <AppInput v-model="minAge"
                        :label-props="{ id: 'minAge', label: 'Edad mínima', icon: 'icon-[lucide--gauge]' }"
                        :input-props="{ type: 'number', placeholder: 'Ej. 18' }" :min="0" :onChange="onNumberChange" />
                    <AppInput v-model="maxAge"
                        :label-props="{ id: 'maxAge', label: 'Edad máxima', icon: 'icon-[lucide--gauge]' }"
                        :input-props="{ type: 'number', placeholder: 'Ej. 99' }" :min="0" :onChange="onNumberChange" />
                    <AppInput v-model="userId"
                        :label-props="{ id: 'userId', label: 'Usuario ID', icon: 'icon-[lucide--user]' }"
                        :input-props="{ type: 'number', placeholder: 'Opcional' }" :min="0"
                        :onChange="onNumberChange" />
                    <AppSelect v-model="moduleLabel"
                        :label-props="{ id: 'moduleId', label: 'Módulo', icon: 'icon-[lucide--component]' }"
                        :select-props="{ options: modulesData?.data.map(module => module.name) || [], placeholder: 'Todos', onChange: onModuleChange }"
                        :error-props="{ onError: modulesError, message: 'Error al cargar los módulos' }" />
                </div>
                <div class="flex flex-col sm:flex-row sm:items-center gap-3 mt-4">
                    <AppButton
                        :button-props="{ variant: 'primary', text: isCustomLoading ? 'Generando…' : 'Generar reporte', icon: isCustomLoading ? undefined : 'icon-[lucide--file-bar-chart] text-white', onClick: handleGenerateReport, disabled: isCustomLoading }" />
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
                        <span class="hidden sm:inline">{{ new Date(periodDateRange?.start ||
                            '').toLocaleDateString('es-ES') }} - {{ new Date(periodDateRange?.end ||
                                '').toLocaleDateString('es-ES') }}
                        </span>
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
                        <AppChart
                            v-if="!isPeriodChanging && stats && Array.isArray(genderChartData?.datasets) && (genderChartData.datasets[0]?.data?.length || 0) > 0"
                            :key="`gender-${selectedPeriod}-${stats?.totalVisits || 0}`" :type="genderChartType"
                            :data="genderChartData" :options="genderChartOptions" :plugins="chartPlugins"
                            :width="chartDimensions.width" :height="chartDimensions.height" :responsive="true" />
                        <div v-else-if="isPeriodChanging" class="flex items-center justify-center h-full">
                            <AppLoader message="Cargando datos..." />
                        </div>
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
                        <AppChart
                            v-if="!isPeriodChanging && stats && Array.isArray(ageBandChartData?.datasets) && (ageBandChartData.datasets[0]?.data?.length || 0) > 0"
                            :key="`ageband-${selectedPeriod}-${stats?.totalVisits || 0}`" :type="ageBandChartType"
                            :data="ageBandChartData" :options="ageBandChartOptions" :plugins="chartPlugins"
                            :width="chartDimensions.width" :height="chartDimensions.height + 60" :responsive="true" />
                        <div v-else-if="isPeriodChanging" class="flex items-center justify-center h-full">
                            <AppLoader message="Cargando datos..." />
                        </div>
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
                    <AppChart
                        v-if="!isPeriodChanging && stats && Array.isArray(timeSeriesChartData?.datasets) && (timeSeriesChartData.datasets[0]?.data?.length || 0) > 0"
                        :key="`timeseries-${selectedPeriod}-${stats?.visitsByDate?.length || 0}`"
                        :type="timeSeriesChartType" :data="timeSeriesChartData" :options="timeSeriesChartOptions"
                        :width="timeSeriesChartDimensions.width" :height="timeSeriesChartDimensions.height"
                        :responsive="true" />
                    <div v-else-if="isPeriodChanging" class="flex items-center justify-center h-full">
                        <AppLoader message="Cargando datos..." />
                    </div>
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
                    <AppChart
                        v-if="!isPeriodChanging && stats && Array.isArray(topModulesChartData?.datasets) && (topModulesChartData.datasets[0]?.data?.length || 0) > 0"
                        :key="`topmodules-${selectedPeriod}-${stats?.topModules?.length || 0}`"
                        :type="topModulesChartType" :data="topModulesChartData" :options="topModulesChartOptions"
                        :width="chartDimensions.width" :height="chartDimensions.height" :responsive="true" />
                    <div v-else-if="isPeriodChanging" class="flex items-center justify-center h-full">
                        <AppLoader message="Cargando datos..." />
                    </div>
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