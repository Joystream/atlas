import styled from '@emotion/styled'

import { smallBadgeStyles } from '@/components/Badge'
import { cVar, sizes, zIndex } from '@/styles'

import { Pill } from '../Pill'
import { Button } from '../_buttons/Button'

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

export const TabsGroup = styled.div<{ 'data-underline': boolean }>`
  display: flex;
  position: relative;
  scroll-behavior: smooth;
  overflow: auto;

  ::-webkit-scrollbar {
    display: none;
  }

  scrollbar-width: none;

  &[data-underline='true'] {
    box-shadow: ${cVar('effectDividersBottom')};
  }
`

export const Tab = styled.div<TabProps>`
  transition: box-shadow ${cVar('animationTransitionFast')}, color ${cVar('animationTransitionFast')};
  padding: ${sizes(2.5)} ${sizes(4)} 0 ${sizes(4)};
  height: 56px;
  display: flex;
  font: ${cVar('typographyDesktopT200')};
  letter-spacing: ${cVar('typographyDesktopT200LetterSpacing')};
  text-transform: ${cVar('typographyDesktopT200TextTransform')};
  color: ${({ selected }) => (selected ? cVar('colorTextStrong') : cVar('colorText'))};
  text-align: center;
  box-shadow: ${({ selected }) => (selected ? `inset 0 -4px 0 ${cVar('colorBackgroundPrimary')};` : 'none')};
  flex-shrink: 0;

  :hover,
  :focus {
    box-shadow: inset 0 -4px 0 ${({ selected }) => (selected ? cVar('colorBackgroundPrimary') : cVar('colorBorderStrong'))};
    cursor: pointer;
  }

  span {
    ${smallBadgeStyles}

    &[data-badge]::after {
      margin-top: calc(-1 * ${sizes(2.5)});
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

export const StyledButton = styled(Button)<{ 'data-right'?: boolean }>`
  pointer-events: all;
  margin-top: ${sizes(1)};

  &[data-right='true'] {
    float: right;
  }
`
