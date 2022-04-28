import Tippy from '@tippyjs/react/headless'
import React, { useState } from 'react'

import { Button } from '@/components/_buttons/Button'
import { SvgActionPlaceholder } from '@/components/_icons'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  EmojiContainer,
  ReactionPopoverInnerWrapper,
  ReactionPopoverWrapper,
  StyledEmojiButton,
} from './ReactionPopover.styles'

import { REACTION_TYPE, ReactionType } from '../ReactionChip'

export type ReactionPopoverProps = {
  onReactionClick?: (reaction: ReactionType) => void
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

export const ReactionPopover: React.FC<ReactionPopoverProps> = ({ onReactionClick, disabled }) => {
  const [isOpen, setIsOpen] = useState(false)
  const smMatch = useMediaMatch('sm')
  const reactions = Object.entries(REACTION_TYPE).map(([key, value]) => ({
    name: key as ReactionType,
    value,
  }))

  const handleReactionClick = (reaction: ReactionType) => {
    onReactionClick?.(reaction)
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
            {reactions.map(({ name, value }, idx) => {
              return (
                <StyledEmojiButton
                  verticalTranslate={getTranslateNumber(idx)}
                  isVisible={isOpen}
                  onClick={() => {
                    handleReactionClick(name)
                    instance?.hide()
                  }}
                  variant="tertiary"
                  size={smMatch ? 'small' : 'medium'}
                  iconOnly
                  icon={<EmojiContainer>{value}</EmojiContainer>}
                  key={name}
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
      <Button variant="tertiary" size="small" iconOnly icon={<SvgActionPlaceholder />} disabled={disabled} />
    </Tippy>
  )
}
