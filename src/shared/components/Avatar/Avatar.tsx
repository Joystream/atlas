import React from 'react'
import { CSSTransition } from 'react-transition-group'
import {
  AvatarSize,
  Container,
  StyledImage,
  StyledTransitionGroup,
  StyledPlaceholder,
  SilhouetteAvatar,
  EditButton,
  NewChannelAvatar,
} from './Avatar.style'
import { transitions } from '@/shared/theme'
import { SvgGlyphImage, SvgGlyphNewChannel, SvgLargeUploadFailed } from '@/shared/icons'

export type AvatarProps = {
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  onEditClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  imageUrl?: string | null
  hasAvatarUploadFailed?: boolean
  loading?: boolean
  className?: string
  size?: AvatarSize
  editable?: boolean
  newChannel?: boolean
  onError?: () => void
}

const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
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
          <span>{imageUrl ? 'Edit Avatar' : 'Add avatar'}</span>
        </EditButton>
      )}
      {newChannel && !isEditable ? (
        <NewChannelAvatar>
          <SvgGlyphNewChannel />
        </NewChannelAvatar>
      ) : (
        <StyledTransitionGroup>
          <CSSTransition
            key={loading ? 'placeholder' : 'content'}
            timeout={parseInt(transitions.timings.loading)}
            classNames={transitions.names.fade}
          >
            {loading ? (
              <StyledPlaceholder rounded />
            ) : imageUrl ? (
              <StyledImage src={imageUrl} onError={onError} />
            ) : hasAvatarUploadFailed ? (
              <NewChannelAvatar>
                <SvgLargeUploadFailed />
              </NewChannelAvatar>
            ) : (
              <SilhouetteAvatar />
            )}
          </CSSTransition>
        </StyledTransitionGroup>
      )}
    </Container>
  )
}

export default Avatar
export type { AvatarSize }
