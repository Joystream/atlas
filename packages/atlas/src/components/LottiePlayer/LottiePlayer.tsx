import { Player } from '@lottiefiles/react-lottie-player'
import { FC } from 'react'

type LottiePlayerProps = {
  data: object
  play?: boolean
  size?: number
  loop?: boolean
  onComplete?: () => void
  className?: string
}

export const LottiePlayer: FC<LottiePlayerProps> = ({ play = true, data, size, loop, onComplete, className }) => {
  return (
    <Player
      autoplay={play}
      loop={loop}
      src={data}
      style={size ? { width: size, height: size } : {}}
      onEvent={(e) => (e === 'complete' ? onComplete?.() : null)}
      className={className}
    />
  )
}
