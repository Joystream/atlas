import { FC } from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { transitions } from '@/styles'
import { AssetUploadStatus } from '@/types/storage'

import { BottomProgressBar, LoaderWrapper, ProgressBar, UploadProgressBarContainer } from './UploadProgressBar.styles'

import { SvgAlertsSuccess24 } from '../../assets/icons'
import { Loader } from '../_loaders/Loader'

export type UploadProgressBarProps = {
  progress?: number
  lastStatus?: AssetUploadStatus
  withLoadingIndicator?: boolean
  withCompletedAnimation?: boolean
  className?: string
}

export const UploadProgressBar: FC<UploadProgressBarProps> = ({
  progress = 0,
  lastStatus,
  className,
  withLoadingIndicator,
  withCompletedAnimation,
}) => {
  return (
    <UploadProgressBarContainer className={className}>
      <ProgressBar
        runCompletedAnimation={withCompletedAnimation}
        progress={progress}
        isProcessing={lastStatus === 'processing'}
        isCompleted={lastStatus === 'completed'}
      />
      {lastStatus !== 'completed' && <BottomProgressBar progress={progress} />}
      {withLoadingIndicator && (
        <SwitchTransition>
          <CSSTransition
            key={lastStatus === 'inProgress' || lastStatus === 'processing' ? 'progress' : 'completed'}
            classNames={transitions.names.fade}
            timeout={200}
          >
            <LoaderWrapper>
              {(lastStatus === 'inProgress' || lastStatus === 'processing') && <Loader variant="small" />}
              {lastStatus === 'completed' && <SvgAlertsSuccess24 />}
            </LoaderWrapper>
          </CSSTransition>
        </SwitchTransition>
      )}
    </UploadProgressBarContainer>
  )
}
