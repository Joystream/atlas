import { FC, useEffect, useRef, useState } from 'react'

import {
  SvgActionCopy,
  SvgActionEmbed,
  SvgLogoFacebookMonochrome,
  SvgLogoFacebookOnLight,
  SvgLogoTwitterMonochrome,
  SvgLogoTwitterOnLight,
  SvgLogoVkMonochrome,
  SvgLogoVkOnLight,
} from '@/components/_icons'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { Input } from '@/components/_inputs/Input'
import { absoluteRoutes } from '@/config/routes'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { copyToClipboard, isMobile } from '@/utils/browser'
import { formatDurationShort } from '@/utils/time'

import { InputContainer, ShareButton, ShareButtonsContainer, ShareWrapper } from './VideoSharing.styles'

type VideoSharingProps = {
  videoId?: string
  isEmbedded?: boolean
  currentTime?: number
}

export const VideoSharing: FC<VideoSharingProps> = ({ videoId, currentTime, isEmbedded }) => {
  const [url, setUrl] = useState(window.location.origin + absoluteRoutes.viewer.video(videoId))
  const [startsAt, setStartsAt] = useState(0)
  const xsMatch = useMediaMatch('xs')

  const [timeStampChecked, setTimeStampChecked] = useState(false)

  const firstRender = useRef(true)

  useEffect(() => {
    if (!firstRender.current || !currentTime) {
      return
    }
    setStartsAt(currentTime)
    firstRender.current = false
  }, [currentTime])

  const handleCheckboxChange = (val: boolean) => {
    setTimeStampChecked(val)
    if (val) {
      setUrl(window.location.origin + absoluteRoutes.viewer.video(videoId) + '?time=' + startsAt)
    } else {
      setUrl(window.location.origin + absoluteRoutes.viewer.video(videoId))
    }
  }

  return (
    <ShareWrapper>
      <InputContainer>
        <Input
          onChange={() => null}
          size={isMobile() || !xsMatch ? 'medium' : 'large'}
          value={url}
          actionButton={{
            onClick: () => copyToClipboard(url),
            icon: <SvgActionCopy />,
          }}
        />
        <Checkbox
          label={`Starts at ${formatDurationShort(startsAt || 0)}`}
          value={timeStampChecked}
          onChange={handleCheckboxChange}
        />
      </InputContainer>
      <ShareButtonsContainer>
        <ShareButton variant={!isEmbedded ? 'primary' : 'secondary'}>
          <SvgActionEmbed />
        </ShareButton>
        <ShareButton variant={!isEmbedded ? 'primary' : 'secondary'}>
          {!isEmbedded ? <SvgLogoFacebookOnLight /> : <SvgLogoFacebookMonochrome />}
        </ShareButton>
        <ShareButton variant={!isEmbedded ? 'primary' : 'secondary'}>
          {!isEmbedded ? <SvgLogoTwitterOnLight /> : <SvgLogoTwitterMonochrome />}
        </ShareButton>
        <ShareButton variant={!isEmbedded ? 'primary' : 'secondary'}>
          {!isEmbedded ? <SvgLogoVkOnLight /> : <SvgLogoVkMonochrome />}
        </ShareButton>
      </ShareButtonsContainer>
    </ShareWrapper>
  )
}
