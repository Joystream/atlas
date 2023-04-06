import { FilterButtonOption, FilterButtonProps } from '@/components/FilterButton'

export type SectionFilter = Omit<FilterButtonProps, 'onChange'>
export type AppliedFilters<T extends string = string> = Record<T, FilterButtonOption[]>

export const createFiltersObject = (filters: SectionFilter[]): AppliedFilters => {
  return filters.reduce<AppliedFilters>((prev, current) => {
    return { ...prev, [current.name]: current.options || [] }
  }, {})
}
