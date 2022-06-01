import styled from '@emotion/styled'

import { Button } from '@/components/_buttons/Button'
import { cVar, sizes } from '@/styles'

export const TermsBox = styled.div`
  scroll-behavior: smooth;
  text-align: left;
  position: relative;
  height: 300px;
  width: 100%;
  background-color: ${cVar('colorCoreNeutral800')};
  overflow: auto;
`
export const TextWrapper = styled.div`
  margin: ${sizes(9)} ${sizes(9)} ${sizes(9)} ${sizes(8)};

  a {
    text-decoration: none;
    color: ${cVar('colorCoreNeutral50')};
  }
`

export const TermsOverlay = styled.div`
  position: sticky;
  left: 0;
  bottom: 0;
  height: 35%;
  width: auto;
  background: linear-gradient(180deg, transparent 0%, ${cVar('colorCoreNeutral800')} 100%);
`
export const ScrollButton = styled(Button)`
  position: absolute;
  right: ${sizes(6)};
  bottom: ${sizes(6)};
`
