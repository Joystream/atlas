import { CrtDrawerProps } from '@/components/CrtDrawer'

export type CommonStepProps = {
  setPrimaryButtonProps: (props: NonNullable<CrtDrawerProps['actionBar']>['primaryButton']) => void
}
