import styled from '@emotion/styled'
import { ReactNode } from 'react'

import { Text } from '@/components/Text'
import { sizes } from '@/styles'

type CrtFormWrapperProps = {
  title: string
  learnMoreLink: string
  subtitle: string
  children: ReactNode
}

export const CrtFormWrapper = ({ children, subtitle, title }: CrtFormWrapperProps) => {
  return (
    <Wrapper>
      <HeaderWrapper>
        <TitleWrapper>
          <Text variant="h500" as="h5">
            {title}
          </Text>
          {/*<TextButton to={learnMoreLink} icon={<SvgActionPlay />}>*/}
          {/*  Learn more*/}
          {/*</TextButton>*/}
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
