import { useLayoutEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { SvgActionLock, SvgActionUnlocked } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { SetupStepForm } from '@/components/_crt/CreateTokenDrawer/CreateTokenDrawer.types'
import {
  BottomPlaceholder,
  LeftPlaceholder,
  WidgetPreviewContainer,
} from '@/components/_crt/CreateTokenDrawer/steps/styles'
import { CrtBasicInfoWidget } from '@/components/_crt/CrtBasicInfoWidget'
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
    disabled: true,
  },
]

type SetupTokenStepProps = {
  onSubmit: (form: SetupStepForm) => void
} & CommonStepProps

export const SetupTokenStep = ({ setPrimaryButtonProps, onSubmit, form, setPreview }: SetupTokenStepProps) => {
  const {
    register,
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SetupStepForm>({
    defaultValues: form,
  })

  const watchedForm = watch()

  useMountEffect(() => {
    setPrimaryButtonProps({
      text: 'Next step',
      onClick: () => handleSubmit(onSubmit)(),
    })
  })

  useLayoutEffect(() => {
    setPreview(
      <WidgetPreviewContainer>
        <LeftPlaceholder />
        <CrtBasicInfoWidget
          name={watchedForm.name}
          titleColor="colorText"
          details={[
            {
              caption: 'REVENUE SHARE',
              content: `${watchedForm.revenueShare}%`,
              tooltipText: 'Lorem ipsum',
            },
            {
              caption: 'CREATOR REWARD',
              content: `${watchedForm.creatorReward}%`,
              tooltipText: 'Lorem ipsum',
            },
          ]}
        />
        <BottomPlaceholder>
          <svg xmlns="http://www.w3.org/2000/svg" width="371" height="163" viewBox="0 0 371 163" fill="none">
            <path
              d="M0 41C0 34.3726 5.37258 29 12 29C18.6274 29 24 34.3726 24 41C24 47.6274 18.6274 53 12 53C5.37258 53 0 47.6274 0 41Z"
              fill="#181C20"
            />
            <path d="M0 0H91V16H0V0Z" fill="#181C20" />
            <path d="M0 69H49V85H0V69Z" fill="#181C20" />
            <path d="M36 25H147V57H36V25Z" fill="#181C20" />
            <path d="M0 109H371V163H0V109Z" fill="#14171B" />
          </svg>
        </BottomPlaceholder>
      </WidgetPreviewContainer>
    )
  }, [setPreview, watchedForm.creatorReward, watchedForm.name, watchedForm.revenueShare])

  return (
    <CrtFormWrapper title="Set up your token" subtitle="Enter basic token information and settings." learnMoreLink="">
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
Recommended values — Holders:20%, Channel: 80%."
      >
        <Controller
          name="revenueShare"
          control={control}
          render={({ field }) => (
            <RatioSlider
              {...field}
              description={
                <FlexBox gap={2}>
                  <FlexBox width="auto" gap={1}>
                    <Text variant="t100" as="span" color="colorText">
                      Holders:
                    </Text>
                    <Text variant="t100" as="p" color="colorTextStrong">
                      {field.value}%
                    </Text>
                  </FlexBox>
                  <FlexBox gap={1}>
                    <Text variant="t100" as="span" color="colorText">
                      Channel:
                    </Text>
                    <Text variant="t100" as="p" color="colorTextStrong">
                      {100 - field.value}%
                    </Text>
                  </FlexBox>
                </FlexBox>
              }
            />
          )}
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
          render={({ field }) => <RatioSlider {...field} max={20} step={2} />}
        />
      </FormField>
    </CrtFormWrapper>
  )
}
