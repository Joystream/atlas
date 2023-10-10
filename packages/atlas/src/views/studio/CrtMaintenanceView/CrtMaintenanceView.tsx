import styled from '@emotion/styled'
import { FC } from 'react'

import crtMaint from '@/assets/images/crt-maintenance.webp'
import { Text } from '@/components/Text'
import { useHeadTags } from '@/hooks/useHeadTags'

export const CrtMaintenanceView: FC = () => {
  const headTags = useHeadTags('Creator tokens')
  return (
    <>
      {headTags}
      <Container>
        <img style={{ maxWidth: '428px' }} src={crtMaint} alt="Creator token maintenance image" />
        <Text variant="h500" as="h1" margin={{ top: 10 }}>
          Creator Tokens are Under Maintenance
        </Text>
        <Text as="span" margin={{ top: 2 }} align="center" variant="t200" color="colorText">
          We should be back shortly. In the meantime, {/*@ts-ignore our types don't allow this but its fine here*/}
          <Text variant="t200" as="a" color="colorTextPrimary" href="https://www.google.com" target="_blank">
            feel free to connect with us on Discord.
          </Text>
        </Text>
      </Container>
    </>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  margin: 0 auto;
  text-align: center;

  * {
    width: min(100%, 408px);
  }
`
