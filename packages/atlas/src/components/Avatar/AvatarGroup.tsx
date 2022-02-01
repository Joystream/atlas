import React, { Fragment, useRef, useState } from 'react'

import { AvatarProps } from './Avatar'
import {
  AvatarBackground,
  AvatarGroupContainer,
  AvatarGroupSize,
  AvatarOverlay,
  AvatarWrapper,
  StyledAvatar,
} from './AvatarGroup.styles'

import { Tooltip } from '../Tooltip'

export type AvatarGroupSingleAvatar = Omit<AvatarProps, 'size' | 'className'> & {
  tooltipText?: string
  children?: React.ReactNode
}

export type AvatarGroupProps = {
  avatars: AvatarGroupSingleAvatar[]
  size?: AvatarGroupSize
  avatarStrokeColor?: string
  clickable?: boolean
  reverse?: boolean
  loading?: boolean
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
  loading,
  reverse,
  className,
}) => {
  const [hoveredAvatarIdx, setHoveredAvatarIdx] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement | null>(null)
  return (
    <AvatarGroupContainer size={size} className={className}>
      {avatars.map((avatarProps, idx) => (
        <Fragment key={idx}>
          <AvatarWrapper
            ref={ref}
            clickable={clickable}
            onMouseEnter={() => clickable && setHoveredAvatarIdx(idx)}
            onMouseLeave={() => clickable && setHoveredAvatarIdx(null)}
            size={size}
            style={{ zIndex: hoveredAvatarIdx === idx ? avatars.length : reverse ? idx : avatars.length - idx }}
            avatarStrokeColor={avatarStrokeColor}
          >
            <AvatarBackground avatarStrokeColor={avatarStrokeColor} />
            <StyledAvatar {...avatarProps} loading={loading} size={getSizeofAvatar(size)} />
            <AvatarOverlay dimmed={hoveredAvatarIdx !== idx && hoveredAvatarIdx !== null} />
          </AvatarWrapper>
          <Tooltip
            text={avatarProps.tooltipText}
            arrowDisabled
            placement="top"
            offsetY={clickable ? 16 : 8}
            reference={ref}
          />
        </Fragment>
      ))}
    </AvatarGroupContainer>
  )
}
