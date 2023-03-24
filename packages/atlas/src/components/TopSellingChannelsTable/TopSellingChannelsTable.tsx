import styled from '@emotion/styled'
import { useMemo } from 'react'

import { useMemberships } from '@/api/hooks/membership'
import { SvgActionCreatorToken, SvgActionVerified } from '@/assets/icons'
import { JoyTokenIcon } from '@/components/JoyTokenIcon'
import { NumberFormat } from '@/components/NumberFormat'
import { TableProps } from '@/components/Table'
import { Text } from '@/components/Text'
import { absoluteRoutes } from '@/config/routes'
import { useMemberAvatar } from '@/providers/assets/assets.hooks'
import { SentryLogger } from '@/utils/logs'
import { shortenString } from '@/utils/misc'

import { SenderItem, SenderItemIconsWrapper, StyledLink, StyledTable } from './TopSellingChannelsTable.styles'

import { Avatar } from '../Avatar'

const COLUMNS: TableProps['columns'] = [
  {
    Header: '',
    accessor: 'index',
    width: 20,
  },
  {
    Header: 'CHANNEL',
    accessor: 'channel',
    width: 200,
  },
  {
    Header: 'NFTS SOLD',
    accessor: 'nftsSold',
    width: 50,
  },
  {
    Header: 'SALES VOLUME',
    accessor: 'salesVolume',
    width: 50,
  },
]

export const JoyAmountWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
`

const DATA = [
  { index: 1, channel: 'j4UBSJyBRWK9zZaR2LHj8QKWi8nhR7d6iGQ5drTzPve1QmeYS', nftsSold: 1, salesVolume: 22 },
  { index: 2, channel: 'j4UBSJyBRWK9zZaR2LHj8QKWi8nhR7d6iGQ5drTzPve1QmeYS', nftsSold: 1, salesVolume: 22 },
  { index: 3, channel: 'j4UBSJyBRWK9zZaR2LHj8QKWi8nhR7d6iGQ5drTzPve1QmeYS', nftsSold: 1, salesVolume: 22 },
]

export const TopSellingChannelsTable = () => {
  const mappedData: TableProps['data'] = useMemo(
    () =>
      DATA.map((data) => ({
        index: (
          <Text variant="t100" as="p" color="colorTextMuted">
            {data.index}
          </Text>
        ),
        salesVolume: (
          <JoyAmountWrapper>
            <JoyTokenIcon variant="gray" />
            <NumberFormat variant="t200-strong" as="p" value={data.salesVolume} margin={{ left: 1 }} />
          </JoyAmountWrapper>
        ),
        nftsSold: (
          <Text variant="t100" as="p">
            {data.nftsSold}
          </Text>
        ),
        channel: <Sender sender={data.channel} />,
      })),
    []
  )
  return <StyledTable columns={COLUMNS} data={mappedData} doubleColumn />
}

const Sender = ({ sender }: { sender: string }) => {
  const { memberships } = useMemberships(
    { where: { controllerAccount_eq: sender } },
    {
      onError: (error) => SentryLogger.error('Failed to fetch memberships', 'ActiveUserProvider', error),
      skip: sender === 'council',
    }
  )
  const member = memberships?.find((member) => member.controllerAccount === sender)
  const { url: avatarUrl, isLoadingAsset: avatarLoading } = useMemberAvatar(member)

  if (member) {
    return (
      <StyledLink to={absoluteRoutes.viewer.member(member.handle)}>
        <SenderItem
          nodeStart={<Avatar assetUrl={avatarUrl} loading={avatarLoading} />}
          label={member?.handle}
          isInteractive={false}
          nodeEnd={
            <SenderItemIconsWrapper>
              <SvgActionCreatorToken />
              <SvgActionVerified />
            </SenderItemIconsWrapper>
          }
        />
      </StyledLink>
    )
  } else {
    return <SenderItem nodeStart={<Avatar />} label={shortenString(sender, 6, 4)} isInteractive={false} />
  }
}
