import styled from '@emotion/styled'

import { Button } from '@/components/_buttons/Button'
import { oldColors, sizes } from '@/styles'

export const TermsBox = styled.div`
  scroll-behavior: smooth;
  text-align: left;
  position: relative;
  height: 300px;
  width: 100%;
  background-color: ${oldColors.gray[800]};
  overflow: auto;
`
export const TextWrapper = styled.div`
  margin: ${sizes(9)} ${sizes(9)} ${sizes(9)} ${sizes(8)};

  a {
    text-decoration: none;
    color: ${oldColors.gray[50]};
  }
`

export const TermsOverlay = styled.div`
  position: sticky;
  left: 0;
  bottom: 0;
  height: 35%;
  width: auto;
  background: linear-gradient(180deg, transparent 0%, ${oldColors.gray[800]} 100%);
`
export const ScrollButton = styled(Button)`
  position: absolute;
  right: ${sizes(6)};
  bottom: ${sizes(6)};
`
