import accountCreation from '@/assets/account-creation.png'
import { useActiveUser, useJoystream } from '@/hooks'
import { Placeholder, Spinner, Text } from '@/shared/components'
import { transitions } from '@/shared/theme'
import React, { FormEvent, useState } from 'react'
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
  StyledButton,
} from './AccountStep.style'
import polkadotIcon from '@/assets/polkadot.png'
import joystreamIcon from '@/assets/logo.png'
import { StepFooter, BottomBarIcon, StepSubTitle, StepTitle, StepWrapper } from './Steps.style'
import { useNavigate } from 'react-router'
import { SvgGlyphNewChannel, SvgOutlineConnect } from '@/shared/icons'

const AccountStep: React.FC = () => {
  const navigate = useNavigate()
  const { setActiveUser } = useActiveUser()
  const { accounts } = useJoystream()
  const [imageLoaded, setImageLoaded] = useState(false)
  const [selectedAccountAddress, setSelectedAccountAddress] = useState<undefined | string>()

  const handleSubmitSelectedAccount = async (e: FormEvent) => {
    e.preventDefault()
    if (!selectedAccountAddress) {
      return
    }
    await setActiveUser({
      accountId: selectedAccountAddress,
      memberId: null,
      channelId: null,
    })
    navigate({ search: '?step=3' })
  }

  const handleSelect = (id: string) => {
    setSelectedAccountAddress(id)
  }

  return (
    <SwitchTransition>
      <CSSTransition
        key={!accounts?.length ? 'no-accounts' : 'accounts'}
        classNames={transitions.names.fadeAndSlide}
        timeout={parseInt(transitions.timings.routing)}
      >
        {!accounts?.length ? (
          <StepWrapper centered withBottomBar>
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
            <StepFooter>
              <BottomBarIcon />
              <Text variant="body2" secondary>
                Make sure to safely save your seed phrase!
              </Text>
            </StepFooter>
          </StepWrapper>
        ) : (
          <form onSubmit={handleSubmitSelectedAccount}>
            <StepWrapper centered>
              <IconGroup>
                <img src={polkadotIcon} alt="" />
                <SvgOutlineConnect />
                <img src={joystreamIcon} alt="" />
              </IconGroup>
              <StepTitle variant="h4">Connect accounts</StepTitle>
              <StepSubTitle secondary>
                Select polkadot account which you want to connect to your new joystream membership.
              </StepSubTitle>
              <AccountsWrapper>
                {accounts?.map(({ id, name }) => (
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
                  Connect accounts
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
  onSelect?: (e: React.MouseEvent<HTMLElement>) => void
  selectedValue?: string
}

const AccountBar: React.FC<AccountBarProps> = ({ name, id, onSelect, selectedValue }) => {
  return (
    <AccountWrapper isSelected={selectedValue === id}>
      <AccountInfo>
        <IconWrapper>
          <SvgGlyphNewChannel />
        </IconWrapper>
        <div>
          <Text variant="subtitle1">{name}</Text>
          <AccountAddress secondary variant="caption">
            {id}
          </AccountAddress>
        </div>
      </AccountInfo>
      <StyledRadioButton value={id} onClick={onSelect} selectedValue={selectedValue} />
    </AccountWrapper>
  )
}

export default AccountStep
