import { useSearchParams } from 'react-router-dom'

import { ExternalSignInModal } from '@/components/_auth/ExternalSignInModal'
import { LogInModal } from '@/components/_auth/LogInModal'
// import { SignUpModal } from '@/components/_auth/SignUpModal'
import { CreateChannelModal } from '@/components/_channel/CreateChannelModal'
import { useAuthStore } from '@/providers/auth/auth.store'

import { AccountSetup } from '../AccountSetup'
import { EmailSetup } from '../EmailSetup'
import { ExternalAccountSetup } from '../ExternalAccountSetup'
import { ForgotPasswordModal } from '../ForgotPasswordModal/ForgotPasswordModal'

export const AuthModals = () => {
  const { authModalOpenName } = useAuthStore()
  const [searchParams] = useSearchParams()

  const accountType = searchParams.get('account-type')

  if (authModalOpenName) {
    return (
      <>
        <LogInModal />
        <ExternalSignInModal />
        {/* old modal <SignUpModal /> */}
        <ForgotPasswordModal />
        <CreateChannelModal />
        <EmailSetup />
        <AccountSetup />
      </>
    )
  }

  return (
    <>
      {accountType === 'internal' ? <AccountSetup /> : null}
      {accountType === 'external' ? <ExternalAccountSetup /> : null}
    </>
  )
}
