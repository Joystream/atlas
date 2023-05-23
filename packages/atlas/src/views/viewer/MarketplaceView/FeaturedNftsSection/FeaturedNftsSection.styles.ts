import styled from '@emotion/styled'

import { FormField } from '@/components/_inputs/FormField'
import { cVar, sizes } from '@/styles'

export const FeaturedNftsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(8)};
`

export const StyledFormField = styled(FormField)`
  padding: ${sizes(6)} ${sizes(5)} ${sizes(5)};
`

export const PreviewWrapper = styled.div`
  display: flex;
  padding: ${sizes(5)};
  align-items: center;
  justify-content: center;
  height: 164px;
  background: ${cVar('colorBackgroundMutedAlpha')};
  box-shadow: ${cVar('effectDividersBottom')}, ${cVar('effectDividersTop')};
  width: 100%;
  margin-bottom: ${sizes(5)};
`
