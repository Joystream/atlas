import { Button } from '@/components/_buttons/Button'
import { useAuthStore } from '@/providers/auth/auth.store'

export const PlaygroundSignUp = () => {
  const {
    actions: { setAuthModalOpenName },
  } = useAuthStore()
  return <Button onClick={() => setAuthModalOpenName('signUp')}>Sign up</Button>
}
