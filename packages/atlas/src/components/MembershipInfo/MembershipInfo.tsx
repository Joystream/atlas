import { FC, MouseEvent, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { absoluteRoutes } from '@/config/routes'
import { useClipboard } from '@/hooks/useClipboard'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { cVar, transitions } from '@/styles'
import { shortenAddress } from '@/utils/address'

import {
  MembershipDetails,
  MembershipHeader,
  MembershipInfoContainer,
  StyledHandle,
  StyledSvgActionCheck,
  StyledSvgActionCopy,
  StyledText,
} from './MembershipInfo.style'

import { SvgActionEdit } from '../../assets/icons'
import { Avatar } from '../Avatar'
import { Tooltip } from '../Tooltip'
import { Button } from '../_buttons/Button'
import { SkeletonLoader } from '../_loaders/SkeletonLoader'

export type MembershipInfoProps = {
  avatarUrl?: string | null
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
  avatarUrl,
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
  const { copyToClipboard } = useClipboard()
  const [copyButtonClicked, setCopyButtonClicked] = useState(false)
  const smMatch = useMediaMatch('sm')

  const handleCopyAddress = () => {
    if (!address) {
      return
    }
    copyToClipboard(address, 'Account address copied to clipboard')
    setCopyButtonClicked(true)
    setTimeout(() => {
      setCopyButtonClicked(false)
    }, 3000)
  }

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
              size={smMatch ? 'preview' : 'channel-card'}
              editable={editable}
              onImageValidation={onImageValidation}
              onClick={onAvatarEditClick}
              assetUrl={avatarUrl}
              loading={avatarLoading}
              hasAvatarUploadFailed={hasAvatarUploadFailed}
            />
            <MembershipDetails>
              {loading ? (
                <SkeletonLoader width={200} height={smMatch ? 56 : 40} bottomSpace={8} />
              ) : (
                <StyledHandle as="h1" variant={smMatch ? 'h700' : 'h600'}>
                  {handle || '\xa0'}
                </StyledHandle>
              )}
              {loading || !address ? (
                <SkeletonLoader width={140} height={24} />
              ) : (
                <StyledText as="p" variant="t300" color="colorText" onClick={handleCopyAddress}>
                  {shortenAddress(address, 6, 4)}
                  <Tooltip text="Copy account address" placement="top">
                    {copyButtonClicked ? <StyledSvgActionCheck /> : <StyledSvgActionCopy />}
                  </Tooltip>
                </StyledText>
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
