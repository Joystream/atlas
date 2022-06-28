import { FC, useCallback, useEffect, useMemo, useState } from 'react'

import { SvgActionNewTab, SvgAlertsError24, SvgAlertsInformative24, SvgLogoPolkadot } from '@/components/_icons'
import { IconWrapper } from '@/components/_icons/IconWrapper'
import { Loader } from '@/components/_loaders/Loader'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useMountEffect } from '@/hooks/useMountEffect'
import { useUser, useUserStore } from '@/providers/user'

import { SignInModalStepTemplate } from './SignInModalStepTemplate'
import { StyledBottomBanner, StyledListItem, StyledTopBanner, WalletLogo } from './SignInSteps.styles'
import { SignInStepProps } from './SignInSteps.types'

export const SignInModalWalletStep: FC<SignInStepProps> = ({
  setPrimaryButtonProps,
  goToNextStep,
  hasNavigatedBack,
}) => {
  const smMatch = useMediaMatch('sm')

  const [selectedWalletIdx, setSelectedWalletIdx] = useState<number>(0)
  const [hasError, setHasError] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const { getWalletsList, signIn } = useUser()
  const walletFromStore = useUserStore((state) => state.wallet)

  const wallets = useMemo(() => {
    const unsortedWallets = getWalletsList()
    return unsortedWallets.sort((w1, w2) => {
      // sort order: wallets with logo, installed wallets, all the rest sorted alphabetically
      if (w1.logo.src && !w2.logo.src) return -1
      if (!w1.logo.src && w2.logo.src) return 1

      if (w1.installed && !w2.installed) return -1
      if (!w1.installed && w2.installed) return 1

      return w1.title.localeCompare(w2.title)
    })
  }, [getWalletsList])

  const selectedWallet = (selectedWalletIdx != null && wallets[selectedWalletIdx]) || null

  const handleConfirm = useCallback(async () => {
    if (!selectedWallet) return

    setIsConnecting(true)
    setHasError(false)
    const success = await signIn(selectedWallet.extensionName)
    setIsConnecting(false)

    if (!success) {
      setHasError(true)
      // set error state
      return
    }

    goToNextStep()
  }, [goToNextStep, selectedWallet, signIn])

  const handleSelectWallet = useCallback((idx: number) => {
    setSelectedWalletIdx(idx)
    setHasError(false)
  }, [])

  // if the user has wallet connected already, mark the connected one as selected
  useMountEffect(() => {
    if (!walletFromStore) return

    const index = wallets.findIndex((w) => w.extensionName === walletFromStore.extensionName)

    if (selectedWalletIdx === index) return

    setSelectedWalletIdx(index)
  })

  // send updates to SignInModal on state of primary button
  useEffect(() => {
    setPrimaryButtonProps({
      text: isConnecting
        ? 'Connecting...'
        : selectedWallet?.installed
        ? 'Select wallet'
        : `Install ${selectedWallet?.title}`,
      disabled: isConnecting,
      icon: selectedWallet?.installed ? null : <SvgActionNewTab />,
      iconPlacement: 'right',
      to: selectedWallet?.installed ? undefined : selectedWallet?.installUrl,
      onClick: selectedWallet?.installed ? handleConfirm : undefined,
    })
  }, [handleConfirm, isConnecting, selectedWallet, setPrimaryButtonProps])

  return (
    <SignInModalStepTemplate
      title="Select wallet"
      subtitle="Select which wallet you want to connect with."
      tooltipText="To create a Joystream membership, you need to select a wallet account to connect it with first. It's 100% free."
      hasNavigatedBack={hasNavigatedBack}
    >
      {hasError ? (
        <StyledTopBanner
          title="Something went wrong"
          description={`We could not connect to your wallet. Please, refresh the page to try again. If you've denied ${selectedWallet?.title} access for this website, you'll need to change it in the wallet settings.`}
          icon={<SvgAlertsError24 />}
        />
      ) : null}
      {wallets.map((wallet, idx) => (
        <StyledListItem
          key={wallet.title}
          label={wallet.title}
          caption={wallet.installed ? 'Installed' : undefined}
          size={smMatch ? 'large' : 'medium'}
          selected={selectedWalletIdx === idx}
          destructive={selectedWalletIdx === idx && hasError}
          nodeStart={
            <IconWrapper
              icon={wallet.logo.src ? <WalletLogo src={wallet.logo.src} alt={wallet.logo.alt} /> : <SvgLogoPolkadot />}
            />
          }
          nodeEnd={selectedWalletIdx === idx && isConnecting ? <Loader variant="small" /> : undefined}
          onClick={() => handleSelectWallet(idx)}
        />
      ))}
      {selectedWallet?.installed === false ? (
        <StyledBottomBanner
          description={`Refresh the page if ${selectedWallet.title} is already installed.`}
          icon={<SvgAlertsInformative24 />}
        />
      ) : null}
    </SignInModalStepTemplate>
  )
}
