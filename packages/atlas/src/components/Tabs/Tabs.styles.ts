import styled from '@emotion/styled'

import { smallBadgeStyles } from '@/components/Badge'
import { cVar, sizes, zIndex } from '@/styles'

import { Pill } from '../Pill'

type TabProps = {
  selected: boolean
}

type BackgroundGradientProps = {
  direction: 'prev' | 'next'
}

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
  transition: box-shadow 0.125s ease, color 0.125s ease;
  padding: 0 ${sizes(8)};
  height: 64px;
  display: flex;
  align-items: center;
  font: ${cVar('typographyDesktopT200')};
  letter-spacing: ${cVar('typographyDesktopT200LetterSpacing')};
  text-transform: ${cVar('typographyDesktopT200TextTransform')};
  color: ${({ selected }) => (selected ? 'white' : cVar('colorCoreNeutral300'))};
  text-align: center;
  box-shadow: ${({ selected }) => (selected ? `inset 0 -4px 0 ${cVar('colorCoreBlue500')};` : 'none')};
  flex-shrink: 0;

  :hover,
  :focus {
    box-shadow: inset 0 -4px 0 ${({ selected }) => (selected ? cVar('colorCoreBlue500') : cVar('colorCoreNeutral300'))};
    cursor: pointer;
  }

  span {
    ${smallBadgeStyles}

    &[data-badge]::after {
      margin-left: ${sizes(2)};
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

export const StyledPill = styled(Pill)`
  margin-left: ${sizes(2)};
`
