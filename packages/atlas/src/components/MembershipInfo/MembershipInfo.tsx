import React, { useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useClipboard } from '@/providers/clipboard/hooks'
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

import { Avatar } from '../Avatar'
import { Tooltip } from '../Tooltip'
import { Button } from '../_buttons/Button'
import { SvgActionEdit } from '../_icons'
import { SkeletonLoader } from '../_loaders/SkeletonLoader'

export type MembershipInfoProps = {
  avatarUrl?: string | null
  hasAvatarUploadFailed?: boolean
  onAvatarEditClick?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
  handle?: string | null
  address?: string | null
  loading?: boolean
  isOwner?: boolean
  editable?: boolean
  className?: string
}

export const MembershipInfo: React.FC<MembershipInfoProps> = ({
  address,
  avatarUrl,
  hasAvatarUploadFailed,
  onAvatarEditClick,
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
    copyToClipboard(address, 'Video URL copied to clipboard')
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
              onClick={onAvatarEditClick}
              assetUrl={avatarUrl}
              loading={loading}
              hasAvatarUploadFailed={hasAvatarUploadFailed}
            />
            <MembershipDetails>
              {loading ? (
                <SkeletonLoader width={200} height={smMatch ? 56 : 40} bottomSpace={8} />
              ) : (
                <StyledHandle variant={smMatch ? 'h700' : 'h600'}>{handle || '\xa0'}</StyledHandle>
              )}
              {loading || !address ? (
                <SkeletonLoader width={140} height={24} />
              ) : (
                <StyledText variant="t300" secondary onClick={handleCopyAddress}>
                  {shortenAddress(address, 6, 4)}
                  <Tooltip text="Copy account address" arrowDisabled placement="top">
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
