import styled from '@emotion/styled'

import { sizes } from '../../theme'

export const Container = styled.section`
  display: flex;
  flex-direction: column;
`

export const CarouselArrowsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: ${sizes(4)};
  margin-left: auto;
`
