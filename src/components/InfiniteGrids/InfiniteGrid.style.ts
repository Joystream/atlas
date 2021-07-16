import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Placeholder, Text } from '@/shared/components'
import { SvgPlayerPlay } from '@/shared/icons'
import { colors, sizes } from '@/shared/theme'

export const Title = styled(Text)`
  margin-bottom: ${sizes(4)};
`

export const StyledPlaceholder = styled(Placeholder)`
  margin-bottom: ${sizes(4)};
`

export const LoadMoreButtonWrapper = styled.div`
  margin-top: ${sizes(10)};
`

export const WatchAllLink = styled(Link)`
  display: inline-flex;
  text-decoration: none;
  color: ${colors.blue[300]};
  align-items: center;
  font-weight: 700;
  margin-left: ${sizes(9)};
`

export const StyledSvgGlyphPlay = styled(SvgPlayerPlay)`
  margin-right: ${sizes(3)};

  path {
    fill: ${colors.blue[300]};
  }
`

export const TitleWrapper = styled.div`
  align-items: baseline;
  display: flex;
`
