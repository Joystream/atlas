import { differenceInMilliseconds, intervalToDuration } from 'date-fns'
import { useCallback, useState } from 'react'

import { SelectedAuctionOption } from '@/components/_inputs/AuctionDatePicker'
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
    const parsedHours = hours ? pluralizeNoun(hours, 'Hour') : ''
    return `${parsedDays} ${parsedHours}`
  }

  const nextStep = useCallback(() => setCurrentStep((step) => step + 1), [])
  const previousStep = useCallback(() => setCurrentStep((step) => step - 1), [])

  const getNumberOfBlocksAndDaysLeft = (startDate: SelectedAuctionOption, endDate: SelectedAuctionOption) => {
    const startDatePickedValue = startDate?.pickedValue
    const endDatePickedValue = endDate?.pickedValue

    const isStartDateAndEndDateValid = startDatePickedValue instanceof Date && endDatePickedValue instanceof Date
    const now = new Date(Date.now())

    if (isStartDateAndEndDateValid) {
      return {
        blocks: convertDurationToBlocks(differenceInMilliseconds(endDatePickedValue, startDatePickedValue)),
        daysAndHoursText: getTotalDaysAndHoursText(startDatePickedValue, endDatePickedValue),
      }
    }
    if (endDatePickedValue instanceof Date) {
      return {
        blocks: convertDurationToBlocks(differenceInMilliseconds(endDatePickedValue, now)),
        daysAndHoursText: getTotalDaysAndHoursText(endDatePickedValue, now),
      }
    }
    if (endDate?.type === 'duration') {
      if (endDate?.pickedValue === 0) {
        return {
          blocks: 0,
          daysAndHoursText: 'No expiration date',
        }
      }
      return {
        blocks: convertDurationToBlocks(daysToMilliseconds(endDate.pickedValue)),
        daysAndHoursText: pluralizeNoun(endDate.pickedValue, 'day'),
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
