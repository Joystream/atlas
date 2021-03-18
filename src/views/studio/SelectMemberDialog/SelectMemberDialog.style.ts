import { Text } from '@/shared/components'
import { colors, sizes } from '@/shared/theme'
import styled from '@emotion/styled'

export const DialogSubtitle = styled(Text)`
  margin-top: ${sizes(2)};
  color: ${colors.gray[200]};
`

export const Underline = styled.div`
  margin-top: ${sizes(4)};
  background: ${colors.gray[600]};
  position: absolute;
  left: 0;
  height: 1px;
  width: 100%;
`
