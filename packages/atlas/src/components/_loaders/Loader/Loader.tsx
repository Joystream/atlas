import styled from '@emotion/styled'
import { FC } from 'react'
import Lottie from 'react-lottie-player'

import loaderLargeAnimation from '@/assets/animations/loader-L.json'
import loaderMediumAnimation from '@/assets/animations/loader-M.json'
import loaderSmallAnimation from '@/assets/animations/loader-S.json'
import LoaderXSmallAnimation from '@/assets/animations/loader-XS.json'
import loaderPlayerAnimation from '@/assets/animations/loader-player.json'

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
  xlarge: { data: loaderLargeAnimation, size: 216 },
  large: { data: loaderLargeAnimation, size: 108 },
  compact: { data: loaderLargeAnimation, size: 60 },
  medium: { data: loaderMediumAnimation, size: 36 },
  small: { data: loaderSmallAnimation, size: 24 },
  xsmall: { data: LoaderXSmallAnimation, size: 16 },
  player: { data: loaderPlayerAnimation, size: 72 },
}

export const Loader: FC<LoaderProps> = ({ variant = 'medium', className }) => {
  const config = VARIANT_TO_CONFIG[variant]
  return <StyledLottie play animationData={config.data} size={config.size} className={className} />
}

const StyledLottie = styled(Lottie, {
  shouldForwardProp: (prop) => prop !== 'size',
})<{ size: number }>`
  width: ${({ size }) => `${size}px`};
  height: ${({ size }) => `${size}px`};
`
