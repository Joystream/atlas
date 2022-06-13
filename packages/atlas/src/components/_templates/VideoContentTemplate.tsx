import styled from '@emotion/styled'
import { FC, PropsWithChildren, useMemo } from 'react'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Text } from '@/components/Text'
import { CallToActionButton, CallToActionWrapper } from '@/components/_buttons/CallToActionButton'
import { CTA_MAP } from '@/config/cta'
import { cVar, media, sizes } from '@/styles'
import { CtaData } from '@/types/cta'

type VideoContentTemplateProps = PropsWithChildren<{
  title?: string
  cta?: CtaData[]
}>

export const VideoContentTemplate: FC<VideoContentTemplateProps> = ({ children, title, cta }) => {
  const ctaContent = useMemo(
    () => cta && cta.map((item, idx) => <CallToActionButton key={`cta-${idx}`} {...CTA_MAP[item]} />),
    [cta]
  )

  return (
    <StyledViewWrapper big>
      {title && (
        <Header as="h1" variant="h600">
          {title}
        </Header>
      )}
      {children}
      {cta && <CallToActionWrapper>{ctaContent}</CallToActionWrapper>}
    </StyledViewWrapper>
  )
}

const Header = styled(Text)`
  margin: ${sizes(16)} 0;
  font: ${cVar('typographyDesktopH600')};
  letter-spacing: ${cVar('typographyDesktopH600LetterSpacing')};
  text-transform: ${cVar('typographyDesktopH600TextTransform')};

  ${media.lg} {
    font: ${cVar('typographyDesktopH700')};
    letter-spacing: ${cVar('typographyDesktopH700LetterSpacing')};
    text-transform: ${cVar('typographyDesktopH700TextTransform')};
  }
`

const StyledViewWrapper = styled(LimitedWidthContainer)`
  padding-bottom: ${sizes(16)};

  > section {
    :not(:first-of-type) {
      margin-top: ${sizes(32)};
    }
  }
`
