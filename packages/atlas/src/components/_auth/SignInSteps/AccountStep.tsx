import { Dispatch, FC, FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { SvgControlsConnect } from '@/components/_icons'
import { Footer, FooterButtonsContainer } from '@/components/_overlays/Dialog/Dialog.styles'
import { useUser } from '@/providers/user'
import { transitions } from '@/styles'

import {
  AccountAddress,
  AccountInfo,
  AccountStepImg,
  AccountWrapper,
  AccountsWrapper,
  IconGroup,
  OrderedStep,
  OrderedSteps,
  StyledPolkadotIdenticon,
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
  setSelectedAccountAddress: Dispatch<string | undefined>
  selectedAccountAddress?: string
}

export const AccountStep: FC<AccountStepProps> = ({
  nextStepPath,
  setSelectedAccountAddress,
  selectedAccountAddress,
}) => {
  const navigate = useNavigate()
  const { walletAccounts, memberships, isAuthLoading } = useUser()

  const membershipsControllerAccounts = memberships?.map((a) => a.controllerAccount)
  const accountsWithNoMembership = walletAccounts.filter((el) => !membershipsControllerAccounts?.includes(el.address))

  const handleSubmitSelectedAccount = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedAccountAddress) {
      return
    }
    navigate({ search: nextStepPath })
  }

  const handleSelect = (id: string) => {
    setSelectedAccountAddress(id)
  }
  if (isAuthLoading) {
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
          <>
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
            </StyledStepWrapper>
            <StepFooter>
              <BottomBarIcon />
              <Text variant="t200" secondary>
                Make sure to safely save your seed phrase!
              </Text>
            </StepFooter>
          </>
        ) : (
          <>
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
                {accountsWithNoMembership?.map(({ address, name }) => (
                  <AccountBar
                    key={address}
                    id={address}
                    name={name}
                    onSelect={() => handleSelect(address)}
                    selectedValue={selectedAccountAddress}
                  />
                ))}
              </AccountsWrapper>
            </StepWrapper>
            <Footer dividers>
              <FooterButtonsContainer>
                <Button type="submit" onClick={handleSubmitSelectedAccount} disabled={!selectedAccountAddress}>
                  Connect account
                </Button>
              </FooterButtonsContainer>
            </Footer>
          </>
        )}
      </CSSTransition>
    </SwitchTransition>
  )
}
export type AccountBarProps = {
  name?: string
  id: string
  onSelect?: () => void
  selectedValue?: string
}

export const AccountBar: FC<AccountBarProps> = ({ name, id, onSelect, selectedValue }) => {
  return (
    <AccountWrapper isSelected={selectedValue === id}>
      <AccountInfo>
        <StyledPolkadotIdenticon id={id} />
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
