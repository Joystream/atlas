import { Button } from '@/components/_buttons/Button'
import { useUser } from '@/providers/user/user.hooks'

export const PlaygroundSignUp = () => {
  const { setSignUpModalOpen } = useUser()
  return <Button onClick={() => setSignUpModalOpen(true)}>Sign up</Button>
}
