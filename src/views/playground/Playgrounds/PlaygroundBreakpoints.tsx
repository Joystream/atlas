import React from 'react'

import { useMediaMatch } from '@/hooks/useMediaMatch'

export const PlaygroundBreakpoints: React.FC = () => {
  const smMatch = useMediaMatch('sm').toString()
  const mdMatch = useMediaMatch('md').toString()
  const lgMatch = useMediaMatch('lg').toString()
  const xlMatch = useMediaMatch('xl').toString()

  return (
    <div>
      <span>Breakpoints:</span>
      <ul>
        <li>sm: {smMatch}</li>
        <li>md: {mdMatch}</li>
        <li>lg: {lgMatch}</li>
        <li>xl: {xlMatch}</li>
      </ul>
    </div>
  )
}
