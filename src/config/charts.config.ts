import { markRaw } from 'vue'
import type { ChartData, ChartOptions } from 'chart.js'
import type { Statistic } from '@/types/stats.types'

export const valueLabelPlugin = markRaw({
  id: 'valueLabelPlugin',
  afterDraw(chart: any) {
    // Only run on pie and bar charts, skip line charts to prevent loops
    const chartType = chart?.config?.type
    if (chartType !== 'pie' && chartType !== 'bar') {
      return
    }
    
    // Skip if animations are still running
    const animator = chart?._animator
    if (animator && animator._running) {
      return
    }
    
    const ctx = chart?.ctx
    // Guard against null during disposal/resize
    if (!ctx || typeof ctx.save !== 'function') {
      return
    }
    
    try {
      ctx.save()
      const datasets = Array.isArray(chart?.data?.datasets) ? chart.data.datasets : []
      
      datasets.forEach((dataset: any, i: number) => {
        let meta: any = null
        try { 
          meta = typeof chart.getDatasetMeta === 'function' ? chart.getDatasetMeta(i) : null 
        } catch (e: any) { 
          meta = null 
        }
        if (!meta || meta.hidden || !Array.isArray(meta.data)) {
          return
        }
        
        meta.data.forEach((element: any, index: number) => {
          const value = Array.isArray(dataset?.data) ? dataset.data[index] : null
          if (value == null || Number.isNaN(Number(value))) return
          if (!element || typeof element.tooltipPosition !== 'function') return
          
          let pos: any = null
          try { 
            pos = element.tooltipPosition() 
          } catch (e: any) { 
            pos = null 
          }
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
      try { 
        ctx.restore() 
      } catch (e: any) {
        // Silent fail
      }
    }
  },
})

export function getGenderChartData(stats: Statistic | null): ChartData<'pie'> {
  return {
    labels: ['Femenino', 'Masculino', 'Otro'],
    datasets: [
      {
        label: 'Por género',
        data: [
          stats?.genderDistribution.F || 0,
          stats?.genderDistribution.M || 0,
          stats?.genderDistribution.O || 0,
        ],
        backgroundColor: ['#3b82f6', '#64748b', '#0ea5e9'],
        borderColor: ['#2563eb', '#475569', '#0284c7'],
        borderWidth: 2,
      },
    ],
  }
}

export function getGenderChartOptions(): ChartOptions<'pie'> {
  return markRaw({
    responsive: true,
    maintainAspectRatio: false,
    animation: { 
      animateRotate: true, 
      animateScale: true, 
      duration: 1000,
      onComplete: function(animation: any) {
        // Force a redraw after animation completes to show value labels
        if (animation.chart) {
          animation.chart.draw()
        }
      }
    },
    layout: { padding: 10 },
    plugins: {
      legend: {
        position: 'bottom',
        labels: { padding: 15, usePointStyle: true, boxWidth: 12 },
      },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
      },
    },
  })
}

export function getAgeBandChartData(stats: Statistic | null): ChartData<'bar'> {
  return {
    labels: ['Infancia', 'Juventud', 'Adultez joven', 'Adultez media', 'Vejez'],
    datasets: [
      {
        label: 'Por rango etario',
        data: [
          stats?.ageRangeDistribution.infancia || 0,
          stats?.ageRangeDistribution.juventud || 0,
          stats?.ageRangeDistribution.adultez_joven || 0,
          stats?.ageRangeDistribution.adultez_media || 0,
          stats?.ageRangeDistribution.vejez || 0,
        ],
        backgroundColor: ['#059669', '#3b82f6', '#0ea5e9', '#f59e0b', '#dc2626'],
        borderColor: ['#047857', '#2563eb', '#0284c7', '#d97706', '#b91c1c'],
        borderWidth: 2,
        borderRadius: 4,
      },
    ],
  }
}

export function getAgeBandChartOptions(): ChartOptions<'bar'> {
  return markRaw({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1200, easing: 'easeOutQuart' },
    layout: { padding: { top: 24, bottom: 10, left: 10, right: 10 } },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f3f4f6' }, ticks: { color: '#6b7280', maxTicksLimit: 6 } },
      x: { grid: { display: false }, ticks: { color: '#6b7280', maxRotation: 0 } },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
      },
    },
  })
}

export function getTimeSeriesChartData(stats: Statistic | null): ChartData<'line'> {
  return {
    labels: (stats?.visitsByDate || []).map((p) => (p.hour != null ? `${p.hour}:00` : p.date || '')),
    datasets: [
      {
        label: 'Visitas por día',
        data: (stats?.visitsByDate || []).map((p) => p.count),
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
  }
}

export function getTimeSeriesChartOptions(): ChartOptions<'line'> {
  return markRaw({
    responsive: true,
    maintainAspectRatio: false,
    animation: { duration: 1500, easing: 'easeInOutCubic' },
    layout: { padding: { top: 10, bottom: 10, left: 10, right: 10 } },
    scales: {
      y: { beginAtZero: true, grid: { color: '#f3f4f6' }, ticks: { color: '#6b7280', maxTicksLimit: 6 } },
      x: { grid: { color: '#f3f4f6' }, ticks: { color: '#6b7280', maxRotation: 45, maxTicksLimit: 8 } },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
      },
    },
  })
}

export function getTopModulesChartData(stats: Statistic | null): ChartData<'bar'> {
  const labels = (stats?.topModules || []).map((m) => m.name)
  const data = (stats?.topModules || []).map((m) => m.visitCount)
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
      },
    ],
  }
}

export function getTopModulesChartOptions(): ChartOptions<'bar'> {
  return markRaw({
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    animation: { duration: 800, easing: 'easeOutCubic' },
    layout: { padding: { top: 10, bottom: 10, left: 10, right: 10 } },
    scales: {
      x: { beginAtZero: true, grid: { color: '#f3f4f6' }, ticks: { color: '#6b7280', maxTicksLimit: 6 } },
      y: { grid: { display: false }, ticks: { color: '#6b7280' } },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1f2937',
        titleColor: '#ffffff',
        bodyColor: '#ffffff',
        borderColor: '#374151',
        borderWidth: 1,
      },
    },
  })
}

export const topUsersColumns: { key: string; label: string; sortable?: boolean; width?: string; align?: 'left' | 'center' | 'right' }[] = [
  { key: 'userName', label: 'Usuario', sortable: true },
  { key: 'visitCount', label: 'Visitas', align: 'right', sortable: true },
]

// Duración máxima de animaciones para sincronización
export const MAX_ANIMATION_DURATION = 1500 // ms - debe ser >= a la animación más larga


