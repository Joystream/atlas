import { Button } from '@/components/_buttons/Button'
import { useAuthStore } from '@/providers/auth/auth.store'

export const PlaygroundSignUp = () => {
  const {
    actions: { setAuthModalOpen },
  } = useAuthStore()
  return <Button onClick={() => setAuthModalOpen('signUp')}>Sign up</Button>
}
