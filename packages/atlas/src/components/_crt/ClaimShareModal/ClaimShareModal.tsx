import { useApolloClient } from '@apollo/client'
import BN from 'bn.js'
import { useEffect } from 'react'

import {
  useGetCreatorTokenHoldersQuery,
  useGetFullCreatorTokenQuery,
  useGetRevenueShareDividendQuery,
} from '@/api/queries/__generated__/creatorTokens.generated'
import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgAlertsInformative24 } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { FlexBox } from '@/components/FlexBox'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { atlasConfig } from '@/config'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useFee, useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { SentryLogger } from '@/utils/logs'
import { formatDateTimeAt } from '@/utils/time'

type ClaimShareModalProps = {
  show?: boolean
  onClose: () => void
  tokenId?: string
  token?: FullCreatorTokenFragment
}

export const ClaimShareModal = ({ onClose, show, tokenId: _tokenId, token: _token }: ClaimShareModalProps) => {
  const { data, refetch } = useGetFullCreatorTokenQuery({
    variables: { id: _tokenId ?? '' },
    skip: !_tokenId || !!_token,
    notifyOnNetworkStatusChange: true,
  })
  const token = _token ?? data?.creatorTokenById
  const tokenId = _token?.id ?? _tokenId

  const tokenName = token?.symbol ?? 'N/A'
  const { joystream, proxyCallback } = useJoystream()
  const { memberId } = useUser()
  const { displaySnackbar } = useSnackbar()
  const handleTransaction = useTransaction()
  const { fullFee } = useFee('participateInSplitTx')
  const activeRevenueShare = token?.revenueShares.find((rS) => !rS.finalized)
  const { convertBlockToMsTimestamp } = useBlockTimeEstimation()
  const client = useApolloClient()

  useEffect(() => {
    if (show) {
      refetch()
    }
  }, [refetch, show])

  const { data: holderData } = useGetCreatorTokenHoldersQuery({
    variables: {
      where: {
        token: {
          id_eq: tokenId,
        },
        member: {
          id_eq: memberId,
        },
      },
    },
    skip: !memberId || !tokenId,
  })
  const { totalAmount, stakedAmount } = holderData?.tokenAccounts[0] ?? {}
  const stakableBalance = totalAmount && stakedAmount ? +totalAmount - +stakedAmount : 0
  const { data: dividendData, loading: loadingDividendData } = useGetRevenueShareDividendQuery({
    variables: {
      tokenId: token?.id ?? '',
      stakingAmount: stakableBalance,
    },
    skip: !stakableBalance || !token,
  })

  const onSubmit = async () => {
    if (!joystream || !token || !memberId || !stakableBalance || !activeRevenueShare) {
      SentryLogger.error('Failed to submit claim share transaction', 'ClaimShareModal', {
        joystream,
        token,
        memberId,
        stakableBalance,
        activeRevenueShare,
      })
      return
    }
    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).participateInSplit(
          token.id,
          memberId,
          String(stakableBalance),
          proxyCallback(updateStatus)
        ),
      fee: fullFee,
      onTxSync: async (data) => {
        displaySnackbar({
          title: `${hapiBnToTokenNumber(new BN(data.dividendAmount))} ${atlasConfig.joystream.tokenTicker} received`,
          description: `${
            data.stakedAmount
          } $${tokenName} is locked until the end of revenue share. (${formatDateTimeAt(
            new Date(convertBlockToMsTimestamp(activeRevenueShare.endsAt) ?? 0)
          )})`,
          iconType: 'success',
        })
        onClose()
        client.refetchQueries({ include: 'all' })
      },
      onError: () => {
        SentryLogger.error('Failed to claim share transaction', 'ClaimShareModal', {
          joystream,
          token,
          memberId,
          stakableBalance,
          activeRevenueShare,
        })
        displaySnackbar({
          iconType: 'error',
          title: 'Something went wrong',
        })
      },
    })
  }

  return (
    <DialogModal
      show={show}
      onExitClick={onClose}
      title="Claim your share"
      primaryButton={{
        text: 'Claim share',
        onClick: onSubmit,
      }}
      secondaryButton={{
        text: 'Cancel',
        onClick: onClose,
      }}
    >
      <FlexBox flow="column" gap={6}>
        <Banner
          icon={<SvgAlertsInformative24 />}
          title={`Locking your $${tokenName} tokens`}
          description={`To claim the reward immediately you have to lock all your $${tokenName} tokens until the end of revenue share. When revenue share ends your tokens will be transferred back to you.
          `}
        />
        <FlexBox flow="column" gap={2}>
          <FlexBox justifyContent="space-between" alignItems="center">
            <Text variant="t100" as="p" color="colorText">
              You will lock
            </Text>
            <NumberFormat
              value={stakableBalance}
              variant="t100"
              as="p"
              color="colorText"
              withToken
              customTicker={`$${tokenName}`}
            />
          </FlexBox>
          <FlexBox justifyContent="space-between" alignItems="center">
            <Text variant="t100" as="p" color="colorText">
              Revenue share ends on
            </Text>
            <Text variant="t100" as="p" color="colorText">
              {activeRevenueShare
                ? formatDateTimeAt(new Date(convertBlockToMsTimestamp(activeRevenueShare?.endsAt) ?? 0))
                : '-'}
            </Text>
          </FlexBox>
          <FlexBox justifyContent="space-between" alignItems="baseline">
            <Text variant="h300" as="h1" color="colorText">
              You will receive
            </Text>
            {loadingDividendData ? (
              <SkeletonLoader height={30} width={90} />
            ) : (
              <NumberFormat
                value={new BN(dividendData?.getShareDividend.dividendJoyAmount ?? 0)}
                variant="h300"
                as="p"
                withDenomination="before"
                withToken
              />
            )}
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </DialogModal>
  )
}
