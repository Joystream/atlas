import { FC } from 'react'

import { Text } from '@/components/Text'
import { useHeadTags } from '@/hooks/useHeadTags'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  BottomPattern,
  ContainerLayoutGrid,
  StyledGridItem,
  StyledSvgSmallMoneroModified,
  TopPattern,
} from './CrtView.styles'

export const CrtView: FC = () => {
  const headTags = useHeadTags('Creator tokens')
  const smMatch = useMediaMatch('sm')
  return (
    <>
      <BottomPattern />
      <TopPattern />
      {headTags}
      <ContainerLayoutGrid>
        <StyledGridItem colSpan={{ base: 12, sm: 10, md: 8, lg: 6, xxl: 4 }} colStart={{ sm: 2, md: 3, lg: 4, xxl: 5 }}>
          <StyledSvgSmallMoneroModified />
          <Text variant={smMatch ? 'h600' : 'h500'} as="h1" margin={{ bottom: 4, top: 8 }}>
            Creator tokens are coming later this year
          </Text>
          <Text as="p" margin={{ top: 4, bottom: 16 }} align="center" variant="t300" color="colorText">
            With Creator Tokens, channel owners are be able to mint their own personalised tokens and let their audience
            buy and hold a share in the channel.
          </Text>
        </StyledGridItem>
      </ContainerLayoutGrid>
    </>
  )
}
