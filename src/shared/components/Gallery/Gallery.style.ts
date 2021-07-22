import styled from '@emotion/styled'

import { Button } from '@/shared/components'

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

export const TitleWrapper = styled.div`
  align-items: baseline;
  display: flex;
`

export const SeeAllLink = styled(Button)`
  margin-left: ${sizes(8)};
`
