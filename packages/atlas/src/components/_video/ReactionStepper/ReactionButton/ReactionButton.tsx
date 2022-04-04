import React, { useRef, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgActionDislikeOutline, SvgActionLikeOutline } from '@/components/_icons'
import { SvgThumbsUpIllustration } from '@/components/_illustrations'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { DialogPopover } from '@/components/_overlays/DialogPopover'
import { PopoverImperativeHandle } from '@/components/_overlays/Popover'
import { usePersonalDataStore } from '@/providers/personalData'
import { cVar, transitions } from '@/styles'
import { formatNumberShort } from '@/utils/number'

import {
  LoadingWrapper,
  PopoverIllustrationWrapper,
  ReactionsCounter,
  StyledSvgActionDislikeSolid,
  StyledSvgActionLikeSolid,
} from './ReactionButton.styles'

// proccessing means that there is ongoing transaction
export type ReactionSteppperState = 'liked' | 'disliked' | 'default' | 'loading' | 'processing'

type ReactionButtonProps = {
  reactionsNumber?: number
  onReact?: () => void
  state: ReactionSteppperState
  type: 'like' | 'dislike'
}

export const ReactionButton: React.FC<ReactionButtonProps> = ({ reactionsNumber, state, onReact, type }) => {
  const popoverRef = useRef<PopoverImperativeHandle>(null)
  const reactionPopoverDismissed = usePersonalDataStore((state) => state.reactionPopoverDismissed)
  const setReactionPopoverDismission = usePersonalDataStore((state) => state.actions.setReactionPopoverDismission)
  const [shouldRunAnimation, setShouldRunAnimation] = useState(false)

  const isLoading = state === 'loading'
  const isProcessing = state === 'processing'

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

  const handleReact = () => {
    if (isReacted) {
      return
    }
    setShouldRunAnimation(true)
    onReact?.()
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
          <DialogPopover
            ref={popoverRef}
            dividers
            disabled={reactionPopoverDismissed}
            // TODO add proper link here
            additionalActionsNode={<Text variant="t100-strong">Learn more</Text>}
            headerNode={
              <PopoverIllustrationWrapper>
                <SvgThumbsUpIllustration />
              </PopoverIllustrationWrapper>
            }
            popoverWidth="wide"
            primaryButton={{
              text: 'Got it',
              onClick: () => {
                handleReact()
                setReactionPopoverDismission(true)
              },
            }}
            secondaryButton={{
              text: 'Cancel',
              onClick: () => popoverRef.current?.hide(),
            }}
            trigger={
              <Button
                disabled={isProcessing}
                onClick={() => reactionPopoverDismissed && handleReact()}
                onAnimationEnd={() => setShouldRunAnimation(false)}
                variant="tertiary"
                icon={isReacted ? renderSolidIcon() : renderOutlineIcon()}
              >
                <ReactionsCounter type={type} state={state} variant="t200">
                  {formatNumberShort(reactionsNumber || 0)}
                </ReactionsCounter>
              </Button>
            }
          >
            <Text variant="h300">We save social interactions on blockchain</Text>
            <Text variant="t200" secondary margin={{ top: 2 }} as="p">
              Comments and reactions are stored on blockchain, meaning every action needs a wallet signature to take
              effect. Transaction fees apply.
            </Text>
          </DialogPopover>
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
