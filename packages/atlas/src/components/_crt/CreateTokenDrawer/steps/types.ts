import { CrtDrawerProps } from '@/components/CrtDrawer'

import { CreateTokenForm } from '../CreateTokenDrawer.types'

export type CommonStepProps = {
  setPrimaryButtonProps: (props: NonNullable<CrtDrawerProps['actionBar']>['primaryButton']) => void
  form: CreateTokenForm
}
