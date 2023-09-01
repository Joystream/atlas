import styled from '@emotion/styled'
import { useState } from 'react'

import { SvgJoyTokenSilver24 } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Tabs } from '@/components/Tabs'
import { Text } from '@/components/Text'
import { CrtPortfolioTable } from '@/components/_crt/CrtPortfolioTable/CrtPortfolioTable'
import { DetailsContent } from '@/components/_nft/NftTile'
import { sizes } from '@/styles'

const TABS = ['Creator token', 'NFTs']

const mappedTabs = TABS.map((tab) => ({
  name: tab,
}))

export const Portfolio = () => {
  const [tab, setTab] = useState(0)
  return (
    <LimitedWidthContainer>
      <TitleBox alignItems="center" justifyContent="space-between">
        <Text variant="h700" as="h1">
          Portfolio
        </Text>
        <DetailsContent
          caption="PORTFOLIO TOTAL VALUE"
          tooltipText="Lorem ipsum"
          content={2300}
          withDenomination
          tileSize="big"
          icon={<SvgJoyTokenSilver24 />}
        />
      </TitleBox>
      <FlexBox flow="column" gap={6}>
        <Tabs initialIndex={0} tabs={mappedTabs} onSelectTab={setTab} />
        {tab === 0 && (
          <CrtPortfolioTable
            data={[
              {
                tokenId: '1',
                status: 'idle',
                transferable: 10,
                vested: 30,
                total: 40,
              },
            ]}
            isLoading={false}
          />
        )}
      </FlexBox>
    </LimitedWidthContainer>
  )
}

export const TitleBox = styled(FlexBox)`
  padding: ${sizes(12)} 0;
`
