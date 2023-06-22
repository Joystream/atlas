import { FC, MouseEvent } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { cVar, transitions } from '@/styles'

import { MembershipDetails, MembershipHeader, MembershipInfoContainer, StyledHandle } from './MembershipInfo.style'

import { SvgActionEdit } from '../../assets/icons'
import { Avatar } from '../Avatar'
import { Button } from '../_buttons/Button'
import { CopyAddressButton } from '../_buttons/CopyAddressButton/CopyAddressButton'
import { SkeletonLoader } from '../_loaders/SkeletonLoader'

export type MembershipInfoProps = {
  avatarUrls?: string[] | null
  avatarLoading?: boolean
  hasAvatarUploadFailed?: boolean
  onAvatarEditClick?: (event: MouseEvent<HTMLElement>) => void
  onImageValidation?: (validImage: boolean) => void
  handle?: string | null
  address?: string | null
  loading?: boolean
  isOwner?: boolean
  editable?: boolean
  className?: string
}

export const MembershipInfo: FC<MembershipInfoProps> = ({
  address,
  avatarUrls,
  avatarLoading,
  hasAvatarUploadFailed,
  onAvatarEditClick,
  onImageValidation,
  handle,
  loading,
  isOwner,
  editable,
  className,
}) => {
  const smMatch = useMediaMatch('sm')

  return (
    <SwitchTransition>
      <CSSTransition
        key={String(loading)}
        timeout={parseInt(cVar('animationTimingFast', true))}
        classNames={transitions.names.fade}
      >
        <MembershipHeader className={className}>
          <MembershipInfoContainer>
            <Avatar
              size={smMatch ? 136 : 88}
              editable={editable}
              onImageValidation={onImageValidation}
              onClick={onAvatarEditClick}
              assetUrl={avatarUrls}
              loading={avatarLoading}
              hasAvatarUploadFailed={hasAvatarUploadFailed}
            />
            <MembershipDetails>
              {loading ? (
                <SkeletonLoader width={200} height={smMatch ? 56 : 40} bottomSpace={8} />
              ) : (
                <StyledHandle as="h1" variant={smMatch ? 'h700' : 'h600'} margin={{ bottom: 2 }}>
                  {handle || '\xa0'}
                </StyledHandle>
              )}
              {loading || !address ? (
                <SkeletonLoader width={140} height={24} />
              ) : (
                <CopyAddressButton address={address} />
              )}
            </MembershipDetails>
          </MembershipInfoContainer>
          {isOwner &&
            (loading ? (
              <SkeletonLoader width={smMatch ? 148 : '100%'} height={48} />
            ) : (
              <Button
                to={absoluteRoutes.viewer.editMembership()}
                icon={<SvgActionEdit />}
                size="large"
                variant="secondary"
                fullWidth={!smMatch}
              >
                Edit profile
              </Button>
            ))}
        </MembershipHeader>
      </CSSTransition>
    </SwitchTransition>
  )
}
