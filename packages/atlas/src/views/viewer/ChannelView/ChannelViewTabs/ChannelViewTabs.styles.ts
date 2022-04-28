import styled from '@emotion/styled'

import { Pagination } from '@/components/Pagination'
import { sizes } from '@/styles'

export const VideoSection = styled.section`
  position: relative;
`

export const StyledPagination = styled(Pagination)`
  padding-top: ${sizes(6)};
`
