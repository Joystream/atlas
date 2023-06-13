import { ExternalSignInModal } from '@/components/_auth/ExternalSignInModal'
import { LogInModal } from '@/components/_auth/LogInModal'
import { SignUpModal } from '@/components/_auth/SignUpModal'
import { useAuthStore } from '@/providers/auth/auth.store'

export const AuthModals = () => {
  const { authModalOpenName } = useAuthStore()

  if (authModalOpenName) {
    return (
      <>
        <LogInModal />
        <ExternalSignInModal />
        <SignUpModal />
      </>
    )
  }

  return null
}
