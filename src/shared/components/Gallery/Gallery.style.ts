import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { SvgPlayerPlay } from '@/shared/icons'

import { colors, sizes } from '../../theme'

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
