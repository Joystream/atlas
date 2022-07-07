import { SvgActionClose } from '@/components/_icons'

import { CloseButton, EmbeddedShareWrapper, OverlayBackground, ShareTitle } from './EmbeddedShareOverlay.styles'

import { VideoSharing } from '../VideoSharing'

type EmbeddedShareOverlayProps = {
  videoId?: string
  currentTime?: number
}

export const EmbeddedShareOverlay: React.FC<EmbeddedShareOverlayProps> = ({ videoId, currentTime }) => {
  return (
    <OverlayBackground>
      <CloseButton icon={<SvgActionClose />} variant="tertiary" size="medium" />
      <EmbeddedShareWrapper>
        <ShareTitle variant="h600" as="h2">
          Share video
        </ShareTitle>
        <VideoSharing videoId={videoId} currentTime={currentTime} isEmbedded />
      </EmbeddedShareWrapper>
    </OverlayBackground>
  )
}
