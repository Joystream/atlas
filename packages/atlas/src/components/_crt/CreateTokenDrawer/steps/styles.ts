import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

export const WidgetPreviewContainer = styled.div`
  display: grid;
  gap: ${sizes(4)};
  width: fit-content;
  margin-top: 100px;
  position: relative;
  height: 400px;
`

export const Shadow = styled.div`
  position: absolute;
  inset: 0;
  box-shadow: inset 70px -150px 60px -21px black;
  z-index: 1;
`

export const LeftPlaceholder = styled.div`
  grid-column: 1/2;
  grid-row: 1/3;
  background-color: ${cVar('colorBackgroundMuted')};
  opacity: 0.5;
  position: absolute;
  top: 0;
  right: calc(100% + ${sizes(4)});
  width: 500px;
  height: 1000px;
`

export const BottomPlaceholder = styled.div`
  height: 400px;
  width: 100%;
  background-color: ${cVar('colorBackgroundMuted')};
  padding: ${sizes(4)};
  opacity: 0.5;
`

export const PreviewContainer = styled.div`
  margin: 100px 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: ${sizes(8)};

  .chart-box {
    margin: -20px 0 0 -20px;
    width: calc(100% + 125px);
    height: 300px;
  }
`

export const TooltipBox = styled.div`
  text-align: center;
  padding: ${sizes(1)};
  border-radius: ${cVar('radiusSmall')};
`
