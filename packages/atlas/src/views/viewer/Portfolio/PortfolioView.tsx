import styled from '@emotion/styled'
import { useState } from 'react'

import { SvgActionCreatorToken, SvgActionPlay } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { NumberFormat } from '@/components/NumberFormat'
import { PageTabs } from '@/components/PageTabs'
import { Table, TableProps } from '@/components/Table'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import {
  CrtPortfolioTable,
  TokenInfo,
  TokenPortfolioUtils,
} from '@/components/_crt/CrtPortfolioTable/CrtPortfolioTable'
import { useSubscribeAccountBalance, useTokenPrice } from '@/providers/joystream'
import { sizes } from '@/styles'
import { StyledSvgJoyTokenMonochrome24 } from '@/views/studio/MyPaymentsView/PaymentsOverview/PaymentsOverview.styles'

const emptySpace = Array.from({ length: 20 }, () => ' ').join('')

const JOY_COLUMNS: TableProps['columns'] = [
  { Header: 'Name', accessor: 'name', width: 110 },
  { Header: 'Current price', accessor: 'price', width: 100 },
  { Header: 'Balance value', accessor: 'balanceValue', width: 100 },
  { Header: 'Your balance', accessor: 'balance', width: 100 },
  { Header: '', accessor: 'utils', width: 50 },
]

const TABS = [
  {
    name: 'Tokens',
    description: 'Manage & collect your funds' + emptySpace,
    icon: <SvgActionCreatorToken />,
  },
  {
    name: 'Video NFTs',
    description: 'Browse your NFT collection' + emptySpace,
    icon: <SvgActionPlay />,
  },
]

export const PortfolioView = () => {
  const [tab, setTab] = useState(0)
  const { tokenPrice, convertHapiToUSD } = useTokenPrice()
  const { accountBalance } = useSubscribeAccountBalance()
  return (
    <>
      <StyledPageTabs isBig tabs={TABS} onSelectTab={setTab} selected={tab} />

      <StyledLimitedWidthContainer>
        <FlexBox width="100%" gap={4} equalChildren>
          <WidgetTile
            title="Liquid tokens value"
            customNode={
              <NumberFormat value={913981} as="span" icon={<StyledSvgJoyTokenMonochrome24 />} withDenomination />
            }
          />
          <WidgetTile
            title="Total tokens value"
            customNode={
              <NumberFormat value={913981} as="span" icon={<StyledSvgJoyTokenMonochrome24 />} withDenomination />
            }
          />
        </FlexBox>

        <FlexBox flow="column" gap={6}>
          <Text variant="h500" as="h3">
            JOY balance
          </Text>
          <StyledTable
            data={[
              {
                name: <TokenInfo tokenName="Joystream" tokenTitle="JOY" isVerified={false} />,
                price: (
                  <Text variant="t100" as="p">
                    ${tokenPrice?.toFixed(6)}
                  </Text>
                ),
                balanceValue: (
                  <Text variant="t100" as="p">
                    ${accountBalance ? convertHapiToUSD(accountBalance)?.toFixed(2) : 0}
                  </Text>
                ),
                balance: <NumberFormat variant="t100" value={accountBalance ?? 0} as="p" />,
                utils: <TokenPortfolioUtils onBuy={() => undefined} onTransfer={() => undefined} />,
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
            data={[
              {
                tokenTitle: '$JBC',
                tokenName: 'Joyblocks',
                isVerified: true,
                status: 'idle',
                transferable: 10,
                vested: 30,
                total: 40,
              },
            ]}
            isLoading={false}
          />
        </FlexBox>
      </StyledLimitedWidthContainer>
    </>
  )
}

export const StyledLimitedWidthContainer = styled(LimitedWidthContainer)`
  padding: ${sizes(12)} 0;
  display: flex;
  flex-direction: column;
  gap: ${sizes(12)};
`
export const StyledPageTabs = styled(PageTabs)`
  margin: 0 calc(-1 * var(--size-global-horizontal-padding));
`

const StyledTable = styled(Table)`
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
