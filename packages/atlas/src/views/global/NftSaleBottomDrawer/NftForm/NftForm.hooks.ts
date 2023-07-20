import { differenceInMilliseconds } from 'date-fns'
import { useCallback, useState } from 'react'

import { AuctionDatePickerValue } from '@/components/_inputs/AuctionDatePicker'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useJoystream } from '@/providers/joystream'
import { daysToMilliseconds } from '@/utils/time'

import { Listing } from './NftForm.types'

export const useNftForm = () => {
  const [activeInputs, setActiveInputs] = useState<string[]>(['startingPrice'])
  const [listingType, setListingType] = useState<Listing>('Auction')
  const [currentStep, setCurrentStep] = useState(0)

  const nextStep = useCallback(() => setCurrentStep((step) => step + 1), [])
  const previousStep = useCallback(() => setCurrentStep((step) => step - 1), [])

  return {
    state: {
      activeInputs,
      setActiveInputs,
      listingType,
      setListingType,
      currentStep,
      nextStep,
      previousStep,
    },
  }
}

export const useNftFormUtils = () => {
  const { convertDurationToBlocks } = useBlockTimeEstimation()
  const { chainState } = useJoystream()

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

  return { getNumberOfBlocks, chainState }
}
