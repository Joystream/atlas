import { format, formatDistanceToNowStrict, parseISO } from 'date-fns'

export const formatDate = (date: Date) => format(date, 'd MMM yyyy')
export const formatTime = (date: Date) => format(date, 'HH:mm')
export const formatDateTime = (date: Date) => format(date, 'd MMM yyyy, HH:mm')

export const formatDateAgo = (date: Date): string => {
  return `${formatDistanceToNowStrict(date)} ago`
}

export const formatDurationShort = (duration: number, showHours?: boolean): string => {
  const MINUTES_IN_HOUR = 60
  const SECONDS_IN_HOUR = MINUTES_IN_HOUR * 60

  const normalize = (n: number) => n.toString().padStart(2, '0')

  let remaining = duration

  const hours = Math.floor(remaining / SECONDS_IN_HOUR)
  remaining = remaining % SECONDS_IN_HOUR

  const minutes = Math.floor(remaining / MINUTES_IN_HOUR)
  remaining = remaining % MINUTES_IN_HOUR

  const seconds = remaining

  if (hours || showHours) {
    return `${normalize(hours)}:${normalize(minutes)}:${normalize(seconds)}`
  }

  return `${minutes}:${normalize(seconds)}`
}

export const daysToMilliseconds = (days: number) => {
  return days * 24 * 60 * 60 * 1000
}

export const getTimeDiffInSeconds = (time: Date) => Math.max(0, Math.round((time.getTime() - Date.now()) / 1000))

export const convertDateFormat = (timestamp: Date | string) => {
  return timestamp instanceof Date ? timestamp : parseISO(timestamp)
}

export const getNextFriday = (date = new Date()) => {
  const nextDate = new Date(date)
  const currentDayOfWeek = nextDate.getDay()
  const daysToAdd = currentDayOfWeek <= 5 ? 5 - currentDayOfWeek : 7 - currentDayOfWeek + 5
  nextDate.setDate(nextDate.getDate() + daysToAdd)
  return nextDate
}
