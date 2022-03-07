import { intervalToDuration } from 'date-fns'
import { useState } from 'react'

import { Listing } from '@/views/studio/VideoWorkspace/NftForm/types'

export const useNftForm = () => {
  const [activeInputs, setActiveInputs] = useState<string[]>([])
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [listingType, setListingType] = useState<Listing>('Auction')
  const [currentStep, setCurrentStep] = useState(0)

  const getTotalDaysAndHoursText = (start: Date, end: Date) => {
    const { days, hours } = intervalToDuration({
      start,
      end,
    })
    const parsedDays = days ? `${days} ${days > 1 ? 'Days' : 'Day'}` : ''
    const parsedHours = hours ? `${hours} ${hours > 1 ? 'Hours' : 'Hour'}` : ''
    return `${parsedDays} ${parsedHours}`
  }

  return {
    getTotalDaysAndHoursText,
    state: {
      activeInputs,
      setActiveInputs,
      termsAccepted,
      setTermsAccepted,
      listingType,
      setListingType,
      currentStep,
      setCurrentStep,
    },
  }
}
