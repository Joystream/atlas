import { FC, MouseEvent, PropsWithChildren, useCallback, useEffect } from 'react'

import { SvgActionNewChannel } from '@/assets/icons'
import { validateImage } from '@/utils/image'

import {
  AvatarSize,
  BadgeContainer,
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
  assetUrls?: string[] | null
  hasAvatarUploadFailed?: boolean
  loading?: boolean
  className?: string
  size?: AvatarSize
  newChannel?: boolean
  editable?: boolean
  clickable?: boolean
  disableHoverDimm?: boolean
  badge?: boolean | string | number
}>

export const Avatar: FC<AvatarProps> = ({
  assetUrls,
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
  onImageValidation,
  disableHoverDimm,
  badge,
}) => {
  const isEditable = !loading && editable && size !== 32 && size !== 24

  const checkIfImageIsValid = useCallback(async () => {
    if (!assetUrls?.[0]) {
      onImageValidation?.(true)
      return
    }
    try {
      await validateImage(assetUrls?.[0])
      onImageValidation?.(true)
    } catch (error) {
      onImageValidation?.(false)
    }
  }, [assetUrls, onImageValidation])

  useEffect(() => {
    if (!assetUrls?.[0]) {
      return
    }
    checkIfImageIsValid()
  }, [assetUrls, checkIfImageIsValid])

  const getEditableIconSize = useCallback(() => {
    const smallIconSizes = [24, 32, 40]
    if (smallIconSizes.includes(size)) {
      return
    } else {
      return 24
    }
  }, [size])

  return (
    <BadgeContainer data-badge={badge}>
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
            <Overlay isEdit={isEditable && !!assetUrls} />
            {isEditable &&
              (assetUrls ? (
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
            <StyledImage
              resolvedUrls={assetUrls}
              onError={onError}
              isLoading={loading}
              imagePlaceholder={<SilhouetteAvatar />}
            />
          ))}
        {children && (loading ? <StyledSkeletonLoader rounded /> : <ChildrenWrapper>{children}</ChildrenWrapper>)}
      </Container>
    </BadgeContainer>
  )
}

export type { AvatarSize }
