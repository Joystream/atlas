import React from 'react'

import { useMediaMatch } from '@/hooks/useMediaMatch'
import { copyToClipboard } from '@/utils/browser'

import { MembershipDetails, MembershipInfoContainer, StyledSvgActionCopy, StyledText } from './MembershipInfo.style'

import { Avatar } from '../Avatar'
import { Text } from '../Text'
import { Tooltip } from '../Tooltip'

export type MembershipInfoProps = {
  avatarUrl?: string
  handle: string
  address: string
}

export const MembershipInfo: React.FC<MembershipInfoProps> = ({ address, avatarUrl, handle }) => {
  const smMatch = useMediaMatch('sm')
  return (
    <MembershipInfoContainer>
      <Avatar size={smMatch ? 'preview' : 'channel-card'} assetUrl={avatarUrl} />
      <MembershipDetails>
        <Text variant={smMatch ? 'h700' : 'h600'}>{handle}</Text>
        <StyledText variant="t300" secondary>
          {shortenAddress(address, 6, 4)}
          <Tooltip text="Copy address" arrowDisabled placement="top">
            <StyledSvgActionCopy onClick={() => copyToClipboard(address)} />
          </Tooltip>
        </StyledText>
      </MembershipDetails>
    </MembershipInfoContainer>
  )
}

export const shortenAddress = (text: string, firstLettersAmount: number, lastLettersAmount: number) => {
  const arrayFromString = text.split('')
  const firstLetters = arrayFromString.slice(0, firstLettersAmount).join('')
  const lastLetters = arrayFromString.slice(arrayFromString.length - 1 - lastLettersAmount).join('')
  return `${firstLetters}...${lastLetters}`
}
