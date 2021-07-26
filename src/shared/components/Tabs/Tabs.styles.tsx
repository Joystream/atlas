import styled from '@emotion/styled'

import { colors, sizes, zIndex } from '@/shared/theme'

import { badgeStyles } from '../Badge'

type TabProps = {
  selected: boolean
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
  overflow: auto;

  ::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;
`

export const Tab = styled.div<TabProps>`
  transition: all 0.125s ease;
  width: ${TAB_WIDTH}px;
  min-width: ${TAB_WIDTH}px;
  padding: 22px 0;
  font-size: 14px;
  color: ${(props) => (props.selected ? colors.white : colors.gray[300])};
  text-transform: capitalize;
  text-align: center;
  border-bottom: ${(props) => (props.selected ? `4px solid ${colors.blue[500]}` : 'none')};

  :hover,
  :focus {
    border-bottom: ${(props) => (props.selected ? `4px solid ${colors.blue[500]}` : `4px solid ${colors.gray[300]}`)};
    cursor: pointer;
  }

  span {
    ${badgeStyles}

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
