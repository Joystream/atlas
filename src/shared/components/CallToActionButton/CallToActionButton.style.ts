import isPropValid from '@emotion/is-prop-valid'
import styled from '@emotion/styled'

import { colors, media, sizes, transitions } from '@/shared/theme'

import { CallToActionButtonProps } from '.'

const mappedColors = {
  blue: colors.blue[500],
  red: colors.secondary.alert[100],
  yellow: colors.secondary.warning[100],
  green: colors.secondary.success[100],
}

export const CallToActionWrapper = styled.div`
  margin-top: ${sizes(19)};

  ${media.medium} {
    display: grid;
    grid-template-columns: auto auto auto;
    grid-column-gap: ${sizes(6)};
  }
`

export const IconWrapper = styled.div`
  margin-bottom: ${sizes(5)};
`

export const BodyWrapper = styled.div`
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

  ${media.medium} {
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

  ${IconWrapper} {
    path,
    circle {
      stroke: ${({ colorVariant = 'blue' }) => mappedColors[colorVariant]};
    }
  }
`
