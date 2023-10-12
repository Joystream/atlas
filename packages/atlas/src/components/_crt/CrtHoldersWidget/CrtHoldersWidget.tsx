import styled from '@emotion/styled'
import { useMemo, useState } from 'react'

import { TokenAccountOrderByInput } from '@/api/queries/__generated__/baseTypes.generated'
import { useGetCreatorTokenHoldersQuery } from '@/api/queries/__generated__/creatorTokens.generated'
import { BasicCreatorTokenHolderFragment } from '@/api/queries/__generated__/fragments.generated'
import { SvgActionChevronR } from '@/assets/icons'
import { Avatar } from '@/components/Avatar'
import { AvatarGroup } from '@/components/Avatar/AvatarGroup'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { PieChart, PieDatum, joystreamColors } from '@/components/_charts/PieChart'
import { Widget } from '@/components/_crt/CrtStatusWidget/CrtStatusWidget.styles'
import { getMemberAvatar } from '@/providers/assets/assets.helpers'
import { useUser } from '@/providers/user/user.hooks'
import { cVar } from '@/styles'

export type HolderDatum = {
  id: string
  value: number
  name: string
  members: {
    handle: string
    avatarUrls: string[]
  }[]
  index: number
}

export type CrtHoldersWidgetProps = {
  tokenId: string
  totalSupply: number
}

export const holdersToDatum = (accounts: BasicCreatorTokenHolderFragment[], totalSupply: number): HolderDatum[] =>
  accounts.map((acc, index) => ({
    id: acc.member.handle,
    name: acc.member.handle,
    value: Math.round((+(acc.totalAmount ?? 0) / totalSupply) * 100),
    members: [
      {
        avatarUrls: getMemberAvatar(acc.member).urls ?? [],
        handle: acc.member.handle,
      },
    ],
    index,
  }))

export const CrtHoldersWidget = ({ tokenId, totalSupply }: CrtHoldersWidgetProps) => {
  const { activeMembership } = useUser()
  const [hoveredHolder, setHoveredHolder] = useState<PieDatum | null>(null)
  const { data } = useGetCreatorTokenHoldersQuery({
    variables: {
      where: {
        token: {
          id_eq: tokenId,
        },
      },
      limit: 6,
      orderBy: TokenAccountOrderByInput.TokenAccountsNumDesc,
    },
  })
  const chartData = useMemo(() => {
    const parsedData = data?.tokenAccounts ? holdersToDatum(data.tokenAccounts, totalSupply) : []
    if (parsedData.length > 3) {
      let namedHoldersAccumulated = 0
      const namedHolders = parsedData.slice(0, 3)
      namedHolders.forEach((holder) => {
        namedHoldersAccumulated += holder.value
      })

      namedHolders.push({
        id: 'others',
        value: 100 - namedHoldersAccumulated,
        name: 'Others',
        index: namedHolders.length,
        members: parsedData.slice(3).map((holder) => ({
          handle: holder.name,
          avatarUrls: holder.members[0].avatarUrls,
        })),
      })

      return namedHolders
    }
    return parsedData
  }, [data?.tokenAccounts, totalSupply])

  const owner = useMemo(
    () => chartData.find((holder) => holder.id === activeMembership?.handle),
    [chartData, activeMembership?.handle]
  )
  return (
    <Widget
      title="Holders"
      titleVariant="h500"
      titleColor="colorTextStrong"
      customTopRightNode={
        <TextButton icon={<SvgActionChevronR />} iconPlacement="right">
          Show more
        </TextButton>
      }
      customNode={
        <FlexBox width="100%" gap={12} equalChildren>
          <FlexBox flow="column" width="100%">
            <Text variant="h100" as="h1" color="colorTextMuted">
              TOTAL SUPPLY
            </Text>
            <ChartWrapper>
              <PieChart
                data={chartData}
                onDataHover={setHoveredHolder}
                hoverOpacity
                hoveredData={hoveredHolder}
                valueFormat={(value) => `${value}%`}
              />
            </ChartWrapper>
          </FlexBox>
          <FlexBox flow="column" gap={6}>
            <FlexBox flow="column" gap={2}>
              <Text variant="h100" as="h1" margin={{ bottom: 4 }} color="colorTextMuted">
                YOU OWN
              </Text>
              {owner && (
                <HoldersLegendEntry
                  key={owner.id}
                  name={owner.id}
                  members={owner.members}
                  color={joystreamColors[owner.index]}
                  value={owner.value}
                  isActive={owner.id === hoveredHolder?.id}
                  onMouseEnter={() => setHoveredHolder(owner)}
                  onMouseExit={() => setHoveredHolder(null)}
                />
              )}
            </FlexBox>
            <FlexBox flow="column" gap={2}>
              <Text variant="h100" as="h1" margin={{ bottom: 4 }} color="colorTextMuted">
                TOP HOLDERS
              </Text>
              {chartData.map((row) =>
                row.id === activeMembership?.handle ? null : (
                  <HoldersLegendEntry
                    key={row.id}
                    name={row.id}
                    members={row.members}
                    color={joystreamColors[row.index]}
                    value={row.value}
                    isActive={row.id === hoveredHolder?.id}
                    onMouseEnter={() => setHoveredHolder(row)}
                    onMouseExit={() => setHoveredHolder(null)}
                  />
                )
              )}
            </FlexBox>
          </FlexBox>
        </FlexBox>
      }
    />
  )
}

type HoldersLegendEntryProps = {
  name: string
  value: number
  color: string
  isActive: boolean
  onMouseEnter: () => void
  onMouseExit: () => void
  members: {
    handle: string
    avatarUrls: string[]
  }[]
}

const HoldersLegendEntry = ({
  name,
  value,
  color,
  isActive,
  onMouseExit,
  onMouseEnter,
  members,
}: HoldersLegendEntryProps) => {
  return (
    <FlexBox
      gap={2}
      alignItems="center"
      style={{ opacity: isActive ? 1 : 0.3 }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseExit}
    >
      <ColorBox color={color} />
      <FlexBox alignItems="center">
        {members.length === 1 ? (
          <Avatar assetUrls={members[0].avatarUrls} />
        ) : (
          <AvatarGroup
            avatars={members.map((member) => ({ urls: member.avatarUrls, tooltipText: member.handle }))}
            avatarStrokeColor={cVar('colorBackgroundMuted')}
          />
        )}
        <Text variant="t100" as="p">
          {name}
        </Text>
      </FlexBox>
      <Text variant="t100" as="p">
        {value}%
      </Text>
    </FlexBox>
  )
}

const ColorBox = styled.div<{ color: string }>`
  min-width: 24px;
  min-height: 24px;
  background-color: ${(props) => props.color};
`

const ChartWrapper = styled.div`
  height: 300px;
  width: 100%;
`
