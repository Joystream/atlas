import styled from '@emotion/styled'

import { Button } from '@/shared/components/Button'
import { Text } from '@/shared/components/Text'
import { colors, sizes } from '@/shared/theme'

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: ${sizes(6)} 0;
`

export const Content = styled.div`
  border-color: ${colors.gray[600]};
  border-style: solid;
  border-width: 1px 0 1px 0;
  padding: ${sizes(4)} 0;
`

export const Actions = styled.div`
  padding: ${sizes(4)} 0;
`
export const ActionButton = styled(Button)`
  &:first-child {
    margin-bottom: ${sizes(2)};
  }
`

export const Title = styled(Text)`
  display: block;
  margin-bottom: ${sizes(4)};
`
