import React from 'react'
import Lottie from 'react-lottie-player'

import errorAnimation from '@/assets/animations/error.json'

type AnimatedErrorProps = {
  className?: string
}

export const AnimatedError: React.FC<AnimatedErrorProps> = ({ className }) => {
  return <Lottie play loop={false} animationData={errorAnimation} className={className} />
}
