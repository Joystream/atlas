import styled from '@emotion/styled'

import { media, sizes } from '@/styles'

export const WorkspaceWrapper = styled.div`
  display: grid;
  row-gap: ${sizes(6)};
  margin: ${sizes(10)} ${sizes(8)};

  ${media.md} {
    column-gap: ${sizes(8)};
    grid-template-columns: 450px auto;
  }
`

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(4)};
`
