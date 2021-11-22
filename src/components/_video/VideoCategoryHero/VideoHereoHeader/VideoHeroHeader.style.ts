import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { media, oldColors, sizes } from '@/styles'

export const StyledVideoHeroHeader = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  align-self: flex-start;
`
export const Divider = styled.div`
  width: 1px;
  align-self: stretch;
  background-color: ${oldColors.gray[600]};
  margin: 0 ${sizes(2)};

  ${media.md} {
    margin: 0 ${sizes(4)};
  }
`

export const VideoHeroHeaderTitle = styled(Text)`
  margin-left: ${sizes(2)};
`
