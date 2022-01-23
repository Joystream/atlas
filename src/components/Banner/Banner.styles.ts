import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

export const BannerHeader = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr auto;
  gap: 8px;
  align-items: center;
`

export const BannerTitle = styled(Text)`
  word-break: break-word;
`

export const BannerDescription = styled(Text)`
  margin-top: ${sizes(2)};
  display: grid;

  word-break: break-word;
`

export const BannerWrapper = styled.div`
  position: relative;
  padding: ${sizes(4)};
  box-shadow: inset 0 0 0 1px ${cVar('colorBorder')};
  width: 100%;
`
