import styled from '@emotion/styled'

import { SvgActionCheck } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { cVar, media, sizes, square } from '@/styles'
import {
  BackgroundContainer,
  CenteredLayoutGrid,
  HeaderGridItem,
  StyledLimitedWidthContainer,
} from '@/views/global/YppLandingView/YppLandingView.styles'
import { useSectionTextVariants } from '@/views/global/YppLandingView/sections/useSectionTextVariants'

export const YppConnectionDetails = () => {
  const [titleVariant, subtitleVariant] = useSectionTextVariants()

  return (
    <BackgroundContainer>
      <StyledLimitedWidthContainer centerText>
        <FlexBox flow="column" gap={4} alignItems="center">
          <CheckBox>
            <SvgActionCheck />
          </CheckBox>
          <CenteredLayoutGrid>
            <HeaderGridItem
              as="header"
              colStart={{ sm: 3, lg: 4 }}
              colSpan={{ base: 12, sm: 8, lg: 6 }}
              data-aos="fade-up"
              data-aos-delay="350"
              data-aos-offset="80"
              data-aos-easing="atlas-easing"
            >
              <Text variant={titleVariant} as="span">
                Connecting is{' '}
                <Text variant={titleVariant} as="span" color="colorTextSuccess">
                  Safe
                </Text>
              </Text>
              <Text
                variant={subtitleVariant}
                as="p"
                color="colorText"
                data-aos="fade-up"
                data-aos-delay="250"
                data-aos-offset="40"
                data-aos-easing="atlas-easing"
                margin={{ top: 4 }}
              >
                We are verified by the YouTube Safety Team. We can only read specific types of data through the official
                API. We we cannot publish or change anything on your YouTube channel.
              </Text>
            </HeaderGridItem>
          </CenteredLayoutGrid>
          <AllowanceBox flow="column" gap={6}>
            <Text variant="h500" as="h5">
              We can read
            </Text>
            {['Channel title, avater, image, sub count, date.', 'Video titles, views and date.', 'Account profile'].map(
              (scope, idx) => (
                <FlexBox key={idx} alignItems="center" gap={2}>
                  <SmallCheckBox>
                    <SvgActionCheck />
                  </SmallCheckBox>
                  <Text variant="t300" as="p" color="colorText" align="left">
                    {scope}
                  </Text>
                </FlexBox>
              )
            )}
          </AllowanceBox>
        </FlexBox>
      </StyledLimitedWidthContainer>
    </BackgroundContainer>
  )
}

export const CheckBox = styled.div`
  background: ${cVar('colorBackgroundSuccess')};
  display: grid;
  place-items: center;
  padding: ${sizes(2)};
  border-radius: 50%;

  svg {
    ${square(36)};
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

const AllowanceBox = styled(FlexBox)`
  background: ${cVar('colorBackgroundMutedAlpha')};
  border: 1px solid ${cVar('colorBorderMutedAlpha')};
  border-radius: ${cVar('radiusMedium')};
  padding: ${sizes(8)};
  width: fit-content;
  margin-top: ${sizes(8)};

  ${media.sm} {
    padding-right: 10%;
  }
`
