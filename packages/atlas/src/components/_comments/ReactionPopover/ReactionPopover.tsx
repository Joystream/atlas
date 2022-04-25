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

import { REACTION_TYPE, ReactionChipProps } from '../ReactionChip'

export type ReactionPopoverTypes = {
  onReactionClick: () => void
  onPopoverOpen: () => void
}

const getTranslateNumber = (idx: number) => {
  switch (idx) {
    case 0:
    case 4:
      return 8
    case 1:
    case 3:
      return 12
    case 2:
      return 16
    default:
      return 16
  }
}

export const ReactionPopover: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const smMatch = useMediaMatch('sm')
  const reactions = Object.entries(REACTION_TYPE).map(([key, value]) => ({
    name: key as ReactionChipProps['reaction'],
    value,
  }))
  return (
    <Tippy
      onMount={() => setIsOpen(true)}
      onHide={() => setIsOpen(false)}
      render={(attrs) => (
        <ReactionPopoverWrapper {...attrs}>
          <ReactionPopoverInnerWrapper isVisible={isOpen}>
            {reactions.map(({ name, value }, idx) => {
              return (
                <StyledEmojiButton
                  verticalTranslate={getTranslateNumber(idx)}
                  isVisible={isOpen}
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
      <Button variant="tertiary" size="small" iconOnly icon={<SvgActionPlaceholder />} />
    </Tippy>
  )
}
