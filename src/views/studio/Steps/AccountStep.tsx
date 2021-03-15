import accountCreation from '@/assets/account-creation.png'
import { Text } from '@/shared/components'
import React, { useEffect, useState } from 'react'
import { StepSubTitle, StepTitle, StepWrapper } from '../SignInView.style'
import {
  AccountAvatar,
  AccountBalance,
  AccountCreationImg,
  AccountInfo,
  AccountWrapper,
  StyledButton,
  StyledSpinner,
} from './AccountStep.style'

const fakeAccounts = [
  {
    balance: 0.4,
    name: 'Myaccountname',
    avatarUrl: 'https://picsum.photos/200',
  },
  {
    balance: 12.3,
    name: 'MySecondAccount',
    avatarUrl: 'https://picsum.photos/200',
  },
]

type AccountStepProps = {
  onStepChange: (idx: number) => void
  currentStepIdx: number
}

type Account = {
  name: string
  balance: number
  avatarUrl: string
}

const AccountStep: React.FC<AccountStepProps> = ({ currentStepIdx, onStepChange }) => {
  const [accounts, setAccounts] = useState<null | Account[]>()
  const [loading, setLoading] = useState(true)

  const fetchAccounts = async () => {
    // some function to fetch all accounts
    // for example
    // const accounts = await getAllAccounts()
    setLoading(false)
    setAccounts(fakeAccounts)
    console.log('fetched')
  }

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAccounts()
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleSelectAccount = () => {
    onStepChange(currentStepIdx + 1)
  }

  return loading && !accounts?.length ? (
    <StepWrapper centered>
      <AccountCreationImg src={accountCreation} />
      <StepTitle variant="h4">Waiting for account creation</StepTitle>
      <StepSubTitle variant="body2">Open Polka Dot Extension and create your first account.</StepSubTitle>
      <StyledSpinner />
    </StepWrapper>
  ) : (
    <StepWrapper>
      <StepTitle variant="h4">Select Account</StepTitle>
      <StepSubTitle>
        Select account you would like to assign to your new Joystream membership cccount. (Showing only accounts with
        sufficient amount of funds to start a channel.)
      </StepSubTitle>
      {accounts?.map(({ balance, name, avatarUrl }, idx) => (
        <Account key={idx} balance={balance} name={name} onSelectAccount={handleSelectAccount} avatarUrl={avatarUrl} />
      ))}
    </StepWrapper>
  )
}

type AccountProps = {
  onSelectAccount: () => void
} & Account

const Account: React.FC<AccountProps> = ({ name, balance, avatarUrl, onSelectAccount }) => {
  return (
    <AccountWrapper>
      <AccountInfo>
        <AccountAvatar src={avatarUrl} />
        <div>
          <Text variant="h6">{name}</Text>
          <AccountBalance variant="body2">{balance} JOY</AccountBalance>
        </div>
      </AccountInfo>
      <StyledButton variant="tertiary" size="medium" onClick={onSelectAccount}>
        Select Account
      </StyledButton>
    </AccountWrapper>
  )
}

export default AccountStep
