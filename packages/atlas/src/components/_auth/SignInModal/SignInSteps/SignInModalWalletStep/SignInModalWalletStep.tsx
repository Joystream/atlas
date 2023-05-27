import { Wallet } from '@talismn/connect-wallets'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'

import { SvgActionNewTab, SvgAlertsError24, SvgAlertsInformative24, SvgLogoPolkadot } from '@/assets/icons'
import { IconWrapper } from '@/components/IconWrapper'
import { Loader } from '@/components/_loaders/Loader'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useMountEffect } from '@/hooks/useMountEffect'
import { UnknownWallet, getWalletsList } from '@/providers/wallet/wallet.helpers'
import { useWallet } from '@/providers/wallet/wallet.hooks'
import { isMobile } from '@/utils/browser'
import { capitalizeFirstLetter } from '@/utils/misc'

import { MOBILE_SUPPORTED_WALLETS, walletSort } from './SignInModalWalletStep.utils'

import { SignInModalStepTemplate } from '../SignInModalStepTemplate'
import {
  ListItemsWrapper,
  StyledBottomBanner,
  StyledListItem,
  StyledTopBanner,
  WalletLogo,
} from '../SignInSteps.styles'
import { SignInStepProps } from '../SignInSteps.types'

export const isMobileDevice = isMobile()

export const SignInModalWalletStep: FC<SignInStepProps> = ({
  setPrimaryButtonProps,
  goToNextStep,
  hasNavigatedBack,
}) => {
  const smMatch = useMediaMatch('sm')

  const [selectedWalletIdx, setSelectedWalletIdx] = useState<number>(0)
  const [hasError, setHasError] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const { wallet: walletFromStore, signInToWallet } = useWallet()

  const wallets = useMemo(() => {
    const unsortedWallets = getWalletsList()
    if (isMobileDevice) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const rawWallets = Object.keys((window as any).injectedWeb3 || {})

      const allMoblieWallets = new Set([
        'polkawallet',
        ...rawWallets,
        ...unsortedWallets
          // talisman and polkadot-js will be returned by getWallets function, but they don't have mobile support
          .filter((wallet) => wallet.extensionName !== 'talisman' && wallet.extensionName !== 'polkadot-js')
          .map((wallet) => wallet.extensionName),
      ])

      return Array.from(allMoblieWallets)
        .map((walletName) => {
          const possiblyInstalledWallet = unsortedWallets.find(
            (wallet) => wallet.extensionName === walletName && wallet.extensionName === 'subwallet-js'
          )
          if (possiblyInstalledWallet) {
            return {
              ...possiblyInstalledWallet,
              ...MOBILE_SUPPORTED_WALLETS[walletName as keyof typeof MOBILE_SUPPORTED_WALLETS],
              installed: possiblyInstalledWallet.installed,
              title: capitalizeFirstLetter(possiblyInstalledWallet.title),
            } as Wallet
          }

          return {
            title: capitalizeFirstLetter(walletName),
            extensionName: walletName,
            installed: rawWallets.some((rawWallet) => rawWallet === walletName),
            ...(MOBILE_SUPPORTED_WALLETS[walletName as keyof typeof MOBILE_SUPPORTED_WALLETS] ?? { logo: { src: '' } }),
          } as UnknownWallet
        })
        .sort(walletSort)
    }
    return unsortedWallets.sort(walletSort)
  }, [])

  const selectedWallet = (selectedWalletIdx != null && wallets[selectedWalletIdx]) || null

  const handleConfirm = useCallback(async () => {
    if (!selectedWallet) return

    setIsConnecting(true)
    setHasError(false)
    const success = await signInToWallet(selectedWallet.extensionName)
    setIsConnecting(false)

    if (!success) {
      setHasError(true)
      // set error state
      return
    }

    goToNextStep()
  }, [goToNextStep, selectedWallet, signInToWallet])

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
            caption={
              wallet.installed
                ? 'Installed'
                : isMobileDevice && wallet.extensionName === 'subwallet-js'
                ? 'Recommended'
                : undefined
            }
            size={smMatch ? 'large' : 'medium'}
            selected={selectedWalletIdx === idx}
            destructive={selectedWalletIdx === idx && hasError}
            nodeStart={
              <IconWrapper
                icon={
                  wallet.logo?.src ? <WalletLogo src={wallet.logo.src} alt={wallet.logo.alt} /> : <SvgLogoPolkadot />
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
