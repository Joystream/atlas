import { useLocation } from '@reach/router'

export const useRouterQuery = (queryParam: string) => {
  const search = new URLSearchParams(useLocation().search)
  return search.get(queryParam)
}
