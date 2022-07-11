import { FC, MouseEvent, useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import { Tooltip } from '@/components/Tooltip'
import { SvgActionClose, SvgActionCopy, SvgActionEmbed } from '@/components/_icons'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { Input } from '@/components/_inputs/Input'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { absoluteRoutes } from '@/config/routes'
import { useClipboard } from '@/hooks/useClipboard'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { cVar, transitions } from '@/styles'
import { isMobile } from '@/utils/browser'
import { formatDurationShort } from '@/utils/time'

import {
  CloseButton,
  EmbeddedShareWrapper,
  InputContainer,
  OverlayBackground,
  ShareButton,
  ShareButtonsContainer,
  ShareTitle,
  ShareWrapper,
} from './VideoShare.styles'

type VideoShareProps = {
  videoId?: string
  isEmbedded?: boolean
  currentTime?: number
  isShareDialogOpen?: boolean
  onCloseShareDialog?: () => void
  isFullScreen: boolean
}

export const VideoShare: FC<VideoShareProps> = ({
  videoId,
  currentTime,
  isEmbedded,
  isShareDialogOpen,
  isFullScreen,
  onCloseShareDialog,
}) => {
  if (!isEmbedded) {
    return (
      <DialogModal title="Share video" show={isShareDialogOpen} onExitClick={onCloseShareDialog}>
        <VideoShareContent videoId={videoId} currentTime={currentTime} />
      </DialogModal>
    )
  } else {
    return (
      <CSSTransition
        in={isShareDialogOpen}
        timeout={parseInt(cVar('animationTimingFast', true))}
        classNames={transitions.names.fade}
        mountOnEnter
        unmountOnExit
      >
        <OverlayBackground
          onClick={(e) => {
            // handle click outside
            if (e.target === e.currentTarget) {
              onCloseShareDialog?.()
            }
          }}
        >
          <CloseButton
            icon={<SvgActionClose />}
            variant="tertiary"
            size="medium"
            onClick={onCloseShareDialog}
            isFullScreen={!isMobile() && isFullScreen}
          />
          <EmbeddedShareWrapper>
            <ShareTitle variant="h600" as="h2">
              Share video
            </ShareTitle>
            <VideoShareContent videoId={videoId} currentTime={currentTime} isEmbedded />
          </EmbeddedShareWrapper>
        </OverlayBackground>
      </CSSTransition>
    )
  }
}

type VideoShareContentProps = {
  videoId?: string
  isEmbedded?: boolean
  currentTime?: number
}

const VideoShareContent: FC<VideoShareContentProps> = ({ videoId, isEmbedded, currentTime }) => {
  const [url, setUrl] = useState(window.location.origin + absoluteRoutes.viewer.video(videoId))
  const xsMatch = useMediaMatch('xs')
  const { copyToClipboard } = useClipboard()

  const [startsAt, setStartsAt] = useState(0)
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

  const handleGenerateIframe = (e: MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    const url =
      window.location.origin + absoluteRoutes.embedded.video(videoId) + (timeStampChecked ? `?time=${startsAt}` : '')

    const iframe = `<iframe src="${url}" scrolling="no" height="400px" width="600px" allowfullscreen></iframe>`

    copyToClipboard(iframe)
  }

  return (
    <ShareWrapper>
      <InputContainer>
        <Input
          onChange={() => null}
          size={isMobile() || !xsMatch ? 'medium' : 'large'}
          value={url}
          actionButton={{
            dontFocusOnClick: true,
            onClick: (e) => {
              e.stopPropagation()
              copyToClipboard(url)
            },
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
        <Tooltip hideOnClick="toggle" text="Copy iframe code" placement="top">
          <ShareButton variant={!isEmbedded ? 'primary' : 'secondary'} onClick={handleGenerateIframe}>
            <SvgActionEmbed />
          </ShareButton>
        </Tooltip>
        {/* TODO add these button once integration is ready */}
        {/* <ShareButton variant={!isEmbedded ? 'primary' : 'secondary'}>
          {!isEmbedded ? <SvgLogoFacebookOnLight /> : <SvgLogoFacebookMonochrome />}
        </ShareButton>
        <ShareButton variant={!isEmbedded ? 'primary' : 'secondary'}>
          {!isEmbedded ? <SvgLogoTwitterOnLight /> : <SvgLogoTwitterMonochrome />}
        </ShareButton>
        <ShareButton variant={!isEmbedded ? 'primary' : 'secondary'}>
          {!isEmbedded ? <SvgLogoVkOnLight /> : <SvgLogoVkMonochrome />}
        </ShareButton> */}
      </ShareButtonsContainer>
    </ShareWrapper>
  )
}
