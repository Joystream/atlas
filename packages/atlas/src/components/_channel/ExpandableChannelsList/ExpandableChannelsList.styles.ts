import styled from '@emotion/styled'

import { Button } from '@/components/_buttons/Button'
import { cVar, sizes } from '@/styles'

export const LanguageSelectWrapper = styled.div`
  margin-left: ${sizes(6)};
  width: ${sizes(34)};
`

export const Separator = styled.div`
  height: 1px;
  background-color: ${cVar('colorCoreNeutral700')};
  margin: ${sizes(16)} 0;
`

export const LoadMoreButtonWrapper = styled.div`
  margin-top: ${sizes(12)};
`

export const AdditionalLink = styled(Button)`
  margin-left: auto;
`
