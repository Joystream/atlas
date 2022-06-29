import { FC, PropsWithChildren } from 'react'

import { Information } from '@/components/Information'
import { Text } from '@/components/Text'
import { Loader } from '@/components/_loaders/Loader'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  AnimatedContainer,
  ContentContainer,
  HeaderContainer,
  LogoContainer,
  StyledJoystreamLogo,
} from './SignInModalStepTemplate.styles'

type SignInModalStepTemplateProps = PropsWithChildren<{
  title: string
  subtitle: string
  tooltipText?: string
  loader?: boolean
  hasNavigatedBack: boolean
}>

export const SignInModalStepTemplate: FC<SignInModalStepTemplateProps> = ({
  title,
  subtitle,
  tooltipText,
  children,
  loader,
  hasNavigatedBack,
}) => {
  const smMatch = useMediaMatch('sm')

  return (
    <AnimatedContainer hasNavigatedBack={hasNavigatedBack}>
      <LogoContainer>{loader ? <Loader variant="medium" /> : <StyledJoystreamLogo />}</LogoContainer>
      <HeaderContainer>
        <Text as="h3" variant={smMatch ? 'h500' : 'h400'}>
          {title}
        </Text>
        {tooltipText ? <Information text={tooltipText} placement="top" multiline /> : null}
      </HeaderContainer>
      <Text variant="t200" as="span" color="colorText">
        {subtitle}
      </Text>
      <ContentContainer>{children}</ContentContainer>
    </AnimatedContainer>
  )
}
