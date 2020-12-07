import React from 'react'
import { CSSTransition } from 'react-transition-group'
import { AvatarSize, Container, StyledImage, StyledTransitionGroup, StyledPlaceholder } from './Avatar.style'
import { transitions } from '@/shared/theme'

export type AvatarProps = {
  onClick?: (e: React.MouseEvent<HTMLElement>) => void
  handle?: string | null
  imageUrl?: string | null
  loading?: boolean
  className?: string
  size?: AvatarSize
}

const initialsFromHandle = (rawHandle: string | null | undefined): string => {
  const handle = rawHandle || 'Unknown'
  const vowels = ['a', 'e', 'i', 'o', 'u', 'y']
  const [first = '', second = ''] = handle.split('')
  return vowels.includes(second) ? first : `${first}${second}`
}

const Avatar: React.FC<AvatarProps> = ({ imageUrl, handle, loading = false, size = 'default', onClick, className }) => {
  return (
    <Container onClick={onClick} size={size} className={className}>
      <StyledTransitionGroup>
        <CSSTransition
          key={loading ? 'placeholder' : 'content'}
          timeout={parseInt(transitions.timings.loading)}
          classNames={transitions.names.fade}
        >
          {loading ? (
            <StyledPlaceholder rounded />
          ) : imageUrl ? (
            <StyledImage src={imageUrl} />
          ) : (
            <span>{initialsFromHandle(handle)}</span>
          )}
        </CSSTransition>
      </StyledTransitionGroup>
    </Container>
  )
}

export default Avatar
export type { AvatarSize }
