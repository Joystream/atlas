import { FC, MouseEvent, PropsWithChildren, useCallback, useEffect, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { SvgActionNewChannel } from '@/components/_icons'
import { cVar, transitions } from '@/styles'
import { validateImage } from '@/utils/image'

import {
  AvatarSize,
  ChildrenWrapper,
  Container,
  EditOverlay,
  IconAndOverlayWrapper,
  NewChannelAvatar,
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
  assetUrl?: string | null
  hasAvatarUploadFailed?: boolean
  withoutOutline?: boolean
  loading?: boolean
  className?: string
  /**
   * @description preview - 136px x 136px
   * @description cover - default: 64px x 64px, md: 88px x 88px
   * @description default - 32px x 32px
   * @description fill - 100% x 100%
   * @description bid - 24px x 24px
   * @description small - 40px x 40px
   * @description channel - default: 88px x 88px, md: 136px x 136px
   * @description channel-card - default: 88px x 88px, md: 104px x 104px
   */
  size?: AvatarSize
  editable?: boolean
  newChannel?: boolean
  clickable?: boolean
  onError?: () => void
}>

export const Avatar: FC<AvatarProps> = ({
  assetUrl,
  hasAvatarUploadFailed,
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
  const [invalidImage, setInvalidImage] = useState(false)

  const checkIfImageIsValid = useCallback(async () => {
    if (!assetUrl) {
      return
    }
    try {
      await validateImage(assetUrl)
      setInvalidImage(false)
    } catch (error) {
      setInvalidImage(true)
    }
  }, [assetUrl])

  useEffect(() => {
    if (!assetUrl) {
      return
    }
    checkIfImageIsValid()
  }, [assetUrl, checkIfImageIsValid])

  const isImageInvalid = invalidImage || hasAvatarUploadFailed

  const getEditableIconSize = useCallback(() => {
    const smallIconSizes = ['bid', 'default', 'small']
    if (smallIconSizes.includes(size)) {
      return
    } else {
      return 24
    }
  }, [size])

  const handleError = () => {
    onError?.()
  }

  const getFailedIconSize = useCallback(() => {
    const smallIconSizes = ['default', 'small']
    if (size === 'bid') {
      return 16
    }
    if (smallIconSizes.includes(size)) {
      return 24
    } else {
      return
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
      isClickable={clickable || !!onClick}
    >
      {(clickable || !!onClick) && (
        <IconAndOverlayWrapper>
          <EditOverlay />
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
        ) : isImageInvalid ? (
          <NewChannelAvatar>
            <StyledSvgIllustrativeFileFailed width={getFailedIconSize()} />
            {size === 'preview' && (
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
              ) : assetUrl ? (
                <StyledImage src={assetUrl} onError={handleError} />
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
