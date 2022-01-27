import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { SvgActionImage, SvgActionNewChannel } from '@/components/_icons'
import { transitions } from '@/styles'

import {
  AvatarSize,
  ChildrenWrapper,
  Container,
  EditButton,
  NewChannelAvatar,
  SilhouetteAvatar,
  StyledImage,
  StyledSkeletonLoader,
  StyledSvgIllustrativeFileFailed,
} from './Avatar.styles'

export type AvatarProps = {
  onClick?: (event: React.MouseEvent<HTMLElement>) => void
  onEditClick?: (event: React.MouseEvent<HTMLButtonElement>) => void
  assetUrl?: string | null
  hasAvatarUploadFailed?: boolean
  withoutOutline?: boolean
  loading?: boolean
  className?: string
  size?: AvatarSize
  editable?: boolean
  newChannel?: boolean
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
  onEditClick,
  className,
  editable,
  newChannel,
  onError,
}) => {
  const handleEditClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.stopPropagation()
    if (onEditClick) {
      onEditClick(event)
    }
  }
  const isEditable = !loading && editable && size !== 'default' && size !== 'bid'

  return (
    <Container onClick={onClick} size={size} className={className} isLoading={loading} withoutOutline={withoutOutline}>
      {isEditable && (
        <EditButton size={size} onClick={handleEditClick} type="button">
          <SvgActionImage />
          <span>{assetUrl ? 'Edit Avatar' : 'Add avatar'}</span>
        </EditButton>
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
