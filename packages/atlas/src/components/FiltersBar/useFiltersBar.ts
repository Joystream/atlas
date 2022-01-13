import { useState } from 'react'

import { VideoWhereInput } from '@/api/queries'

export type VideoLengthOptions = '0-to-4' | '4-to-10' | '10-to-9999'

export const useFiltersBar = () => {
  // filters
  const [dateUploadedFilter, setDateUploadedFilter] = useState<number>()
  const [videoLengthFilter, setVideoLengthFilter] = useState<VideoLengthOptions>()
  const [excludePaidPromotionalMaterialFilter, setExcludePaidPromotionalMaterialFilter] = useState<boolean>()
  const [excludeMatureContentRatingFilter, setExcludeMatureContentRatingFilter] = useState<boolean>()
  const [categoriesFilter, setCategoriesFilter] = useState<string[]>()
  const [language, setLanguage] = useState<string | null | undefined>('undefined')

  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [videoWhereInput, setVideoWhereInput] = useState<VideoWhereInput>({})

  const canClearDateUploadedFilter = videoWhereInput?.createdAt_gte !== undefined
  const canClearVideoLengthFilter =
    videoWhereInput?.duration_lte !== undefined || videoWhereInput?.duration_gte !== undefined
  const canClearOtherFilters = videoWhereInput?.hasMarketing_eq === false || videoWhereInput?.isExplicit_eq === false
  const canClearCategoriesFilter =
    videoWhereInput?.categoryId_in !== undefined && videoWhereInput?.categoryId_in?.length !== 0
  const canClearAllFilters =
    canClearDateUploadedFilter || canClearVideoLengthFilter || canClearOtherFilters || canClearCategoriesFilter

  const clearDateUploadedFilter = () => {
    setDateUploadedFilter(undefined)
    setVideoWhereInput((value) => {
      delete value.createdAt_gte
      return value
    })
  }
  const clearVideoLengthFilter = () => {
    setVideoLengthFilter(undefined)
    setVideoWhereInput((value) => {
      delete value.duration_lte
      delete value.duration_gte
      return value
    })
  }
  const clearOtherFilters = () => {
    setExcludePaidPromotionalMaterialFilter(undefined)
    setExcludeMatureContentRatingFilter(undefined)
    setVideoWhereInput((value) => {
      delete value.isExplicit_eq
      delete value.hasMarketing_eq
      return value
    })
  }

  const clearCategoriesFilter = () => {
    setCategoriesFilter(undefined)
    setVideoWhereInput((value) => {
      delete value.categoryId_in
      return value
    })
  }

  const clearAllFilters = () => {
    clearDateUploadedFilter()
    clearVideoLengthFilter()
    clearCategoriesFilter()
    clearOtherFilters()
    clearCategoriesFilter()
  }

  return {
    videoWhereInput,
    setVideoWhereInput,
    filters: {
      isFiltersOpen,
      setIsFiltersOpen,
      dateUploadedFilter,
      setDateUploadedFilter,
      videoLengthFilter,
      setVideoLengthFilter,
      excludePaidPromotionalMaterialFilter,
      setExcludePaidPromotionalMaterialFilter,
      excludeMatureContentRatingFilter,
      setExcludeMatureContentRatingFilter,
      categoriesFilter,
      setCategoriesFilter,
      language,
      setLanguage,
    },
    canClearFilters: {
      canClearAllFilters,
      canClearDateUploadedFilter,
      canClearVideoLengthFilter,
      canClearOtherFilters,
      canClearCategoriesFilter,
      clearAllFilters,
      clearDateUploadedFilter,
      clearVideoLengthFilter,
      clearOtherFilters,
      clearCategoriesFilter,
    },
  } as const
}
