import styled from '@emotion/styled'

import { ActionBar } from '@/components/ActionBar'
import { Text } from '@/components/Text'
import { SvgActionChevronR } from '@/components/_icons'
import { cVar, media, sizes } from '@/styles'

export const ScrollableWrapper = styled.div<{ actionBarHeight: number }>`
  height: 100%;
  margin-bottom: ${({ actionBarHeight = 0 }) => actionBarHeight}px;
  overflow-y: auto;
`

export const NFTWorkspaceFormWrapper = styled.div`
  height: 100%;
  justify-content: flex-end;
  display: flex;
  flex-direction: column-reverse;

  ${media.md} {
    display: block;
  }
`

export const NFTPreview = styled.div`
  background: black;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: ${sizes(16)} ${sizes(4)};
  ${media.md} {
    width: 50%;
    position: fixed;
    left: 0;
    height: 100%;
    flex-direction: row;
  }
`

export const NFTFormScrolling = styled.div`
  padding: ${sizes(8)};
  flex-grow: 1;
  position: relative;
  ${media.md} {
    left: 50%;
    max-width: 50%;
  }
`

export const NFTFormWrapper = styled.div`
  height: 100%;
`
export const StepperWrapper = styled.div`
  max-width: 100%;
  overflow-x: auto;
  padding-bottom: ${sizes(8)};
  box-shadow: ${cVar('effectDividersBottom')};
  scrollbar-width: none;

  ::-webkit-scrollbar {
    display: none;
  }
`

export const StepperInnerWrapper = styled.div`
  margin-left: ${sizes(2)};
  width: 600px;
  display: grid;
  gap: ${sizes(6)};
  grid-template-columns: repeat(3, max-content);
`

export const StepWrapper = styled.div<{ isLast?: boolean }>`
  display: grid;
  grid-template-columns: 1fr ${({ isLast }) => !isLast && 'auto'};
  gap: 16px;
  align-items: center;
`

export const StyledChevron = styled(SvgActionChevronR)``

export const Title = styled(Text)`
  margin-top: ${sizes(8)};
  margin-bottom: ${sizes(4)};
`

export const Paragraph = styled(Text)`
  margin-bottom: ${sizes(12)};
`

export const StyledActionBar = styled(ActionBar)`
  position: fixed;
  bottom: 0;
  width: 100%;
  left: 0;
`
