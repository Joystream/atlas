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
  margin-left: ${sizes(4)};
  align-self: start;
`

export const BannerDescription = styled.div<{ withTitle?: boolean }>`
  margin-top: ${({ withTitle }) => (withTitle ? sizes(2) : 0)};
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  white-space: pre-line;
`

export const BannerWrapper = styled.div<{ size: 'small' | 'medium'; borderColor?: string }>`
  flex: 1;
  position: relative;
  padding: ${(props) => (props.size === 'small' ? sizes(4) : sizes(6))};
  width: 100%;
  background-color: ${cVar('colorBackgroundMutedAlpha')};
  border-left: 2px solid ${({ borderColor }) => borderColor ?? cVar('colorBorderPrimary')};
`

export const ActionButton = styled(Button)`
  margin-top: ${sizes(2)};
`

export const Container = styled.div`
  display: flex;
  justify-content: space-between;
`
