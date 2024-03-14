import { SvgAlertsInformative24 } from '@/assets/icons'
import { Banner } from '@/components/Banner'
import { FlexBox } from '@/components/FlexBox'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { atlasConfig } from '@/config'
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

const getTokenDetails = (_?: string) => ({
  tokenPrice: 100,
  userProjectToken: 200,
  revenueShareEnd: new Date(),
})
export const ClaimShareModal = ({ onClose, tokenId, show }: ClaimShareModalProps) => {
  const tokenName = 'JBC'
  const { joystream, proxyCallback } = useJoystream()
  const { memberId } = useUser()
  const { displaySnackbar } = useSnackbar()
  const handleTransaction = useTransaction()
  const { fullFee } = useFee('participateInSplitTx')
  const { tokenPrice, userProjectToken, revenueShareEnd } = getTokenDetails(tokenId)

  const onSubmit = async () => {
    if (!joystream || !tokenId || !memberId) return
    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).participateInSplit(
          tokenId,
          memberId,
          String(userProjectToken),
          proxyCallback(updateStatus)
        ),
      fee: fullFee,
      onTxSync: async () => {
        displaySnackbar({
          title: `${tokenPrice * userProjectToken} ${atlasConfig.joystream.tokenTicker} received`,
          description: `${userProjectToken} $${tokenName} is locked until the end of revenue share. (${formatDateTime(
            revenueShareEnd
          )
            .split(',')
            .join(' at')})`,
          iconType: 'success',
        })
        onClose()
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
              value={userProjectToken}
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
              {formatDateTime(revenueShareEnd).split(',').join(' at')}
            </Text>
          </FlexBox>
          <FlexBox justifyContent="space-between" alignItems="baseline">
            <Text variant="h300" as="h1" color="colorText">
              You will receive
            </Text>
            <NumberFormat value={tokenPrice * userProjectToken} variant="h300" as="p" withDenomination withToken />
          </FlexBox>
        </FlexBox>
      </FlexBox>
    </DialogModal>
  )
}
