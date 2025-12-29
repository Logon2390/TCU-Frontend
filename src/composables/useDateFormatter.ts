export const useDateFormatter = () => {
  const LOCALE = 'es-ES'
  const TIMEZONE = 'America/Costa_Rica'

  const formatDate = (dateString: string | Date, options?: Intl.DateTimeFormatOptions): string => {
    if (!dateString) return ''

    const date = new Date(dateString)

    return date.toLocaleDateString(LOCALE, {
      timeZone: TIMEZONE,
      ...options,
    })
  }

  const formatDateLong = (dateString: string | Date): string => {
    return formatDate(dateString, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatDateShort = (dateString: string | Date): string => {
    return formatDate(dateString)
  }

  const formatDateTime = (dateString: string | Date): string => {
    if (!dateString) return ''

    const date = new Date(dateString)

    return date.toLocaleString(LOCALE, {
      timeZone: TIMEZONE,
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatTime = (dateString: string | Date): string => {
    if (!dateString) return ''

    const date = new Date(dateString)

    return date.toLocaleTimeString(LOCALE, {
      timeZone: TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const formatCivilDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number)

    if (!year || !month || !day) return new Date()

    const date = new Date(year, month - 1, day, 12, 0, 0)
    return date
  }

  return {
    formatDate,
    formatDateLong,
    formatDateShort,
    formatDateTime,
    formatTime,
    formatCivilDate,
  }
}
