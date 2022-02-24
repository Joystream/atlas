import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, media, sizes } from '@/styles'

export const ScrollableWrapper = styled.div`
  height: 100%;
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
    height: 100%;
    left: 50%;
    max-width: 50%;
  }
`

type NFTFormWrapperProps = {
  lastStep: boolean
}

export const NFTFormWrapper = styled.div<NFTFormWrapperProps>`
  height: 100%;
  padding-bottom: ${({ lastStep }) => lastStep && '80px'};
`
export const StepperWrapper = styled.div`
  max-width: 100%;
  overflow-x: auto;
  padding-bottom: ${sizes(8)};
  box-shadow: ${cVar('effectDividersBottom')};
  scrollbar-width: none;
  margin-bottom: ${sizes(8)};

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

export const Paragraph = styled(Text)`
  margin-bottom: ${sizes(12)};
`

export const AuctionDurationTooltipFooter = styled.div`
  padding: ${sizes(2)};
  margin-top: 10px;
  background-color: ${cVar('colorBackgroundElevated')};
`
