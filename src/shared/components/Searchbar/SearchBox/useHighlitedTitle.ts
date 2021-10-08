import { useMemo } from 'react'

import { colors } from '@/shared/theme'

export const useHighlitedTitle = (title?: string | null, query?: string) => {
  return useMemo(() => {
    if (query) {
      const regex = new RegExp(query, 'i')
      return title
        ? title.replace(
            regex,
            (match) => `<mark style="color: ${colors.gray[50]}; background-color: transparent">${match}</mark>`
          )
        : ''
    }
    return title || ''
  }, [query, title])
}
