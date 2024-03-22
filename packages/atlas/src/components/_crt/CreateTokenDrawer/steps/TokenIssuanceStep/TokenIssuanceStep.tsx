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
              description="All tokens minted that are not part of the first payout get unlocked gradually over the course of the vesting period. Vesting period starts after the cliff has passed."
              tooltip={{
                text: 'Do you want your tokens to be gradually available for you to sell, sending the signal to your audience that this project is aimed on long term success? Then choose longer vesting.',
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
                description="A portion of your own tokens that will be released to you right after cliff period."
                tooltip={{
                  text: 'Do you want to send the signal to your token buyers that only a portion of all created tokens is possible to get sold and the rest will get unlocked over time, signalling about long term goals of your project? Then we advise you to choose amount less than 50% here.',
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
            How your tokens will unlock over time
          </Text>
          <Text variant="t200" as="p" color="colorTextMuted">
            You will get a part of your tokens now and get full amount by the end of the vesting duration.
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
      title="Token issuance"
      learnMoreLink=""
      subtitle="At this stage you can issue as many tokens as you want. The more tokens you have in circulation, the less each individual token sold or purchased will impact the token's price if sold on public market."
    >
      <FormField
        label="Tokens issued to your wallet"
        description="Decide how many tokens you want to create for yourself. This amount cannot be changed later. You will be able to sell these tokens to your audience directly or enable a public sale, where others can mint more of your channel tokens in exchange for JOYs."
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
        label="Token assurances"
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
