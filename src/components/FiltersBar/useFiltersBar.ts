import { useState } from 'react'

import { VideoWhereInput } from '@/api/queries'

export type VideoLengthOptions = '0-to-4' | '4-to-10' | '10-to-9999'

export const useFiltersBar = () => {
  // filters
  const [selectedCategoryIdFilter, setSelectedCategoryIdFilter] = useState<string>()
  const [dateUploadedFilter, setDateUploadedFilter] = useState<number>()
  const [licensesFilter, setLicensesFilter] = useState<number[]>()
  const [videoLegnthFilter, setVideoLegnthFilter] = useState<VideoLengthOptions>()
  const [paidPromotionalMaterialFilter, setPaidPromotionalMaterialFilter] = useState<boolean>()
  const [matureContentRatingFilter, setMatureContentRatingFilter] = useState<boolean>()

  const [isFiltersOpen, setiIsFiltersOpen] = useState(true)
  const [videoWhereInput, setVideoWhereInput] = useState<VideoWhereInput>({})

  const canClearDateUploadedFilter = videoWhereInput?.createdAt_gte !== undefined
  const canClearVideoLegnthFilter =
    videoWhereInput?.duration_lte !== undefined || videoWhereInput?.duration_gte !== undefined
  const canClearLicensesFilter =
    videoWhereInput?.licenseId_in !== undefined && videoWhereInput?.licenseId_in?.length !== 0
  const canClearOtherFilters = !!videoWhereInput?.hasMarketing_eq || !!videoWhereInput?.isExplicit_eq
  const canClearAllFilters =
    canClearDateUploadedFilter || canClearVideoLegnthFilter || canClearLicensesFilter || canClearOtherFilters

  const clearDateUploadedFilter = () => {
    setDateUploadedFilter(undefined)
    setVideoWhereInput((value) => {
      delete value.createdAt_gte
      return value
    })
  }
  const clearVideoLegnthFilter = () => {
    setVideoLegnthFilter(undefined)
    setVideoWhereInput((value) => {
      delete value.duration_lte
      delete value.duration_gte
      return value
    })
  }
  const clearLicensesFilter = () => {
    setLicensesFilter(undefined)
    setVideoWhereInput((value) => {
      delete value.licenseId_in
      return value
    })
  }
  const clearOtherFilters = () => {
    setPaidPromotionalMaterialFilter(undefined)
    setMatureContentRatingFilter(undefined)
    setVideoWhereInput((value) => {
      delete value.isExplicit_eq
      delete value.hasMarketing_eq
      return value
    })
  }
  const clearAllFilters = () => {
    clearDateUploadedFilter()
    clearVideoLegnthFilter()
    clearLicensesFilter()
    clearOtherFilters()
  }

  return {
    videoWhereInput,
    setVideoWhereInput,
    filters: {
      selectedCategoryIdFilter,
      setSelectedCategoryIdFilter,
      isFiltersOpen,
      setiIsFiltersOpen,
      dateUploadedFilter,
      setDateUploadedFilter,
      videoLegnthFilter,
      setVideoLegnthFilter,
      paidPromotionalMaterialFilter,
      setPaidPromotionalMaterialFilter,
      matureContentRatingFilter,
      setMatureContentRatingFilter,
      licensesFilter,
      setLicensesFilter,
    },
    canClearFilters: {
      canClearAllFilters,
      canClearDateUploadedFilter,
      canClearVideoLegnthFilter,
      canClearLicensesFilter,
      canClearOtherFilters,
      clearAllFilters,
      clearDateUploadedFilter,
      clearVideoLegnthFilter,
      clearLicensesFilter,
      clearOtherFilters,
    },
  } as const
}
