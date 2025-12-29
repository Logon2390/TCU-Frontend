import pdfMake from 'pdfmake/build/pdfmake'
import * as pdfFonts from 'pdfmake/build/vfs_fonts'
import type { TDocumentDefinitions, Content } from 'pdfmake/interfaces'
import type { Statistic, StatsPeriod } from '@/types/stats.types'

// Configurar las fuentes
if (pdfFonts && (pdfFonts as any).pdfMake) {
  pdfMake.vfs = (pdfFonts as any).pdfMake.vfs
} else if (pdfFonts) {
  pdfMake.vfs = (pdfFonts as any).default?.pdfMake?.vfs || (pdfFonts as any).vfs
}

const GENDER_MAP: Record<string, string> = {
  F: 'Femenino',
  M: 'Masculino',
  O: 'Otro',
}

const AGE_RANGE_MAP: Record<string, string> = {
  infancia: 'Infancia (0-9 años)',
  preadolescencia: 'Preadolescencia (10-12 años)',
  adolescencia: 'Adolescencia (13-17 años)',
  adultez_joven: 'Adultez joven (18-35 años)',
  adultez_media: 'Adultez (36-64 años)',
  vejez: 'Vejez (65+ años)',
}

const PERIOD_MAP: Record<StatsPeriod, string> = {
  today: 'Hoy',
  month: 'Mes',
  year: 'Año',
  custom: 'Personalizado',
}

interface PdfReportOptions {
  stats: Statistic
  period: StatsPeriod
  dateRange?: { start: string; end: string }
  appliedFilters?: {
    gender?: string
    ageRange?: string
    minAge?: number
    maxAge?: number
    userId?: number
    moduleId?: number
    moduleName?: string
  }
}

export const usePdfReport = () => {
  const formatDate = (dateString: string): string => {
    if (!dateString) return ''

    const dateParts = dateString.split('T')[0].split('-')
    if (dateParts.length === 3) {
      const year = parseInt(dateParts[0])
      const month = parseInt(dateParts[1]) - 1
      const day = parseInt(dateParts[2])
      const date = new Date(year, month, day, 12, 0, 0)

      return date.toLocaleDateString('es-ES', {
        timeZone: 'America/Costa_Rica',
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    }

    return dateString
  }

  const generatePdfReport = async (options: PdfReportOptions) => {
    const { stats, period, dateRange, appliedFilters } = options

    // Calcular datos adicionales
    const totalVisits = stats.totalVisits || 0
    const days = Math.max(1, stats.visitsByDate?.length || 1)
    const dailyAverage = (totalVisits / days).toFixed(1)

    // Género predominante
    const genderEntries = Object.entries(stats.genderDistribution)
    const maxGender = genderEntries.reduce((a, b) => (a[1] > b[1] ? a : b))
    const genderPercentage =
      totalVisits > 0 ? ((maxGender[1] / totalVisits) * 100).toFixed(1) : '0.0'

    // Rango etario predominante
    const ageEntries = Object.entries(stats.ageRangeDistribution)
    const maxAge = ageEntries.reduce((a, b) => (a[1] > b[1] ? a : b))
    const agePercentage = totalVisits > 0 ? ((maxAge[1] / totalVisits) * 100).toFixed(1) : '0.0'

    // Fecha de generación
    const now = new Date()
    const generationDate = now.toLocaleDateString('es-ES', {
      timeZone: 'America/Costa_Rica',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    // Construir el contenido del PDF
    const content: Content = [
      {
        columns: [
          {
            width: '*',
            stack: [
              {
                text: 'Centro Cívico por la Paz Pococí',
                style: 'header',
                fontSize: 18,
                bold: true,
                color: '#1e40af',
                alignment: 'center',
              },
              {
                text: 'Reporte de Estadísticas de Visitas',
                style: 'subheader',
                fontSize: 14,
                color: '#4b5563',
                alignment: 'center',
                margin: [0, 5, 0, 0] as [number, number, number, number],
              },
            ],
          },
          {
            width: 60,
            text: '',
          },
        ],
        margin: [0, 0, 0, 20] as [number, number, number, number],
      },

      {
        canvas: [
          { type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: '#e5e7eb' },
        ],
        margin: [0, 0, 0, 20],
      },

      {
        stack: [
          {
            text: 'Información del Reporte',
            style: 'sectionTitle',
            fontSize: 12,
            bold: true,
            color: '#1e40af',
            margin: [0, 0, 0, 10],
          },
          {
            ul: [
              { text: `Período: ${PERIOD_MAP[period]}`, margin: [0, 2, 0, 2] },
              dateRange
                ? {
                    text: `Rango de fechas: ${formatDate(dateRange.start)} al ${formatDate(dateRange.end)}`,
                    margin: [0, 2, 0, 2],
                  }
                : null,
              { text: `Fecha de generación: ${generationDate}`, margin: [0, 2, 0, 2] },
            ].filter(Boolean),
            margin: [0, 0, 0, 15],
          },
        ],
      },

      {
        stack: [
          {
            text: 'Resumen General',
            style: 'sectionTitle',
            fontSize: 12,
            bold: true,
            color: '#1e40af',
            margin: [0, 10, 0, 10],
          },
          {
            text: [
              { text: 'Durante este período se registraron ', fontSize: 11 },
              { text: `${totalVisits} visitas`, bold: true, color: '#1e40af', fontSize: 11 },
              { text: `, con un promedio de `, fontSize: 11 },
              { text: `${dailyAverage} visitas por día`, bold: true, fontSize: 11 },
              { text: '.', fontSize: 11 },
            ],
            margin: [0, 0, 0, 15],
          },
        ],
      },

      {
        columns: [
          {
            width: '50%',
            stack: [
              { text: 'Total de Visitas', fontSize: 10, color: '#6b7280', margin: [0, 0, 0, 5] },
              { text: totalVisits.toString(), fontSize: 24, bold: true, color: '#1e40af' },
            ],
          },
          {
            width: '50%',
            stack: [
              { text: 'Total de Usuarios', fontSize: 10, color: '#6b7280', margin: [0, 0, 0, 5] },
              { text: stats.totalUsers.toString(), fontSize: 24, bold: true, color: '#1e40af' },
            ],
          },
        ],
        margin: [0, 0, 0, 20],
      },

      {
        stack: [
          {
            text: 'Distribución por Género',
            style: 'sectionTitle',
            fontSize: 12,
            bold: true,
            color: '#1e40af',
            margin: [0, 10, 0, 10],
          },
          {
            table: {
              widths: ['*', 'auto'],
              body: [
                [
                  { text: 'Género', bold: true, fillColor: '#f3f4f6' },
                  { text: 'Visitas', bold: true, fillColor: '#f3f4f6' },
                ],
                ['Femenino', stats.genderDistribution.F.toString()],
                ['Masculino', stats.genderDistribution.M.toString()],
                ['Otro', stats.genderDistribution.O.toString()],
              ],
            },
            margin: [0, 0, 0, 10],
          },
          {
            text: [
              { text: 'Género predominante: ', fontSize: 10 },
              {
                text: `${GENDER_MAP[maxGender[0]]} con ${maxGender[1]} visitas (${genderPercentage}% del total)`,
                bold: true,
                fontSize: 10,
              },
            ],
            margin: [0, 0, 0, 15],
          },
        ],
      },

      {
        stack: [
          {
            text: 'Distribución por Rango Etario',
            style: 'sectionTitle',
            fontSize: 12,
            bold: true,
            color: '#1e40af',
            margin: [0, 10, 0, 10],
          },
          {
            table: {
              widths: ['*', 'auto'],
              body: [
                [
                  { text: 'Rango Etario', bold: true, fillColor: '#f3f4f6' },
                  { text: 'Visitas', bold: true, fillColor: '#f3f4f6' },
                ],
                ['Infancia (0-9 años)', stats.ageRangeDistribution.infancia.toString()],
                ['Preadolescencia (10-12 años)', stats.ageRangeDistribution.preadolescencia.toString()],
                ['Adolescencia (13-17 años)', stats.ageRangeDistribution.adolescencia.toString()],
                ['Adultez joven (18-35 años)', stats.ageRangeDistribution.adultez_joven.toString()],
                ['Adultez (36-64 años)', stats.ageRangeDistribution.adultez_media.toString()],
                ['Vejez (65+ años)', stats.ageRangeDistribution.vejez.toString()],
              ],
            },
            margin: [0, 0, 0, 10],
          },
          {
            text: [
              { text: 'Grupo etario predominante: ', fontSize: 10 },
              {
                text: `${AGE_RANGE_MAP[maxAge[0]]} con ${maxAge[1]} visitas (${agePercentage}% del total)`,
                bold: true,
                fontSize: 10,
              },
            ],
            margin: [0, 0, 0, 10],
          },
          {
            text: [
              { text: 'Edad promedio: ', fontSize: 10 },
              { text: `${stats.averageAge} años`, bold: true, fontSize: 10 },
            ],
            margin: [0, 0, 0, 15],
          },
        ],
      },

      stats.topModules && stats.topModules.length > 0
        ? {
            stack: [
              {
                text: 'Módulos Más Visitados',
                style: 'sectionTitle',
                fontSize: 12,
                bold: true,
                color: '#1e40af',
                margin: [0, 10, 0, 10],
              },
              {
                table: {
                  widths: ['*', 'auto'],
                  body: [
                    [
                      { text: 'Módulo', bold: true, fillColor: '#f3f4f6' },
                      { text: 'Visitas', bold: true, fillColor: '#f3f4f6' },
                    ],
                    ...stats.topModules.map((module) => [
                      module.name,
                      module.visitCount.toString(),
                    ]),
                  ],
                },
                margin: [0, 0, 0, 15],
              },
            ],
          }
        : null,

      {
        text: '___________________________________________',
        alignment: 'center',
        margin: [0, 20, 0, 10],
        color: '#e5e7eb',
      },
      {
        text: 'Centro Cívico por la Paz Pococí',
        alignment: 'center',
        fontSize: 9,
        color: '#6b7280',
      },
    ].filter(Boolean) as Content

    // Definición del documento
    const docDefinition: TDocumentDefinitions = {
      content,
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 5] as [number, number, number, number],
        },
        subheader: {
          fontSize: 14,
          margin: [0, 5, 0, 0] as [number, number, number, number],
        },
        sectionTitle: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 10] as [number, number, number, number],
        },
        logo: {
          fontSize: 24,
          bold: true,
        },
      },
      defaultStyle: {
        fontSize: 10,
        lineHeight: 1.3,
      },
      pageMargins: [40, 40, 40, 40] as [number, number, number, number],
    }

    // Generar nombre del archivo
    const periodLabel = PERIOD_MAP[period].toLowerCase()
    const dateLabel = new Date().toISOString().split('T')[0]
    const filename = `reporte-${periodLabel}-${dateLabel}.pdf`

    // Crear y descargar el PDF
    pdfMake.createPdf(docDefinition).download(filename)
  }

  return {
    generatePdfReport,
  }
}
