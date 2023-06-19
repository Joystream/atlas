import styled from '@emotion/styled'

import { Avatar } from '@/components/Avatar'
import { sizes } from '@/styles'

export const InputsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(8)};
`

export const StyledAvatar = styled(Avatar)`
  position: relative;
  margin-right: ${sizes(4)};
  flex-shrink: 0;
  visibility: visible;
`
