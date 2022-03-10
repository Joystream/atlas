import { useCallback, useState } from 'react'

import { OwnedNftWhereInput, VideoWhereInput } from '@/api/queries'

export type VideoLengthOptions = '0-to-4' | '4-to-10' | '10-to-9999'

export const useFiltersBar = () => {
  // filters
  const [dateUploadedFilter, setDateUploadedFilter] = useState<number>()
  const [videoLengthFilter, setVideoLengthFilter] = useState<VideoLengthOptions>()
  const [excludePaidPromotionalMaterialFilter, setExcludePaidPromotionalMaterialFilter] = useState<boolean>()
  const [excludeMatureContentRatingFilter, setExcludeMatureContentRatingFilter] = useState<boolean>()
  const [nftStatusFilter, setNftStatusFilter] = useState<string>()
  const [categoriesFilter, setCategoriesFilter] = useState<string[]>()
  const [language, setLanguage] = useState<string | null | undefined>('undefined')

  const [isFiltersOpen, setIsFiltersOpen] = useState(false)
  const [videoWhereInput, setVideoWhereInput] = useState<VideoWhereInput>({})
  const [ownedNftWhereInput, setOwnedNftWhereInput] = useState<OwnedNftWhereInput>({})

  const canClearDateUploadedFilter = videoWhereInput?.createdAt_gte !== undefined
  const canClearVideoLengthFilter =
    videoWhereInput?.duration_lte !== undefined || videoWhereInput?.duration_gte !== undefined
  const canClearOtherFilters = videoWhereInput?.hasMarketing_eq === false || videoWhereInput?.isExplicit_eq === false
  // TODO: this needs to be replaced after graphql nft implementation
  const canClearNftStatusFilter = !!ownedNftWhereInput?.transactionalStatus_json
  const canClearCategoriesFilter =
    (videoWhereInput?.category && videoWhereInput.category.id_in && videoWhereInput.category.id_in.length !== 0) ||
    false
  const canClearAllFilters =
    canClearDateUploadedFilter ||
    canClearVideoLengthFilter ||
    canClearOtherFilters ||
    canClearCategoriesFilter ||
    canClearNftStatusFilter

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

  const clearNftStatusFilter = () => {
    setNftStatusFilter(undefined)
    setOwnedNftWhereInput((value) => {
      delete value.transactionalStatus_json
      return value
    })
  }

  const clearCategoriesFilter = () => {
    setCategoriesFilter(undefined)
    setVideoWhereInput((value) => {
      delete value.category
      return value
    })
  }

  const clearAllFilters = useCallback(() => {
    clearDateUploadedFilter()
    clearVideoLengthFilter()
    clearCategoriesFilter()
    clearOtherFilters()
    clearCategoriesFilter()
    clearNftStatusFilter()
  }, [])

  return {
    videoWhereInput,
    ownedNftWhereInput,
    setVideoWhereInput,
    setOwnedNftWhereInput,
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
      nftStatusFilter,
      setNftStatusFilter,
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
      canClearNftStatusFilter,
      canClearCategoriesFilter,
      clearAllFilters,
      clearDateUploadedFilter,
      clearVideoLengthFilter,
      clearOtherFilters,
      clearNftStatusFilter,
      clearCategoriesFilter,
    },
  } as const
}
