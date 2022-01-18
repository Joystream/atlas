import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useMediaMatch } from '@/hooks/useMediaMatch'
import { cVar, transitions } from '@/styles'
import { shortenAddress } from '@/utils/address'
import { copyToClipboard } from '@/utils/browser'

import {
  MembershipDetails,
  MembershipHeader,
  MembershipInfoContainer,
  StyledSvgActionCopy,
  StyledText,
} from './MembershipInfo.style'

import { Avatar } from '../Avatar'
import { Text } from '../Text'
import { Tooltip } from '../Tooltip'
import { Button } from '../_buttons/Button'
import { SvgActionEdit } from '../_icons'
import { SkeletonLoader } from '../_loaders/SkeletonLoader'

export type MembershipInfoProps = {
  avatarUrl?: string | null
  hasAvatarUploadFailed?: boolean
  onAvatarEditClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
  handle?: string | null
  address?: string | null
  loading?: boolean
  isOwner?: boolean
}

export const MembershipInfo: React.FC<MembershipInfoProps> = ({
  address,
  avatarUrl,
  hasAvatarUploadFailed,
  onAvatarEditClick,
  handle,
  loading,
  isOwner,
}) => {
  const smMatch = useMediaMatch('sm')
  return (
    <SwitchTransition>
      <CSSTransition
        key={String(loading)}
        timeout={parseInt(cVar('animationTimingFast', true))}
        classNames={transitions.names.fade}
      >
        <MembershipHeader>
          <MembershipInfoContainer>
            <Avatar
              size={smMatch ? 'preview' : 'channel-card'}
              editable
              onEditClick={onAvatarEditClick}
              assetUrl={avatarUrl}
              loading={loading}
              hasAvatarUploadFailed={hasAvatarUploadFailed}
            />
            <MembershipDetails>
              {loading || !handle ? (
                <SkeletonLoader width={200} height={smMatch ? 56 : 40} bottomSpace={8} />
              ) : (
                <Text variant={smMatch ? 'h700' : 'h600'}>{handle}</Text>
              )}
              {loading || !address ? (
                <SkeletonLoader width={140} height={24} />
              ) : (
                <StyledText variant="t300" secondary onClick={() => copyToClipboard(address)}>
                  {shortenAddress(address, 6, 4)}
                  <Tooltip text="Copy address" arrowDisabled placement="top">
                    <StyledSvgActionCopy />
                  </Tooltip>
                </StyledText>
              )}
            </MembershipDetails>
          </MembershipInfoContainer>
          {isOwner &&
            (loading ? (
              <SkeletonLoader width={smMatch ? 148 : '100%'} height={48} />
            ) : (
              <Button icon={<SvgActionEdit />} size="large" variant="secondary" fullWidth={!smMatch}>
                Edit profile
              </Button>
            ))}
        </MembershipHeader>
      </CSSTransition>
    </SwitchTransition>
  )
}
