import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, media, sizes, transitions } from '@/styles'

export type ColorVariants = 'red' | 'green' | 'yellow' | 'blue' | 'lightBlue' | 'white'

const mappedColors = {
  blue: cVar('colorCoreBlue500'),
  lightBlue: cVar('colorCoreBlue200'),
  red: cVar('colorCoreRed200'),
  yellow: cVar('colorCoreYellow200'),
  green: cVar('colorCoreGreen200'),
  white: cVar('colorCoreNeutral50'),
}

export const CallToActionWrapper = styled.div<{ itemsCount: number }>`
  display: grid;
  gap: ${sizes(4)};
  padding-bottom: ${sizes(16)};
  justify-items: center;

  ${media.md} {
    margin: 0 auto;
    justify-content: center;
    grid-template-columns: repeat(auto-fit, minmax(219px, 1fr));
    max-width: ${({ itemsCount }) => `calc(${itemsCount - 1} * ${sizes(6)} + 419px * ${itemsCount}) `};
    gap: ${sizes(6)};
    padding-bottom: ${sizes(24)};
  }
`
type IconWrapperProps = {
  colorVariant: ColorVariants
}

export const IconWrapper = styled.div<IconWrapperProps>`
  margin-bottom: ${sizes(5)};

  path {
    fill: ${({ colorVariant = 'blue' }) => mappedColors[colorVariant]};
  }
`

export const BodyWrapper = styled(Text)`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

export const ContentWrapper = styled.div`
  padding: ${sizes(8)};
  background-color: ${cVar('colorCoreNeutral800')};
  transition: all ${transitions.timings.regular} ${transitions.easing};
  border-radius: ${cVar('radiusLarge')};
`

export const StyledContainer = styled('button', { shouldForwardProp: isPropValid })<{ colorVariant: ColorVariants }>`
  display: block;
  width: 100%;
  align-items: center;
  cursor: pointer;
  border: 0;
  color: ${cVar('colorCoreBaseWhite')};
  text-decoration: none;
  background-color: transparent;

  &:not(:last-child) {
    margin-bottom: ${sizes(4)};
  }

  ${media.md} {
    &:not(:last-child) {
      margin-bottom: 0;
    }
  }

  :hover {
    ${ContentWrapper} {
      transform: translate(-${sizes(2)}, -${sizes(2)});
      box-shadow: ${({ colorVariant = 'blue' }) => `${sizes(2)} ${sizes(2)} 0 ${mappedColors[colorVariant]}`};
    }
  }
`
