import styled from '@emotion/styled'

import { SvgActionCheck } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { FlexGridItem } from '@/components/LayoutGrid'
import { Text } from '@/components/Text'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { cVar, media, sizes, square } from '@/styles'
import {
  BackgroundContainer,
  CenteredLayoutGrid,
  HeaderGridItem,
  StyledLimitedWidthContainer,
} from '@/views/global/YppLandingView/YppLandingView.styles'
import { useSectionTextVariants } from '@/views/global/YppLandingView/sections/useSectionTextVariants'

export const YppConnectionDetails = () => {
  const mdMatch = useMediaMatch('md')
  const smMatch = useMediaMatch('sm')
  const [titleVariant, subtitleVariant] = useSectionTextVariants()

  return (
    <BackgroundContainer>
      <StyledLimitedWidthContainer centerText>
        <CenteredLayoutGrid>
          <HeaderGridItem
            as="header"
            colStart={{ sm: 2 }}
            colSpan={{ base: 12, sm: 10 }}
            data-aos="fade-up"
            data-aos-delay="350"
            data-aos-offset="80"
            data-aos-easing="atlas-easing"
          >
            <CheckBox square={smMatch ? 56 : 40}>
              <SvgActionCheck />
            </CheckBox>
            <Text variant={titleVariant} as="span">
              Connecting is{' '}
              <Text variant={titleVariant} as="span" color="colorTextSuccess">
                Safe
              </Text>
            </Text>
            <Text
              variant={mdMatch ? 't500' : subtitleVariant}
              as="p"
              color="colorText"
              data-aos="fade-up"
              data-aos-delay="250"
              data-aos-offset="40"
              data-aos-easing="atlas-easing"
              margin={{ top: 4, bottom: mdMatch ? 8 : 6 }}
            >
              We are verified by the YouTube Safety Team. We can only read specific types of data through the official
              API. We we cannot publish or change anything on your YouTube channel.
            </Text>
          </HeaderGridItem>
          <AllowanceBox
            flow="column"
            gap={6}
            colSpan={{ base: 12, sm: 10, md: 8, lg: 6 }}
            colStart={{ sm: 2, md: 3, lg: 4 }}
          >
            <Text variant={smMatch ? 'h500' : 'h400'} as="h5">
              We can read
            </Text>
            <FlexBox flow="column" gap={mdMatch ? 6 : 4}>
              {[
                'Channel title, avater, image, sub count, date.',
                'Video titles, views and date.',
                'Account profile',
              ].map((scope, idx) => (
                <FlexBox key={idx} alignItems="center" gap={2}>
                  <SmallCheckBox>
                    <SvgActionCheck />
                  </SmallCheckBox>
                  <Text variant="t300" as="p" color="colorText" align="left">
                    {scope}
                  </Text>
                </FlexBox>
              ))}
            </FlexBox>
          </AllowanceBox>
        </CenteredLayoutGrid>
      </StyledLimitedWidthContainer>
    </BackgroundContainer>
  )
}

export const CheckBox = styled.div<{ square: number }>`
  background: ${cVar('colorBackgroundSuccess')};
  display: grid;
  place-items: center;
  padding: ${sizes(4)};
  border-radius: 50%;
  width: fit-content;
  margin: 0 auto;

  svg {
    ${(props) => square(props.square)};
  }
`

const SmallCheckBox = styled.div`
  background: ${cVar('colorBackgroundMutedAlpha')};
  border-radius: 50%;
  display: grid;
  place-items: center;
  ${square(32)};

  svg {
    ${square(20)};
  }

  path {
    fill: ${cVar('colorTextSuccess')};
  }
`

const AllowanceBox = styled(FlexGridItem)`
  background: ${cVar('colorBackgroundMutedAlpha')};
  border: 1px solid ${cVar('colorBorderMutedAlpha')};
  border-radius: ${cVar('radiusMedium')};
  padding: ${sizes(8)};
  width: fit-content;
  margin: 0 auto;

  ${media.sm} {
    padding-right: 10%;
  }
`
