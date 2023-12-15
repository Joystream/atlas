import { useApolloClient } from '@apollo/client'
import { FC, useCallback, useEffect } from 'react'

import { SvgAlertsInformative24 } from '@/assets/icons'
import { ActionDialogButtonProps } from '@/components/ActionBar'
import { FlexBox } from '@/components/FlexBox'
import { NumberFormat } from '@/components/NumberFormat'
import { ColumnBox } from '@/components/ProgressWidget/ProgressWidget.styles'
import { Text } from '@/components/Text'
import { Tooltip } from '@/components/Tooltip'
import { HDivider } from '@/components/_crt/MarketDrawer/MarketDrawer.styles'
import { SummaryRow } from '@/components/_overlays/SendTransferDialogs/SendTransferDialogs.styles'
import { useFee, useJoystream } from '@/providers/joystream'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { SentryLogger } from '@/utils/logs'

type SaleSummaryProps = {
  price: number
  tnc: string
  setPrimaryButtonProps: (props: ActionDialogButtonProps) => void
  setSecondaryButtonProps: (props: ActionDialogButtonProps) => void
  handleBackClick: () => void
  handleCloseModal: () => void
  onSuccess: () => void
}

export const SaleSummaryStep: FC<SaleSummaryProps> = ({
  price,
  setSecondaryButtonProps,
  setPrimaryButtonProps,
  handleBackClick,
  handleCloseModal,
  onSuccess,
}) => {
  const { fullFee } = useFee('startAmmTx', ['1', '1', 1, price])
  const { tokenPrice } = useJoystream()
  const handleTransaction = useTransaction()
  const { displaySnackbar } = useSnackbar()
  const { joystream, proxyCallback } = useJoystream()
  const { memberId, channelId } = useUser()
  const client = useApolloClient()

  const handleSubmitTransaction = useCallback(() => {
    if (!joystream || !memberId || !channelId || !tokenPrice) {
      SentryLogger.error('Failed to submit CRT market start', 'MarketDrawer', {
        joystream,
        memberId,
        channelId,
        tokenPrice,
      })
      return
    }
    handleTransaction({
      txFactory: async (updateStatus) =>
        (await joystream.extrinsics).startAmm(memberId, channelId, tokenPrice, price, proxyCallback(updateStatus)),
      onTxSync: async () => {
        client.refetchQueries({ include: 'active' })
        onSuccess()
      },
      onError: () => {
        SentryLogger.error('Failed to start CRT market', 'MarketDrawer', {
          joystream,
          memberId,
          channelId,
          tokenPrice,
        })
        displaySnackbar({
          title: 'Something went wrong',
        })
        handleCloseModal()
      },
    })
  }, [
    channelId,
    client,
    displaySnackbar,
    handleCloseModal,
    handleTransaction,
    joystream,
    memberId,
    onSuccess,
    price,
    proxyCallback,
    tokenPrice,
  ])

  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Start market',
      onClick: () => handleSubmitTransaction(),
    })

    setSecondaryButtonProps({
      text: 'Back',
      onClick: () => {
        handleBackClick()
      },
    })
  }, [handleBackClick, handleSubmitTransaction, setPrimaryButtonProps, setSecondaryButtonProps])

  return (
    <ColumnBox gap={2}>
      <Text variant="h500" as="h2" margin={{ bottom: 2 }}>
        Market summary
      </Text>
      <Text variant="h400" as="h2" margin={{ bottom: 2 }}>
        Sale settings
      </Text>
      <SummaryRow>
        <FlexBox alignItems="center">
          <Text as="span" variant="h300" color="colorText">
            Starting price
          </Text>
          <Tooltip text="Tooltip placeholder" placement="top" offsetY={4} delay={[1000, null]}>
            <SvgAlertsInformative24 width={16} height={16} />
          </Tooltip>
        </FlexBox>
        <NumberFormat variant="h300" value={price} withToken as="span" />
      </SummaryRow>
      <HDivider />
      <SummaryRow>
        <FlexBox alignItems="center">
          <Text as="span" variant="h300" color="colorText">
            Transaction Fee
          </Text>
          <Tooltip text="Tooltip placeholder" placement="top" offsetY={4} delay={[1000, null]}>
            <SvgAlertsInformative24 width={16} height={16} />
          </Tooltip>
        </FlexBox>
        <NumberFormat variant="h300" withDenomination="before" format="short" value={fullFee} withToken as="span" />
      </SummaryRow>
    </ColumnBox>
  )
}
