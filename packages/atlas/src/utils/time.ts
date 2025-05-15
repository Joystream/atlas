import { format, formatDistanceToNowStrict, parseISO } from 'date-fns'

import { pluralizeNoun } from '@/utils/misc'

const MINUTES_IN_HOUR = 60
const SECONDS_IN_HOUR = MINUTES_IN_HOUR * 60

export const formatDate = (date: Date) => format(date, 'd MMM yyyy')
export const formatDateGuardarian = (date: Date) => format(date, 'dd:MM:yyyy')
export const formatTime = (date: Date) => format(date, 'HH:mm')
export const formatDateTime = (date: Date) => format(date, 'd MMM yyyy, HH:mm')
export const formatDateTimeAt = (date: Date) => format(date, "d MMM yyyy 'at' HH:mm")

export const formatDateAgo = (date: Date): string => {
  return `${formatDistanceToNowStrict(date)} ago`
}

export const formatDurationShort = (duration: number, showHours?: boolean): string => {
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

export const formatDurationBiggestTick = (duration: number): string => {
  let remaining = duration

  const hours = Math.floor(remaining / SECONDS_IN_HOUR)
  remaining = remaining % SECONDS_IN_HOUR

  const minutes = Math.floor(remaining / MINUTES_IN_HOUR)
  remaining = remaining % MINUTES_IN_HOUR

  const seconds = remaining

  if (hours >= 24) {
    const days = Math.floor(hours / 24)

    return `${pluralizeNoun(days, 'day')}`
  }

  if (hours) {
    return `${pluralizeNoun(hours, 'hour')}`
  }

  if (minutes) {
    return `${pluralizeNoun(minutes, 'minute')}`
  }

  return `${pluralizeNoun(seconds, 'second')}`
}

export const daysToMilliseconds = (days: number) => {
  return days * 24 * 60 * 60 * 1000
}

// Warning: this function will modify received date as a ref
export const addDaysToDate = (daysToAdd: number, date = new Date()) => {
  date.setDate(date.getDate() + daysToAdd)
  return date
}

export const getTimeDiffInSeconds = (time: Date) => Math.max(0, Math.round((time.getTime() - Date.now()) / 1000))

export const convertDateFormat = (timestamp: Date | string) => {
  return timestamp instanceof Date ? timestamp : parseISO(timestamp)
}

// weekday: 1 - monday, 2 - tuesday ... 7- sunday
export const getNextWeekday = (date = new Date(), weekday = 1) => {
  const nextDate = new Date(date)
  const currentDayOfWeek = nextDate.getDay()
  const daysToAdd = currentDayOfWeek <= weekday ? weekday - currentDayOfWeek : 7 - currentDayOfWeek + weekday
  nextDate.setDate(nextDate.getDate() + daysToAdd)
  return nextDate
}
