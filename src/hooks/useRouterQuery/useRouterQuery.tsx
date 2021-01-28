import { useLocation } from 'react-router-dom'

export const useRouterQuery = (queryParam: string) => {
  const search = new URLSearchParams(useLocation().search)
  return search.get(queryParam)
}
