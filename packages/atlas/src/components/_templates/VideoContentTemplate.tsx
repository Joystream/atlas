import styled from '@emotion/styled'
import { FC, PropsWithChildren, useMemo } from 'react'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Text } from '@/components/Text'
import { CTA_MAP, CallToActionButton, CallToActionWrapper } from '@/components/_buttons/CallToActionButton'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { sizes } from '@/styles'
import { CtaData } from '@/types/cta'

type VideoContentTemplateProps = PropsWithChildren<{
  title?: string
  cta?: CtaData[]
}>

export const VideoContentTemplate: FC<VideoContentTemplateProps> = ({ children, title, cta }) => {
  const lgMatch = useMediaMatch('lg')
  const ctaContent = useMemo(
    () => cta && cta.map((item, idx) => <CallToActionButton key={`cta-${idx}`} {...CTA_MAP[item]} />),
    [cta]
  )

  return (
    <StyledViewWrapper big>
      {title && (
        <Text as="h1" variant={lgMatch ? 'h700' : 'h600'} margin={{ top: 16, bottom: 16 }}>
          {title}
        </Text>
      )}
      {children}
      {cta && <CallToActionWrapper itemsCount={cta.length}>{ctaContent}</CallToActionWrapper>}
    </StyledViewWrapper>
  )
}

const StyledViewWrapper = styled(LimitedWidthContainer)`
  padding-bottom: ${sizes(16)};

  > section {
    :not(:first-of-type) {
      margin-top: ${sizes(32)};
    }
  }
`
