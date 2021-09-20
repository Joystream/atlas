import React from 'react'
import { CSSTransition, SwitchTransition } from 'react-transition-group'

import { AssetUploadStatus } from '@/providers/uploadsManager/types'
import { transitions } from '@/shared/theme'

import {
  BottomProgressBar,
  ProgressBar,
  StyledLoader,
  StyledSvgAlertSuccess,
  UploadProgressBarContainer,
} from './UploadProgressBar.style'

export type UploadProgressBarProps = {
  progress?: number
  lastStatus?: AssetUploadStatus
  withLoadingIndicator?: boolean
  withCompletedAnimation?: boolean
  className?: string
}

export const UploadProgressBar: React.FC<UploadProgressBarProps> = ({
  progress,
  lastStatus,
  className,
  withLoadingIndicator,
  withCompletedAnimation,
}) => {
  return (
    <UploadProgressBarContainer className={className}>
      <ProgressBar
        runCompletedAnimation={withCompletedAnimation}
        progress={progress || 0}
        isProcessing={lastStatus === 'processing'}
        isCompleted={lastStatus === 'completed'}
      />
      {lastStatus !== 'completed' && <BottomProgressBar progress={progress || 0} />}
      {withLoadingIndicator && (
        <SwitchTransition>
          <CSSTransition
            key={lastStatus === 'inProgress' || lastStatus === 'processing' ? 'progress' : 'completed'}
            classNames={transitions.names.fade}
            timeout={200}
          >
            {lastStatus === 'inProgress' || lastStatus === 'processing' ? (
              <StyledLoader variant="small" />
            ) : (
              <StyledSvgAlertSuccess />
            )}
          </CSSTransition>
        </SwitchTransition>
      )}
    </UploadProgressBarContainer>
  )
}
