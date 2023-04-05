import { AppliedFilters, SectionFilter } from '@/components/Section/SectionHeader/SectionFilters/SectionFilters'

export const createFiltersObject = (filters: SectionFilter[]): AppliedFilters => {
  return filters.reduce<AppliedFilters>((prev, current) => {
    return { ...prev, [current.name]: current.options || [] }
  }, {})
}
