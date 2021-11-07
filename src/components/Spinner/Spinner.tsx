import React from 'react'

import { SpinnerWrapper } from './Spinner.style'

export type SpinnerSize = 'large' | 'medium' | 'small'

export type SpinnerProps = {
  size?: SpinnerSize
  className?: string
}

export const Spinner: React.FC<SpinnerProps> = ({ className, size = 'medium' }) => {
  return <SpinnerWrapper className={className} size={size} />
}
