import { ExternalSignInModal } from '@/components/_auth/ExternalSignInModal'
import { LogInModal } from '@/components/_auth/LogInModal'
import { SignUpModal } from '@/components/_auth/SignUpModal'
import { useAuthStore } from '@/providers/auth/auth.store'

export const AuthModals = () => {
  const { authModalOpenName } = useAuthStore()
  switch (authModalOpenName) {
    case 'logIn':
      return <LogInModal />
    case 'externalLogIn':
      return <ExternalSignInModal />
    case 'signUp':
      return <SignUpModal />
    default:
      return null
  }
}
