import { FC } from 'react'

import {
  loaderLAnimation,
  loaderMAnimation,
  loaderPlayerAnimation,
  loaderSAnimation,
  loaderXSAnimation,
} from '@/assets/animations'
import { LottiePlayer } from '@/components/LottiePlayer'

type LoaderVariant = 'xlarge' | 'large' | 'compact' | 'medium' | 'small' | 'xsmall' | 'player'
type LoaderProps = {
  variant?: LoaderVariant
  className?: string
}
type LoaderConfig = {
  data: object
  size: number
}

const VARIANT_TO_CONFIG: Record<LoaderVariant, LoaderConfig> = {
  xlarge: { data: loaderLAnimation, size: 216 },
  large: { data: loaderLAnimation, size: 108 },
  compact: { data: loaderLAnimation, size: 60 },
  medium: { data: loaderMAnimation, size: 36 },
  small: { data: loaderSAnimation, size: 24 },
  xsmall: { data: loaderXSAnimation, size: 16 },
  player: { data: loaderPlayerAnimation, size: 72 },
}

export const Loader: FC<LoaderProps> = ({ variant = 'medium', className }) => {
  const config = VARIANT_TO_CONFIG[variant]
  return <LottiePlayer data={config.data} loop size={config.size} className={className} />
}
