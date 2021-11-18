import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { IconButton } from '@/components/_buttons/IconButton'
import { SvgGlyphChevronLeft } from '@/components/_icons'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { absoluteRoutes } from '@/config/routes'
import { transitions } from '@/theme'

import { Divider, StyledVideoHeroHeader, VideoHeroHeaderTitle } from './VideoHeroHeader.style'

type VideoHeroHeaderProps = {
  loading?: boolean
  icon: React.ReactNode
  title: string
}

export const VideoHeroHeader: React.FC<VideoHeroHeaderProps> = ({ loading, icon, title }) => {
  return (
    <SwitchTransition>
      <CSSTransition
        key={loading ? 'data' : 'placeholder'}
        classNames={transitions.names.fade}
        timeout={parseInt(transitions.timings.regular)}
      >
        <StyledVideoHeroHeader>
          {!loading ? (
            <IconButton variant="tertiary" to={absoluteRoutes.viewer.discover()}>
              <SvgGlyphChevronLeft />
            </IconButton>
          ) : (
            <SkeletonLoader rounded height={40} width={40} />
          )}
          <Divider />
          {!loading ? (
            <>
              {icon}
              <VideoHeroHeaderTitle variant="h5">{title}</VideoHeroHeaderTitle>
            </>
          ) : (
            <SkeletonLoader height={24} width={160} />
          )}
        </StyledVideoHeroHeader>
      </CSSTransition>
    </SwitchTransition>
  )
}
