import styled from '@emotion/styled'

import { SvgAppLogoShort } from '@/assets/logos'
import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

export const StyledSvgAppLogoShort = styled(SvgAppLogoShort)`
  height: 36px;

  path {
    fill: ${cVar('colorTextMuted')};
  }
`

export const Content = styled.div`
  margin-top: ${sizes(6)};
`

export const DescriptionText = styled(Text)`
  display: block;
`

export const Anchor = styled.a`
  text-decoration: none;
  color: inherit;
  cursor: pointer;
`

export const Img = styled.img`
  width: 100%;
`

export const HeaderIconsWrapper = styled.div`
  display: flex;
  align-items: center;
  margin: ${sizes(6)} 0;
`

export const CategoriesText = styled(Text)`
  display: block;
  margin-top: ${sizes(1)};
`
