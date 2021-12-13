import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { SvgActionImage, SvgActionNewChannel } from '@/components/_icons'
import { transitions } from '@/styles'

import {
  AvatarSize,
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
  loading = false,
  size = 'default',
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
    <Container onClick={onClick} size={size} className={className} loading={loading}>
      {isEditable && (
        <EditButton size={size} onClick={handleEditClick} type="button">
          <SvgActionImage />
          <span>{assetUrl ? 'Edit Avatar' : 'Add avatar'}</span>
        </EditButton>
      )}
      {newChannel && !isEditable ? (
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
      )}
    </Container>
  )
}

export type { AvatarSize }
