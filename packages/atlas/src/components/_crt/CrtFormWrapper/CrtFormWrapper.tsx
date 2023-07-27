import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { sizes } from '@/styles'

type CrtFormWrapperProps = {
  title: string
  titleLink: string
  subtitle: string
  children: React.ReactNode
}

export const CrtFormWrapper = ({ children, subtitle, titleLink, title }: CrtFormWrapperProps) => {
  return (
    <Wrapper>
      <HeaderWrapper>
        <TitleWrapper>
          <Text variant="h500" as="h5">
            {title}
          </Text>
        </TitleWrapper>
        <Text variant="t300" as="p" color="colorText">
          {subtitle}
        </Text>
      </HeaderWrapper>
      {children}
    </Wrapper>
  )
}

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(2)};
`

const TitleWrapper = styled.div`
  display: flex;
  gap: ${sizes(4)};
`

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(10)};
`
