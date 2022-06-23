import { FC, useCallback, useEffect, useState } from 'react'

import { Banner } from '@/components/Banner'
import { PolkadotIdenticon } from '@/components/PolkadotIdenticon'
import { Loader } from '@/components/_loaders/Loader'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useUser } from '@/providers/user'
import { shortenAddress } from '@/utils/address'

import { SignInModalStepTemplate } from './SignInModalStepTemplate'
import { StyledListItem } from './SignInSteps.styles'
import { SignInStepProps } from './SignInSteps.types'

type SignInModalAccountStepProps = SignInStepProps & {
  selectedAddress: string | null
  setSelectedAddress: (acc: string) => void
}

export const SignInModalAccountStep: FC<SignInModalAccountStepProps> = ({
  selectedAddress,
  setSelectedAddress,
  setPrimaryButtonProps,
  goToNextStep,
  hasNavigatedBack,
}) => {
  const smMatch = useMediaMatch('sm')

  const [localSelectedAddress, setLocalSelectedAddress] = useState<string | null>(selectedAddress)
  const { walletAccounts, memberships } = useUser()

  const membershipsControllerAccounts = memberships?.map((a) => a.controllerAccount)
  const accountsWithNoMembership = walletAccounts.filter((el) => !membershipsControllerAccounts?.includes(el.address))

  const handleConfirm = useCallback(() => {
    if (!localSelectedAddress) return

    setSelectedAddress(localSelectedAddress)
    goToNextStep()
  }, [goToNextStep, localSelectedAddress, setSelectedAddress])

  // select first account when there's nothing selected
  useEffect(() => {
    if (localSelectedAddress || !accountsWithNoMembership.length) return

    setLocalSelectedAddress(accountsWithNoMembership[0].address)
  }, [accountsWithNoMembership, localSelectedAddress])

  // send updates to SignInModal on state of primary button
  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Select account',
      disabled: !localSelectedAddress,
      onClick: handleConfirm,
    })
  }, [handleConfirm, localSelectedAddress, setPrimaryButtonProps])

  return (
    <SignInModalStepTemplate
      title="Select account"
      subtitle="Select which account you want your Joystream membership to be connected with."
      tooltipText="To create a Joystream membership, you need to select a wallet account to connect it with first. It's 100% free."
      hasNavigatedBack={hasNavigatedBack}
    >
      {accountsWithNoMembership.length !== 0 ? (
        accountsWithNoMembership.map((account) => (
          <StyledListItem
            key={account.address}
            label={account.name || 'Account'}
            caption={shortenAddress(account.address, 5, 5)}
            size={smMatch ? 'large' : 'medium'}
            selected={localSelectedAddress === account.address}
            nodeStart={<PolkadotIdenticon id={account.address} />}
            onClick={() => setLocalSelectedAddress(account.address)}
          />
        ))
      ) : (
        <Banner description="Waiting for new wallet accounts..." icon={<Loader variant="small" />} />
      )}
    </SignInModalStepTemplate>
  )
}
