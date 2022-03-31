import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

export const ReactionStepperWrapper = styled.div`
  display: inline-grid;
  grid-template-columns: max-content max-content;
  grid-template-rows: auto auto;
  row-gap: ${sizes(2)};
`

export const ReactionButton = styled.button`
  display: grid;
  grid-template-columns: auto auto;
  gap: ${sizes(2)};
  align-items: center;
  background: none;
  border: none;
  padding: ${sizes(3)} ${sizes(4)};
  width: 100%;
`

export const ReactionBar = styled.div`
  width: 100%;
  grid-column: span 2;
  height: 2px;
  background-color: ${cVar('colorCoreNeutral700')};
`

export const ReactionBarProgress = styled.div<{ likesPercent: number }>`
  width: 100%;
  height: 100%;
  transform: scaleX(${({ likesPercent }) => likesPercent});
  transform-origin: left;
  background-color: ${cVar('colorText')};
`
