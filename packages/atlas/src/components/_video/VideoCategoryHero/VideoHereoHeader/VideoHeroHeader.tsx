import { FC, ReactNode } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { Button } from '@/components/_buttons/Button'
import { SvgActionChevronL } from '@/components/_icons'
import { SkeletonLoader } from '@/components/_loaders/SkeletonLoader'
import { absoluteRoutes } from '@/config/routes'
import { transitions } from '@/styles'

import { Divider, StyledVideoHeroHeader, VideoHeroHeaderTitle } from './VideoHeroHeader.style'

type VideoHeroHeaderProps = {
  loading?: boolean
  icon: ReactNode
  title: string
}

export const VideoHeroHeader: FC<VideoHeroHeaderProps> = ({ loading, icon, title }) => {
  return (
    <SwitchTransition>
      <CSSTransition
        key={loading ? 'data' : 'placeholder'}
        classNames={transitions.names.fade}
        timeout={parseInt(transitions.timings.regular)}
      >
        <StyledVideoHeroHeader>
          {!loading ? (
            <Button icon={<SvgActionChevronL />} variant="tertiary" to={absoluteRoutes.viewer.discover()} />
          ) : (
            <SkeletonLoader rounded height={40} width={40} />
          )}
          <Divider />
          {!loading ? (
            <>
              {icon}
              <VideoHeroHeaderTitle variant="h400">{title}</VideoHeroHeaderTitle>
            </>
          ) : (
            <SkeletonLoader height={24} width={160} />
          )}
        </StyledVideoHeroHeader>
      </CSSTransition>
    </SwitchTransition>
  )
}
