import { To } from 'history'
import React, { forwardRef, useState } from 'react'
import { LinkProps } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { Text } from '@/components/Text'
import { SvgControlsPlaylist } from '@/components/_icons'
import { cVar, transitions } from '@/styles'

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
    element: React.ReactNode
    type?: 'default' | 'hover'
    clickable?: boolean
    halfWidth?: boolean
  }
}

export type Playlist = {
  type: 'playlist'
  slots?: Pick<SlotsObject, 'bottomLeft' | 'topLeft' | 'center'>
}
export type Video = {
  type: 'video'
  slots?: SlotsObject
}
export type ThumbnailType = Playlist | Video

export type VideoThumbnailProps = {
  loading?: boolean
  videoHref?: To
  linkState?: LinkProps['state']
  thumbnailUrl?: string | null
  thumbnailAlt?: string | null
  clickable?: boolean
  videosInPlaylist?: number
  contentSlot?: React.ReactNode
  onClick?: () => void
  onMouseEnter?: (event: React.MouseEvent<HTMLAnchorElement>) => void
  onMouseLeave?: (event: React.MouseEvent<HTMLAnchorElement>) => void
} & ThumbnailType

export const VideoThumbnail = forwardRef<HTMLAnchorElement, VideoThumbnailProps>(
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

    const handleClick = (e: React.MouseEvent) => {
      if (!videoHref) {
        e.preventDefault()
      }
      clickable && onClick?.()
    }

    return (
      <VideoThumbnailContainer
        ref={ref}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={handleClick}
        clickable={clickable}
        activeDisabled={activeDisabled}
        to={videoHref ? videoHref : ''}
        state={linkState}
        isPlaylist={type === 'playlist'}
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
        {type === 'playlist' && (
          <PlaylistOverlay loading={loading}>
            <SvgControlsPlaylist />
            <Text margin={{ top: 2 }} variant="t100">
              {videosInPlaylist ?? 0} videos
            </Text>
          </PlaylistOverlay>
        )}
      </VideoThumbnailContainer>
    )
  }
)

VideoThumbnail.displayName = 'VideoThumbnail'
