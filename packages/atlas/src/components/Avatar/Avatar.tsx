import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { SvgActionImage, SvgActionNewChannel } from '@/components/_icons'
import { transitions } from '@/styles'

import {
  AvatarSize,
  ChildrenWrapper,
  Container,
  EditOverlay,
  NewChannelAvatar,
  SilhouetteAvatar,
  StyledImage,
  StyledSkeletonLoader,
  StyledSvgIllustrativeFileFailed,
} from './Avatar.styles'

export type AvatarProps = {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  assetUrl?: string | null
  hasAvatarUploadFailed?: boolean
  withoutOutline?: boolean
  loading?: boolean
  className?: string
  size?: AvatarSize
  editable?: boolean
  newChannel?: boolean
  clickable?: boolean
  onError?: () => void
}

export const Avatar: React.FC<AvatarProps> = ({
  assetUrl,
  hasAvatarUploadFailed,
  withoutOutline,
  loading = false,
  size = 'default',
  children,
  onClick,
  className,
  editable,
  newChannel,
  clickable,
  onError,
}) => {
  const isEditable = !loading && editable && size !== 'default' && size !== 'bid'

  return (
    <Container
      as={onClick ? 'button' : 'div'}
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      size={size}
      className={className}
      isLoading={loading}
      withoutOutline={withoutOutline}
      isClickable={clickable || !!onClick}
    >
      {isEditable && (
        <EditOverlay size={size}>
          <SvgActionImage />
          <span>{assetUrl ? 'Edit avatar' : 'Add avatar'}</span>
        </EditOverlay>
      )}
      {!children &&
        (newChannel && !isEditable ? (
          <NewChannelAvatar>
            <SvgActionNewChannel />
          </NewChannelAvatar>
        ) : (
          <SwitchTransition>
            <CSSTransition
              key={loading ? 'placeholder' : 'content'}
              timeout={parseInt(transitions.timings.loading)}
              classNames={transitions.names.fade}
            >
              {loading ? (
                <StyledSkeletonLoader rounded />
              ) : assetUrl ? (
                <StyledImage src={assetUrl} onError={onError} />
              ) : hasAvatarUploadFailed ? (
                <NewChannelAvatar>
                  <StyledSvgIllustrativeFileFailed />
                </NewChannelAvatar>
              ) : (
                <SilhouetteAvatar />
              )}
            </CSSTransition>
          </SwitchTransition>
        ))}
      {children && (loading ? <StyledSkeletonLoader rounded /> : <ChildrenWrapper>{children}</ChildrenWrapper>)}
    </Container>
  )
}

export type { AvatarSize }
