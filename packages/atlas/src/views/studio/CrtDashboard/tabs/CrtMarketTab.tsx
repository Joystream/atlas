import BN from 'bn.js'
import { useMemo } from 'react'

import { useGetFullAmmCurveQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { FullCreatorTokenFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgJoyTokenMonochrome24 } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { NumberFormat } from '@/components/NumberFormat'
import { WidgetTile } from '@/components/WidgetTile'
import { AmmTransactionsTable } from '@/components/_crt/AmmTransactionsTable/AmmTransactionsTable'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { HAPI_TO_JOY_RATE } from '@/joystream-lib/config'
import { calcBuyMarketPricePerToken } from '@/utils/crts'
import { SentryLogger } from '@/utils/logs'

type CrtMarketTabProps = {
  token: FullCreatorTokenFragment
}

export const CrtMarketTab = ({ token }: CrtMarketTabProps) => {
  const mdMatch = useMediaMatch('md')
  const currentAmm = token.ammCurves.find((curve) => !curve.finalized)
  const { data, loading } = useGetFullAmmCurveQuery({
    variables: {
      where: {
        id_eq: currentAmm?.id,
      },
    },
    skip: !currentAmm,
    onError: (error) => {
      SentryLogger.error('Failed to fetch AMM curve', 'CrtMarketTab', error)
    },
  })
  const pricePerUnit = useMemo(
    () => calcBuyMarketPricePerToken(currentAmm?.mintedByAmm, currentAmm?.ammSlopeParameter, currentAmm?.ammInitPrice),
    [currentAmm?.ammInitPrice, currentAmm?.ammSlopeParameter, currentAmm?.mintedByAmm]
  )

  return (
    <>
      <FlexBox flow={mdMatch ? 'row' : 'column'} width="100%" equalChildren gap={4} alignItems="stretch">
        <WidgetTile
          title="Current price per unit"
          customNode={
            loading ? (
              <SkeletonLoader height={30} width={90} />
            ) : (
              <NumberFormat
                value={pricePerUnit ?? 0}
                icon={<SvgJoyTokenMonochrome24 />}
                variant="h500"
                format={pricePerUnit?.gt(new BN(HAPI_TO_JOY_RATE)) ? undefined : 'short'}
                as="p"
                withDenomination
              />
            )
          }
          tooltip={{
            text: `This is the amount of ${atlasConfig.joystream.tokenTicker} that is currently stored on your channel balance. To withdraw it you have to create a revenue share.`,
          }}
        />
        <WidgetTile
          title="Bought on market"
          customNode={
            loading ? (
              <SkeletonLoader height={30} width={90} />
            ) : (
              <NumberFormat
                value={+(currentAmm?.mintedByAmm ?? 0)}
                withToken
                customTicker={`$${token.symbol}`}
                variant="h500"
                as="p"
              />
            )
          }
          tooltip={{
            text: `This is the amount of ${atlasConfig.joystream.tokenTicker} that is currently stored on your channel balance. To withdraw it you have to create a revenue share.`,
          }}
        />
        <WidgetTile
          title="Sold to market"
          customNode={
            loading ? (
              <SkeletonLoader height={30} width={90} />
            ) : (
              <NumberFormat
                value={+(currentAmm?.burnedByAmm ?? 0)}
                withToken
                customTicker={`$${token.symbol}`}
                variant="h500"
                as="p"
              />
            )
          }
          tooltip={{
            text: `This is the amount of ${atlasConfig.joystream.tokenTicker} that is currently stored on your channel balance. To withdraw it you have to create a revenue share.`,
          }}
        />
      </FlexBox>
      <AmmTransactionsTable
        symbol={token.symbol ?? 'N/A'}
        loading={loading}
        data={data?.ammCurves[0].transactions ?? []}
      />
    </>
  )
}
