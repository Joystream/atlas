import { useMediaMatch } from '@/hooks/useMediaMatch'

type VideoGridRowsVariant = 'default' | 'compact' | 'main'

const ROWS_MAPPING: Record<'xss' | 'sm' | 'md', Record<VideoGridRowsVariant, number>> = {
  md: {
    main: 4,
    default: 2,
    compact: 1,
  },
  sm: {
    main: 6,
    default: 4,
    compact: 2,
  },
  xss: {
    main: 8,
    default: 6,
    compact: 3,
  },
}

export const useVideoGridRows = (variant: VideoGridRowsVariant = 'default') => {
  const mdMatch = useMediaMatch('md')
  const smMatch = useMediaMatch('sm')

  const targetBreakpoint = mdMatch ? 'md' : smMatch ? 'sm' : 'xss'

  return ROWS_MAPPING[targetBreakpoint][variant]
}
