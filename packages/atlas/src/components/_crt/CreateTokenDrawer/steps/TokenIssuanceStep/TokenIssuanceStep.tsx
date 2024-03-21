import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect, useLayoutEffect } from 'react'
import { flushSync } from 'react-dom'
import { Controller, useForm } from 'react-hook-form'

import { SvgAlertsInformative24 } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { LineChart } from '@/components/_charts/LineChart'
import { IssuanceStepForm } from '@/components/_crt/CreateTokenDrawer/CreateTokenDrawer.types'
import { CommonStepProps } from '@/components/_crt/CreateTokenDrawer/steps/types'
import { CrtFormWrapper } from '@/components/_crt/CrtFormWrapper'
import { FormField } from '@/components/_inputs/FormField'
import { RadioButtonGroup } from '@/components/_inputs/RadioButtonGroup'
import { Select } from '@/components/_inputs/Select'
import { TokenInput } from '@/components/_inputs/TokenInput'
import { useMountEffect } from '@/hooks/useMountEffect'
import { cVar } from '@/styles'
import { formatNumber } from '@/utils/number'
import { formatDate } from '@/utils/time'

import {
  assuranceOptions,
  cliffOptions,
  createTokenIssuanceSchema,
  generateChartData,
  getDataBasedOnType,
  vestingOptions,
} from './TokenIssuanceStep.utils'

import { PreviewContainer, TooltipBox } from '../styles'

const cliffBanner = (
  <Banner
    icon={<SvgAlertsInformative24 />}
    title="You will not be able to start a sale before the cliff ends"
    description="On sale you can sell your own preminted tokens for your own price and receive revenue right after the sale. By putting your tokens under the cliff you won’t be able to use sale until cliff ends. "
    // actionButton={{
    //   text: 'Learn more',
    //   _textOnly: true,
    //   onClick: () => undefined,
    // }}
  />
)

type TokenIssuanceStepProps = {
  onSubmit: (form: IssuanceStepForm) => void
} & CommonStepProps

export const TokenIssuanceStep = ({
  setPrimaryButtonProps,
  onSubmit,
  form,
  setPreview,
  scrollFormDown,
}: TokenIssuanceStepProps) => {
  const {
    control,
    watch,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IssuanceStepForm>({
    resolver: zodResolver(createTokenIssuanceSchema(form.name)),
    defaultValues: form,
  })

  useMountEffect(() => {
    setPrimaryButtonProps({
      text: 'Next step',
      onClick: () => handleSubmit(onSubmit)(),
    })
  })

  const assuranceType = watch('assuranceType')
  const creatorIssueAmount = watch('creatorIssueAmount')
  const customVesting = watch('vesting')
  const customCliff = watch('cliff')
  const firstPayout = watch('firstPayout')

  useEffect(() => {
    if (assuranceType !== 'custom') {
      setValue('cliff', null)
      setValue('vesting', null)
      setValue('firstPayout', undefined)
    }
  }, [assuranceType, setValue])

  useLayoutEffect(() => {
    scrollFormDown()
  }, [customVesting, scrollFormDown])

  const getAssuranceDetails = () => {
    switch (assuranceType) {
      case 'custom':
        return (
          <>
            <FormField
              label="Fully locked period"
              description="During this time tokens from initial allocation cannot be sold or transferred."
              tooltip={{
                text: 'This signals to your investors that they can be 100% sure the token price on the market during this period will be exclusively impacted by market conditions. This is a strong signal of integrity.',
              }}
              error={errors.cliff?.message}
            >
              <Controller
                name="cliff"
                control={control}
                render={({ field }) => <Select items={cliffOptions} {...field} />}
              />
            </FormField>
            {customCliff && customCliff !== '0' ? cliffBanner : null}
            <FormField
              label="Vesting period"
              description="Period during all minted tokens get fully unlocked."
              tooltip={{
                text: 'Longer vesting periods signal longer term intentions and prevent from making mistakes with tokens pricing and transfers.',
              }}
              error={errors.vesting?.message}
            >
              <Controller
                name="vesting"
                control={control}
                render={({ field }) => <Select items={vestingOptions} {...field} />}
              />
            </FormField>
            {customVesting && customVesting !== '0' ? (
              <FormField
                label="First payout"
                description="A portion of your tokens that will be available for trading after locked period expires."
                tooltip={{
                  text: 'We suggest to choose a value less than 50%.',
                }}
                error={errors.firstPayout?.message}
              >
                <Controller
                  name="firstPayout"
                  control={control}
                  render={({ field }) => (
                    <TokenInput
                      {...field}
                      placeholder="25"
                      nodeStart={
                        <Text
                          variant="t300"
                          as="p"
                          color={typeof field.value === 'undefined' ? 'colorTextMuted' : undefined}
                        >
                          %
                        </Text>
                      }
                      nodeEnd={
                        creatorIssueAmount ? (
                          <Text variant="t300" as="p" color="colorTextMuted">
                            {formatNumber((creatorIssueAmount * Number(field.value || 0)) / 100)} ${form.name}
                          </Text>
                        ) : (
                          <div />
                        )
                      }
                    />
                  )}
                />
              </FormField>
            ) : null}
          </>
        )
      case 'risky':
      case 'safe':
      default:
        return null
    }
  }

  useLayoutEffect(() => {
    const data =
      assuranceType === 'custom'
        ? generateChartData(
            Number(customCliff ?? 0),
            Number(customVesting ?? 0),
            firstPayout ? Math.min(Math.max(firstPayout, 0), 100) : 0
          )
        : generateChartData(...(getDataBasedOnType(assuranceType) as [number, number, number]))
    setPreview(
      <PreviewContainer>
        <FlexBox gap={2} flow="column">
          <Text variant="h100" as="h1">
            Tokens unlock schedule preview
          </Text>
          <Text variant="t200" as="p" color="colorTextMuted">
            Hover over the chart to see how many tokens will get unlocked at any time in the future.
          </Text>
        </FlexBox>
        <div className="chart-box">
          <LineChart
            enablePointLabel
            tooltip={(point) => {
              const currentDate = new Date()
              const timeInMonths = point.data.x === 'Now' ? 0 : +(point.data.x as string).split('M')[0]
              return (
                <TooltipBox>
                  <Text variant="t300" as="p">
                    {formatNumber(((creatorIssueAmount ?? 0) * (point.data.y as number)) / 100)} ${form.name}
                  </Text>
                  <Text variant="t100" as="p" color="colorTextMuted">
                    {point.data.x !== 'Now'
                      ? formatDate(new Date(currentDate.setMonth(currentDate.getMonth() + timeInMonths)))
                      : 'Now'}
                  </Text>
                </TooltipBox>
              )
            }}
            yScale={{
              type: 'linear',
              min: 0,
              max: 'auto',
              stacked: false,
              reverse: false,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickValues: [0, 25, 50, 75, 100],
              format: (tick) => `${tick}%`,
            }}
            gridYValues={[0, 25, 50, 75, 100]}
            data={[
              {
                id: 1,
                color: cVar('colorTextPrimary'),
                data,
              },
            ]}
          />
        </div>
      </PreviewContainer>
    )
  }, [assuranceType, creatorIssueAmount, customCliff, customVesting, firstPayout, form.name, setPreview])

  return (
    <CrtFormWrapper
      title="Token Initial Supply"
      learnMoreLink=""
      subtitle="Choose number of tokens minted for your channel right away and their unlocking period."
    >
      <FormField
        label="Channel tokens initial supply"
        description="Define how many tokens tokens to mint right away for your channel. Implications of this choice are explained in the tooltip."
        tooltip={{
          text: `
Low Supply (3k):

- Higher value per token due to scarcity.
- Attracts investors seeking exclusivity.
- Could lead to lower liquidity (harder to buy/sell).
- Potential for price appreciation as demand grows

High Supply (100k):

- Lower value per token due to abundance.
- More accessible to a broader investor base.
- Supports a more active and inclusive market.
- Lesser impact on token value from new issuances or rewards.
        `,
        }}
        error={errors.creatorIssueAmount?.message}
      >
        <Controller
          name="creatorIssueAmount"
          control={control}
          render={({ field }) => (
            <TokenInput
              {...field}
              placeholder="1 000"
              nodeEnd={
                <Text variant="t300" as="p" color="colorTextMuted">
                  ${form.name}
                </Text>
              }
            />
          )}
        />
      </FormField>
      <FormField
        label="Tokens unlock schedule"
        description="Add cliff & vesting for your own tokens to make your followers feel more secure when investing in your channel."
        tooltip={{
          text:
            'Different options presented below correspond to different level of token safety projected to your potential buyers. ' +
            'For example choosing risky option does not signal to your buyers that they are safe from the pump and dump scenario, while secure and safe options signal a safer token purchasing option. ',
        }}
      >
        <Controller
          name="assuranceType"
          control={control}
          render={({ field }) => (
            <RadioButtonGroup
              {...field}
              onChange={(val) => {
                flushSync(() => {
                  field.onChange(val)
                })
                scrollFormDown()
              }}
              options={assuranceOptions}
            />
          )}
        />
      </FormField>
      {getAssuranceDetails()}
    </CrtFormWrapper>
  )
}
