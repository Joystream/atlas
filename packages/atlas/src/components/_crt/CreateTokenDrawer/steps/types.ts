import { ReactNode } from 'react'

import { CrtDrawerProps } from '@/components/CrtDrawer'

import { CreateTokenForm } from '../CreateTokenDrawer.types'

export type CommonStepProps = {
  setPrimaryButtonProps: (props: NonNullable<CrtDrawerProps['actionBar']>['primaryButton']) => void
  setPreview: (preview: ReactNode) => void
  form: CreateTokenForm
  scrollFormDown: () => void
}
