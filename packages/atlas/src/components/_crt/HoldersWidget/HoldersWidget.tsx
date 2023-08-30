import styled from '@emotion/styled'

import { SvgActionChevronR } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { CrtHoldersTable } from '@/components/_crt/CrtHoldersTable/CrtHoldersTable'
import { cVar, sizes } from '@/styles'

export type HoldersWidgetProps = {
  tokenId: string
}

const getTokenHolders = (_: string) => {
  return [
    {
      memberId: '1',
      vested: 10000,
      total: 11000,
    },
    {
      memberId: '1',
      vested: 1000,
      total: 1000,
    },
    {
      memberId: '1',
      vested: 100,
      total: 110,
    },
  ]
}

export const HoldersWidget = ({ tokenId }: HoldersWidgetProps) => {
  const holders = getTokenHolders(tokenId)
  return (
    <Box>
      <FlexBox alignItems="center" justifyContent="space-between">
        <Text variant="h500" as="span">
          Holders{' '}
          <Text variant="h500" as="span" color="colorText">
            (20)
          </Text>
        </Text>
        <TextButton icon={<SvgActionChevronR />} iconPlacement="right">
          Show all holders
        </TextButton>
      </FlexBox>
      <CrtHoldersTable data={holders} isLoading={false} />
    </Box>
  )
}

export const Box = styled.div`
  background-color: ${cVar('colorBackgroundMuted')};

  > *:nth-child(1) {
    padding: ${sizes(6)};
  }
`
