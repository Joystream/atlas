import { useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { SvgActionLock, SvgActionUnlocked } from '@/assets/icons'
import { CrtFormWrapper } from '@/components/_crt/CrtFormWrapper'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { OptionCardGroupRadio } from '@/components/_inputs/OptionCardGroup'
import { RatioSlider } from '@/components/_inputs/Slider'

import { CommonStepProps } from './types'

const accessOptions = [
  {
    label: 'Anyone',
    caption: 'Everyone can own your token.',
    icon: <SvgActionUnlocked />,
    value: 'anyone',
  },
  {
    label: 'Invite only',
    caption: 'Only members on allowlist can own your token. ',
    icon: <SvgActionLock />,
    value: 'locked',
  },
]

const defaultValues = {
  access: 'anyone',
  name: '',
  revenueShare: 50,
  creatorReward: 50,
}

export const SetupTokenStep = ({ setActionBarProps }: CommonStepProps) => {
  const { register, control } = useForm({
    defaultValues,
  })

  useEffect(() => {
    setActionBarProps({
      primaryButton: {
        text: 'Next step',
      },
      secondaryButton: {
        text: 'Cancel',
      },
    })
  }, [setActionBarProps])

  return (
    <CrtFormWrapper title="Set up your token" subtitle="Enter basic token information and settings." titleLink="">
      <FormField
        label="Name"
        description="Choose 3 letter name for your token to be displayed on your token page, tokens marketplace and in your buyers’ portfolio."
      >
        <Input {...register('name')} placeholder="$ABC" />
      </FormField>
      <FormField label="Access" description="Define if everyone can buy your token or only selected memebers.">
        <Controller
          name="access"
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
