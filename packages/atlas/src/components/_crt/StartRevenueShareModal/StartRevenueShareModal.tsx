import styled from '@emotion/styled'
import { BN } from 'bn.js'
import { useCallback, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useGetFullCreatorTokenLazyQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import {
  SvgActionArrowRight,
  SvgActionClock,
  SvgActionCreatorToken,
  SvgActionLinkUrl,
  SvgAlertsWarning24,
} from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox/FlexBox'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { ClaimShareModal } from '@/components/_crt/ClaimShareModal'
import { SuccessActionModalTemplate } from '@/components/_crt/SuccessActionModalTemplate'
import { AuctionDatePicker, AuctionDatePickerProps } from '@/components/_inputs/AuctionDatePicker'
import { FormField } from '@/components/_inputs/FormField'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { absoluteRoutes } from '@/config/routes'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useClipboard } from '@/hooks/useClipboard'
import { useGetTokenBalance } from '@/hooks/useGetTokenBalance'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { useFee, useJoystream, useSubscribeAccountBalance } from '@/providers/joystream'
import { useNetworkUtils } from '@/providers/networkUtils/networkUtils.hooks'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { sizes } from '@/styles'
import { SentryLogger } from '@/utils/logs'
import { pluralizeNoun } from '@/utils/misc'
import { permillToPercentage } from '@/utils/number'
import { addDaysToDate, formatDateTimeAt } from '@/utils/time'

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
  const [openClaimShareModal, setOpenClaimShareModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const { joystream, proxyCallback, chainState } = useJoystream()
  const { refetchCreatorTokenData, refetchChannelPayments } = useNetworkUtils()
  const { memberId, channelId, activeChannel } = useUser()
  const { displaySnackbar } = useSnackbar()
  const handleTransaction = useTransaction()
  const { copyToClipboard } = useClipboard()
  const { convertMsTimestampToBlock, convertBlocksToDuration } = useBlockTimeEstimation()
  const { tokenBalance } = useGetTokenBalance(token.id, memberId ?? '-1')
  const [refetchToken, { data: localTokenData }] = useGetFullCreatorTokenLazyQuery({
    variables: {
      id: token.id,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'no-cache',
  })
  const { fullFee } = useFee('issueRevenueSplitTx', ['1', '1', 10000, 10000])
  const { trackRevenueShareStarted } = useSegmentAnalytics()

  const memoizedChannelStateBloatBond = useMemo(() => {
    return new BN(activeChannel?.channelStateBloatBond || 0)
  }, [activeChannel?.channelStateBloatBond])
  const { accountBalance: channelBalance } = useSubscribeAccountBalance(activeChannel?.rewardAccount, {
    channelStateBloatBond: memoizedChannelStateBloatBond,
  })

  const { trigger, handleSubmit, control, watch, resetField } = useForm<{
    startDate: AuctionDatePickerProps['value'] | null
    endDate: AuctionDatePickerProps['value'] | null
  }>({
    defaultValues: {
      endDate: { type: 'duration', durationDays: 7 },
    },
  })
  const [startDate, endDate] = watch(['startDate', 'endDate'])
  const endDateTimestamp = useMemo(() => {
    // we need to create new date object to avoid modifying it in addDaysToDate
    const rawStartDate = startDate?.type === 'date' ? new Date(startDate.date.getTime()) : new Date()
    return endDate?.type === 'date'
      ? endDate.date
      : endDate?.durationDays
      ? addDaysToDate(endDate.durationDays, rawStartDate)
      : new Date()
  }, [endDate, startDate])

  const onSubmit = () =>
    handleSubmit((data) => {
      const rawStartDate = startDate?.type === 'date' ? new Date(startDate.date.getTime()) : new Date()
      const startBlock = convertMsTimestampToBlock(rawStartDate.getTime())

      if (channelBalance?.lten(0)) {
        displaySnackbar({
          iconType: 'warning',
          title: 'Cannot start revenue share',
          description:
            'Your channel reward account must have positive JOY balance. YPP, NFT sales and DAO rewards result in channel rewards.',
        })
        return
      }

      if (!joystream || !memberId || !channelId || !startBlock) {
        SentryLogger.error('Failed submit to start revenue share', 'StartRevenueShare', {
          joystream,
          memberId,
          channelId,
          startBlock,
        })
        return
      }

      const duration =
        data.endDate?.type === 'date'
          ? (convertMsTimestampToBlock(data.endDate.date.getTime()) ?? 0) - startBlock
          : data.endDate?.durationDays
          ? (convertMsTimestampToBlock(addDaysToDate(data.endDate.durationDays, rawStartDate).getTime()) ?? 0) -
            startBlock
          : null

      if (typeof duration !== 'number' || duration < 0) {
        displaySnackbar({
          title: duration && duration < 0 ? 'Revenue share cannot end in the past' : 'Failed to parse ending date',
          iconType: 'error',
          description: 'Please try again.',
        })
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
          refetchChannelPayments(channelId!)
          // we need to refetch token locally to avoid unmount parent modal due to revenue share activation
          refetchToken().then(() => {
            onClose()
            setShowSuccessModal(true)
          })
          trackRevenueShareStarted(channelId, token.id, token.symbol || 'N/A')
        },
        onError: () => {
          displaySnackbar({
            title: 'Something went wrong',
          })
          SentryLogger.error('Failed to start revenue share', 'StartRevenueShare', {
            joystream,
            memberId,
            channelId,
            startBlock,
          })
          onClose()
        },
      })
    })()
  const patronageRate = permillToPercentage(token.revenueShareRatioPermill) / 100

  const successDetails = useMemo(() => {
    if (localTokenData?.creatorTokenById) {
      return [
        {
          text: 'Your membership account is already credited with your portion of channel revenue.',
          icon: <SvgActionArrowRight />,
        },
        {
          text: 'Remind your holders to stake in order to claim their part of revenue. This does not happen automatically.',
          icon: <SvgActionClock />,
          actionNode: (
            <TextButton
              onClick={() =>
                copyToClipboard(
                  `${window.location.host}${absoluteRoutes.viewer.channel(channelId ?? '', { tab: 'Token' })}`
                )
              }
              icon={<SvgActionLinkUrl />}
              iconPlacement="right"
            >
              Copy link to token page
            </TextButton>
          ),
        },
        {
          text: `Make sure to stake ${tokenBalance} $${localTokenData.creatorTokenById.symbol} your membership owns to claim sharable part of revenue.`,
          icon: <SvgActionCreatorToken />,
          variant: 'warning' as const,
          actionNode: (
            <TextButton
              onClick={() => {
                setShowSuccessModal(false)
                setOpenClaimShareModal(true)
              }}
            >
              Stake your tokens now
            </TextButton>
          ),
        },
      ]
    }

    return []
  }, [channelId, copyToClipboard, localTokenData, tokenBalance])

  const details = useMemo(
    () => [
      {
        title: 'Revenue share ends on',
        content: (
          <Text variant="t200" as="p">
            {formatDateTimeAt(endDateTimestamp)}
          </Text>
        ),
      },
      {
        title: 'You will share',
        content: <NumberFormat value={channelBalance ?? 0} as="p" variant="t200" withDenomination="before" withToken />,
      },

      {
        title: 'All holders can receive',
        content: (
          <FlexBox alignItems="baseline" width="fit-content">
            <NumberFormat
              value={channelBalance?.divn(100).muln(patronageRate * 100) ?? 0}
              as="p"
              variant="t200"
              withToken
              withDenomination="before"
            />
            <Text variant="t200" as="p">
              ({Math.round(patronageRate * 100)}%)
            </Text>
          </FlexBox>
        ),
      },
      {
        title: 'Transaction fee',
        content: <NumberFormat value={fullFee} as="p" variant="t200" withDenomination="before" withToken />,
      },
      {
        title: 'You will receive',
        variant: 'h300' as const,
        content: (
          <FlexBox alignItems="baseline" width="fit-content">
            <NumberFormat
              value={channelBalance?.divn(100).muln((1 - patronageRate) * 100) ?? 0}
              as="p"
              variant="h300"
              withToken
              withDenomination="before"
            />
            <Text variant="t200" as="p">
              ({Math.round((1 - patronageRate) * 100)}%)
            </Text>
          </FlexBox>
        ),
      },
    ],
    [channelBalance, endDateTimestamp, fullFee, patronageRate]
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
    <>
      {localTokenData?.creatorTokenById && (
        <ClaimShareModal
          onClose={() => {
            setOpenClaimShareModal(false)
            refetchCreatorTokenData(localTokenData.creatorTokenById?.id ?? '')
          }}
          show={openClaimShareModal}
          token={localTokenData.creatorTokenById}
        />
      )}
      <SuccessActionModalTemplate
        title="Revenue share started!"
        description="There are few things you should know:"
        details={successDetails}
        show={showSuccessModal}
        primaryButton={{
          text: 'Continue',
          onClick: () => {
            setShowSuccessModal(false)
            refetchCreatorTokenData(localTokenData?.creatorTokenById?.id ?? '')
          },
        }}
      />
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
          <FlexBox equalChildren alignItems="start" gap={6}>
            <Controller
              name="startDate"
              control={control}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <FormField error={error?.message} disableErrorAnimation label="Starts">
                  <OuterBox marginTop={2}>
                    <InnerBox>
                      <AuctionDatePicker
                        error={!!error}
                        minDate={new Date()}
                        items={[
                          {
                            value: null,
                            name: 'Now',
                          },
                        ]}
                        onChange={(value) => {
                          onChange(value)
                          if (
                            endDate?.type === 'date' &&
                            value?.type === 'date' &&
                            value.date.getTime() > endDate.date.getTime()
                          ) {
                            resetField('endDate', { defaultValue: { type: 'duration', durationDays: 7 } })
                          }
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
              rules={{
                validate: (value, formValues) => {
                  const rawStartDate =
                    formValues.startDate?.type === 'date' ? new Date(formValues.startDate.date.getTime()) : new Date()

                  const valueTimestamp =
                    value?.type === 'date'
                      ? value.date
                      : value?.durationDays
                      ? addDaysToDate(value.durationDays, new Date(rawStartDate))
                      : new Date()

                  const minDurationMs = convertBlocksToDuration(chainState.minRevenueSplitDuration)

                  if (valueTimestamp.getTime() - Date.now() < minDurationMs) {
                    return `Revenue share must end after ${formatDateTimeAt(
                      new Date(rawStartDate.getTime() + minDurationMs)
                    )}`
                  }

                  return true
                },
              }}
              render={({ field: { onChange, value }, fieldState: { error } }) => (
                <FormField
                  error={error?.message}
                  disableErrorAnimation
                  label="Ends"
                  tooltip={{
                    text: 'Revenue share has limited duration and needs to be closed after the ending date ends. It is after closing the revenue share, all tokens staked during the revenue share can be recovered.',
                  }}
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
          <FlexBox flow="column" gap={2}>
            {details.map((row) => (
              <FlexBox key={row.title} alignItems="center" justifyContent="space-between">
                <FlexBox width="fit-content" alignItems="center">
                  <Text variant={row.variant ?? 't200'} as="p" color="colorText">
                    {row.title}
                  </Text>
                </FlexBox>
                {row.content}
              </FlexBox>
            ))}
            <FlexBox marginTop={3} gap={3} alignItems="start">
              <SvgAlertsWarning24 />
              <Text variant="t200" as="span" color="colorTextCaution">
                Active revenue share will pause all open market transactions for its entire duration.
              </Text>
            </FlexBox>
          </FlexBox>
        </FlexBox>
      </DialogModal>
    </>
  )
}

const OuterBox = styled.div<{ marginTop?: number }>`
  position: relative;
  height: 50px;
  margin-top: ${(props) => sizes(props.marginTop ?? 0)};
`

const InnerBox = styled.div`
  position: absolute;
  inset: 0;
`
