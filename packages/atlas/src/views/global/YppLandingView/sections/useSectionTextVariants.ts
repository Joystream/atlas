import { useMemo } from 'react'

import { TextVariant } from '@/components/Text'
import { useMediaMatch } from '@/hooks/useMediaMatch'

export const useSectionTextVariants = (): [TextVariant, TextVariant] => {
  const xxs = useMediaMatch('xxs')
  const xs = useMediaMatch('xs')
  const sm = useMediaMatch('sm')
  const md = useMediaMatch('md')
  const lg = useMediaMatch('lg')

  return useMemo(() => {
    switch (true) {
      case lg:
        return ['h900', 't300']
      case md:
        return ['h800', 't300']
      case sm:
        return ['h700', 't300']
      case xs:
        return ['h600', 't300']
      default:
      case xxs:
        return ['h500', 't300']
    }
  }, [lg, md, sm, xs, xxs])
}
