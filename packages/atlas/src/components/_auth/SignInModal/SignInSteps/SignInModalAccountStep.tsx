import { FC, useCallback, useEffect, useState } from 'react'

import { Banner } from '@/components/Banner'
import { PolkadotIdenticon } from '@/components/PolkadotIdenticon'
import { Loader } from '@/components/_loaders/Loader'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useUser } from '@/providers/user/user.hooks'
import { useWallet } from '@/providers/wallet/wallet.hooks'
import { shortenString } from '@/utils/misc'

import { SignInModalStepTemplate } from './SignInModalStepTemplate'
import { ListItemsWrapper, StyledListItem } from './SignInSteps.styles'
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
  const { memberships } = useUser()
  const { walletAccounts, wallet } = useWallet()

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
      subtitle="Select a wallet account you want your Joystream blockchain membership to be connected with."
      hasNavigatedBack={hasNavigatedBack}
    >
      {accountsWithNoMembership.length !== 0 ? (
        <ListItemsWrapper>
          {accountsWithNoMembership.map((account) => (
            <StyledListItem
              key={account.address}
              label={account.name || 'Account'}
              caption={shortenString(account.address, 5)}
              size={smMatch ? 'large' : 'medium'}
              selected={localSelectedAddress === account.address}
              nodeStart={<PolkadotIdenticon id={account.address} />}
              onClick={() => setLocalSelectedAddress(account.address)}
            />
          ))}
        </ListItemsWrapper>
      ) : (
        <Banner
          title={`Waiting for new ${wallet?.title} accounts...`}
          description="Open your wallet extension and follow the on-screen prompts to create an account. Once you do, your account will appear here."
          icon={<Loader variant="small" />}
        />
      )}
    </SignInModalStepTemplate>
  )
}
