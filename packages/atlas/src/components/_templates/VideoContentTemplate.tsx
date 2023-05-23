import styled from '@emotion/styled'
import { FC, PropsWithChildren } from 'react'

import { LimitedWidthContainer } from '@/components/LimitedWidthContainer'
import { Text } from '@/components/Text'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { sizes } from '@/styles'

type VideoContentTemplateProps = PropsWithChildren<{
  title?: string
}>

export const VideoContentTemplate: FC<VideoContentTemplateProps> = ({ children, title }) => {
  const lgMatch = useMediaMatch('lg')

  return (
    <StyledViewWrapper big>
      {title && (
        <Text as="h1" variant={lgMatch ? 'h700' : 'h600'} margin={{ top: 16, bottom: 16 }}>
          {title}
        </Text>
      )}
      {children}
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
