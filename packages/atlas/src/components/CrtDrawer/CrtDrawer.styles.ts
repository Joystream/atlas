import styled from '@emotion/styled'

import { Step } from '@/components/Step'
import { BottomDrawer } from '@/components/_overlays/BottomDrawer'
import { cVar, media, sizes } from '@/styles'

export const StyledBottomDrawer = styled(BottomDrawer)`
  top: 0;
  height: 100vh;
`

export const Container = styled.div`
  display: grid;
  height: 100%;

  ${media.md} {
    grid-template-columns: 1fr 1fr;
  }
`

export const PreviewContainer = styled.div`
  width: 100%;
  background-color: #000;
  height: 100%;
  ${media.md} {
    grid-column: 1;
    grid-row: 1;
  }
`

export const FormContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: ${sizes(8)};
  ${media.md} {
    grid-column: 2/3;
  }
`

export const StepContainer = styled.div`
  display: flex;
  align-items: center;
  overflow-x: auto;
  width: fit-content;
  margin-bottom: ${sizes(8)};

  svg {
    min-width: 16px;
  }
`

export const StyledStep = styled(Step)`
  width: fit-content;
`

export const StepWrapper = styled.div`
  overflow-x: auto;
  width: 100%;
  scrollbar-width: none;
  box-shadow: ${cVar('effectDividersBottom')};
  margin-bottom: ${sizes(8)};
  min-height: 82px;

  ::-webkit-scrollbar {
    display: none;
  }
`
