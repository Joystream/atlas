import styled from '@emotion/styled'
import { ChannelAvatar, Placeholder } from '@/shared/components'
import { sizes, colors, typography, breakpoints } from '@/shared/theme'

export const Container = styled.div`
  display: flex;
  flex-direction: column;
`

export const PlayerContainer = styled.div`
  width: 100%;
`

export const PlayerWrapper = styled.div`
  display: flex;
  justify-content: center;
`

export const PlayerPlaceholder = styled(Placeholder)`
  height: 30vh;
  @media screen and (min-width: ${breakpoints.small}) {
    height: 70vh;
  }
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
    color: ${colors.gray[300]};
    line-height: 175%;
    margin: ${sizes(4)} 0 0;
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
