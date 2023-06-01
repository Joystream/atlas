import { Button } from '@/components/_buttons/Button'
import { useAuthStore } from '@/providers/auth/auth.store'

export const PlaygroundSignUp = () => {
  const {
    actions: { setSignUpModalOpen },
  } = useAuthStore()
  return <Button onClick={() => setSignUpModalOpen(true)}>Sign up</Button>
}
