import { ExternalSignInModal } from '@/components/_auth/ExternalSignInModal'
import { LogInModal } from '@/components/_auth/LogInModal'
import { SignUpModal } from '@/components/_auth/SignUpModal'
import { useDebounceValue } from '@/hooks/useDebounceValue'
import { useAuthStore } from '@/providers/auth/auth.store'

export const AuthModals = () => {
  const { authModalOpenName } = useAuthStore()
  const debouncedAuthModalOpenName = useDebounceValue(authModalOpenName, 2_000)

  if (debouncedAuthModalOpenName ?? authModalOpenName) {
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
