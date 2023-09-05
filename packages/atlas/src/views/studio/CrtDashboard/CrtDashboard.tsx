import BN from 'bn.js'
import { useCallback, useState } from 'react'

import { SvgActionChevronR, SvgActionEdit, SvgActionLinkUrl, SvgActionSell } from '@/assets/icons'
import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { NumberFormat } from '@/components/NumberFormat'
import { Tabs } from '@/components/Tabs'
import { Text } from '@/components/Text'
import { WidgetTile } from '@/components/WidgetTile'
import { Button, TextButton } from '@/components/_buttons/Button'
import { HoldersTable } from '@/components/_crt/HoldersTable/HoldersTable'
import {
  BigWidgetContainer,
  HeaderContainer,
  HoldersPlaceholders,
  MainContainer,
  NoGlobalPaddingWrapper,
  ProgressWidgetPlaceholer,
  TabsContainer,
  WidgetContainer,
} from '@/views/studio/CrtDashboard/CrtDashboard.styles'
import { StyledSvgJoyTokenMonochrome24 } from '@/views/studio/MyPaymentsView/PaymentsOverview/PaymentsOverview.styles'

const TABS = ['Dashboard', 'Holders', 'Revenue share', 'Settings'] as const

export const CrtDashboard = () => {
  const [currentTab, setCurrentTab] = useState<number>(0)
  const handleChangeTab = useCallback((idx: number) => {
    setCurrentTab(idx)
  }, [])

  const mappedTabs = TABS.map((tab) => ({ name: tab }))

  return (
    <LimitedWidthContainer>
      <MainContainer>
        <HeaderContainer>
          <Text variant="h700" as="h1">
            $JBC
          </Text>
          <Button variant="tertiary" icon={<SvgActionLinkUrl />} iconPlacement="right">
            See your token
          </Button>
        </HeaderContainer>

        <TabsContainer>
          <Tabs initialIndex={0} selected={currentTab} tabs={mappedTabs} onSelectTab={handleChangeTab} />
          <Button variant="secondary" icon={<SvgActionEdit />}>
            Edit token page
          </Button>
          <Button icon={<SvgActionSell />}>Start sale or market</Button>
        </TabsContainer>

        {currentTab === 1 && (
          <HoldersTable
            data={[
              {
                memberId: '1',
                transferable: 1000,
                allocation: 100,
                total: 1000,
                vested: 0,
              },
            ]}
            isLoading={true}
            currentMemberId="1"
          />
        )}

        {currentTab === 0 && (
          <>
            <NoGlobalPaddingWrapper>
              <ProgressWidgetPlaceholer>Progress Widget Placeholer</ProgressWidgetPlaceholer>
            </NoGlobalPaddingWrapper>

            <WidgetContainer>
              <WidgetTile
                title="Transferable"
                customNode={
                  <NumberFormat
                    value={new BN(9999999)}
                    as="span"
                    icon={<StyledSvgJoyTokenMonochrome24 />}
                    withDenomination
                    withToken
                    customTicker="$JBC"
                    variant="h400"
                  />
                }
              />
              <WidgetTile
                title="Locked"
                tooltip={{
                  text: 'It is locked value',
                }}
                customNode={
                  <NumberFormat
                    value={new BN(9999999)}
                    as="span"
                    icon={<StyledSvgJoyTokenMonochrome24 />}
                    withDenomination
                    withToken
                    customTicker="$JBC"
                    variant="h400"
                  />
                }
              />
              <WidgetTile
                title="Total rev."
                tooltip={{
                  text: 'It is locked value',
                }}
                customNode={
                  <NumberFormat
                    value={new BN(9999999)}
                    as="span"
                    icon={<StyledSvgJoyTokenMonochrome24 />}
                    withDenomination
                    withToken
                    customTicker="$JBC"
                    variant="h400"
                  />
                }
              />
              <WidgetTile
                title="Patronage"
                tooltip={{
                  text: 'It is locked value',
                }}
                customNode={
                  <Text variant="h400" as="h4">
                    10%
                  </Text>
                }
              />
            </WidgetContainer>
            <BigWidgetContainer>
              <WidgetTile
                title="Token holders"
                titleColor="colorTextStrong"
                titleVariant="h500"
                customTopRightNode={
                  <TextButton iconPlacement="right" icon={<SvgActionChevronR />}>
                    Show holders
                  </TextButton>
                }
                customNode={<HoldersPlaceholders />}
              />
              <WidgetTile
                title="Revenue share with holders"
                titleColor="colorTextStrong"
                titleVariant="h500"
                customTopRightNode={
                  <TextButton iconPlacement="right" icon={<SvgActionChevronR />}>
                    Show revenue shares
                  </TextButton>
                }
                customNode={<HoldersPlaceholders />}
              />
            </BigWidgetContainer>
          </>
        )}
      </MainContainer>
    </LimitedWidthContainer>
  )
}
