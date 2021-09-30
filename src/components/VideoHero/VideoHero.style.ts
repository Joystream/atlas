import styled from '@emotion/styled'

import { colors, media, sizes } from '@/shared/theme'

import { ChannelLink } from '../ChannelLink'

export const Container = styled.section`
  position: relative;
  padding: 160px var(--global-horizontal-padding) ${sizes(4)};
  margin: 0 calc(-1 * var(--global-horizontal-padding));
  display: flex;
  flex-direction: column;
  justify-content: flex-end;

  ${media.sm} {
    padding: ${sizes(8)} var(--global-horizontal-padding);
    height: 66.6667vh;
  }
`

export const BackgroundContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 240px;

  ${media.sm} {
    bottom: -128px;
    height: auto;
  }
`

export const GradientOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(180deg, transparent 50%, ${colors.black} 93.23%, ${colors.black} 100%),
    radial-gradient(50.66% 101.32% at 50% 50%, transparent 0%, ${colors.transparentBlack[54]} 100%),
    ${colors.transparentBlack[54]};
`

export const InfoContainer = styled.div`
  position: relative;
  width: 100%;
`

export const StyledChannelLink = styled(ChannelLink)`
  margin-bottom: ${sizes(4)};
`

export const TitleContainer = styled.div`
  a {
    text-decoration: none;
  }
`

export const ButtonsContainer = styled.div`
  display: flex;
  margin-top: ${sizes(4)};

  ${media.sm} {
    margin-top: ${sizes(8)};
  }

  > * + * {
    margin-left: ${sizes(4)};
    flex-shrink: 0;
  }
`
