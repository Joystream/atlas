import { FC, MouseEvent, ReactNode, useEffect, useRef, useState } from 'react'
import { CSSTransition } from 'react-transition-group'

import {
  SvgActionClose,
  SvgActionCopy,
  SvgActionEmbed,
  SvgLogoFacebookMonochrome,
  SvgLogoFacebookOnLight,
  SvgLogoRedditMonochrome,
  SvgLogoRedditOnLight,
  SvgLogoTwitterMonochrome,
  SvgLogoTwitterOnLight,
  SvgLogoVkMonochrome,
  SvgLogoVkOnLight,
} from '@/assets/icons'
import { Tooltip } from '@/components/Tooltip'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { Input } from '@/components/_inputs/Input'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { absoluteRoutes } from '@/config/routes'
import { useClipboard } from '@/hooks/useClipboard'
import { useMediaMatch } from '@/hooks/useMediaMatch'
import { cVar, transitions } from '@/styles'
import { isMobile } from '@/utils/browser'
import { getLinkPropsFromTo } from '@/utils/button'
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
  videoTitle?: string | null
}

export const VideoShare: FC<VideoShareProps> = ({
  videoId,
  currentTime,
  isEmbedded,
  isShareDialogOpen,
  isFullScreen,
  onCloseShareDialog,
  videoTitle,
}) => {
  const commonVideoShareContentProps = {
    videoId,
    currentTime,
    videoTitle,
  }
  if (!isEmbedded) {
    return (
      <DialogModal
        title="Share video"
        show={isShareDialogOpen}
        onClickOutside={onCloseShareDialog}
        onExitClick={onCloseShareDialog}
      >
        <VideoShareContent {...commonVideoShareContentProps} />
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
            <VideoShareContent {...commonVideoShareContentProps} isEmbedded />
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
  videoTitle?: string | null
}

const VideoShareContent: FC<VideoShareContentProps> = ({ videoId, isEmbedded, currentTime, videoTitle }) => {
  const [url, setUrl] = useState(window.location.origin + absoluteRoutes.viewer.video(videoId))
  const xsMatch = useMediaMatch('xs')
  const { copyToClipboard } = useClipboard()
  const [copyButtonClicked, setCopyButtonClicked] = useState(false)

  const [startsAt, setStartsAt] = useState(0)
  const [timeStampChecked, setTimeStampChecked] = useState(false)

  const firstRender = useRef(true)

  useEffect(() => {
    if (!copyButtonClicked) {
      return
    }
    const timeout = setTimeout(() => {
      setCopyButtonClicked(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [copyButtonClicked])

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
    setCopyButtonClicked(true)
  }

  return (
    <ShareWrapper>
      <InputContainer isEmbedded={isEmbedded}>
        <Input
          onChange={() => null}
          size={isMobile() || !xsMatch ? 'medium' : 'large'}
          value={url}
          actionButton={{
            dontFocusOnClick: true,
            tooltipText: copyButtonClicked ? 'Copied to clipboard' : 'Copy URL',
            onMouseLeave: () => setCopyButtonClicked(false),
            onClick: (e) => {
              e.stopPropagation()
              setCopyButtonClicked(true)
              copyToClipboard(url)
            },
            icon: <SvgActionCopy />,
          }}
        />
        <Checkbox
          label={`Start at ${formatDurationShort(startsAt || 0)}`}
          value={timeStampChecked}
          onChange={handleCheckboxChange}
        />
      </InputContainer>
      <ShareButtonsContainer>
        <ShareButtonWithTooltip
          text={copyButtonClicked ? 'Copied to clipboard' : 'Copy embed code'}
          buttonVariant={!isEmbedded ? 'primary' : 'secondary'}
          onClick={handleGenerateIframe}
          onMouseLeave={() => setCopyButtonClicked(false)}
          icon={<SvgActionEmbed />}
        />
        <ShareButtonWithTooltip
          text="Share on Facebook"
          buttonVariant={!isEmbedded ? 'primary' : 'secondary'}
          url={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
          icon={!isEmbedded ? <SvgLogoFacebookOnLight /> : <SvgLogoFacebookMonochrome />}
        />
        <ShareButtonWithTooltip
          text="Share on Twitter"
          buttonVariant={!isEmbedded ? 'primary' : 'secondary'}
          url={`http://www.twitter.com/share?url=${url}`}
          icon={!isEmbedded ? <SvgLogoTwitterOnLight /> : <SvgLogoTwitterMonochrome />}
        />
        <ShareButtonWithTooltip
          text="Share on VK"
          buttonVariant={!isEmbedded ? 'primary' : 'secondary'}
          url={`https://vk.com/share.php?url=${url}`}
          icon={!isEmbedded ? <SvgLogoVkOnLight /> : <SvgLogoVkMonochrome />}
        />
        <ShareButtonWithTooltip
          text="Share on Reddit"
          buttonVariant={!isEmbedded ? 'primary' : 'secondary'}
          url={`https://www.reddit.com/submit?url=${url}&title=${videoTitle}`}
          icon={!isEmbedded ? <SvgLogoRedditOnLight /> : <SvgLogoRedditMonochrome />}
        />
      </ShareButtonsContainer>
    </ShareWrapper>
  )
}

type ShareButtonWithTooltipProps = {
  text: string
  url?: string
  icon: ReactNode
  buttonVariant: 'primary' | 'secondary'
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void
  onMouseLeave?: () => void
}

const ShareButtonWithTooltip: FC<ShareButtonWithTooltipProps> = ({
  text,
  url,
  icon,
  buttonVariant,
  onClick,
  onMouseLeave,
}) => {
  return (
    <Tooltip text={text} placement="top" hideOnClick={false}>
      <ShareButton
        {...getLinkPropsFromTo(url, true)}
        onClick={onClick}
        onMouseLeave={onMouseLeave}
        variant={buttonVariant}
      >
        {icon}
      </ShareButton>
    </Tooltip>
  )
}
