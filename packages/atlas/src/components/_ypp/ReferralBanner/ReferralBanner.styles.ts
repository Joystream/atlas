import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Text } from '@/components/Text'
import { cVar, media, sizes } from '@/styles'

export const InformationWrapper = styled.div`
  display: inline-grid;
  grid-template-columns: auto auto;
  gap: ${sizes(1)};
  align-items: center;
`

export const ReferralBannerContainer = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: auto max-content;
  justify-content: space-between;
  column-gap: ${sizes(2)};
  background-color: ${cVar('colorBackgroundMuted')};
  padding: ${sizes(4)} ${sizes(4)};
  ${media.md} {
    padding: ${sizes(4)} ${sizes(8)};
  }
`

export const ChannelInfoContainer = styled.div`
  display: grid;
  grid-template-columns: auto auto;
  grid-template-rows: auto auto;
  column-gap: ${sizes(2)};
`

export const ChannelAvatarLink = styled(Link)`
  grid-row: span 2;
  align-self: center;
`

export const ChannelTitleText = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: unset;
  overflow: hidden;
`
