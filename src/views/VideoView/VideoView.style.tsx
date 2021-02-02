import styled from '@emotion/styled'
import { ChannelAvatar, Placeholder, Text } from '@/shared/components'
import { sizes, colors, typography, breakpoints } from '@/shared/theme'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`

export const PlayerContainer = styled.div`
  width: 100%;
  height: calc(100vw * 0.5625);
  @media screen and (min-width: ${breakpoints.medium}) {
    height: 70vh;
  }
`

export const PlayerWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin: 0 calc(-1 * var(--global-horizontal-padding));
`

export const PlayerPlaceholder = styled(Placeholder)`
  height: 100%;
`

export const DescriptionPlaceholder = styled(Placeholder)`
  height: 28px;
  margin: ${sizes(4)} 0 0;
`

export const InfoContainer = styled.div`
  padding: ${sizes(8)} 0;
`

export const Meta = styled.span`
  display: block;
  margin-top: ${sizes(1)};
  color: ${colors.gray[300]};
  font-size: 12px;
`

export const ChannelContainer = styled.div`
  margin-top: ${sizes(4)};
`

export const StyledChannelAvatar = styled(ChannelAvatar)`
  :hover {
    cursor: pointer;
  }
`

export const DescriptionContainer = styled.div`
  margin-top: ${sizes(6)};
  border-top: 1px solid ${colors.gray[800]};

  p {
    font-size: ${typography.sizes.body2};
    margin: ${sizes(4)} 0 0;
    @media screen and (min-width: ${breakpoints.small}) {
      font-size: 1rem;
      color: ${colors.gray[300]};
      line-height: 175%;
    }
  }
`

export const MoreVideosContainer = styled.div`
  margin-top: 88px;
`

export const MoreVideosHeader = styled.h5`
  margin: 0 0 ${sizes(4)};
  font-size: ${typography.sizes.h5};
`
export const LicenseContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${sizes(4)} 0 0;
  font-size: ${typography.sizes.overhead};
  color: ${colors.gray[500]};
  letter-spacing: 0.03rem;
  p {
    max-width: 60ch;
    margin: 0;
    line-height: 1.7;
  }
  a {
    text-decoration: none;
    color: ${colors.gray[500]};
  }
`

export const TitleText = styled(Text)`
  font-size: ${typography.sizes.h4};
  @media screen and (min-width: ${breakpoints.small}) {
    font-size: ${typography.sizes.h3};
  }
  @media screen and (min-width: ${breakpoints.medium}) {
    font-size: ${typography.sizes.h2};
  }
`
