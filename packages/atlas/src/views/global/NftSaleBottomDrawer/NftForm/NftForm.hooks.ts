import { differenceInMilliseconds, formatDuration, intervalToDuration } from 'date-fns'
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

  const getTotalDaysAndHours = (startDate: AuctionDatePickerValue, endDate: AuctionDatePickerValue) => {
    const start = (startDate?.type === 'date' && startDate.date) || new Date()

    if (endDate?.type === 'date') {
      const { days, hours } = intervalToDuration({ start: start, end: endDate.date })
      const duration = formatDuration({ hours: hours, days: days }, { format: ['days', 'hours'] })
      return duration ? duration : 'Less than 1 hour'
    }
    if (endDate?.type === 'duration') {
      return pluralizeNoun(endDate.durationDays, 'Day')
    }
  }

  const nextStep = useCallback(() => setCurrentStep((step) => step + 1), [])
  const previousStep = useCallback(() => setCurrentStep((step) => step - 1), [])

  const getNumberOfBlocks = (startDate: AuctionDatePickerValue, endDate: AuctionDatePickerValue) => {
    const start = (startDate?.type === 'date' && startDate.date) || new Date()
    if (endDate?.type === 'date') {
      return convertDurationToBlocks(differenceInMilliseconds(endDate.date, start))
    }
    if (endDate?.type === 'duration') {
      return convertDurationToBlocks(daysToMilliseconds(endDate.durationDays))
    }
    if (!endDate) {
      return 0
    }
  }

  return {
    getTotalDaysAndHours,
    getNumberOfBlocks,
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
