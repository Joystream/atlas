import { get } from 'lodash'
import { FilteringArgs, GenericData, PredicateFn, SortingArgs } from '../types'

type HasCreatedAt = {
  createdAt: Date
}

export const filterAndSortGenericData = <TData extends GenericData>(
  data: TData[],
  variables: FilteringArgs & SortingArgs
): TData[] => {
  const { where } = variables
  if (!where || !data.length) {
    return data
  }

  const filterKeys = Object.keys(where)
  const predicates = filterKeys.map((key) => createPredicate(key, where[key as keyof FilteringArgs['where']], data[0]))
  const filteredData = data.filter((item) => predicates.every((p) => p(item)))
  return genericSort(filteredData, variables)
}

// let's just ignore this duplication
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const createPredicate = (key: string, value: any, testData: GenericData): PredicateFn => {
  if (key.endsWith('_eq')) {
    const field = key.replace('_eq', '')
    // support filtering by inner id field; e.g. categoryId -> category.id
    const accessKey = field.endsWith('Id') ? `${field.replace('Id', '')}.id` : field
    const testValue = get(testData, accessKey, undefined)
    if (testValue === undefined) {
      console.warn(`skipping filtering by unknown field "${accessKey}"`)
      return () => true
    }

    return (d) => {
      return get(d, accessKey) === value
    }
  } else if (key.endsWith('_in')) {
    const field = key.replace('_in', '')
    // support filtering by inner id field; e.g. categoryId -> category.id
    const accessKey = field.endsWith('Id') ? `${field.replace('Id', '')}.id` : field
    const testValue = get(testData, accessKey, undefined)
    if (testValue === undefined) {
      console.warn(`skipping filtering by unknown field "${accessKey}"`)
      return () => true
    }

    return (d) => {
      return value.includes(get(d, accessKey))
    }
  } else if (key.endsWith('_gte')) {
    const field = key.replace('_gte', '')
    // support filtering by inner id field; e.g. categoryId -> category.id
    const accessKey = field.endsWith('Id') ? `${field.replace('Id', '')}.id` : field
    const testValue = get(testData, accessKey, undefined)
    if (testValue === undefined) {
      console.warn(`skipping filtering by unknown field "${accessKey}"`)
      return () => true
    }
    if (accessKey !== 'createdAt') {
      console.warn(`skipping filtering by unsupported "_gte" field: "${key}"`)
      return () => true
    }

    return (d) => {
      const data = d as HasCreatedAt
      const createdAt = data.createdAt
      const isoCreatedAt = createdAt?.toISOString()
      return isoCreatedAt >= value
    }
  } else {
    console.warn(`skipping filtering by arbitrary filter "${key}"`)
    return () => true
  }
}

export const genericSort = <TData extends GenericData>(data: TData[], variables: SortingArgs): TData[] => {
  const { orderBy } = variables
  if (!orderBy) {
    return data
  }

  const [field, direction] = orderBy.split('_')
  if (!field || !direction) {
    console.warn(`error parsing orderBy: "${orderBy}"`)
    return data
  }

  if (field === 'createdAt') {
    const sortedData = data
      // @ts-ignore just assume there are dates on those
      .sort((d1: HasCreatedAt, d2: HasCreatedAt) => {
        const d1Iso = d1.createdAt.toISOString()
        const d2Iso = d2.createdAt.toISOString()
        return d2Iso.localeCompare(d1Iso)
      })
    if (direction === 'DESC') {
      return sortedData
    } else if (direction === 'ASC') {
      return sortedData.reverse()
    } else {
      console.warn(`unknown sort direction: "${direction}"`)
      return sortedData
    }
  } else {
    console.warn(`unsupported sorting field: "${field}"`)
    return data
  }
}
