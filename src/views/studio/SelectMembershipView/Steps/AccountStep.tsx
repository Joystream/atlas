import accountCreation from '@/assets/account-creation.png'
import { useActiveUser } from '@/hooks'
import { AccountBar, Placeholder } from '@/shared/components'
import { transitions } from '@/shared/theme'
import React, { useEffect, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { AccountStepImg, AccountsWrapper, StyledSpinner } from './AccountStep.style'
import { StepSubTitle, StepTitle, StepWrapper } from './Steps.style'

const fakeAccounts = [
  {
    balance: 0.4,
    name: 'Myaccountname',
    id: 'some unique id',
  },
  {
    balance: 12.3,
    name: 'MySecondAccount',
    id: 'some unique id2',
  },
]

type AccountStepProps = {
  onStepChange: (idx: number) => void
  currentStepIdx: number
}

type Account = {
  id: string
  name: string
  balance: number
}

const AccountStep: React.FC<AccountStepProps> = ({ currentStepIdx, onStepChange }) => {
  const { activeUser, setActiveUser } = useActiveUser()
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
    // temporary
    const interval = setInterval(() => {
      fetchAccounts()
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  const handleSelectAccount = (id: string) => {
    setActiveUser({
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
            <StyledSpinner size={50} />
          </StepWrapper>
        ) : (
          <StepWrapper>
            <StepTitle variant="h4">Select Account</StepTitle>
            <StepSubTitle>
              Select account you would like to assign to your new Joystream membership cccount. (Showing only accounts
              with sufficient amount of funds to start a channel.)
            </StepSubTitle>
            <AccountsWrapper>
              {accounts?.map(({ balance, name, id }) => (
                <AccountBar key={id} secondary={balance + ' JOY'} name={name} onClick={() => handleSelectAccount(id)} />
              ))}
            </AccountsWrapper>
          </StepWrapper>
        )}
      </CSSTransition>
    </SwitchTransition>
  )
}

export default AccountStep
