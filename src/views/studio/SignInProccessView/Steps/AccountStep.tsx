import accountCreation from '@/assets/account-creation.png'
import { useActiveUser } from '@/hooks'
import { Icon, Placeholder, Text } from '@/shared/components'
import { transitions } from '@/shared/theme'
import React, { useCallback, useEffect, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { createFakeAccount, getAccounts, Account } from '../../fakeUtils'
import {
  AccountStepImg,
  AccountsWrapper,
  StyledSpinner,
  AccountWrapper,
  AccountInfo,
  IconWrapper,
  AccountSecondary,
  StyledButton,
} from './AccountStep.style'
import { StepSubTitle, StepTitle, StepWrapper } from './Steps.style'

type AccountStepProps = {
  onStepChange: (idx: number) => void
  currentStepIdx: number
}

const AccountStep: React.FC<AccountStepProps> = ({ currentStepIdx, onStepChange }) => {
  const { setActiveUser, activeUser } = useActiveUser()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [accounts, setAccounts] = useState<null | Account[]>()
  const [loading, setLoading] = useState(true)

  // this is temporary. Normally user will do this inside polkadot
  useEffect(() => {
    createFakeAccount('fake name', 20)
  }, [])

  const fetchAccounts = useCallback(async () => {
    // also temporary - some function to fetch polkadot account
    const accountsFromLocalStorage = await getAccounts()
    setAccounts(accountsFromLocalStorage)
    setLoading(false)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAccounts()
    }, 2000)
    return () => clearInterval(interval)
  }, [fetchAccounts])

  const handleSelectAccount = async (id: string) => {
    await setActiveUser({
      accountId: id,
      memberId: null,
      channelId: null,
    })
    onStepChange(currentStepIdx + 1)
  }

  return (
    <SwitchTransition>
      <CSSTransition
        key={loading && !accounts?.length ? 'loading' : 'accounts'}
        classNames={transitions.names.fadeAndSlide}
        timeout={parseInt(transitions.timings.routing)}
      >
        {loading && !accounts?.length ? (
          <StepWrapper centered>
            {!imageLoaded && <Placeholder height="180px" width="320px" />}
            <CSSTransition in={imageLoaded} classNames="fade" timeout={100}>
              <AccountStepImg src={accountCreation} onLoad={() => setImageLoaded(true)} />
            </CSSTransition>
            <StepTitle variant="h4">Waiting for account creation</StepTitle>
            <StepSubTitle variant="body2">Open Polka Dot Extension and create your first account.</StepSubTitle>
            <StyledSpinner />
          </StepWrapper>
        ) : (
          <StepWrapper>
            <StepTitle variant="h4">Select Account</StepTitle>
            <StepSubTitle>
              Select account you would like to assign to your new Joystream membership cccount. (Showing only accounts
              with sufficient amount of funds to start a channel.)
            </StepSubTitle>
            <AccountsWrapper>
              {accounts?.map(({ accountBalance, accountName, accountId }) => (
                <AccountBar
                  key={accountId}
                  secondary={accountBalance + ' JOY'}
                  name={accountName}
                  onClick={() => handleSelectAccount(accountId)}
                />
              ))}
            </AccountsWrapper>
          </StepWrapper>
        )}
      </CSSTransition>
    </SwitchTransition>
  )
}

export type AccountBarProps = {
  name: string
  secondary?: string
  avatarUrl?: string
  onClick?: () => void
}

const AccountBar: React.FC<AccountBarProps> = ({ name, secondary, onClick }) => {
  return (
    <AccountWrapper>
      <AccountInfo>
        <IconWrapper>
          <Icon name="profile" />
        </IconWrapper>
        <div>
          <Text variant="h6">{name}</Text>
          <AccountSecondary variant="body2">{secondary}</AccountSecondary>
        </div>
      </AccountInfo>
      <StyledButton variant="secondary" size="medium" onClick={onClick}>
        Select Account
      </StyledButton>
    </AccountWrapper>
  )
}

export default AccountStep
