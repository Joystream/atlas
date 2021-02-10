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
} from './Avatar.style'
import { transitions } from '@/shared/theme'
import Icon from '../Icon'

export type AvatarProps = {
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  onEditClick?: (e: React.MouseEvent<HTMLButtonElement>) => void
  imageUrl?: string | null
  loading?: boolean
  className?: string
  size?: AvatarSize
  editable?: boolean
}

const Avatar: React.FC<AvatarProps> = ({
  imageUrl,
  loading = false,
  size = 'default',
  onClick,
  onEditClick,
  className,
  editable,
}) => {
  const isEditable = !loading && editable && size !== 'default'
  return (
    <Container onClick={onClick} size={size} className={className}>
      <StyledTransitionGroup>
        {isEditable && (
          <EditButton size={size} withAvatar={!!imageUrl} onClick={onEditClick}>
            <Icon name="camera" />
            <span>{imageUrl ? 'Edit' : 'Add avatar'}</span>
          </EditButton>
        )}
        <CSSTransition
          key={loading ? 'placeholder' : 'content'}
          timeout={parseInt(transitions.timings.loading)}
          classNames={transitions.names.fade}
        >
          {loading ? <StyledPlaceholder rounded /> : imageUrl ? <StyledImage src={imageUrl} /> : <SilhouetteAvatar />}
        </CSSTransition>
      </StyledTransitionGroup>
    </Container>
  )
}

export default Avatar
export type { AvatarSize }
