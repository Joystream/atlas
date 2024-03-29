import Tippy from '@tippyjs/react/headless'
import { FC, useState } from 'react'

import { EmojiWrapper } from '@/components/EmojiWrapper'
import { Button } from '@/components/_buttons/Button'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { CommentReaction } from '@/joystream-lib/types'
import { usePersonalDataStore } from '@/providers/personalData'

import {
  ReactionPopoverInnerWrapper,
  ReactionPopoverWrapper,
  StyledEmojiButton,
  StyledSvgActionPlaceholder,
} from './ReactionPopover.styles'

export type ReactionPopoverProps = {
  onReactionClick?: (reaction: CommentReaction, reactionPopoverDismissed: boolean) => void
  disabled?: boolean
}

const getTranslateNumber = (idx: number) => {
  switch (idx) {
    // last and first button
    case 0:
    case 4:
      return 8
    // second and fourth
    case 1:
    case 3:
      return 12
    // middle button
    case 2:
      return 16
    default:
      return 16
  }
}

export const ReactionPopover: FC<ReactionPopoverProps> = ({ onReactionClick, disabled }) => {
  const [isOpen, setIsOpen] = useState(false)
  const smMatch = useMediaMatch('sm')
  const reactionPopoverDismissed = usePersonalDataStore((state) => state.reactionPopoverDismissed)
  const reactions = atlasConfig.features.comments.reactions.map(({ id, emoji }) => ({
    reactionId: id,
    value: emoji,
  }))

  const handleReactionClick = (reaction: CommentReaction) => {
    onReactionClick?.(reaction, reactionPopoverDismissed)
    setIsOpen(false)
  }
  return (
    <Tippy
      disabled={disabled}
      onMount={() => setIsOpen(true)}
      onHide={() => setIsOpen(false)}
      render={(attrs, _, instance) => (
        <ReactionPopoverWrapper {...attrs}>
          <ReactionPopoverInnerWrapper isVisible={isOpen}>
            {reactions.map(({ reactionId, value }, idx) => {
              return (
                <StyledEmojiButton
                  verticalTranslate={getTranslateNumber(idx)}
                  isVisible={isOpen}
                  onClick={() => {
                    handleReactionClick(reactionId)
                    instance?.hide()
                  }}
                  variant="tertiary"
                  size={smMatch ? 'small' : 'medium'}
                  icon={<EmojiWrapper block>{value}</EmojiWrapper>}
                  key={reactionId}
                />
              )
            })}
          </ReactionPopoverInnerWrapper>
        </ReactionPopoverWrapper>
      )}
      interactive
      trigger="click"
      hideOnClick
    >
      <Button variant="tertiary" size="small" icon={<StyledSvgActionPlaceholder />} disabled={disabled} />
    </Tippy>
  )
}
