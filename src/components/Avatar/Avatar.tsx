import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { SvgGlyphImage, SvgGlyphNewChannel, SvgLargeUploadFailed } from '@/components/icons'
import { transitions } from '@/theme'

import {
  AvatarSize,
  Container,
  EditButton,
  NewChannelAvatar,
  SilhouetteAvatar,
  StyledImage,
  StyledSkeletonLoader,
} from './Avatar.style'

export type AvatarProps = {
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  onEditClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
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
  const handleEditClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation()
    if (onEditClick) {
      onEditClick(e)
    }
  }
  const isEditable = !loading && editable && size !== 'default'
  return (
    <Container onClick={onClick} size={size} className={className}>
      {isEditable && (
        <EditButton size={size} onClick={handleEditClick} type="button">
          <SvgGlyphImage />
          <span>{assetUrl ? 'Edit Avatar' : 'Add avatar'}</span>
        </EditButton>
      )}
      {newChannel && !isEditable ? (
        <NewChannelAvatar>
          <SvgGlyphNewChannel />
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
                <SvgLargeUploadFailed />
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
