import React, { useRef, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { Button } from '@/components/_buttons/Button'
import { SvgActionDislikeOutline, SvgActionLikeOutline } from '@/components/_icons'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { PopoverImperativeHandle } from '@/components/_overlays/Popover'
import { VideoReaction } from '@/joystream-lib'
import { cVar, transitions } from '@/styles'
import { formatNumberShort } from '@/utils/number'

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
  onReact: (reaction: VideoReaction) => void
  state: ReactionSteppperState
  type: VideoReaction
  onPopoverShow?: () => void
  onPopoverHide?: () => void
  isPopoverOpen?: boolean
  reactionPopoverDismissed?: boolean
}

export const ReactionButton: React.FC<ReactionButtonProps> = ({
  reactionsNumber,
  state,
  type,
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

  const handleReact = (reactionPopoverDismissed: boolean) => {
    if (!reactionPopoverDismissed) {
      onPopoverShow?.()
      popoverRef.current?.show()
    } else {
      setShouldRunAnimation(true)
      onReact?.(type)
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
                icon={isReacted ? renderSolidIcon() : renderOutlineIcon()}
              >
                <ReactionsCounter type={type} state={state} variant="t200-strong">
                  {formatNumberShort(reactionsNumber || 0)}
                </ReactionsCounter>
              </Button>
            }
          />
        )}
      </CSSTransition>
    </SwitchTransition>
  )
}

const ReactionButtonLoader: React.FC = () => {
  return (
    <LoadingWrapper>
      <SkeletonLoader rounded width={16} height={16} /> <SkeletonLoader height={20} width={32} />
    </LoadingWrapper>
  )
}
