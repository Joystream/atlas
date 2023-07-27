import { useEffect, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { SvgAlertsInformative24 } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { CommonStepProps } from '@/components/_crt/CreateTokenDrawer/steps/types'
import { CrtFormWrapper } from '@/components/_crt/CrtFormWrapper'
import { FormField } from '@/components/_inputs/FormField'
import { Input } from '@/components/_inputs/Input'
import { RadioButtonGroup } from '@/components/_inputs/RadioButtonGroup'
import { Select } from '@/components/_inputs/Select'
import { TokenInput } from '@/components/_inputs/TokenInput'

const assuranceOptions = [
  {
    label: 'Secure',
    caption:
      '6 months cliff & 1 year vesting. You won’t receive any tokens now. You will receive 50% of tokens after 6 months of cliff.',
    value: 'secure',
  },
  {
    label: 'Safe (Default)',
    caption: 'No cliff & 6 months vesting. You will receive 50% of tokens now.',
    value: 'safe',
  },
  {
    label: 'Risky',
    caption: 'No cliff & No vesting. You receive all tokens now.',
    value: 'risky',
  },
  {
    label: 'Custom',
    caption: 'Set your own custom cliff, vesting and first payout.',
    value: 'custom',
  },
]

const vestingOptions = [
  {
    value: 'none',
    name: 'No vesting',
  },
  {
    value: 1,
    name: '1 month',
  },
  {
    value: 3,
    name: '3 month',
  },
  {
    value: 6,
    name: '6 month',
  },
]

const cliffOptions = [
  {
    value: 'none',
    name: 'No cliff',
  },
  {
    value: 1,
    name: '1 month',
  },
  {
    value: 3,
    name: '3 month',
  },
  {
    value: 6,
    name: '6 month',
  },
]

const cliffBanner = (
  <Banner
    icon={<SvgAlertsInformative24 />}
    title="You will not be able to start a sale before the cliff ends"
    description="On sale you can sell your own preminted tokens for your own price and receive revenue right after the sale. By putting your tokens under the cliff you won’t be able to use sale until cliff ends. "
    actionButton={{
      text: 'Learn more',
      _textOnly: true,
      onClick: () => undefined,
    }}
  />
)

export const TokenIssuanceStep = ({ setActionBarProps }: CommonStepProps) => {
  const { register, control, watch } = useForm()

  useEffect(() => {
    setActionBarProps({
      primaryButton: {
        text: 'Next step',
      },
      secondaryButton: {
        text: 'Back',
      },
    })
  }, [setActionBarProps])

  const assuranceType = watch('assuranceType')

  const assuranceDetails = useMemo(() => {
    const customVesting = watch('vesting')
    const customCliff = watch('cliff')
    switch (assuranceType) {
      case 'secure':
        return cliffBanner
      case 'custom':
        return (
          <>
            <FormField
              label="Cliff"
              description="Cliff is a period of time that locks your token from being able to sell or transfer."
              tooltip={{
                text: 'If you want to obtain extra security during first few weeks or months from minting your tokens, you may choose to set up a longer cliff. Some choose to focus on the marketing campaign and build up the momentum before tokens get unlocked and can be sold to the audience.',
              }}
            >
              <Controller
                name="cliff"
                control={control}
                render={({ field }) => <Select items={cliffOptions} {...field} />}
              />
            </FormField>
            {customCliff !== 'none' && cliffBanner}
            <FormField
              label="Vesting period"
              description="All tokens minted that are not part of the first payout get unlocked gradually over the course of the vesting period. Vesting period starts after the cliff has passed."
              tooltip={{
                text: 'Do you want your tokens to be gradually available for you to sell, sending the signal to your audience that this project is aimed on long term success? Then choose longer vesting.',
              }}
            >
              <Controller
                name="vesting"
                control={control}
                render={({ field }) => <Select items={vestingOptions} {...field} />}
              />
            </FormField>
            {customVesting !== 'none' && (
              <FormField
                label="First payout"
                description="A portion of your own tokens that will be released to you right after cliff period."
                tooltip={{
                  text: 'Do you want to send the signal to your token buyers that only a portion of all created tokens is possible to get sold and the rest will get unlocked over time, signalling about long term goals of your project? Then we advise you to choose amount less than 50% here.',
                }}
              >
                <Controller name="firstPayout" control={control} render={({ field }) => <TokenInput {...field} />} />
              </FormField>
            )}
          </>
        )
      case 'risky':
      case 'safe':
      default:
        return null
    }
  }, [assuranceType, control, watch])

  return (
    <CrtFormWrapper
      title="Token issuance"
      titleLink=""
      subtitle="At this stage you can issue as many tokens as you want. The more tokens you have in circulation, the less each individual token sold or purchased will impact the token's price if sold on public market."
    >
      <FormField
        label="Tokens issued to your wallet"
        description="Decide how many tokens you want to create for yourself. This amount cannot be changed later. You will be able to sell these tokens to your audience directly or enable a public sale, where others can mint more of your channel tokens in exchange for JOYs."
      >
        <Input {...register('issuedAmount')} />
      </FormField>
      <FormField
        label="Token assurances"
        description="Add cliff & vesting for your own tokens to make your followers feel more secure when investing in your channel."
        tooltip={{
          text: "These parameters are set up to restrict your ability to sell your own tokens over time. There's a benefit of extra security in locking the portion of your tokens, which acts as a safety net in case your account gets compromised. Additionally, restricting token sales allows all holders to minimise the manipulation of token price by the biggest token owner, which will be yourself at start, and block the infamous pump and dump tactics. ",
        }}
      >
        <Controller
          name="assuranceType"
          control={control}
          render={({ field }) => <RadioButtonGroup {...field} options={assuranceOptions} />}
        />
      </FormField>
      {assuranceDetails}
    </CrtFormWrapper>
  )
}
