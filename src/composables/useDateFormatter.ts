export const useDateFormatter = () => {
    const TIMEZONE = 'America/Costa_Rica'
    const LOCALE = 'es-ES'

    const formatDate = (dateString: string | Date, options?: Intl.DateTimeFormatOptions): string => {
        if (!dateString) return ''

        if (typeof dateString === 'string' && dateString.includes('-')) {
            const dateParts = dateString.split('T')[0].split('-')
            if (dateParts.length === 3) {
                const year = parseInt(dateParts[0])
                const month = parseInt(dateParts[1]) - 1
                const day = parseInt(dateParts[2])
                const date = new Date(year, month, day, 12, 0, 0)

                return date.toLocaleDateString(LOCALE, {
                    timeZone: TIMEZONE,
                    ...options
                })
            }
        }

        const date = new Date(dateString)
        return date.toLocaleDateString(LOCALE, {
            timeZone: TIMEZONE,
            ...options
        })
    }

    const formatDateLong = (dateString: string | Date): string => {
        return formatDate(dateString, {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
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
            minute: '2-digit'
        })
    }

    const formatTime = (dateString: string | Date): string => {
        if (!dateString) return ''

        const date = new Date(dateString)
        return date.toLocaleTimeString(LOCALE, {
            timeZone: TIMEZONE,
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return {
        formatDate,
        formatDateLong,
        formatDateShort,
        formatDateTime,
        formatTime
    }
}