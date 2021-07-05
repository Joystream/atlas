import styled from '@emotion/styled'

import { colors, sizes, typography } from '../../theme'

export const Container = styled.section`
  display: flex;
  flex-direction: column;
`
export const HeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: start;
  margin-bottom: ${sizes(10)};
  padding-bottom: ${sizes(4)};
  border-bottom: 1px solid ${colors.gray[700]};

  > h4 {
    font-size: ${typography.sizes.h4};
    margin: 0;
  }

  > button {
    font-size: ${typography.sizes.subtitle2};
    padding: 0;
  }
`

export const CarouselArrowsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap: ${sizes(4)};
  margin-left: auto;
`
