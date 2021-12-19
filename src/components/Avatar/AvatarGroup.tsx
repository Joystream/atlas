import React from 'react'

import { AvatarProps } from './Avatar'
import { AvatarGroupContainer, AvatarOverlay, AvatarWrapper, StyledAvatar } from './AvatarGroup.styles'

export type AvatarGroupProps = {
  avatars: Omit<AvatarProps, 'size' | 'className'>[]
  size: 'bid' | 'small' | 'default'
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({ avatars, size = 'default' }) => {
  return (
    <AvatarGroupContainer>
      {avatars.map((avatarProps, idx) => (
        <AvatarWrapper key={idx} idx={idx} size={size}>
          <StyledAvatar size={size} {...avatarProps} />
          <AvatarOverlay />
        </AvatarWrapper>
      ))}
    </AvatarGroupContainer>
  )
}

const FIRST_PATH4040 = 'M 1 41 C 7 37 11 29 11 21 C 11 13 7 5 1 0 H 39 V 41 H 1 V 41 Z'

const FIRST_PATH4040_HOVER = 'M 0 34 C 7 29 12 22 12 13 C 12 8 11 4 9 0 H 40 V 41 H 0 V 34 Z'

const SECOND_PATH4040 =
  'M 38 40 C 31 36 27 28 27 20 C 27 12 31 4 38 0 H 0 C 7 4 11 12 11 20 C 11 28 7 36 0 40 H 38 V 38 Z'

const SECOND_PATH4040_HOVER =
  'M 39 33 C 32 29 27 21 27 12 C 27 8 28 4 30 0 H 0 C 7 4 11 12 11 20 C 11 28 7 36 0 40 H 39 V 33 Z'
