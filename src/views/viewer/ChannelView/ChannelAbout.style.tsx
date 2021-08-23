import styled from '@emotion/styled'

import { Avatar } from '@/shared/components/Avatar'
import { LayoutGrid } from '@/shared/components/LayoutGrid/LayoutGrid'
import { Text } from '@/shared/components/Text'
import { colors, sizes } from '@/shared/theme'

export const TextContainer = styled.div`
  display: grid;
  grid-gap: ${sizes(4)};
  padding-bottom: ${sizes(8)};
  margin-bottom: ${sizes(8)};
  border-bottom: 1px solid ${colors.gray[600]};
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

export const Details = styled.div`
  display: grid;
  gap: ${sizes(2)};
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

export const StyledLayoutGrid = styled(LayoutGrid)`
  margin-bottom: 50px;
`
