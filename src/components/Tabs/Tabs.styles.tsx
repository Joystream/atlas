import styled from '@emotion/styled'

import { colors, media, sizes, typography, zIndex } from '@/theme'

import { smallBadgeStyles } from '../Badge'

type TabProps = {
  selected: boolean
  variant: 'default' | 'large'
}

type BackgroundGradientProps = {
  direction: 'prev' | 'next'
}

export const TAB_WIDTH = 120

export const TabsWrapper = styled.div`
  position: relative;
  width: 100%;
`

export const TabsGroup = styled.div`
  display: flex;
  position: relative;
  scroll-behavior: smooth;

  ::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
`

export const Tab = styled.div<TabProps>`
  transition: box-shadow 0.125s ease, color 0.125s ease;
  width: ${TAB_WIDTH}px;
  min-width: ${TAB_WIDTH}px;
  padding: ${sizes(6)} 0;
  font-size: ${typography.sizes.body2};
  color: ${({ selected }) => (selected ? colors.white : colors.gray[300])};
  text-align: center;
  box-shadow: ${({ selected }) => (selected ? `inset 0 -4px 0 ${colors.blue[500]};` : 'none')};

  :hover,
  :focus {
    box-shadow: inset 0 -4px 0 ${({ selected }) => (selected ? colors.blue[500] : colors.gray[300])};
    cursor: pointer;
  }

  ${media.md} {
    padding: ${({ variant }) => sizes(variant === 'default' ? 6 : 7)} 0;
  }

  span {
    ${smallBadgeStyles}

    &[data-badge]::after {
      margin-top: calc(-1 * ${sizes(2)});
    }
  }
`

export const BackgroundGradient = styled.div<BackgroundGradientProps>`
  position: absolute;
  top: 0;
  bottom: 0;
  left: ${(props) => (props.direction === 'prev' ? 0 : 'auto')};
  right: ${(props) => (props.direction === 'next' ? 0 : 'auto')};
  width: 20%;
  z-index: ${zIndex.overlay};
  background-image: linear-gradient(${(props) => (props.direction === 'prev' ? 270 : 90)}deg, transparent, black);
  pointer-events: none;
`
