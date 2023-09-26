import { useMemo } from 'react'

import { TextVariant } from '@/components/Text'
import { useMediaMatch } from '@/hooks/useMediaMatch'

export const useSectionTextVariants = (): [TextVariant, TextVariant, TextVariant] => {
  const xxs = useMediaMatch('xxs')
  const xs = useMediaMatch('xs')
  const sm = useMediaMatch('sm')
  const md = useMediaMatch('md')
  const lg = useMediaMatch('lg')

  return useMemo(() => {
    switch (true) {
      case lg:
        return ['h900', 't400', 'h1100'] // [sections title, all section describtions, hero title]
      case md:
        return ['h800', 't400', 'h1000']
      case sm:
        return ['h700', 't400', 'h900']
      case xs:
        return ['h600', 't300', 'h700']
      default:
      case xxs:
        return ['h500', 't300', 'h600']
    }
  }, [lg, md, sm, xs, xxs])
}
