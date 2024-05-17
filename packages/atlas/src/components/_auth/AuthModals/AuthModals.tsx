import { useMemo } from 'react'

import { ExternalSignInModal } from '@/components/_auth/ExternalSignInModal'
import { LogInModal } from '@/components/_auth/LogInModal'
import { SignUpModal } from '@/components/_auth/SignUpModal'
import { CreateChannelModal } from '@/components/_channel/CreateChannelModal'
import { useAuthStore } from '@/providers/auth/auth.store'

import { ForgotPasswordModal } from '../ForgotPasswordModal/ForgotPasswordModal'

export const AuthModals = () => {
  const { authModalOpenName } = useAuthStore()

  return useMemo(() => {
    switch (authModalOpenName) {
      case 'createChannel':
        return <CreateChannelModal />
      case 'externalLogIn':
        return <ExternalSignInModal />
      case 'forgotPassword':
        return <ForgotPasswordModal />
      case 'logIn':
        return <LogInModal />
      case 'signUp':
        return <SignUpModal />
      default:
        return null
    }
  }, [authModalOpenName])
}
