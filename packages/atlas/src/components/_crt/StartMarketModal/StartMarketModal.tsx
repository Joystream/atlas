import BN from 'bn.js'
import { useCallback, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'

import { useGetFullCreatorTokenQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { SvgActionLinkUrl, SvgActionMarket, SvgActionShoppingCart, SvgActionWarning } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { NumberFormat } from '@/components/NumberFormat'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { SuccessActionModalTemplate } from '@/components/_crt/SuccessActionModalTemplate'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { absoluteRoutes } from '@/config/routes'
import { useClipboard } from '@/hooks/useClipboard'
import { useSegmentAnalytics } from '@/hooks/useSegmentAnalytics'
import { HAPI_TO_JOY_RATE } from '@/joystream-lib/config'
import { hapiBnToTokenNumber } from '@/joystream-lib/utils'
import { useFee, useJoystream } from '@/providers/joystream'
import { useNetworkUtils } from '@/providers/networkUtils/networkUtils.hooks'
import { useSnackbar } from '@/providers/snackbars'
import { useTransaction } from '@/providers/transactions/transactions.hooks'
import { useUser } from '@/providers/user/user.hooks'
import { calcBuyMarketPricePerToken, calculateSlopeNumberForAmm } from '@/utils/crts'
import { SentryLogger } from '@/utils/logs'
import { permillToPercentage } from '@/utils/number'

export type StartMarketModalProps = {
  tokenId: string
  show: boolean
  onClose: () => void
}

export const StartMarketModal = ({ onClose, show, tokenId }: StartMarketModalProps) => {
  const { memberId, channelId } = useUser()
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const { tokenPrice } = useJoystream()
  const navigate = useNavigate()
  const { joystream, proxyCallback } = useJoystream()
  const { displaySnackbar } = useSnackbar()
  const handleTransaction = useTransaction()
  const { refetchCreatorTokenData } = useNetworkUtils()
  const { trackAMMStarted } = useSegmentAnalytics()
  const { data } = useGetFullCreatorTokenQuery({
    variables: {
      id: tokenId ?? '',
    },
    onError: (error) => {
      SentryLogger.error('Failed to fetch creator token', 'CloseMarketModal', error)
    },
  })
  const { creatorTokenById } = data ?? {}

  const totalSupply = +(creatorTokenById?.totalSupply ?? 0)
  const holdersRevenueShare = creatorTokenById?.revenueShareRatioPermill
    ? permillToPercentage(creatorTokenById.revenueShareRatioPermill)
    : 0
  const { copyToClipboard } = useClipboard()

  const joySlopeNumber = useMemo(
    () => calculateSlopeNumberForAmm(totalSupply, holdersRevenueShare, tokenPrice ?? 1),
    [holdersRevenueShare, tokenPrice, totalSupply]
  )
  const { fullFee } = useFee('startAmmTx', ['1', '1', joySlopeNumber])

  const startingPrice = useMemo(() => {
    return hapiBnToTokenNumber(
      calcBuyMarketPricePerToken('0', String(Math.round(HAPI_TO_JOY_RATE * joySlopeNumber)), '0') ?? new BN(0)
    )
  }, [joySlopeNumber])

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
        (await joystream.extrinsics).startAmm(memberId, channelId, joySlopeNumber, proxyCallback(updateStatus)),
      onTxSync: async () => {
        trackAMMStarted(tokenId, creatorTokenById?.symbol ?? 'N/A', channelId ?? 'N/A')
        setShowSuccessModal(true)
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
        onClose()
      },
    })
  }, [
    channelId,
    creatorTokenById?.symbol,
    displaySnackbar,
    handleTransaction,
    joySlopeNumber,
    joystream,
    memberId,
    onClose,
    proxyCallback,
    tokenId,
    tokenPrice,
    trackAMMStarted,
  ])

  const successDetails = useMemo(
    () => [
      {
        text: 'The more buyers you have had, the higher will be the profit when you are closing the market.',
        icon: <SvgActionMarket />,
      },
      {
        text: "You are not earning royalties from other people's transactions on your token.",
        icon: <SvgActionWarning />,
      },
      {
        text: 'Share the link to the token page  with an open market so people can go and buy your token.',
        icon: <SvgActionShoppingCart />,
        actionNode: (
          <TextButton
            onClick={() =>
              copyToClipboard(
                `${window.location.host}${absoluteRoutes.viewer.channel(channelId ?? '', { tab: 'Token' })}`
              )
            }
            icon={<SvgActionLinkUrl />}
          >
            Copy link to market
          </TextButton>
        ),
      },
    ],
    [channelId, copyToClipboard]
  )

  return (
    <>
      <SuccessActionModalTemplate
        title="Market started!"
        description="There are few things you should know:"
        details={successDetails}
        show={showSuccessModal}
        primaryButton={{
          text: 'Continue',
          onClick: () => {
            refetchCreatorTokenData(tokenId)
            navigate(absoluteRoutes.studio.crtDashboard({ tab: 'Market' }))
            setShowSuccessModal(false)
            onClose()
          },
        }}
      />
      <DialogModal
        show={show && !showSuccessModal}
        title="Start market"
        onExitClick={onClose}
        primaryButton={{
          text: 'Start market',
          onClick: () => handleSubmitTransaction(),
        }}
        secondaryButton={{
          text: 'Cancel',
          onClick: onClose,
        }}
      >
        <FlexBox flow="column" gap={6}>
          <FlexBox flow="column" gap={2}>
            <Text variant="t200" as="p" color="colorText">
              When someone makes the purchase on the market, new tokens are minted and price goes up. To close the
              market you need to return the minted tokens back to the market by selling the ones you already own. The
              more people purchased your token before you close the market, the higher the profits when closing.
            </Text>
          </FlexBox>
          <FlexBox flow="column" gap={2}>
            <FlexBox alignItems="center" justifyContent="space-between">
              <Text variant="t100" as="p">
                First token price
              </Text>
              <NumberFormat value={startingPrice} as="p" variant="t100" format="smallDecimal" withToken />
            </FlexBox>

            <FlexBox alignItems="center" justifyContent="space-between">
              <Text variant="t100" as="p" color="colorText">
                Transaction fee
              </Text>
              <NumberFormat value={fullFee} as="p" variant="t100" color="colorText" withToken />
            </FlexBox>
          </FlexBox>
        </FlexBox>
      </DialogModal>
    </>
  )
}
