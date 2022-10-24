import { FC, useCallback, useEffect, useMemo, useState } from 'react'

import { SvgActionNewTab, SvgAlertsError24, SvgAlertsInformative24, SvgLogoPolkadot } from '@/assets/icons'
import polkaWalletLogo from '@/assets/images/polkawallet-logo.webp'
import { IconWrapper } from '@/components/IconWrapper'
import { Loader } from '@/components/_loaders/Loader'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useMountEffect } from '@/hooks/useMountEffect'
import { useUser } from '@/providers/user/user.hooks'
import { useUserStore } from '@/providers/user/user.store'
import { isMobile } from '@/utils/browser'
import { capitalizeFirstLetter } from '@/utils/misc'

import { SignInModalStepTemplate } from './SignInModalStepTemplate'
import { ListItemsWrapper, StyledBottomBanner, StyledListItem, StyledTopBanner, WalletLogo } from './SignInSteps.styles'
import { SignInStepProps } from './SignInSteps.types'

const PRIORITY_WALLETS = ['talisman']
const DEFAULT_PRIORITY = 100000
const isMobileDevice = isMobile()
const POLKAWALLET = 'polkawallet'

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
    const hasPolkaWallet = unsortedWallets.some((wallet) => wallet.extensionName === POLKAWALLET)
    if (isMobileDevice) {
      if (hasPolkaWallet) {
        return unsortedWallets
          .filter((wallet) => wallet.extensionName === POLKAWALLET)
          .map((wallet) => ({
            ...wallet,
            title: capitalizeFirstLetter(wallet.title),
            installed: wallet.installed,
            logo: { src: polkaWalletLogo, alt: 'Polkawallet logo' },
          }))
      }
      return [
        {
          title: 'Polkawallet',
          extensionName: POLKAWALLET,
          installed: false,
          logo: { src: polkaWalletLogo, alt: 'Polkawallet logo' },
          installUrl: 'https://polkawallet.io/',
        },
      ]
    }
    return unsortedWallets.sort((w1, w2) => {
      // known wallets on top (wallets with logo)
      if (w1.logo.src && !w2.logo.src) return -1
      if (!w1.logo.src && w2.logo.src) return 1

      // installed wallets on top
      if (w1.installed && !w2.installed) return -1
      if (!w1.installed && w2.installed) return 1

      // priority wallets on top
      const w1PriorityIndex = PRIORITY_WALLETS.indexOf(w1.extensionName)
      const w2PriorityIndex = PRIORITY_WALLETS.indexOf(w2.extensionName)
      const w1Priority = w1PriorityIndex === -1 ? DEFAULT_PRIORITY : w1PriorityIndex
      const w2Priority = w2PriorityIndex === -1 ? DEFAULT_PRIORITY : w2PriorityIndex
      if (w1Priority < w2Priority) return -1
      if (w1Priority > w2Priority) return 1

      // rest sorted alphabetically
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
        : selectedWallet?.installed || isMobileDevice
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
      title={`Select wallet ${isMobileDevice ? 'app' : ''}`}
      subtitle={
        isMobileDevice
          ? 'Setting up Joystream blockchain membership requires a wallet that can be installed as an app on your phone or as a free browser extension on a desktop.'
          : 'Select which wallet you want to connect with.'
      }
      tooltipText="To create a membership, you need to select a wallet account to connect it with first. This is 100% free."
      hasNavigatedBack={hasNavigatedBack}
    >
      {hasError ? (
        <StyledTopBanner
          title="Something went wrong"
          description={`We could not connect to your wallet. Please, refresh the page to try again. If you've denied ${selectedWallet?.title} access for this website, you'll need to change it in the wallet settings.`}
          icon={<SvgAlertsError24 />}
        />
      ) : null}
      <ListItemsWrapper>
        {wallets.map((wallet, idx) => (
          <StyledListItem
            key={wallet.title}
            label={wallet.title}
            caption={wallet.installed ? 'Installed' : isMobileDevice ? 'Recommended' : undefined}
            size={smMatch ? 'large' : 'medium'}
            selected={selectedWalletIdx === idx}
            destructive={selectedWalletIdx === idx && hasError}
            nodeStart={
              <IconWrapper
                icon={
                  wallet.logo.src ? <WalletLogo src={wallet.logo.src} alt={wallet.logo.alt} /> : <SvgLogoPolkadot />
                }
              />
            }
            nodeEnd={selectedWalletIdx === idx && isConnecting ? <Loader variant="small" /> : undefined}
            onClick={() => handleSelectWallet(idx)}
            highlightWhenActive
          />
        ))}
      </ListItemsWrapper>
      {selectedWallet?.installed === false && !isMobileDevice ? (
        <StyledBottomBanner
          description={`Refresh the page if ${selectedWallet.title} is already installed.`}
          icon={<SvgAlertsInformative24 />}
        />
      ) : null}
    </SignInModalStepTemplate>
  )
}
