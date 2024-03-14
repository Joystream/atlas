import { useApolloClient } from '@apollo/client'
import styled from '@emotion/styled'
import { BN } from 'bn.js'
import { useCallback, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { useGetFullCreatorTokenLazyQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgActionClock, SvgActionCreatorToken, SvgActionLinkUrl, SvgActionPayment } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox/FlexBox'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { ClaimShareModal } from '@/components/_crt/ClaimShareModal'
import { SuccessActionModalTemplate } from '@/components/_crt/SuccessActionModalTemplate'
import { AuctionDatePicker, AuctionDatePickerProps } from '@/components/_inputs/AuctionDatePicker'
import { FormField } from '@/components/_inputs/FormField'
import { DetailsContent } from '@/components/_nft/NftTile'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { absoluteRoutes } from '@/config/routes'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useClipboard } from '@/hooks/useClipboard'
import { useGetTokenBalance } from '@/hooks/useGetTokenBalance'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useJoystream, useSubscribeAccountBalance } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { SentryLogger } from '@/utils/logs'
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
  const [openClaimShareModal, setOpenClaimShareModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const { joystream, proxyCallback } = useJoystream()
  const client = useApolloClient()
  const { memberId, channelId, activeChannel } = useUser()
  const { displaySnackbar } = useSnackbar()
  const handleTransaction = useTransaction()
  const { copyToClipboard } = useClipboard()
  const { convertMsTimestampToBlock } = useBlockTimeEstimation()
  const { tokenBalance } = useGetTokenBalance(token.id, memberId ?? '-1')
  const smMatch = useMediaMatch('sm')
  const [refetchToken, { data: localTokenData }] = useGetFullCreatorTokenLazyQuery({
    variables: {
      id: token.id,
    },
    fetchPolicy: 'no-cache',
  })

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

  const onSubmit = () =>
    handleSubmit((data) => {
      const rawStartDate = data.startDate?.type === 'date' ? data.startDate.date : new Date()
      const startBlock = convertMsTimestampToBlock(rawStartDate.getTime())
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
          // we need to refetch token locally to avoid unmount parent modal due to revenue share activation
          refetchToken().then(() => {
            onClose()
            setShowSuccessModal(true)
          })
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
          text: 'If any tokens remain unclaimed at the end of the revenue share period those will be returned to your channel balance.',
          icon: <SvgActionPayment />,
        },
        {
          text: 'Tell your holders to stake their token on your token page until the end of revenue share.',
          icon: <SvgActionClock />,
          actionNode: (
            <TextButton
              onClick={() => copyToClipboard(absoluteRoutes.viewer.channel(channelId ?? '', { tab: 'Token' }))}
              icon={<SvgActionLinkUrl />}
              iconPlacement="right"
            >
              Copy link to token page
            </TextButton>
          ),
        },
        {
          text: `Make sure to stake your own ${tokenBalance} $${localTokenData.creatorTokenById.symbol} to receive your share of revenue.`,
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
    <>
      {localTokenData?.creatorTokenById && (
        <ClaimShareModal
          onClose={() => {
            setOpenClaimShareModal(false)
            client.refetchQueries({ include: 'active' })
          }}
          show={openClaimShareModal}
          tokenId={localTokenData.creatorTokenById.id}
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
            // at this point user won't stake tokens, so we can refetch with cache and close modal
            client.refetchQueries({ include: 'active' })
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
                        items={[
                          {
                            value: null,
                            name: 'Now',
                          },
                        ]}
                        onChange={(value) => {
                          onChange(value)
                          if (endDate?.type === 'date') {
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
    </>
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
