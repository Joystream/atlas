import React, { FormEvent, useState } from 'react'
import { useNavigate } from 'react-router'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { Text } from '@/components/Text'
import { SvgActionChannel, SvgControlsConnect } from '@/components/_icons'
import { useUser } from '@/providers/user'
import { transitions } from '@/styles'

import {
  AccountAddress,
  AccountInfo,
  AccountStepImg,
  AccountWrapper,
  AccountsWrapper,
  IconGroup,
  IconWrapper,
  OrderedStep,
  OrderedSteps,
  StyledButton,
  StyledRadioButton,
  StyledSpinner,
  StyledStepWrapper,
  SubTitle,
} from './AccountStep.styles'
import {
  BottomBarIcon,
  StepFooter,
  StepSubTitle,
  StepTitle,
  StepWrapper,
  StyledJoystreamLogo,
  StyledPolkadotLogo,
} from './SignInSteps.styles'

type AccountStepProps = {
  nextStepPath: string
}

export const AccountStep: React.FC<AccountStepProps> = ({ nextStepPath }) => {
  const navigate = useNavigate()
  const { accounts, setActiveUser, memberships, membershipsLoading } = useUser()
  const [selectedAccountAddress, setSelectedAccountAddress] = useState<undefined | string>()

  const membershipsControllerAccounts = memberships?.map((a) => a.controllerAccount)
  const accountsWithNoMembership = (accounts || []).filter((el) => !membershipsControllerAccounts?.includes(el.id))

  const handleSubmitSelectedAccount = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedAccountAddress) {
      return
    }
    setActiveUser({ accountId: selectedAccountAddress })
    navigate(nextStepPath)
  }

  const handleSelect = (id: string) => {
    setSelectedAccountAddress(id)
  }
  if (membershipsLoading) {
    return <StyledSpinner />
  }
  return (
    <SwitchTransition>
      <CSSTransition
        key={!accountsWithNoMembership?.length ? 'no-accounts' : 'accounts'}
        classNames={transitions.names.fadeAndSlide}
        timeout={parseInt(transitions.timings.routing)}
      >
        {!accountsWithNoMembership?.length ? (
          <StyledStepWrapper>
            <AccountStepImg />
            <StepTitle variant="h500">Create blockchain account</StepTitle>
            <SubTitle variant="t200" secondary>
              Use the Polkadot extension to generate your personal keypair. Follow these instructions:
            </SubTitle>
            <OrderedSteps>
              <OrderedStep secondary variant="t100" as="li">
                Open the extension popup with the icon in your browser bar
              </OrderedStep>
              <OrderedStep secondary variant="t100" as="li">
                Click the plus icon
              </OrderedStep>
              <OrderedStep secondary variant="t100" as="li">
                Continue with instructions presented on the screen
              </OrderedStep>
            </OrderedSteps>
            <StepFooter>
              <BottomBarIcon />
              <Text variant="t200" secondary>
                Make sure to safely save your seed phrase!
              </Text>
            </StepFooter>
          </StyledStepWrapper>
        ) : (
          <form onSubmit={handleSubmitSelectedAccount}>
            <StepWrapper>
              <IconGroup>
                <StyledPolkadotLogo />
                <SvgControlsConnect />
                <StyledJoystreamLogo />
              </IconGroup>
              <StepTitle variant="h500">Connect account</StepTitle>
              <StepSubTitle variant="t200" secondary>
                Select Polkadot account which you want to use to manage your new Joystream membership:
              </StepSubTitle>
              <AccountsWrapper>
                {accountsWithNoMembership?.map(({ id, name }) => (
                  <AccountBar
                    key={id}
                    id={id}
                    name={name}
                    onSelect={() => handleSelect(id)}
                    selectedValue={selectedAccountAddress}
                  />
                ))}
              </AccountsWrapper>
              <StepFooter>
                <StyledButton type="submit" disabled={!selectedAccountAddress}>
                  Connect account
                </StyledButton>
              </StepFooter>
            </StepWrapper>
          </form>
        )}
      </CSSTransition>
    </SwitchTransition>
  )
}

export type AccountBarProps = {
  name?: string
  id?: string
  onSelect?: () => void
  selectedValue?: string
}

export const AccountBar: React.FC<AccountBarProps> = ({ name, id, onSelect, selectedValue }) => {
  return (
    <AccountWrapper isSelected={selectedValue === id}>
      <AccountInfo>
        <IconWrapper>
          <SvgActionChannel />
        </IconWrapper>
        <div>
          <Text variant="t300-strong">{name}</Text>
          <AccountAddress secondary variant="t100">
            {id}
          </AccountAddress>
        </div>
      </AccountInfo>
      <StyledRadioButton value={id} onChange={onSelect} selectedValue={selectedValue} />
    </AccountWrapper>
  )
}
