import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { cVar, sizes } from '@/styles'

export const InformationWrapper = styled.div`
  display: inline-grid;
  grid-template-columns: auto auto;
  gap: ${sizes(1)};
  align-items: center;
`

export const ReferalBannerContainer = styled.div`
  width: 100%;
  padding: ${sizes(4)} ${sizes(8)};
  display: flex;
  justify-content: space-between;
  background-color: ${cVar('colorBackgroundMuted')};
`

export const ChannelInfoContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  gap: ${sizes(2)};
`

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: unset;
`
