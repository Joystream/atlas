import React, { useState } from 'react'

import { AvatarProps } from './Avatar'
import {
  AvatarGroupContainer,
  AvatarGroupDirection,
  AvatarGroupSize,
  AvatarOverlay,
  AvatarWrapper,
  StyledAvatar,
} from './AvatarGroup.styles'

import { Tooltip } from '../Tooltip'

export type AvatarGroupProps = {
  avatars: (Omit<AvatarProps, 'size' | 'className'> & { tooltipText?: string })[]
  size?: AvatarGroupSize
  avatarStrokeColor?: string
  clickable?: boolean
  direction: AvatarGroupDirection
  className?: string
}

const getSizeofAvatar = (size: AvatarGroupSize) => {
  // converts size of avatar group to avatar size
  switch (size) {
    case 'large':
      return 'small'
    case 'medium':
      return 'default'
    case 'small':
      return 'bid'
  }
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  size = 'medium',
  avatarStrokeColor,
  clickable = true,
  direction = 'left',
  className,
}) => {
  const [hoveredAvatarIdx, setHoveredAvatarIdx] = useState<number | null>(null)
  return (
    <AvatarGroupContainer direction={direction} className={className}>
      {avatars.map((avatarProps, idx) => (
        <AvatarWrapper
          direction={direction}
          key={idx}
          clickable={clickable}
          onMouseEnter={() => clickable && setHoveredAvatarIdx(idx)}
          onMouseLeave={() => clickable && setHoveredAvatarIdx(null)}
          idx={direction === 'left' ? idx : avatars.length - idx}
          size={size}
          style={{ zIndex: hoveredAvatarIdx === idx ? avatars.length : avatars.length - idx }}
        >
          <Tooltip text={avatarProps.tooltipText} arrowDisabled placement="top" offsetY={clickable ? 16 : 8}>
            <StyledAvatar size={getSizeofAvatar(size)} avatarStrokeColor={avatarStrokeColor} {...avatarProps} />
          </Tooltip>
          <AvatarOverlay dimmed={hoveredAvatarIdx !== idx && hoveredAvatarIdx !== null} />
        </AvatarWrapper>
      ))}
    </AvatarGroupContainer>
  )
}
