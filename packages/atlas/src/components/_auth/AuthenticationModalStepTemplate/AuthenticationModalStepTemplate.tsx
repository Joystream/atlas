import { FC, PropsWithChildren, ReactNode } from 'react'

import { Text } from '@/components/Text'
import { Loader } from '@/components/_loaders/Loader'
import { useMediaMatch } from '@/hooks/useMediaMatch'

import {
  AnimatedContainer,
  BackgroundImage,
  ContentContainer,
  CustomBackgroundContainer,
  HeaderContainer,
  LogoContainer,
  StyledAppLogo,
} from './AuthenticationModalStepTemplate.styles'

type AuthenticationModalStepTemplateProps = PropsWithChildren<{
  title: string
  subtitle?: ReactNode
  subtitleIcon?: ReactNode
  loader?: boolean
  hasNavigatedBack: boolean
  darkBackground?: boolean
  hasNegativeBottomMargin?: boolean
  backgroundImage?: string
  formNode?: ReactNode
}>

export const AuthenticationModalStepTemplate: FC<AuthenticationModalStepTemplateProps> = ({
  title,
  subtitle,
  subtitleIcon,
  children,
  loader,
  hasNavigatedBack,
  hasNegativeBottomMargin,
  darkBackground,
  backgroundImage,
  formNode,
}) => {
  const smMatch = useMediaMatch('sm')

  return (
    <>
      <CustomBackgroundContainer
        darkBackground={darkBackground}
        hasNegativeBottomMargin={hasNegativeBottomMargin}
        hasDivider={!!(backgroundImage || darkBackground)}
        hasBottomPadding={!!(backgroundImage || darkBackground)}
      >
        {backgroundImage && <BackgroundImage src={backgroundImage} alt="" />}
        <AnimatedContainer hasNavigatedBack={hasNavigatedBack}>
          <LogoContainer>
            {loader ? <Loader variant="medium" /> : <StyledAppLogo variant="short-monochrome" />}
          </LogoContainer>
          <HeaderContainer>
            <Text as="h3" variant={smMatch ? 'h500' : 'h400'}>
              {title}
            </Text>
          </HeaderContainer>
          {subtitle && (
            <>
              {subtitleIcon}
              <Text variant="t200" as="span" color="colorText">
                {subtitle}
              </Text>
            </>
          )}
          {children && <ContentContainer>{children}</ContentContainer>}
        </AnimatedContainer>
      </CustomBackgroundContainer>
      <AnimatedContainer hasNavigatedBack={hasNavigatedBack}>{formNode}</AnimatedContainer>
    </>
  )
}
