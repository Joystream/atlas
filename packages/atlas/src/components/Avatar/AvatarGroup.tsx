import { FC, Fragment, PropsWithChildren, useRef, useState } from 'react'

import { BasicMembershipFieldsFragment } from '@/api/queries/__generated__/fragments.generated'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'

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

type SharedAvatarGroupAvatarProps = PropsWithChildren<{
  tooltipText?: string
}> &
  Pick<AvatarProps, 'onClick' | 'loading'>

export type AvatarGroupUrlAvatar = {
  __typename?: 'AvatarGroupUrlAvatar'
  url?: string | null
} & SharedAvatarGroupAvatarProps

type AvatarGroupMemberAvatar = BasicMembershipFieldsFragment & SharedAvatarGroupAvatarProps

export type AvatarGroupAvatar = AvatarGroupUrlAvatar | AvatarGroupMemberAvatar

export type AvatarGroupProps = {
  avatars: AvatarGroupAvatar[]
  size?: AvatarGroupSize
  avatarStrokeColor?: string
  clickable?: boolean
  reverse?: boolean
  loading?: boolean
  className?: string
  shouldHighlightEveryAvatar?: boolean
  spreadAvatars?: boolean
}

const getSizeofAvatar = (size: AvatarGroupSize) => {
  // converts size of avatar group to avatar size
  switch (size) {
    case 'large':
      return 40
    case 'medium':
      return 32
    case 'small':
      return 24
  }
}

export const AvatarGroup: FC<AvatarGroupProps> = ({
  avatars,
  size = 'medium',
  avatarStrokeColor,
  clickable = true,
  loading,
  reverse,
  shouldHighlightEveryAvatar,
  className,
  spreadAvatars,
}) => {
  const [hoveredAvatarIdx, setHoveredAvatarIdx] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement | null>(null)

  return (
    <AvatarGroupContainer
      size={size}
      className={className}
      shouldHighlightEveryAvatar={shouldHighlightEveryAvatar}
      spreadAvatars={spreadAvatars}
    >
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
            <SingleAvatar avatar={avatarProps} loading={loading} size={getSizeofAvatar(size)} />
            <AvatarOverlay dimmed={hoveredAvatarIdx !== idx && hoveredAvatarIdx !== null} />
          </AvatarWrapper>
          <Tooltip text={avatarProps.tooltipText} placement="top" offsetY={clickable ? 16 : 8} reference={ref} />
        </Fragment>
      ))}
    </AvatarGroupContainer>
  )
}

type SingleAvatarProps = {
  avatar: AvatarGroupAvatar
  loading?: boolean
  size: AvatarProps['size']
}
const SingleAvatar: FC<SingleAvatarProps> = ({ avatar, loading: loadingProp, size }) => {
  const { url: memberAvatarUrl, isLoadingAsset: memberAvatarLoading } = getMemberAvatar(
    avatar.__typename === 'Membership' ? avatar : null
  )

  let loading: boolean
  let url: string | null | undefined
  if (avatar.__typename === 'Membership') {
    url = memberAvatarUrl
    loading = memberAvatarLoading || avatar.loading || loadingProp || false
  } else {
    url = (avatar as AvatarGroupUrlAvatar).url
    loading = avatar.loading || loadingProp || false
  }
  return (
    <StyledAvatar
      loading={loading}
      assetUrl={url}
      size={size}
      disableHoverDimm
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
        avatar.onClick?.(e)
      }}
    >
      {avatar.children}
    </StyledAvatar>
  )
}
