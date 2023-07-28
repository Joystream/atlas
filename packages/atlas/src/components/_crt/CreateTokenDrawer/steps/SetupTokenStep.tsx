import { Controller, useForm } from 'react-hook-form'

import { SvgActionLock, SvgActionUnlocked } from '@/assets/icons'
import { Text } from '@/components/Text'
import { SetupStepForm } from '@/components/_crt/CreateTokenDrawer/CreateTokenDrawer.types'
import { CrtFormWrapper } from '@/components/_crt/CrtFormWrapper'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { OptionCardGroupRadio } from '@/components/_inputs/OptionCardGroup'
import { RatioSlider } from '@/components/_inputs/Slider'
import { useMountEffect } from '@/hooks/useMountEffect'

import { CommonStepProps } from './types'

const accessOptions = [
  {
    label: 'Anyone',
    caption: 'Everyone can own your token.',
    icon: <SvgActionUnlocked />,
    value: true,
  },
  {
    label: 'Invite only',
    caption: 'Only members on allowlist can own your token. ',
    icon: <SvgActionLock />,
    value: false,
  },
]

const defaultValues = {
  isOpen: true,
  name: '',
  revenueShare: 50,
  creatorReward: 50,
}

type SetupTokenStepProps = {
  onSubmit: (form: SetupStepForm) => void
} & CommonStepProps

export const SetupTokenStep = ({ setPrimaryButtonProps, onSubmit }: SetupTokenStepProps) => {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<SetupStepForm>({
    defaultValues,
  })

  useMountEffect(() => {
    setPrimaryButtonProps({
      text: 'Next step',
      onClick: () => handleSubmit(onSubmit)(),
    })
  })

  return (
    <CrtFormWrapper title="Set up your token" subtitle="Enter basic token information and settings." titleLink="">
      <FormField
        label="Name"
        description="Choose 3 letter name for your token to be displayed on your token page, tokens marketplace and in your buyers’ portfolio."
        error={errors.name?.message}
      >
        <Input
          {...register('name', {
            maxLength: {
              value: 3,
              message: 'Name must be 3 letters long.',
            },
            minLength: {
              value: 3,
              message: 'Name must be 3 letters long.',
            },
            required: {
              value: true,
              message: 'Name is required.',
            },
            pattern: {
              value: /[A-Z]+/,
              message: 'Name should contain only uppercase letters.',
            },
          })}
          placeholder="ABC"
          nodeStart={
            <Text variant="t300" as="p" color="colorTextMuted">
              $
            </Text>
          }
        />
      </FormField>
      <FormField label="Access" description="Define if everyone can buy your token or only selected memebers.">
        <Controller
          name="isOpen"
          control={control}
          render={({ field: { value, onChange } }) => (
            <OptionCardGroupRadio options={accessOptions} onChange={onChange} selectedValue={value} />
          )}
        />
      </FormField>
      <FormField
        label="Revenue share with holders"
        description="Define the share of your channel revenue that goes to yourself vs shared with your token holders.
Recommended values — Channel: 80%, Holders:20%. "
      >
        <Controller
          name="revenueShare"
          control={control}
          render={({ field }) => <RatioSlider id="revenueShare" {...field} />}
        />
      </FormField>
      <FormField
        label="Annual creator reward"
        tooltip={{
          text:
            'Here you have a chance to set up how much will you be earning from your tokens in % terms from the total supply. Total token supply means all tokens that were ever minted, owned by yourself and all of your token holders collectively.\n' +
            '\n' +
            'This revenue increment is calculated on every block and can be claimed any time. Non-profit projects may choose to set this closer to 0%. We cap this at 30% as everything above this figure may considered to be way above the market convention and sends the wrong signal to the buyers and holders.',
        }}
        description="Define your own reward for managing the tokens. 10% means that if you have 10000k of tokens exist and this amount does not change, an additional 1k tokens will get minted and added to your wallet gradually over the course of 1 year."
      >
        <Controller
          name="creatorReward"
          control={control}
          render={({ field }) => <RatioSlider id="creatorReward" {...field} />}
        />
      </FormField>
    </CrtFormWrapper>
  )
}
