import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { FlexBox } from '@/components/FlexBox'
import { cVar, sizes } from '@/styles'

export const StyledVideo = styled.video`
  width: 100%;
  height: auto;
  max-height: 100%;
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  border-radius: ${cVar('radiusMedium')};
`

export const GradientOverlay = styled.div`
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 20%;
  background: linear-gradient(to top, rgba(0 0 0 1), rgba(0 0 0 0));
`

export const StyledVideoWrapper = styled.div`
  position: relative;
  width: 100%;
  padding-top: 63%;
  max-width: 100%;
`

export const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${cVar('colorTextPrimary')};
`

export const StyledLimitedWidthWrapper = styled(FlexBox)`
  text-align: center;
  width: fit-content;
  margin: auto;
  padding-top: ${sizes(8)};
  max-width: 1368px;
`
