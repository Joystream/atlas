import React from 'react'
import { SpinnerWrapper } from './Spinner.style'

const Spinner: React.FC<{ className?: string }> = ({ className }) => {
  return <SpinnerWrapper className={className} />
}

export default Spinner
