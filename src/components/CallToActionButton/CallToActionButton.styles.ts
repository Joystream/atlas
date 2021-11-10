import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { colors, media, sizes, transitions } from '@/theme'

import { ColorVariants } from './CallToActionButton'

import { CallToActionButtonProps } from '.'

const mappedColors = {
  blue: colors.blue[500],
  lightBlue: colors.blue[200],
  red: colors.secondary.alert[100],
  yellow: colors.secondary.warning[100],
  green: colors.secondary.success[100],
}

export const CallToActionWrapper = styled.div`
  margin-top: ${sizes(32)};

  ${media.md} {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-column-gap: ${sizes(6)};
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
  background-color: ${colors.gray[800]};
  transition: all ${transitions.timings.regular} ${transitions.easing};
`
type StyledContainerProps = Omit<CallToActionButtonProps, 'label'>

export const StyledContainer = styled('button', { shouldForwardProp: isPropValid })<StyledContainerProps>`
  display: block;
  width: 100%;
  align-items: center;
  cursor: pointer;
  border: 0;
  color: ${colors.white};
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
