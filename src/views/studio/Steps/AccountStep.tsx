import accountCreation from '@/assets/account-creation.png'
import { AccountBar, Placeholder } from '@/shared/components'
import React, { useEffect, useState } from 'react'
import { CSSTransition } from 'react-transition-group'
import { StepSubTitle, StepTitle, StepWrapper } from '../SignInView.style'
import { AccountStepImg, AccountsWrapper, StyledSpinner } from './AccountStep.style'

const fakeAccounts = [
  {
    balance: 0.4,
    name: 'Myaccountname',
    avatarUrl: '',
  },
  {
    balance: 12.3,
    name: 'MySecondAccount',
    avatarUrl: '',
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
  const [imageLoaded, setImageLoaded] = useState(false)
  const [accounts, setAccounts] = useState<null | Account[]>()
  const [loading, setLoading] = useState(true)

  const fetchAccounts = async () => {
    // TODO some function to fetch all accounts
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
        Select account you would like to assign to your new Joystream membership cccount. (Showing only accounts with
        sufficient amount of funds to start a channel.)
      </StepSubTitle>
      <AccountsWrapper>
        {accounts?.map(({ balance, name, avatarUrl }, idx) => (
          <AccountBar
            key={idx}
            secondary={balance + ' JOY'}
            name={name}
            onClick={handleSelectAccount}
            avatarUrl={avatarUrl}
          />
        ))}
      </AccountsWrapper>
    </StepWrapper>
  )
}

export default AccountStep
