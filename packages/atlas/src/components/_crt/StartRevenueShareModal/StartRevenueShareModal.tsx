import { useApolloClient } from '@apollo/client'
import styled from '@emotion/styled'
import { BN } from 'bn.js'
import { useCallback, useMemo } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { FlexBox } from '@/components/FlexBox/FlexBox'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { AuctionDatePicker, AuctionDatePickerProps } from '@/components/_inputs/AuctionDatePicker'
import { FormField } from '@/components/_inputs/FormField'
import { DetailsContent } from '@/components/_nft/NftTile'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useJoystream, useSubscribeAccountBalance } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { pluralizeNoun } from '@/utils/misc'
import { permillToPercentage } from '@/utils/number'
import { addDaysToDate } from '@/utils/time'

export type StartRevenueShareProps = {
  token: FullCreatorTokenFragment
  onClose: () => void
  show: boolean
}

const datePickerItemsFactory = (days: number[]) =>
  days.map((value) => ({
    name: pluralizeNoun(value, 'day'),
    value: {
      type: 'duration' as const,
      durationDays: value,
    },
  }))

const endDateItems = datePickerItemsFactory([7, 14, 30])

export const StartRevenueShare = ({ token, onClose, show }: StartRevenueShareProps) => {
  const smMatch = useMediaMatch('sm')
  const { memberId, channelId, activeChannel } = useUser()
  const { displaySnackbar } = useSnackbar()
  const memoizedChannelStateBloatBond = useMemo(() => {
    return new BN(activeChannel?.channelStateBloatBond || 0)
  }, [activeChannel?.channelStateBloatBond])
  const { accountBalance: channelBalance } = useSubscribeAccountBalance(activeChannel?.rewardAccount, {
    channelStateBloatBond: memoizedChannelStateBloatBond,
  })
  const { joystream, proxyCallback } = useJoystream()
  const handleTransaction = useTransaction()
  const form = useForm<{
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
  const [startDate, endDate] = watch(['startDate', 'endDate'])

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
          ? (convertMsTimestampToBlock(addDaysToDate(data.endDate.durationDays, rawStartDate).getTime()) ?? 0) -
            startBlock
          : null

      if (typeof duration !== 'number' || duration < 0) {
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
  const patronageRate = permillToPercentage(token.revenueShareRatioPermill) / 100

  const details = useMemo(
    () => [
      {
        title: 'You will share',
        content: (
          <NumberFormat
            value={channelBalance ?? 0}
            as="p"
            variant="t100"
            color="colorText"
            withDenomination="before"
            withToken
          />
        ),
      },
      {
        title: 'You will receive',
        content: (
          <FlexBox alignItems="baseline" width="fit-content">
            <NumberFormat
              value={channelBalance?.muln(patronageRate) ?? 0}
              as="p"
              variant="t100"
              color="colorText"
              withToken
            />
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
              value={channelBalance?.muln(1 - patronageRate) ?? 0}
              as="p"
              variant="t100"
              color="colorText"
              withToken
            />
            <Text variant="t100" as="p" color="colorText">
              ({Math.round((1 - patronageRate) * 100)}%)
            </Text>
          </FlexBox>
        ),
      },
    ],
    [channelBalance, patronageRate]
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
            content={channelBalance ?? 0}
            icon={<JoyTokenIcon size={smMatch ? 24 : 16} variant="silver" />}
            withDenomination
          />
        </FlexBox>

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
