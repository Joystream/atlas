import styled from '@emotion/styled'
import BN from 'bn.js'
import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  useGetChannelTokenBalanceLazyQuery,
  useGetCreatorTokenHoldersQuery,
  useGetTokenRevenueSharesCountQuery,
  useGetTokenRevenueSharesQuery,
} from '@/api/queries/__generated__/creatorTokens.generated'
import { SvgActionChevronB } from '@/assets/icons'
import { SvgEmptyStateIllustration } from '@/assets/illustrations'
import { FlexBox } from '@/components/FlexBox'
import { NumberFormat } from '@/components/NumberFormat'
import { Table, TableProps } from '@/components/Table'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { Button } from '@/components/_buttons/Button'
import {
  CrtPortfolioTable,
  TokenInfo,
  TokenPortfolioUtils,
} from '@/components/_crt/CrtPortfolioTable/CrtPortfolioTable'
import { RevenueShareWidget, RevenueShareWidgetLoader } from '@/components/_crt/RevenueShareWidget/RevenueShareWidget'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { SendFundsDialog } from '@/components/_overlays/SendTransferDialogs'
import { atlasConfig } from '@/config'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { useSubscribeAccountBalance, useTokenPrice } from '@/providers/joystream'
import { useJoystreamStore } from '@/providers/joystream/joystream.store'
import { useUser } from '@/providers/user/user.hooks'
import { formatNumber } from '@/utils/number'
import { StyledSvgJoyTokenMonochrome24 } from '@/views/studio/MyPaymentsView/PaymentsOverview/PaymentsOverview.styles'

const JOY_COLUMNS: TableProps['columns'] = [
  { Header: 'Name', accessor: 'name', width: 150 },
  { Header: 'Current price', accessor: 'price', width: 150 },
  { Header: 'Balance value', accessor: 'balanceValue', width: 150 },
  { Header: 'Your balance', accessor: 'balance', width: 150 },
  { Header: '', accessor: 'utils', width: 50 },
]

const REVENUE_SHARES_PER_REFETCH = 3
let timestamp = 0
export const PortfolioTokenTab = () => {
  const { memberId } = useUser()
  const { tokenPrice, convertHapiToUSD } = useTokenPrice()
  const { accountBalance } = useSubscribeAccountBalance()
  const { currentBlock } = useJoystreamStore()
  const smMatch = useMediaMatch('sm')
  const [fetchChannelTokenBalance] = useGetChannelTokenBalanceLazyQuery()
  const [showSendDialog, setShowSendDialog] = useState(false)
  const [liquidCrtValue, setLiquidCrtValue] = useState<BN | null>(null)
  const toggleSendDialog = () => setShowSendDialog((prevState) => !prevState)
  useEffect(() => {
    if (!timestamp) {
      timestamp = currentBlock
    }
  }, [currentBlock])

  const { data, loading: loadingHolderData } = useGetCreatorTokenHoldersQuery({
    variables: {
      where: {
        member: {
          id_eq: memberId,
        },
      },
    },
    skip: !memberId,
  })
  const commonParams = {
    finalized_eq: false,
    token: {
      id_in: data?.tokenAccounts.map(({ token }) => token.id),
    },
  }
  const where = {
    OR: [
      {
        ...commonParams,
        endsAt_gt: timestamp,
      },
      {
        ...commonParams,
        stakers_some: {
          account: {
            member: {
              id_eq: memberId,
            },
          },
        },
      },
    ],
  }
  const { data: revenueSharesCount } = useGetTokenRevenueSharesCountQuery({
    variables: {
      where,
    },
  })
  const {
    data: memberTokenRevenueShareData,
    loading: loadingRevenueShares,
    fetchMore,
  } = useGetTokenRevenueSharesQuery({
    variables: {
      where,
      limit: REVENUE_SHARES_PER_REFETCH,
    },
    skip: !data?.tokenAccounts || !memberId || !timestamp, //!currentBlockRef.current,
  })

  const mappedData = useMemo(
    () =>
      data?.tokenAccounts.map((tokenAccount) => ({
        tokenTitle: tokenAccount.token.symbol ?? 'N/A',
        tokenName: tokenAccount.token.symbol ?? 'N/A',
        status: tokenAccount.token.status,
        isVerified: false,
        tokenId: tokenAccount.token.id,
        memberId: memberId ?? '',
        vested: tokenAccount.vestingSchedules.reduce((prev, next) => prev + Number(next.totalVestingAmount), 0),
        total: +tokenAccount.totalAmount,
        channelId: tokenAccount.token.channel?.channel.id ?? '',
        hasStaked: +tokenAccount.stakedAmount > 0,
      })),
    [data?.tokenAccounts, memberId]
  )

  const totalTokenValue = useMemo(() => {
    if (!(data?.tokenAccounts && accountBalance)) {
      return 0
    }
    const crtTotalValue = data.tokenAccounts.reduce(
      (prev, next) => prev.add(new BN(next.token.lastPrice ?? 0).muln(Number(next.totalAmount))),
      new BN(0)
    )
    return crtTotalValue.add(accountBalance)
  }, [accountBalance, data?.tokenAccounts])

  const getLiquidTokensValue = useCallback(async () => {
    if (!(data?.tokenAccounts && accountBalance)) {
      return 0
    }
    const value = new BN(0)
    for (let i = 0; i < data.tokenAccounts.length; i++) {
      const account = data.tokenAccounts[i]
      const { data: singleBalance } = await fetchChannelTokenBalance({
        variables: {
          tokenId: account.token.id,
          memberId: memberId ?? '',
          currentBlockHeight: currentBlock,
        },
      })
      if (singleBalance) {
        const lastPrice = new BN(data.tokenAccounts[i].token.lastPrice ?? 0)
        value.iadd(lastPrice.muln(singleBalance.getAccountTransferrableBalance.transferrableCrtAmount))
      }
    }

    value.iadd(accountBalance)

    setLiquidCrtValue(value)
    return value
  }, [accountBalance, currentBlock, data?.tokenAccounts, fetchChannelTokenBalance, memberId])

  useEffect(() => {
    if (!liquidCrtValue) {
      getLiquidTokensValue()
    }
  }, [getLiquidTokensValue, liquidCrtValue])

  return (
    <>
      <SendFundsDialog show={showSendDialog} onExitClick={toggleSendDialog} accountBalance={accountBalance} />

      <FlexBox flow={smMatch ? 'row' : 'column'} width="100%" gap={4} alignItems="strech" equalChildren>
        <WidgetTile
          title="Liquid tokens value"
          customNode={
            <NumberFormat
              value={liquidCrtValue ?? 0}
              as="span"
              icon={<StyledSvgJoyTokenMonochrome24 />}
              withDenomination
            />
          }
        />
        <WidgetTile
          title="Total tokens value"
          customNode={
            loadingHolderData ? (
              <SkeletonLoader height={30} width={90} />
            ) : (
              <NumberFormat
                value={totalTokenValue}
                as="span"
                icon={<StyledSvgJoyTokenMonochrome24 />}
                withDenomination
              />
            )
          }
        />
      </FlexBox>

      {loadingRevenueShares || memberTokenRevenueShareData?.revenueShares.length ? (
        <FlexBox flow="column" gap={6}>
          <Text variant="h500" as="h3">
            Revenue shares
          </Text>
          <FlexBox flow="column" gap={2}>
            {loadingRevenueShares
              ? Array.from({ length: 3 }, (_, idx) => <RevenueShareWidgetLoader key={idx} />)
              : memberTokenRevenueShareData?.revenueShares.map((revenueShare) => (
                  <RevenueShareWidget
                    key={revenueShare.id}
                    tokenId={revenueShare.token.id}
                    tokenName={revenueShare.token.symbol ?? ''}
                    revenueShare={revenueShare}
                    memberId={memberId ?? ''}
                  />
                ))}
          </FlexBox>
          {(revenueSharesCount?.revenueSharesConnection.totalCount ?? 0) >
          (memberTokenRevenueShareData?.revenueShares.length ?? 0) ? (
            <FlexBox width="100%" justifyContent="center">
              <Button
                variant="secondary"
                iconPlacement="right"
                icon={<SvgActionChevronB />}
                onClick={() =>
                  fetchMore({
                    variables: {
                      limit: REVENUE_SHARES_PER_REFETCH,
                      offset: memberTokenRevenueShareData?.revenueShares.length,
                    },
                    updateQuery: (prev, { fetchMoreResult }) => {
                      return {
                        ...prev,
                        revenueShares: [...prev.revenueShares, ...fetchMoreResult.revenueShares],
                      }
                    },
                  })
                }
              >
                Load more
              </Button>
            </FlexBox>
          ) : null}
        </FlexBox>
      ) : null}

      <FlexBox minWidth="0" flow="column" gap={6}>
        <Text variant="h500" as="h3">
          {atlasConfig.joystream.tokenTicker} balance
        </Text>
        <StyledTable
          minWidth={650}
          data={[
            {
              name: (
                <TokenInfo tokenName="Joystream" tokenTitle={atlasConfig.joystream.tokenTicker} isVerified={false} />
              ),
              price: (
                <Text variant="t100" as="p">
                  ${tokenPrice?.toFixed(6)}
                </Text>
              ),
              balanceValue: (
                <Text variant="t100" as="p">
                  ${accountBalance ? formatNumber(convertHapiToUSD(accountBalance) ?? 0) : 0}
                </Text>
              ),
              balance: <NumberFormat variant="t100" value={accountBalance ?? 0} as="p" withToken />,
              utils: (
                <TokenPortfolioUtils
                  onBuy={() => window.open('https://www.joystream.org/token/', '_blank')}
                  onSell={() => window.open('https://www.joystream.org/token/', '_blank')}
                  onTransfer={toggleSendDialog}
                />
              ),
            },
          ]}
          columns={JOY_COLUMNS}
        />
      </FlexBox>

      <FlexBox flow="column" gap={6}>
        <Text variant="h500" as="h3">
          My tokens
        </Text>
        <CrtPortfolioTable
          data={mappedData ?? []}
          isLoading={loadingHolderData}
          emptyState={{
            icon: <SvgEmptyStateIllustration />,
            title: 'You don’t own any creator tokens yet',
            description: 'When you buy any creator tokens you will be able to manage them and view from this page.',
          }}
        />
      </FlexBox>
    </>
  )
}

const StyledTable = styled(Table)`
  width: 100%;

  td:nth-child(n + 2),
  td:nth-child(n + 3),
  td:nth-child(n + 4) {
    align-items: end;
  }

  th:nth-child(n + 2),
  th:nth-child(n + 3),
  th:nth-child(n + 4) {
    align-items: end;
    justify-content: end;

    > div {
      align-items: end;
    }
  }
`
