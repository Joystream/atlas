import { useWalletContext } from '@/providers/wallet/wallet.provider'
import { useWalletStore } from '@/providers/wallet/wallet.store'

export const useWallet = () => {
  const { walletStatus, walletAccounts, wallet } = useWalletStore()
  const walletContext = useWalletContext()

  return {
    walletStatus,
    walletAccounts,
    wallet,
    ...walletContext,
  }
}
