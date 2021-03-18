import React from 'react'
import { SpinnerWrapper } from './Spinner.style'

export type SpinnerProps = {
  size?: number
  className?: string
}

const Spinner: React.FC<SpinnerProps> = ({ className, size }) => {
  return <SpinnerWrapper className={className} size={size} />
}

export default Spinner
