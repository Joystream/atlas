import styled from '@emotion/styled'

import { colors, sizes } from '@/shared/theme'

export const TextContainer = styled.div`
  display: grid;
  grid-gap: ${sizes(4)};
  padding-bottom: ${sizes(8)};
  margin-bottom: ${sizes(8)};
  border-bottom: 1px solid ${colors.gray[600]};
`

export const Container = styled.div`
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(206px, 326px);
  gap: 142px;
  margin-bottom: 50px;
`

export const LinksContainer = styled.div`
  display: grid;
  grid-gap: ${sizes(6)};
`

export const Links = styled.div`
  display: flex;
  flex-wrap: wrap;

  > button {
    margin-right: ${sizes(12)};
    margin-bottom: ${sizes(12)};
  }
`
