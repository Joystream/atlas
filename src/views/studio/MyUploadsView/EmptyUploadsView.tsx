import React from 'react'
import styled from '@emotion/styled'
import { ReactComponent as EmptyUploadsIllustration } from '@/assets/empty-uploads-illustration.svg'
import { Button, Text } from '@/shared/components'
import { sizes } from '@/shared/theme'
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
        <div>
          <Button icon={<SvgGlyphUpload />} to={absoluteRoutes.studio.editVideo()} size="large">
            Upload video
          </Button>
        </div>
      </InnerContainerView>
    </ContainerView>
  )
}

const ContainerView = styled.div`
  position: relative;
`

const InnerContainerView = styled.div`
  position: absolute;
  left: 50%;
  top: ${sizes(78)};
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`

const StyledEmptyUploadsIllustration = styled(EmptyUploadsIllustration)`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  margin-top: ${sizes(8)};
`

const MessageView = styled.div`
  text-align: center;
  margin-bottom: ${sizes(4)};
`
