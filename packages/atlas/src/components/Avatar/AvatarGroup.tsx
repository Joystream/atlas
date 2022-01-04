import React, { useState } from 'react'

import { AvatarProps } from './Avatar'
import { AvatarGroupContainer, AvatarGroupSize, AvatarOverlay, AvatarWrapper, StyledAvatar } from './AvatarGroup.styles'

import { Tooltip } from '../Tooltip'

export type AvatarGroupProps = {
  avatars: (Omit<AvatarProps, 'size' | 'className'> & { tooltipText?: string })[]
  size?: AvatarGroupSize
  avatarStrokeColor?: string
  clickable?: boolean
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
}) => {
  const [hoveredAvatarIdx, setHoveredAvatarIdx] = useState<number | null>(null)
  return (
    <AvatarGroupContainer>
      {avatars.map((avatarProps, idx) => (
        <AvatarWrapper
          key={idx}
          clickable={clickable}
          onMouseEnter={() => clickable && setHoveredAvatarIdx(idx)}
          onMouseLeave={() => clickable && setHoveredAvatarIdx(null)}
          idx={idx}
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
