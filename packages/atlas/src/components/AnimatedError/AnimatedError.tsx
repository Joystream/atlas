import { FC } from 'react'

import errorAnimation from '@/assets/animations/error.json'
import { LottiePlayer } from '@/components/LottiePlayer'

type AnimatedErrorProps = {
  className?: string
}

export const AnimatedError: FC<AnimatedErrorProps> = ({ className }) => {
  return <LottiePlayer data={errorAnimation} className={className} />
}
