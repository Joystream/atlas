import { Global, css } from '@emotion/react'
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
    <>
      <Global styles={playerContainerOverrides} />
      <Player
        autoplay={play}
        loop={loop}
        keepLastFrame
        src={data}
        style={size ? { width: size, height: size } : {}}
        onEvent={(e) => (e === 'complete' ? onComplete?.() : null)}
        className={className}
      />
    </>
  )
}

const playerContainerOverrides = css`
  .lf-player-container {
    width: min-content;
  }
`
