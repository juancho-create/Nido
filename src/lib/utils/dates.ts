import { format, differenceInDays, parseISO, isToday, isYesterday } from 'date-fns'
import { es } from 'date-fns/locale'

export function getTodayString(): string {
  return format(new Date(), 'yyyy-MM-dd')
}

export function formatDate(dateStr: string, pattern = 'd MMM yyyy'): string {
  return format(parseISO(dateStr), pattern, { locale: es })
}

export function daysSince(dateStr: string): number {
  return differenceInDays(new Date(), parseISO(dateStr))
}

export function isTodayString(dateStr: string): boolean {
  return isToday(parseISO(dateStr))
}

export function isYesterdayString(dateStr: string): boolean {
  return isYesterday(parseISO(dateStr))
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function smokeFreeDayCount(quitDate: string): number {
  return Math.max(0, differenceInDays(new Date(), parseISO(quitDate)))
}

/** Returns "hace 2 días", "ayer", "hoy" etc. */
export function relativeDay(dateStr: string): string {
  const d = parseISO(dateStr)
  if (isToday(d)) return 'hoy'
  if (isYesterday(d)) return 'ayer'
  const diff = differenceInDays(new Date(), d)
  if (diff < 7) return `hace ${diff} días`
  return formatDate(dateStr)
}
