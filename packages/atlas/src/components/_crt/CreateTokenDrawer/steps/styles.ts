import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

export const WidgetPreviewContainer = styled.div`
  display: grid;
  gap: ${sizes(4)};
  width: fit-content;
  margin-top: 100px;
  position: relative;
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
  height: 200px;
  width: 100%;
  background-color: ${cVar('colorBackgroundMuted')};
  padding: ${sizes(4)};
  opacity: 0.5;
`

export const PreviewContainer = styled.div`
  height: 300px;
  margin: 100px 0;
  display: flex;
  flex-direction: column;
  width: 100%;

  h1 {
    padding: 0 60px;
  }
`

export const TooltipBox = styled.div`
  text-align: center;
  padding: ${sizes(1)};
  border-radius: ${cVar('radiusSmall')};
`
