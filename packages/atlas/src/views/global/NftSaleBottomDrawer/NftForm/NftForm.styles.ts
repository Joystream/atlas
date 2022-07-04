import styled from '@emotion/styled'

import { cVar, media, sizes } from '@/styles'

export const ScrollableWrapper = styled.div`
  height: 100%;
`

export const NftWorkspaceFormWrapper = styled.div`
  height: 100%;
  justify-content: flex-end;
  display: flex;
  flex-direction: column-reverse;

  ${media.md} {
    display: block;
  }
`

export const NftPreview = styled.div<{ fixedHeight?: number }>`
  background: ${cVar('colorCoreBaseBlack')};
  justify-content: center;
  align-items: center;
  flex-direction: column;
  display: none;

  ${media.sm} {
    padding: ${sizes(8)};
    display: flex;
  }

  ${media.md} {
    overflow: auto;
    padding: 0;
    width: 50%;
    position: fixed;
    left: 0;
    height: ${({ fixedHeight }) => (fixedHeight ? `${fixedHeight}px` : '100%')};
  }
`

export const NftFormScrolling = styled.div`
  --form-md-scrolling-padding: ${sizes(8)};

  padding: ${sizes(8)} ${sizes(4)} ${sizes(16)} ${sizes(4)};
  flex-grow: 1;
  position: relative;

  ${media.md} {
    padding: var(--form-md-scrolling-padding);
    left: 50%;
    max-width: 50%;
  }
`

type NftFormWrapperProps = {
  lastStep: boolean
}

export const NftFormWrapper = styled.div<NftFormWrapperProps>`
  height: 100%;
  padding-bottom: ${({ lastStep }) => lastStep && '40px'};
  margin: 0 auto;

  ${media.md} {
    max-width: calc(720px - (2 * var(--form-md-scrolling-padding)));
  }
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
  width: 100%;
  display: grid;
  gap: ${sizes(4)};
  grid-template-columns: repeat(3, max-content);
`

export const StepWrapper = styled.div<{ isLast?: boolean }>`
  display: grid;
  grid-template-columns: 1fr ${({ isLast }) => !isLast && 'auto'};
  gap: 16px;
  align-items: center;
`
