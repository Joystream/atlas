import styled from '@emotion/styled'
import { useCallback, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { FlexBox } from '@/components/FlexBox/FlexBox'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { AuctionDatePicker, AuctionDatePickerProps } from '@/components/_inputs/AuctionDatePicker'
import { FormField } from '@/components/_inputs/FormField'
import { TokenInput } from '@/components/_inputs/TokenInput'
import { DetailsContent } from '@/components/_nft/NftTile'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { pluralizeNoun } from '@/utils/misc'

export type SellTokenModalProps = {
  tokenId: string
  onClose: () => void
  show: boolean
}

const getTokenDetails = (_: string) => ({
  title: 'JBC',
  pricePerUnit: 1000,
  tokensOnSale: 67773,
  userBalance: 100000,
  patronageRate: 0.8,
})

const datePickerItemsFactory = (days: number[]) =>
  days.map((value) => ({
    name: pluralizeNoun(value, 'day'),
    value: {
      type: 'duration' as const,
      durationDays: value,
    },
  }))

const endDateItems = datePickerItemsFactory([7, 14, 30])

export const StartRevenueShare = ({ tokenId, onClose, show }: SellTokenModalProps) => {
  const [tokens, setTokens] = useState<number | null>(null)
  const smMatch = useMediaMatch('sm')
  const { patronageRate, userBalance, title } = getTokenDetails(tokenId)

  const form = useForm<{
    tokens: number | null
    startDate: AuctionDatePickerProps['value'] | null
    endDate: AuctionDatePickerProps['value'] | null
  }>()
  const { trigger, control, watch } = form

  const details = useMemo(
    () => [
      {
        title: 'You will receive',
        content: (
          <FlexBox alignItems="baseline" width="fit-content">
            <NumberFormat value={(tokens ?? 0) * patronageRate} as="p" variant="t100" color="colorText" withToken />
            <Text variant="t100" as="p" color="colorText">
              ({Math.round(patronageRate * 100)}%)
            </Text>
          </FlexBox>
        ),
      },
      {
        title: 'You will spend',
        content: (
          <FlexBox alignItems="baseline" width="fit-content">
            <NumberFormat
              value={(tokens ?? 0) * (1 - patronageRate)}
              as="p"
              variant="t100"
              color="colorText"
              withToken
            />
            <Text variant="t100" as="p" color="colorText">
              ( {Math.round(1 - patronageRate) * 100}%)
            </Text>
          </FlexBox>
        ),
      },
    ],
    [patronageRate, tokens]
  )

  const [startDate, endDate] = watch(['startDate', 'endDate'])

  const selectDurationToDate = useCallback((value: AuctionDatePickerProps['value'], base?: Date) => {
    if (value?.type === 'date') {
      return value.date
    }

    if (value?.type === 'duration') {
      const now = base ? new Date(base.getTime()) : new Date()
      now.setDate(now.getDate() + value.durationDays)
      return now
    }
    return undefined
  }, [])

  return (
    <DialogModal
      title={`Sell $${title}`}
      show={show}
      onExitClick={onClose}
      primaryButton={{
        text: 'Sell tokens',
      }}
    >
      <FlexBox flow="column" gap={8}>
        <FlexBox gap={6} equalChildren>
          <DetailsContent
            avoidIconStyling
            tileSize={smMatch ? 'big' : 'bigSmall'}
            caption="YOUR CHANNEL BALANCE"
            content={userBalance}
            icon={<JoyTokenIcon size={smMatch ? 24 : 16} variant="silver" />}
            withDenomination
          />
        </FlexBox>
        <FormField
          label="Amount to share"
          description="Those tokens will be withdrawn from your channel balance and divided between you and your token holders."
        >
          <TokenInput
            value={tokens}
            onChange={setTokens}
            placeholder="0"
            nodeEnd={
              <FlexBox gap={2} alignItems="baseline">
                <Text variant="t300" as="p" color="colorTextMuted">
                  $0.00
                </Text>
                <TextButton>Max</TextButton>
              </FlexBox>
            }
          />
        </FormField>

        <FlexBox flow="column" gap={2}>
          {details.map((row) => (
            <FlexBox key={row.title} alignItems="center" justifyContent="space-between">
              <FlexBox width="fit-content" alignItems="center">
                <Text variant="t100" as="p" color="colorText">
                  {row.title}
                </Text>
              </FlexBox>
              {row.content}
            </FlexBox>
          ))}
        </FlexBox>

        <FlexBox equalChildren alignItems="center" gap={6}>
          <Controller
            name="startDate"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormField
                error={error?.message}
                // TODO shake animation on date picker is very glitchy, for now just disable it
                disableErrorAnimation
                label="Starts"
              >
                <OuterBox>
                  <InnerBox>
                    <AuctionDatePicker
                      error={!!error}
                      minDate={new Date()}
                      maxDate={selectDurationToDate(endDate, selectDurationToDate(startDate))}
                      items={[
                        {
                          value: null,
                          name: 'Now',
                        },
                      ]}
                      onChange={(value) => {
                        onChange(value)
                        trigger('startDate')
                      }}
                      value={value}
                    />
                  </InnerBox>
                </OuterBox>
              </FormField>
            )}
          />
          <Controller
            name="endDate"
            control={control}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormField
                error={error?.message}
                // TODO shake animation on date picker is very glitchy, for now just disable it
                disableErrorAnimation
                label="Ends"
              >
                <OuterBox>
                  <InnerBox>
                    <AuctionDatePicker
                      error={!!error}
                      minDate={selectDurationToDate(startDate)}
                      items={endDateItems}
                      onChange={(value) => {
                        onChange(value)
                        trigger('endDate')
                      }}
                      value={value}
                    />
                  </InnerBox>
                </OuterBox>
              </FormField>
            )}
          />
        </FlexBox>
      </FlexBox>
    </DialogModal>
  )
}

const OuterBox = styled.div`
  position: relative;
  height: 50px;
`

const InnerBox = styled.div`
  position: absolute;
  inset: 0;
`
