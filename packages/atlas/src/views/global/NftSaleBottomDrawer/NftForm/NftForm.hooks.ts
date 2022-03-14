import { differenceInMilliseconds, intervalToDuration } from 'date-fns'
import { useCallback, useState } from 'react'

import { AuctionDatePickerValue } from '@/components/_inputs/AuctionDatePicker'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { pluralizeNoun } from '@/utils/misc'
import { daysToMilliseconds } from '@/utils/time'

import { Listing } from './NftForm.types'

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

    const parsedDays = days ? pluralizeNoun(days, 'Day') : ''
    const parsedHours = hours !== undefined ? (hours >= 1 ? pluralizeNoun(hours, 'Hour') : 'Less than an hour') : ''
    return `${parsedDays} ${parsedHours}`
  }

  const nextStep = useCallback(() => setCurrentStep((step) => step + 1), [])
  const previousStep = useCallback(() => setCurrentStep((step) => step - 1), [])

  const getNumberOfBlocksAndDaysLeft = (startDate: AuctionDatePickerValue, endDate: AuctionDatePickerValue) => {
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
    if (typeof endDate === 'string' && endDate === 'initial') {
      return {
        blocks: 0,
        daysAndHoursText: 'No expiration date',
      }
    }
    if (typeof endDate === 'number') {
      return {
        blocks: convertDurationToBlocks(daysToMilliseconds(endDate)),
        daysAndHoursText: pluralizeNoun(endDate, 'day'),
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
