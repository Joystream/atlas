import { FC } from 'react'

import { SpinnerSize, SpinnerWrapper } from './Spinner.styles'

export type SpinnerProps = {
  size?: SpinnerSize
  className?: string
}

export const Spinner: FC<SpinnerProps> = ({ className, size = 'medium' }) => {
  return <SpinnerWrapper className={className} size={size} />
}
