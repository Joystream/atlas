import { To } from 'history'
import { MouseEvent, ReactNode, forwardRef, useState } from 'react'
import { LinkProps } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { SvgControlsPlaylist } from '@/assets/icons'
import { Text } from '@/components/Text'
import { cVar, transitions } from '@/styles'
import { getLinkPropsFromTo } from '@/utils/button'

import {
  ContentContainer,
  ContentOverlay,
  HoverOverlay,
  PlaylistOverlay,
  SlotContainer,
  SlotPosition,
  SlotsOverlay,
  ThumbnailBackground,
  ThumbnailImage,
  ThumbnailSkeletonLoader,
  VideoThumbnailContainer,
} from './VideoThumbnail.styles'

export type SlotsObject = {
  [Property in SlotPosition]?: {
    element: ReactNode
    type?: 'default' | 'hover'
    clickable?: boolean
    halfWidth?: boolean
  }
}

type PlaylistVideoThumbnailProps = {
  type: 'playlist'
  slots?: Pick<SlotsObject, 'bottomLeft' | 'topLeft' | 'center'>
}
type RegularVideoThumbnailProps = {
  type: 'video'
  slots?: SlotsObject
}

export type VideoThumbnailProps = {
  loading?: boolean
  videoHref?: To
  linkState?: LinkProps['state']
  thumbnailUrl?: string | null
  thumbnailAlt?: string | null
  clickable?: boolean
  videosInPlaylist?: number
  contentSlot?: ReactNode
  onClick?: () => void
  onMouseEnter?: (event: MouseEvent<HTMLDivElement>) => void
  onMouseLeave?: (event: MouseEvent<HTMLDivElement>) => void
} & (PlaylistVideoThumbnailProps | RegularVideoThumbnailProps)

export const VideoThumbnail = forwardRef<HTMLDivElement, VideoThumbnailProps>(
  (
    {
      loading,
      videoHref,
      linkState,
      slots,
      thumbnailUrl,
      thumbnailAlt,
      onClick,
      clickable = true,
      contentSlot,
      onMouseEnter,
      onMouseLeave,
      type,
      videosInPlaylist,
    },
    ref
  ) => {
    const [activeDisabled, setActiveDisabled] = useState(false)
    const slotsArray = slots && Object.entries(slots)

    const handleClick = (e: MouseEvent) => {
      if (!videoHref) {
        e.preventDefault()
      }
      clickable && onClick?.()
    }
    const linkProps = { state: linkState, ...getLinkPropsFromTo(videoHref) }

    return (
      <VideoThumbnailContainer
        ref={ref}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={handleClick}
        clickable={clickable}
        activeDisabled={activeDisabled}
        isPlaylist={type === 'playlist'}
        {...linkProps}
      >
        <ContentOverlay>
          <SwitchTransition>
            <CSSTransition
              key={String(loading)}
              timeout={parseInt(cVar('animationTimingFast', true))}
              classNames={transitions.names.fade}
            >
              {loading ? (
                <ThumbnailSkeletonLoader />
              ) : (
                <ThumbnailBackground>
                  {thumbnailUrl && <ThumbnailImage src={thumbnailUrl || ''} alt={thumbnailAlt || ''} />}
                </ThumbnailBackground>
              )}
            </CSSTransition>
          </SwitchTransition>
          {contentSlot && (
            <CSSTransition
              in={!!contentSlot}
              timeout={parseInt(cVar('animationTimingFast', true))}
              classNames={transitions.names.fade}
            >
              <ContentContainer>{contentSlot}</ContentContainer>
            </CSSTransition>
          )}
        </ContentOverlay>
        <HoverOverlay loading={loading} />
        <SlotsOverlay>
          {slotsArray?.map(
            ([position, properties]) =>
              properties && (
                <SlotContainer
                  key={position}
                  type={properties.type}
                  halfWidth={properties.halfWidth}
                  position={position as keyof SlotsObject}
                  onMouseEnter={() => clickable && properties.clickable && setActiveDisabled(true)}
                  onMouseLeave={() => clickable && properties.clickable && setActiveDisabled(false)}
                >
                  {properties.element}
                </SlotContainer>
              )
          )}
        </SlotsOverlay>
        {type === 'playlist' && !loading && (
          <PlaylistOverlay>
            <SvgControlsPlaylist />
            <Text as="span" margin={{ top: 2 }} variant="t100">
              {videosInPlaylist ?? 0} videos
            </Text>
          </PlaylistOverlay>
        )}
      </VideoThumbnailContainer>
    )
  }
)

VideoThumbnail.displayName = 'VideoThumbnail'
