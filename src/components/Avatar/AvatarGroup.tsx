import React, { useState } from 'react'

import { AvatarProps } from './Avatar'
import { AvatarGroupContainer, AvatarOverlay, AvatarWrapper, StyledAvatar } from './AvatarGroup.styles'

import { Tooltip } from '../Tooltip'

export type AvatarGroupProps = {
  avatars: (Omit<AvatarProps, 'size' | 'className'> & { tooltipText?: string })[]
  size?: 'bid' | 'small' | 'default'
  avatarStrokeColor?: string
  clickable?: boolean
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  avatars,
  size = 'default',
  avatarStrokeColor,
  clickable = true,
}) => {
  const [hoveredAvatarIdx, setHoveredAvatarIdx] = useState<number | null>(null)
  return (
    <AvatarGroupContainer>
      {avatars.map((avatarProps, idx) => (
        <Tooltip key={idx} text={avatarProps.tooltipText} arrowDisabled placement="top" offsetY={clickable ? 16 : 8}>
          <AvatarWrapper
            clickable={clickable}
            onMouseEnter={() => clickable && setHoveredAvatarIdx(idx)}
            onMouseLeave={() => clickable && setHoveredAvatarIdx(null)}
            idx={idx}
            size={size}
            style={{ zIndex: hoveredAvatarIdx === idx ? avatars.length : avatars.length - idx }}
          >
            <StyledAvatar size={size} avatarStrokeColor={avatarStrokeColor} {...avatarProps} />
            <AvatarOverlay dimmed={hoveredAvatarIdx !== idx && hoveredAvatarIdx !== null} />
          </AvatarWrapper>
        </Tooltip>
      ))}
    </AvatarGroupContainer>
  )
}
