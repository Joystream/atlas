// react-lottie-player@1.4.0 doesn't include type declarations for the light version of the player
// this file can be removed once https://github.com/mifi/react-lottie-player/issues/45 is resolved

declare module 'react-lottie-player/dist/LottiePlayerLight' {
  import type { AnimationConfig, AnimationDirection, AnimationEventCallback, AnimationSegment } from 'lottie-web'

  type LottieProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement> &
    Pick<AnimationConfig, 'loop' | 'renderer' | 'rendererSettings' | 'audioFactory'> & {
      play?: boolean
      goTo?: number
      speed?: number
      direction?: AnimationDirection
      segments?: AnimationSegment | AnimationSegment[]

      onComplete?: AnimationEventCallback
      onLoopComplete?: AnimationEventCallback
      onEnterFrame?: AnimationEventCallback
      onSegmentStart?: AnimationEventCallback
    } & ({ path?: string } | { animationData?: object })

  const Lottie: React.FC<LottieProps>

  export default Lottie
}
