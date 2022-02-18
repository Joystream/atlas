import styled from '@emotion/styled'

import { cVar, media, sizes } from '@/styles'

export const Wrapper = styled.div`
  position: relative;
  left: -5px;
  width: 100vw;
  background-color: ${cVar('colorBackgroundStrong')};

  ${media.sm} {
    left: 0;
    width: 516px;
  }
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${sizes(4)};
`

export const Content = styled.div`
  overflow-y: auto;

  ${media.sm} {
    max-height: 336px;
  }
`
