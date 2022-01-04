import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { useMediaMatch } from '@/hooks/useMediaMatch'
import { cVar, transitions } from '@/styles'
import { copyToClipboard } from '@/utils/browser'

import { MembershipDetails, MembershipInfoContainer, StyledSvgActionCopy, StyledText } from './MembershipInfo.style'

import { Avatar } from '../Avatar'
import { Text } from '../Text'
import { Tooltip } from '../Tooltip'
import { SkeletonLoader } from '../_loaders/SkeletonLoader'

export type MembershipInfoProps = {
  avatarUrl?: string
  handle: string
  address: string
  loading: boolean
}

export const MembershipInfo: React.FC<MembershipInfoProps> = ({ address, avatarUrl, handle, loading }) => {
  const smMatch = useMediaMatch('sm')
  return (
    <MembershipInfoContainer>
      <Avatar size={smMatch ? 'preview' : 'channel-card'} assetUrl={avatarUrl} loading={loading} />
      <SwitchTransition>
        <CSSTransition
          key={String(loading)}
          timeout={parseInt(cVar('animationTimingFast', true))}
          classNames={transitions.names.fade}
        >
          <MembershipDetails>
            {loading ? (
              <SkeletonLoader width={200} height={smMatch ? 56 : 40} bottomSpace={8} />
            ) : (
              <Text variant={smMatch ? 'h700' : 'h600'}>{handle}</Text>
            )}
            {loading ? (
              <SkeletonLoader width={140} height={24} />
            ) : (
              <StyledText variant="t300" secondary>
                {shortenAddress(address, 6, 4)}
                <Tooltip text="Copy address" arrowDisabled placement="top">
                  <StyledSvgActionCopy onClick={() => copyToClipboard(address)} />
                </Tooltip>
              </StyledText>
            )}
          </MembershipDetails>
        </CSSTransition>
      </SwitchTransition>
    </MembershipInfoContainer>
  )
}

export const shortenAddress = (text: string, firstLettersAmount: number, lastLettersAmount: number) => {
  const arrayFromString = text.split('')
  const firstLetters = arrayFromString.slice(0, firstLettersAmount).join('')
  const lastLetters = arrayFromString.slice(arrayFromString.length - 1 - lastLettersAmount).join('')
  return `${firstLetters}...${lastLetters}`
}
