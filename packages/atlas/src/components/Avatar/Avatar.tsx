import { FC, MouseEvent, PropsWithChildren, useCallback } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { SvgActionNewChannel } from '@/assets/icons'
import { cVar, transitions } from '@/styles'

import {
  AvatarSize,
  ChildrenWrapper,
  Container,
  IconAndOverlayWrapper,
  NewChannelAvatar,
  Overlay,
  SilhouetteAvatar,
  StyledImage,
  StyledSkeletonLoader,
  StyledSvgActionAddImage,
  StyledSvgActionEdit,
  StyledSvgIllustrativeFileFailed,
} from './Avatar.styles'

import { Text } from '../Text'

export type AvatarProps = PropsWithChildren<{
  onClick?: (event: MouseEvent<HTMLElement>) => void
  onImageValidation?: (validImage: boolean) => void
  onError?: () => void
  assetUrl?: string[] | null
  hasAvatarUploadFailed?: boolean
  loading?: boolean
  className?: string
  size?: AvatarSize
  newChannel?: boolean
  editable?: boolean
  clickable?: boolean
  disableHoverDimm?: boolean
}>

export const Avatar: FC<AvatarProps> = ({
  assetUrl,
  hasAvatarUploadFailed,
  loading = false,
  size = 32,
  children,
  className,
  editable,
  newChannel,
  clickable,
  onError,
  onClick,
  // onImageValidation,
  disableHoverDimm,
}) => {
  const isEditable = !loading && editable && size !== 32 && size !== 24

  const getEditableIconSize = useCallback(() => {
    const smallIconSizes = [24, 32, 40]
    if (smallIconSizes.includes(size)) {
      return
    } else {
      return 24
    }
  }, [size])

  return (
    <Container
      as={onClick ? 'button' : 'div'}
      type={onClick ? 'button' : undefined}
      onClick={onClick}
      size={size}
      className={className}
      isLoading={loading}
      disableHoverDimm={disableHoverDimm}
      isClickable={clickable || (clickable == null && !!onClick)} // default to true if onClick is provided
    >
      {(clickable || !!onClick) && (
        <IconAndOverlayWrapper>
          <Overlay isEdit={isEditable && !!assetUrl} />
          {isEditable &&
            (assetUrl ? (
              <StyledSvgActionEdit width={getEditableIconSize()} height={getEditableIconSize()} />
            ) : (
              <StyledSvgActionAddImage width={getEditableIconSize()} height={getEditableIconSize()} />
            ))}
        </IconAndOverlayWrapper>
      )}
      {!children &&
        (newChannel && !isEditable ? (
          <NewChannelAvatar>
            <SvgActionNewChannel />
          </NewChannelAvatar>
        ) : hasAvatarUploadFailed ? (
          <NewChannelAvatar>
            <StyledSvgIllustrativeFileFailed />
            {size === 136 && (
              <Text variant="t100" as="span" margin={{ top: 2 }}>
                Failed upload
              </Text>
            )}
          </NewChannelAvatar>
        ) : (
          <SwitchTransition>
            <CSSTransition
              key={loading ? 'placeholder' : 'content'}
              timeout={parseInt(cVar('animationTimingFast', true))}
              classNames={transitions.names.fade}
            >
              {loading ? (
                <StyledSkeletonLoader rounded />
              ) : assetUrl?.length ? (
                <StyledImage src={assetUrl} onError={onError} />
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
