import { ExternalSignInModal } from '@/components/_auth/ExternalSignInModal'
import { LogInModal } from '@/components/_auth/LogInModal'
import { SignUpModal } from '@/components/_auth/SignUpModal'
import { CreateChannelModal } from '@/components/_channel/CreateChannelModal'
import { useAuthStore } from '@/providers/auth/auth.store'

import { ForgotPasswordModal } from '../ForgotPasswordModal/ForgotPasswordModal'

export const AuthModals = () => {
  const { authModalOpenName } = useAuthStore()

  if (authModalOpenName) {
    return (
      <>
        <LogInModal />
        <ExternalSignInModal />
        <SignUpModal />
        <ForgotPasswordModal />
        <CreateChannelModal />
      </>
    )
  }

  return null
}
