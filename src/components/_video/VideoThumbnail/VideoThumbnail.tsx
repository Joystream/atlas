import { To } from 'history'
import React, { useState } from 'react'
import { LinkProps } from 'react-router-dom'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { cVar, transitions } from '@/styles'

import {
  ContentContainer,
  ContentOverlay,
  HoverOverlay,
  SlotContainer,
  SlotPosition,
  SlotsOverlay,
  ThumbnailImage,
  ThumbnailSkeletonLoader,
  VideoThumbnailContainer,
} from './VideoThumbnail.styles'

export type SlotsObject = {
  [Property in SlotPosition]?: {
    element: React.ReactNode
    type?: 'default' | 'hover'
    clickable?: boolean
  }
}

export type VideoThumbnailProps = {
  loading?: boolean
  to?: To
  linkState?: LinkProps['state']
  thumbnailUrl?: string | null
  thumbnailAlt?: string | null
  onClick?: () => void
  clickable?: boolean
  contentSlot?: React.ReactNode
  slots?: SlotsObject
}

export const VideoThumbnail: React.FC<VideoThumbnailProps> = ({
  loading,
  to,
  linkState,
  slots,
  thumbnailUrl,
  thumbnailAlt,
  onClick,
  clickable = true,
  contentSlot,
}) => {
  const [activeDisabled, setActiveDisabled] = useState(false)
  const slotsArray = slots && Object.entries(slots)

  const handleClick = (e: React.MouseEvent) => {
    if (!to) {
      e.preventDefault()
    }
    clickable && onClick?.()
  }

  return (
    <VideoThumbnailContainer
      onClick={handleClick}
      clickable={clickable}
      activeDisabled={activeDisabled}
      to={to ? to : ''}
      state={linkState}
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
            ) : thumbnailUrl ? (
              <ThumbnailImage src={thumbnailUrl || ''} alt={thumbnailAlt || ''} />
            ) : (
              <div />
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
        {slotsArray?.map(([position, { element, type = 'default', clickable = false }]) => (
          <SlotContainer
            key={position}
            type={type}
            position={position as keyof SlotsObject}
            onMouseMove={() => clickable && setActiveDisabled(true)}
            onMouseOut={() => clickable && setActiveDisabled(false)}
          >
            {element}
          </SlotContainer>
        ))}
      </SlotsOverlay>
    </VideoThumbnailContainer>
  )
}
