import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { AmmTransactionOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { useGetAmmTransactionsQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { SvgActionArrowBottom, SvgActionArrowTop } from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { absoluteRoutes } from '@/config/routes'
import { cVar, sizes } from '@/styles'

export const LastestCrtTrades = () => {
  const { data } = useGetAmmTransactionsQuery({
    variables: {
      limit: 30,
      orderBy: [AmmTransactionOrderByInput.CreatedInDesc, AmmTransactionOrderByInput.QuantityDesc],
    },
  })
  return (
    <RibbonContainer>
      <InnerContainer>
        {data?.ammTransactions.map((tx) => (
          <StyledLink
            key={`${tx.id}-1`}
            to={absoluteRoutes.viewer.channel(tx.amm.token.channel?.channel.id, { tab: 'Token' })}
          >
            <FlexBox gap={2} alignItems="center">
              <Avatar assetUrls={tx.amm.token.channel?.channel.avatarPhoto?.resolvedUrls} />
              <Text variant="h200" as="h1">
                ${tx.amm.token.symbol}
              </Text>
              <AmountBox isBuy={tx.transactionType === 'BUY'} alignItems="center">
                {tx.transactionType === 'BUY' ? <SvgActionArrowTop /> : <SvgActionArrowBottom />}
                <Text
                  variant="h200"
                  as="h1"
                  color={tx.transactionType === 'BUY' ? 'colorTextSuccess' : 'colorTextError'}
                >
                  {tx.quantity}
                </Text>
              </AmountBox>
              <Text variant="h100" as="h1" color="colorText">
                {tx.account.member.handle}
              </Text>
            </FlexBox>
          </StyledLink>
        ))}
        {data?.ammTransactions.map((tx) => (
          <StyledLink
            key={`${tx.id}-2`}
            to={absoluteRoutes.viewer.channel(tx.amm.token.channel?.channel.id, { tab: 'Token' })}
          >
            <FlexBox gap={2} alignItems="center">
              <Avatar assetUrls={tx.amm.token.channel?.channel.avatarPhoto?.resolvedUrls} />
              <Text variant="h200" as="h1">
                ${tx.amm.token.symbol}
              </Text>
              <AmountBox isBuy={tx.transactionType === 'BUY'} alignItems="center">
                <SvgActionArrowTop />
                <Text
                  variant="h200"
                  as="h1"
                  color={tx.transactionType === 'BUY' ? 'colorTextSuccess' : 'colorTextError'}
                >
                  {tx.quantity}
                </Text>
              </AmountBox>
              <Text variant="h100" as="h1" color="colorText">
                {tx.account.member.handle}
              </Text>
            </FlexBox>
          </StyledLink>
        ))}{' '}
      </InnerContainer>
    </RibbonContainer>
  )
}

const StyledLink = styled(Link)`
  text-decoration: none;
`

const AmountBox = styled(FlexBox)<{ isBuy: boolean }>`
  svg {
    path {
      fill: ${(props) => (props.isBuy ? cVar('colorTextSuccess') : cVar('colorTextError'))};
    }
  }

  color: ${(props) => (props.isBuy ? cVar('colorTextSuccess') : cVar('colorTextError'))};
`

const ScrollSide = keyframes`
  100% {
    transform: translateX(calc(-50% - ${sizes(4)}));
  }

`

const InnerContainer = styled(FlexBox)`
  gap: ${sizes(8)};
  width: fit-content;
  align-items: center;
  animation: ${ScrollSide} 80s linear infinite;
  scrollbar-width: none;

  :hover {
    animation-play-state: paused;
  }
`

const RibbonContainer = styled(FlexBox)`
  overflow-x: auto;
  scrollbar-width: none;
  background-color: ${cVar('colorBackgroundMuted')};
  padding: ${sizes(3)} ${sizes(4)};
  width: calc(100% + var(--size-global-horizontal-padding) * 2);
  margin-left: calc(var(--size-global-horizontal-padding) * -1);
`
