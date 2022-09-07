import BN from 'bn.js'
import { FC, useRef, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { NumberFormat } from '@/components/NumberFormat'
import { Button } from '@/components/_buttons/Button'
import { SvgActionDislikeOutline, SvgActionLikeOutline } from '@/components/_icons'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { PopoverImperativeHandle } from '@/components/_overlays/Popover'
import { VideoReaction } from '@/joystream-lib/types'
import { cVar, transitions } from '@/styles'

import {
  LoadingWrapper,
  ReactionSteppperState,
  ReactionsCounter,
  StyledSvgActionDislikeSolid,
  StyledSvgActionLikeSolid,
} from './ReactionButton.styles'

import { ReactionsOnboardingPopover } from '../../ReactionsOnboardingPopover'

type ReactionButtonProps = {
  reactionsNumber?: number
  onReact: (reaction: VideoReaction) => Promise<boolean>
  state: ReactionSteppperState
  type: VideoReaction
  fee?: BN
  onPopoverShow?: () => Promise<void>
  onPopoverHide?: () => void
  isPopoverOpen?: boolean
  reactionPopoverDismissed?: boolean
}

export const ReactionButton: FC<ReactionButtonProps> = ({
  reactionsNumber,
  state,
  type,
  fee,
  isPopoverOpen,
  onReact,
  onPopoverHide,
  onPopoverShow,
  reactionPopoverDismissed = false,
}) => {
  const [shouldRunAnimation, setShouldRunAnimation] = useState(false)
  const popoverRef = useRef<PopoverImperativeHandle>(null)

  const isLoading = state === 'loading'
  const isProcessing = state === 'processing' || isPopoverOpen

  const isReacted = type === 'like' ? state === 'liked' : state === 'disliked'

  const renderSolidIcon = () => {
    if (type === 'like') {
      return <StyledSvgActionLikeSolid shouldRunAnimation={shouldRunAnimation} />
    } else {
      return <StyledSvgActionDislikeSolid shouldRunAnimation={shouldRunAnimation} />
    }
  }
  const renderOutlineIcon = () => {
    if (type === 'like') {
      return <SvgActionLikeOutline />
    } else {
      return <SvgActionDislikeOutline />
    }
  }

  const handleReact = async (reactionPopoverDismissed: boolean) => {
    if (!reactionPopoverDismissed) {
      await onPopoverShow?.()
      popoverRef.current?.show()
    } else {
      if (onReact) {
        const reacted = await onReact(type)
        if (reacted) {
          setShouldRunAnimation(true)
        }
      }
    }
  }

  return (
    <SwitchTransition>
      <CSSTransition
        key={isLoading?.toString()}
        classNames={transitions.names.fade}
        timeout={parseInt(cVar('animationTimingFast', true))}
      >
        {isLoading ? (
          <ReactionButtonLoader />
        ) : (
          <ReactionsOnboardingPopover
            ref={popoverRef}
            fee={fee}
            disabled={reactionPopoverDismissed}
            onConfirm={() => {
              handleReact(true)
            }}
            onDecline={() => {
              onPopoverHide?.()
              popoverRef.current?.hide()
            }}
            trigger={
              <Button
                disabled={isProcessing}
                onClick={() => handleReact(reactionPopoverDismissed)}
                onAnimationEnd={() => setShouldRunAnimation(false)}
                variant="tertiary"
                icon={isReacted && !isProcessing ? renderSolidIcon() : renderOutlineIcon()}
              >
                <ReactionsCounter as="span" type={type} state={state} disabled={isProcessing} variant="t200-strong">
                  <NumberFormat as="span" format="short" value={reactionsNumber ?? 0} color="inherit" />
                </ReactionsCounter>
              </Button>
            }
          />
        )}
      </CSSTransition>
    </SwitchTransition>
  )
}

const ReactionButtonLoader: FC = () => {
  return (
    <LoadingWrapper>
      <SkeletonLoader rounded width={16} height={16} /> <SkeletonLoader height={20} width={32} />
    </LoadingWrapper>
  )
}
