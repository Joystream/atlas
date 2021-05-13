import React from 'react'
import styled from '@emotion/styled'
import { ReactComponent as EmptyUploadsIllustration } from '@/assets/theater-mask.svg'
import { Button, Text } from '@/shared/components'
import { sizes, media, zIndex } from '@/shared/theme'
import { SvgGlyphUpload } from '@/shared/icons'
import { absoluteRoutes } from '@/config/routes'

export const EmptyUploadsView: React.FC = () => {
  return (
    <ContainerView>
      <StyledEmptyUploadsIllustration />
      <InnerContainerView>
        <MessageView>
          <Text variant="body2" secondary>
            There are no uploads on your list
          </Text>
        </MessageView>
        <Button icon={<SvgGlyphUpload />} to={absoluteRoutes.studio.editVideo()} size="large">
          Upload video
        </Button>
      </InnerContainerView>
    </ContainerView>
  )
}

const ContainerView = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  ${media.medium} {
    margin-top: ${sizes(16)};
  }
`

const InnerContainerView = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  margin-top: -200px;
`

const StyledEmptyUploadsIllustration = styled(EmptyUploadsIllustration)`
  transform: scale(1.5);
  width: 100%;
  z-index: ${zIndex.farBackground};
  ${media.small} {
    transform: scale(1);
  }
`

const MessageView = styled.div`
  text-align: center;
  margin-bottom: ${sizes(4)};
`
