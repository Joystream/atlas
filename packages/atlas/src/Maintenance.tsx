import styled from '@emotion/styled'
import { FC } from 'react'

import { SvgEmptyStateIllustration } from '@/assets/illustrations'
import { SvgAppLogoFull } from '@/assets/logos'
import { Text } from '@/components/Text'
import { atlasConfig } from '@/config'

export const Maintenance: FC = () => (
  <Container>
    <SvgEmptyStateIllustration width={240} height={152} />
    <Header as="h1" variant="h500">
      We’ll be right back!
    </Header>
    <Text as="p" variant="t200" color="colorText">
      {atlasConfig.general.appName} is currently undergoing maintenance work <br /> in order to ensure the best features{' '}
      <br /> and performance for our users. <br /> <br />
      We should be back shortly. <br /> See you soon!
    </Text>
    <SvgAppLogoFull />
  </Container>
)

const Container = styled.div`
  position: relative;
  width: 360px;
  margin: 0 auto;
  text-align: center;
  top: 50%;
  transform: translateY(-50%);

  svg {
    margin: 40px auto;
  }
`

const Header = styled(Text)`
  margin-bottom: 8px;
`
