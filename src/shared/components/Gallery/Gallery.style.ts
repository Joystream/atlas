import styled from '@emotion/styled'

import { sizes, typography } from '../../theme'

export const Container = styled.section`
  display: flex;
  flex-direction: column;
`
export const HeadingContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-bottom: ${sizes(4)};

  > h4 {
    font-size: ${typography.sizes.h5};
    margin: 0;
  }

  > button {
    font-size: ${typography.sizes.subtitle2};
    padding: 0;
  }
`
