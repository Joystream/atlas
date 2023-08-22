import { Meta } from '@storybook/react'
import { useForm } from 'react-hook-form'

import { BenefitsInput } from '@/components/_inputs/BenefitsInput/BenefitsInput'

export default {
  title: 'inputs/BenefitsInput',
  component: BenefitsInput,
} as Meta

export const Default = () => {
  const { control } = useForm()

  return <BenefitsInput control={control} name="storybook" />
}
