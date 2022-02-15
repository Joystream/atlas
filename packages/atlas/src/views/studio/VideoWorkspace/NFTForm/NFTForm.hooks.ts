import { intervalToDuration } from 'date-fns'

export const useNFTForm = () => {
  const getTotalDaysAndHoursText = (start: Date, end: Date) => {
    const { days, hours } = intervalToDuration({
      start,
      end,
    })
    const parsedDays = days ? `${days} ${days > 1 ? 'Days' : 'Day'}` : ''
    const parsedHours = hours ? `${hours} ${hours > 1 ? 'Hours' : 'Hour'}` : ''
    return `${parsedDays} ${parsedHours}`
  }

  return { getTotalDaysAndHoursText }
}
