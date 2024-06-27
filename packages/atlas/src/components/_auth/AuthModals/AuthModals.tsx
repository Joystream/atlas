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
import { YppFinishFlowModal } from '../YppFinishFlowModal'
import { YppFirstFlowModal } from '../YppFirstFlowModal/YppFirstFlowModal'

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
        <YppFirstFlowModal />
      </>
    )
  }

  return (
    <>
      {accountType === 'internal' ? <AccountSetup /> : null}
      {accountType === 'external' ? <ExternalAccountSetup /> : null}
      {accountType === 'ypp' ? <YppFinishFlowModal /> : null}
    </>
  )
}
