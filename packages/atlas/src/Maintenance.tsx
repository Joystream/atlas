import styled from '@emotion/styled'
import { FC } from 'react'

import { SvgEmptyStateIllustration } from '@/assets/illustrations'
import { SvgAppLogoFull, SvgJoystreamLogoFull } from '@/assets/logos'
import { Text } from '@/components/Text'
import { atlasConfig } from '@/config'

import { cVar, sizes } from './styles'

export const Maintenance: FC = () => (
  <Container>
    <StyledSvgEmptyStateIllustration width={240} height={152} />
    <Header as="h1" variant="h500">
      We will be up & running soon
    </Header>
    <Text as="p" variant="t200" color="colorText">
      ${atlasConfig.general.appName} is currently unavailable due to the network upgrade, new infrastructure release
      rollout or operational update which required a temporary downtime.
      <br />
      We should be back shortly. In the meantime,{' '}
      <StyledAnchor href={atlasConfig.general.joystreamDiscordUrl} target="_blank">
        <Text as="span" variant="t200" color="colorTextPrimary">
          feel free to connect with us on Discord.
        </Text>
      </StyledAnchor>
    </Text>
    <Divider />
    <StyledSvgAppLogoFull width={undefined} height={40} />
    <StyledJoystreamAnchor href={atlasConfig.general.joystreamLandingPageUrl} target="_blank">
      <Text as="span" variant="t100" color="colorTextMuted" margin={{ right: 2 }}>
        Powered by
      </Text>
      <StyledSvgJoystreamLogoFull height={16} width={undefined} />
    </StyledJoystreamAnchor>
  </Container>
)

const Container = styled.div`
  position: relative;
  width: 360px;
  margin: 0 auto;
  text-align: center;
  top: 50%;
  transform: translateY(-50%);
`

const StyledSvgAppLogoFull = styled(SvgAppLogoFull)`
  margin: 40px auto;
`

const StyledSvgEmptyStateIllustration = styled(SvgEmptyStateIllustration)`
  margin: 40px auto;
`

const StyledSvgJoystreamLogoFull = styled(SvgJoystreamLogoFull)`
  path {
    fill: ${cVar('colorTextMuted')};
  }
`

export const Divider = styled.div`
  height: 2px;
  width: 32px;
  background-color: ${cVar('colorCoreNeutral800')};
  margin: ${sizes(8)} auto;
`

export const StyledAnchor = styled.a`
  text-decoration: none;
`

export const StyledJoystreamAnchor = styled.a`
  text-decoration: none;
  justify-content: center;
  display: flex;
`

const Header = styled(Text)`
  margin-bottom: 8px;
`
