import accountCreation from '@/assets/account-creation.png'
import { useActiveUser } from '@/hooks'
import { Button, Icon, Placeholder, Spinner, Text } from '@/shared/components'
import { transitions } from '@/shared/theme'
import React, { useCallback, useEffect, useState } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import {
  AccountStepImg,
  AccountsWrapper,
  AccountWrapper,
  AccountInfo,
  IconWrapper,
  OrderedSteps,
  OrderedStep,
  IconGroup,
  AccountAddress,
  StyledRadioButton,
} from './AccountStep.style'
import polkadotIcon from '@/assets/polkadot.png'
import joystreamIcon from '@/assets/logo.png'
import { BottomBarContainer, BottomBarIcon, StepSubTitle, StepTitle, StepWrapper } from './Steps.style'
import { web3Accounts, web3Enable } from '@polkadot/extension-dapp'
import { InjectedAccountWithMeta } from '@polkadot/extension-inject/types'

type AccountStepProps = {
  onStepChange: (idx: number) => void
  currentStepIdx: number
}

const AccountStep: React.FC<AccountStepProps> = ({ currentStepIdx, onStepChange }) => {
  const { setActiveUser, activeUser } = useActiveUser()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [accounts, setAccounts] = useState<null | InjectedAccountWithMeta[]>()
  const [loading, setLoading] = useState(true)
  const [selectedAccountAddress, setSelectedAccountAddress] = useState<undefined | string>()

  const fetchAccounts = useCallback(async () => {
    const extension = await web3Enable('Joystream Atlas')
    const accounts = await web3Accounts()
    if (accounts.length) {
      setAccounts(accounts)
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      fetchAccounts()
    }, 2000)
    return () => clearInterval(interval)
  }, [fetchAccounts])

  const handleSubmitSelectedAccount = async () => {
    if (selectedAccountAddress) {
      await setActiveUser({
        accountId: selectedAccountAddress,
        memberId: null,
        channelId: null,
      })
      onStepChange(currentStepIdx + 1)
    }
  }

  const handleSelect: (e: React.MouseEvent<HTMLElement>) => void = (e) => {
    const element = e.currentTarget as HTMLInputElement
    setSelectedAccountAddress(element.value)
  }

  return (
    <SwitchTransition>
      <CSSTransition
        key={!accounts?.length ? 'loading' : 'accounts'}
        classNames={transitions.names.fadeAndSlide}
        timeout={parseInt(transitions.timings.routing)}
      >
        {!accounts?.length ? (
          <StepWrapper centered>
            {!imageLoaded && <Placeholder height="180px" width="320px" />}
            <CSSTransition in={imageLoaded} classNames="fade" timeout={100}>
              <AccountStepImg src={accountCreation} onLoad={() => setImageLoaded(true)} />
            </CSSTransition>
            <Spinner size="small" />
            <StepTitle variant="h4">Waiting for account creation</StepTitle>
            <Text variant="body2" secondary>
              Follow instructions to create an account:
            </Text>
            <OrderedSteps>
              <OrderedStep secondary variant="caption" as="li">
                Open the extension with the icon in your browser bar.
              </OrderedStep>
              <OrderedStep secondary variant="caption" as="li">
                Click the plus icon
              </OrderedStep>
              <OrderedStep secondary variant="caption" as="li">
                Continue with instructions presented on the screen
              </OrderedStep>
            </OrderedSteps>
            <BottomBarContainer>
              <BottomBarIcon name="dialog-warning"></BottomBarIcon>
              <Text variant="body2" secondary>
                Make sure to safely save your seed phrase!
              </Text>
            </BottomBarContainer>
          </StepWrapper>
        ) : (
          <form onSubmit={handleSubmitSelectedAccount}>
            <StepWrapper centered>
              <IconGroup>
                <img src={polkadotIcon} alt="" />
                <Icon name="connect" />
                <img src={joystreamIcon} alt="" />
              </IconGroup>
              <StepTitle variant="h4">Connect accounts</StepTitle>
              <StepSubTitle secondary>
                Select polkadot account which you want to connect to your new joystream membership.
              </StepSubTitle>
              <AccountsWrapper>
                {accounts?.map(({ address, meta: { name } }) => (
                  <AccountBar
                    key={address}
                    address={address}
                    name={name}
                    onSelect={handleSelect}
                    selectedValue={selectedAccountAddress}
                  />
                ))}
              </AccountsWrapper>
            </StepWrapper>
            <Button type="submit" disabled={!selectedAccountAddress}>
              Connect accounts
            </Button>
          </form>
        )}
      </CSSTransition>
    </SwitchTransition>
  )
}

export type AccountBarProps = {
  name?: string
  address?: string
  onSelect?: (e: React.MouseEvent<HTMLElement>) => void
  selectedValue?: string
}

const AccountBar: React.FC<AccountBarProps> = ({ name, address, onSelect, selectedValue }) => {
  return (
    <AccountWrapper isSelected={selectedValue === address}>
      <AccountInfo>
        <IconWrapper>
          <Icon name="profile" />
        </IconWrapper>
        <div>
          <Text variant="subtitle1">{name}</Text>
          <AccountAddress secondary variant="caption">
            {address}
          </AccountAddress>
        </div>
      </AccountInfo>
      <StyledRadioButton value={address} onClick={onSelect} selectedValue={selectedValue} />
    </AccountWrapper>
  )
}

export default AccountStep
