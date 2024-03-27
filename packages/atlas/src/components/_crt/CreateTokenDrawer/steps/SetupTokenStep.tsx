import { useLayoutEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { SvgActionLock, SvgActionUnlocked } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { WidgetTile } from '@/components/WidgetTile'
import { SetupStepForm } from '@/components/_crt/CreateTokenDrawer/CreateTokenDrawer.types'
import {
  BottomPlaceholder,
  LeftPlaceholder,
  Shadow,
  WidgetPreviewContainer,
} from '@/components/_crt/CreateTokenDrawer/steps/styles'
import { CrtFormWrapper } from '@/components/_crt/CrtFormWrapper'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { OptionCardGroupRadio } from '@/components/_inputs/OptionCardGroup'
import { RatioSlider } from '@/components/_inputs/Slider'
import { DetailsContent } from '@/components/_nft/NftTile'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useMountEffect } from '@/hooks/useMountEffect'

import { CommonStepProps } from './types'

const accessOptions = [
  {
    label: 'Open',
    caption: 'Anyone can buy, hold and sell your tokens.',
    icon: <SvgActionUnlocked />,
    value: true,
  },
  {
    label: 'Invite only',
    caption: 'Only members that you choose can buy your token.',
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
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<SetupStepForm>({
    defaultValues: form,
  })
  const [titleRef, setTitleRef] = useState<HTMLSpanElement | null>(null)
  const smMatch = useMediaMatch('sm')

  const watchedForm = watch()

  useMountEffect(() => {
    setPrimaryButtonProps({
      text: 'Next step',
      onClick: () => handleSubmit(onSubmit)(),
    })
  })

  useLayoutEffect(() => {
    setPreview(
      <>
        <Shadow />
        <WidgetPreviewContainer>
          <LeftPlaceholder />
          <WidgetTile
            title={<span ref={setTitleRef}>${watchedForm.name || 'BTC'}</span>}
            titleVariant="h700"
            titleColor="colorText"
            customNode={
              <FlexBox gap={5}>
                <Tooltip reference={titleRef} text="Token name" placement="top-start" />
                <DetailsContent
                  avoidIconStyling
                  caption="REVENUE SHARE"
                  content={`${watchedForm.revenueShare}%`}
                  tooltipText="Revenue share allows token holders to claim part of channels earnings proportionate to their ownership of channel tokens supply. Channel owner creates time-bound revenue claiming periods, and token holders stake creator tokens they have for the duration of such period in exchange of receiving JOY tokens, thereby receive portion of channel earnings."
                  tileSize={smMatch ? 'big' : 'bigSmall'}
                  withDenomination
                />
                <DetailsContent
                  avoidIconStyling
                  caption="CREATOR REWARD"
                  content={`${watchedForm.creatorReward}%`}
                  tooltipText="Percentage of total supply that gets automatically minted and added to the channel account. It acts like channel inflation per year and high number here decreases the value of existing tokens. From token holder perspective 5% would mean that in 5 years a holder of 100 tokens has  its value similar to 78 tokens now, so a reduction in value of 28%."
                  tileSize={smMatch ? 'big' : 'bigSmall'}
                  withDenomination
                />
              </FlexBox>
            }
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
      </>
    )
  }, [setPreview, smMatch, titleRef, watchedForm.creatorReward, watchedForm.name, watchedForm.revenueShare])

  return (
    <CrtFormWrapper
      title="Set up Token Parameters"
      subtitle="Enter basic token information and settings."
      learnMoreLink=""
    >
      <Controller
        name="name"
        control={control}
        rules={{
          minLength: {
            value: 3,
            message: 'Name must be at least 3 letters long.',
          },
          maxLength: {
            value: 5,
            message: 'Name can be only 5 letters long.',
          },
          required: {
            value: true,
            message: 'Name is required.',
          },
          pattern: {
            value: /[A-Z]+/,
            message: 'Name should contain only letters.',
          },
        }}
        render={({ field }) => (
          <FormField
            label="Name"
            description="Displayed on the Marketplace and in Portfolios. 5 letters max."
            error={errors.name?.message}
          >
            <Input
              {...field}
              onChange={(event) => {
                field.onChange(event.target.value.toUpperCase())
              }}
              placeholder="BTC"
              nodeStart={
                <Text variant="t300" as="p" color="colorTextMuted">
                  $
                </Text>
              }
            />
          </FormField>
        )}
      />

      <FormField label="Ownership permission" description="Choose between open and controlled ownership.">
        <Controller
          name="isOpen"
          control={control}
          render={({ field: { value, onChange } }) => (
            <OptionCardGroupRadio options={accessOptions} onChange={onChange} selectedValue={value} />
          )}
        />
      </FormField>
      <FormField
        label="Revenue share"
        description="Choose revenue sharing ratio between your channel and token holders. Aim for at least of 50% for your channel."
        tooltip={{
          text:
            'Revenue share allows token holders to claim part of channels earnings proportionate to their ownership of channel tokens supply. ' +
            'Channel owner creates time-bound revenue claiming periods, and token holders stake creator tokens they have for the duration of such period in exchange of receiving JOY tokens, thereby receive portion of channel earnings. ' +
            'Here you set up the maximum % of the channel reward account balance that can be claimed by your token holders, the rest gets immediately moved to channel controller account and can be withdrawn.',
        }}
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
        label="Channel reward"
        tooltip={{
          text:
            'Here you have a chance to set up how much will you be earning from your tokens in % terms from the total supply. Total token supply means all tokens that were ever minted, owned by yourself and all of your token holders collectively.\n' +
            '\n' +
            'This revenue increment is calculated on every block and can be claimed any time. Non-profit projects may choose to set this closer to 0%. We cap this at 14% as everything above this figure may considered to be way above the market convention and sends the wrong signal to the buyers and holders.',
        }}
        description="Earn rewards for running your channel through automatic tokens minting. Choose the annual percentage of new tokens added to the existing supply, and they will be gradually added to your channels balance over the year. Caution: This works like inflation, so creating many tokens will reduce the value of existing ones."
      >
        <Controller
          name="creatorReward"
          control={control}
          render={({ field }) => <RatioSlider {...field} max={14} step={1} />}
        />
      </FormField>
    </CrtFormWrapper>
  )
}
