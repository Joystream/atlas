import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export type UsePaginationOptions = {
  initialPerPage?: number
  initialCurrentPage?: number
  currentTab?: number
}

export const useQueryPagination = (opts?: UsePaginationOptions) => {
  const [getSearchParams, setSearchParams] = useSearchParams()
  const _perPage = +(getSearchParams.get('perPage') ?? opts?.initialPerPage ?? 10)
  const _currentPage = +(getSearchParams.get('currentPage') ?? opts?.initialCurrentPage ?? 0)
  const [perPage, setPerPage] = useState(_perPage)
  const [currentPage, setCurrentPage] = useState(_currentPage)

  useEffect(() => {
    setSearchParams({ currentPage: String(currentPage), perPage: String(perPage) }, { replace: true })
  }, [currentPage, perPage, setSearchParams])

  const resetPagination = useCallback(() => {
    setCurrentPage(opts?.initialCurrentPage ?? 0)
    setPerPage(opts?.initialCurrentPage ?? 10)
  }, [opts?.initialCurrentPage, setCurrentPage, setPerPage])

  return { currentPage, setCurrentPage, perPage, setPerPage, resetPagination }
}
