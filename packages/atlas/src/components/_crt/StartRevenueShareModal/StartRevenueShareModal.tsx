import { useApolloClient } from '@apollo/client'
import styled from '@emotion/styled'
import { useCallback, useMemo } from 'react'
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
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { pluralizeNoun } from '@/utils/misc'
import { addDaysToDate } from '@/utils/time'

export type StartRevenueShareProps = {
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

export const StartRevenueShare = ({ tokenId, onClose, show }: StartRevenueShareProps) => {
  const smMatch = useMediaMatch('sm')
  const { memberId, channelId } = useUser()
  const { patronageRate, userBalance } = getTokenDetails(tokenId)
  const { displaySnackbar } = useSnackbar()
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const form = useForm<{
    tokens: number | null
    startDate: AuctionDatePickerProps['value'] | null
    endDate: AuctionDatePickerProps['value'] | null
  }>({
    defaultValues: {
      endDate: { type: 'duration', durationDays: 7 },
    },
  })
  const client = useApolloClient()
  const { convertMsTimestampToBlock } = useBlockTimeEstimation()
  const { trigger, control, watch } = form
  const [startDate, endDate, tokens] = watch(['startDate', 'endDate', 'tokens'])

  const onSubmit = () =>
    form.handleSubmit((data) => {
      const rawStartDate = data.startDate?.type === 'date' ? data.startDate.date : new Date()
      const startBlock = convertMsTimestampToBlock(rawStartDate.getTime())
      if (!joystream || !memberId || !channelId || !startBlock) {
        return
      }

      const duration =
        data.endDate?.type === 'date'
          ? convertMsTimestampToBlock(data.endDate.date.getTime())
          : data.endDate?.durationDays
          ? convertMsTimestampToBlock(addDaysToDate(data.endDate.durationDays, rawStartDate).getTime())
          : null

      if (typeof duration !== 'number') {
        displaySnackbar({ title: 'Failed to parse ending date', iconType: 'error', description: 'Please try again.' })
        return
      }

      handleTransaction({
        txFactory: async (updateStatus) =>
          (await joystream.extrinsics).issueRevenueSplit(
            memberId,
            channelId,
            startBlock,
            duration,
            proxyCallback(updateStatus)
          ),
        onTxSync: async () => {
          displaySnackbar({
            title: 'Success',
            iconType: 'success',
          })
          client.refetchQueries({ include: 'active' })
          onClose()
        },
        onError: () => {
          displaySnackbar({
            title: 'Something went wrong',
          })
          onClose()
        },
      })
    })()

  const details = useMemo(
    () => [
      {
        title: 'You will receive',
        content: (
          <FlexBox alignItems="baseline" width="fit-content">
            <NumberFormat value={(tokens || 0) * patronageRate} as="p" variant="t100" color="colorText" withToken />
            <Text variant="t100" as="p" color="colorText">
              ({Math.round(patronageRate * 100)}%)
            </Text>
          </FlexBox>
        ),
      },
      {
        title: 'Your holders will receive',
        content: (
          <FlexBox alignItems="baseline" width="fit-content">
            <NumberFormat
              value={(tokens || 0) * (1 - patronageRate)}
              as="p"
              variant="t100"
              color="colorText"
              withToken
            />
            <Text variant="t100" as="p" color="colorText">
              ( {Math.round((1 - patronageRate) * 100)}%)
            </Text>
          </FlexBox>
        ),
      },
    ],
    [patronageRate, tokens]
  )

  const selectDurationToDate = useCallback((value: AuctionDatePickerProps['value'], base?: Date) => {
    if (value?.type === 'date') {
      return value.date
    }

    if (value?.type === 'duration') {
      return addDaysToDate(value.durationDays, base)
    }
    return undefined
  }, [])

  return (
    <DialogModal
      title="Start revenue share"
      show={show}
      onExitClick={onClose}
      primaryButton={{
        text: 'Start revenue share',
        onClick: () => onSubmit(),
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
        <Controller
          name="tokens"
          control={control}
          render={({ field: { onChange, value } }) => (
            <FormField
              label="Amount to share"
              description="Those tokens will be withdrawn from your channel balance and divided between you and your token holders."
            >
              <TokenInput
                value={value}
                onChange={onChange}
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
          )}
        />

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
              <FormField error={error?.message} disableErrorAnimation label="Starts">
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
              <FormField error={error?.message} disableErrorAnimation label="Ends">
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
