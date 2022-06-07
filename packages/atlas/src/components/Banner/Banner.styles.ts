import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { cVar, sizes } from '@/styles'

export const BannerHeader = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const IconWrapper = styled.div`
  margin-right: ${sizes(2)};
`

export const BannerText = styled(Text)`
  word-break: break-word;
  flex: 1;
`

export const CloseButton = styled(Button)`
  margin-left: ${sizes(2)};
`

export const BannerDescription = styled.div<{ withTitle?: boolean }>`
  margin-top: ${({ withTitle }) => (withTitle ? sizes(2) : 0)};
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

export const BannerWrapper = styled.div`
  position: relative;
  padding: ${sizes(4)};
  box-shadow: inset 0 0 0 1px ${cVar('colorBorder')};
  width: 100%;
`
