import styled from '@emotion/styled'

import { Button } from '@/shared/components'
import { colors, sizes } from '@/shared/theme'

export const LoadMoreButtonWrapper = styled.div`
  margin-top: ${sizes(12)};
`

export const TitleWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const LanguageSelectWrapper = styled.div`
  margin-left: ${sizes(6)};
  width: ${sizes(34)};
`

export const Separator = styled.div`
  height: 1px;
  background-color: ${colors.gray[700]};
  margin: ${sizes(16)} 0;
`

export const AdditionalLink = styled(Button)`
  margin-left: auto;
`
