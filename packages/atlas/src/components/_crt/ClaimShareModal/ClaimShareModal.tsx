import { useApolloClient } from '@apollo/client'
import BN from 'bn.js'

import {
  useGetFullCreatorTokenQuery,
  useGetRevenueShareDividendQuery,
} from '@/api/queries/__generated__/creatorTokens.generated'
import { SvgAlertsInformative24 } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { FlexBox } from '@/components/FlexBox'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { atlasConfig } from '@/config'
import { useBlockTimeEstimation } from '@/hooks/useBlockTimeEstimation'
import { useGetTokenBalance } from '@/hooks/useGetTokenBalance'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useFee, useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { formatDateTime } from '@/utils/time'

type ClaimShareModalProps = {
  show?: boolean
  onClose: () => void
  tokenId?: string
}

export const ClaimShareModal = ({ onClose, show, tokenId }: ClaimShareModalProps) => {
  const { data } = useGetFullCreatorTokenQuery({ variables: { id: tokenId ?? '' }, skip: !tokenId })
  const token = data?.creatorTokenById
  const tokenName = token?.symbol ?? 'N/A'
  const { joystream, proxyCallback } = useJoystream()
  const { memberId } = useUser()
  const { displaySnackbar } = useSnackbar()
  const handleTransaction = useTransaction()
  const { tokenBalance } = useGetTokenBalance(token?.id, memberId ?? '')
  const { fullFee } = useFee('participateInSplitTx')
  const activeRevenueShare = token?.revenueShares.find((rS) => !rS.finalized)
  const { convertBlockToMsTimestamp } = useBlockTimeEstimation()
  const client = useApolloClient()
  const { data: dividedData } = useGetRevenueShareDividendQuery({
    variables: {
      tokenId: token?.id ?? '',
      stakingAmount: tokenBalance,
    },
    skip: !tokenBalance || !token,
  })

  const onSubmit = async () => {
    if (!joystream || !token || !memberId || !tokenBalance || !activeRevenueShare) return
    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).participateInSplit(
          token.id,
          memberId,
          String(tokenBalance),
          proxyCallback(updateStatus)
        ),
      fee: fullFee,
      onTxSync: async (data) => {
        displaySnackbar({
          title: `${hapiBnToTokenNumber(new BN(data.dividendAmount))} ${atlasConfig.joystream.tokenTicker} received`,
          description: `${data.stakedAmount} $${tokenName} is locked until the end of revenue share. (${formatDateTime(
            new Date(convertBlockToMsTimestamp(activeRevenueShare.endsAt) ?? 0)
          )
            .split(',')
            .join(' at')})`,
          iconType: 'success',
        })
        onClose()
        client.refetchQueries({ include: 'active' })
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
              value={tokenBalance}
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
                ? formatDateTime(new Date(convertBlockToMsTimestamp(activeRevenueShare?.endsAt) ?? 0))
                    .split(',')
                    .join(' at')
                : '-'}
            </Text>
          </FlexBox>
          <FlexBox justifyContent="space-between" alignItems="baseline">
            <Text variant="h300" as="h1" color="colorText">
              You will receive
            </Text>
            <NumberFormat
              value={dividedData?.getShareDividend.dividendJoyAmount ?? 0}
              variant="h300"
              as="p"
              withDenomination="before"
              withToken
            />
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </DialogModal>
  )
}
