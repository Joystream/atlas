import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

export const CollectorsBoxWrapper = styled.div`
  background: ${cVar('colorBackground')};
  padding: ${sizes(4)};
  display: inline-flex;
  align-items: center;
  cursor: pointer;

  :hover {
    background: ${cVar('colorBackgroundStrong')};
  }
`
export const PlusIconBackground = styled.div<{ background: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: ${({ background }) => background};
`

export const PlusIconWrapper = styled.div<{ isHovered?: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background: ${cVar('colorBackgroundAlpha')};
`
