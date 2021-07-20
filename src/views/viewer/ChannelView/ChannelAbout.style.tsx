import styled from '@emotion/styled'

import { Avatar, Text } from '@/shared/components'
import { colors, media, sizes } from '@/shared/theme'

export const TextContainer = styled.div`
  display: grid;
  grid-gap: ${sizes(4)};
  padding-bottom: ${sizes(8)};
  margin-bottom: ${sizes(8)};
  border-bottom: 1px solid ${colors.gray[600]};
`

export const Container = styled.div`
  display: grid;
  gap: 142px;
  grid-template-columns: minmax(0, 1fr) minmax(206px, 326px);
  margin-bottom: 50px;
  ${media.base} {
    gap: 32px;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
  ${media.small} {
    gap: 79px;
    grid-template-rows: initial;
    grid-template-columns: minmax(0, 1fr) minmax(206px, 228px);
  }
  ${media.medium} {
    gap: 94px;
    grid-template-columns: minmax(0, 1fr) minmax(206px, 260px);
  }
`

export const LinksContainer = styled.div`
  display: grid;
  grid-gap: ${sizes(6)};
`

export const Links = styled.div`
  display: flex;
  flex-wrap: wrap;

  > a {
    margin-right: ${sizes(12)};
    margin-bottom: ${sizes(6)};
  }
`

export const DetailsContainer = styled.div`
  ${media.base} {
    grid-row: 1;
  }
  ${media.compact} {
    grid-row: initial;
  }
`

export const Details = styled.div`
  padding-bottom: ${sizes(4)};
  border-bottom: 1px solid ${colors.gray[600]};
  margin-bottom: ${sizes(4)};
`

export const DetailsText = styled(Text)`
  margin-bottom: ${sizes(4)};
`

export const AvatarContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: ${sizes(2)};
`

export const StyledAvatar = styled(Avatar)`
  margin-right: ${sizes(2)};
`
