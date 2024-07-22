import { useCallback, useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

export type UseQueryTableStateOptions<O extends string> = {
  initialPerPage?: number
  initialCurrentPage?: number
  currentTab?: number
  initialOrderBy?: O
}

export const useQueryTableState = <O extends string>(opts?: UseQueryTableStateOptions<O>) => {
  const [getSearchParams, setSearchParams] = useSearchParams()
  const _perPage = +(getSearchParams.get('perPage') ?? opts?.initialPerPage ?? 10)
  const _currentPage = +(getSearchParams.get('currentPage') ?? opts?.initialCurrentPage ?? 0)
  const _orderBy = (getSearchParams.get('orderBy') ?? opts?.initialOrderBy) as O
  const [perPage, setPerPage] = useState(_perPage)
  const [currentPage, setCurrentPage] = useState(_currentPage)
  const [orderBy, setOrderBy] = useState<O>(_orderBy)

  useEffect(() => {
    setSearchParams(
      {
        currentPage: String(currentPage),
        perPage: String(perPage),
        ...(orderBy ? { orderBy } : {}),
      },
      { replace: true }
    )
  }, [currentPage, perPage, setSearchParams, orderBy])

  const resetPagination = useCallback(() => {
    setCurrentPage(opts?.initialCurrentPage ?? 0)
    setPerPage(opts?.initialCurrentPage ?? 10)
  }, [opts?.initialCurrentPage, setCurrentPage, setPerPage])

  return { currentPage, setCurrentPage, perPage, setPerPage, resetPagination, orderBy, setOrderBy }
}
