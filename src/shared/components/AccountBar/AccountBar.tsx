import React from 'react'
import { Text, Icon } from '@/shared/components'
import {
  AccountAvatar,
  AccountInfo,
  AccountSecondary,
  AccountWrapper,
  IconWrapper,
  StyledButton,
} from './AccountBar.style'

export type AccountBarProps = {
  name: string
  secondary?: string
  avatarUrl?: string
  onClick?: () => void
  blank?: boolean
}

const AccountBar: React.FC<AccountBarProps> = ({ name, secondary, avatarUrl, onClick, blank }) => {
  return (
    <AccountWrapper blank={blank} onClick={blank ? onClick : undefined}>
      <AccountInfo>
        {blank || !avatarUrl ? (
          <IconWrapper>
            <Icon name="profile" />
          </IconWrapper>
        ) : (
          <AccountAvatar imageUrl={avatarUrl} />
        )}
        <div>
          <Text variant="h6">{name}</Text>
          <AccountSecondary variant="body2">{secondary}</AccountSecondary>
        </div>
      </AccountInfo>
      {!blank && (
        <StyledButton variant="secondary" size="medium" onClick={onClick}>
          Select Account
        </StyledButton>
      )}
    </AccountWrapper>
  )
}

export default AccountBar
