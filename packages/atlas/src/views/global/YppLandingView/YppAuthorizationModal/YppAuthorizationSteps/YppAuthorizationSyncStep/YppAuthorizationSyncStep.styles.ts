import styled from '@emotion/styled'

import { Banner } from '@/components/Banner'
import { cVar, sizes } from '@/styles'

export const FormWrapper = styled.div`
  display: grid;
  gap: ${sizes(6)};
`

export const StyledBanner = styled(Banner)`
  h3 {
    font: ${cVar('typographyDesktopH300')};
  }
`
