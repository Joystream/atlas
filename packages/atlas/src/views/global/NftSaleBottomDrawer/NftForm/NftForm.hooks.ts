import { differenceInMilliseconds, intervalToDuration } from 'date-fns'
import { useCallback, useState } from 'react'

import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { daysToMilliseconds } from '@/utils/time'

import { AuctionDuration, EndDate, Listing, StartDate } from './NftForm.types'

export const useNftForm = () => {
  const [activeInputs, setActiveInputs] = useState<string[]>([])
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [listingType, setListingType] = useState<Listing>('Auction')
  const [currentStep, setCurrentStep] = useState(0)

  const { convertDurationToBlocks } = useBlockTimeEstimation()

  const getTotalDaysAndHoursText = (start: Date, end: Date) => {
    const { days, hours } = intervalToDuration({
      start,
      end,
    })
    const parsedDays = days ? `${days} ${days > 1 ? 'Days' : 'Day'}` : ''
    const parsedHours = hours ? `${hours} ${hours > 1 ? 'Hours' : 'Hour'}` : ''
    return `${parsedDays} ${parsedHours}`
  }

  const nextStep = useCallback(() => setCurrentStep((step) => step + 1), [])
  const previousStep = useCallback(() => setCurrentStep((step) => step - 1), [])
  const getNumberOfBlocksAndDaysLeft = (startDate: StartDate, endDate: EndDate) => {
    const isStartDateAndEndDateValid = startDate instanceof Date && endDate instanceof Date
    const now = new Date(Date.now())

    if (isStartDateAndEndDateValid) {
      return {
        blocks: convertDurationToBlocks(differenceInMilliseconds(endDate, startDate)),
        daysAndHoursText: getTotalDaysAndHoursText(startDate, endDate),
      }
    }
    if (endDate instanceof Date) {
      return {
        blocks: convertDurationToBlocks(differenceInMilliseconds(endDate, now)),
        daysAndHoursText: getTotalDaysAndHoursText(endDate, now),
      }
    }
    switch (endDate) {
      case AuctionDuration.NoExpiration:
        return
      case AuctionDuration.OneDay:
      case AuctionDuration.ThreeDays:
      case AuctionDuration.FiveDays:
      case AuctionDuration.SevenDays: {
        const numberOfDays = Number(endDate.replace(/[^0-9]/g, ''))
        return {
          blocks: convertDurationToBlocks(daysToMilliseconds(numberOfDays)),
          daysAndHoursText: numberOfDays ? `${numberOfDays} ${numberOfDays > 1 ? 'Days' : 'Day'}` : '',
        }
      }
    }
  }

  return {
    getTotalDaysAndHoursText,
    getNumberOfBlocksAndDaysLeft,
    state: {
      activeInputs,
      setActiveInputs,
      termsAccepted,
      setTermsAccepted,
      listingType,
      setListingType,
      currentStep,
      nextStep,
      previousStep,
    },
  }
}
