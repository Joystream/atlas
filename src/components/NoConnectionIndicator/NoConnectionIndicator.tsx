import { ConnectionStatus } from '@/hooks'
import { Spinner } from '@/shared/components'
import { transitions } from '@/shared/theme'
import React from 'react'
import { CSSTransition } from 'react-transition-group'
import { IndicatorWrapper, StyledSubTitle, StyledTitle, TextWrapper } from './NoConnectionIndicator.style'

export type NoConnectionIndicatorProps = {
  connectionStatus: ConnectionStatus
}

const NoConnectionIndicator: React.FC<NoConnectionIndicatorProps> = ({ connectionStatus }) => {
  return (
    <CSSTransition
      in={connectionStatus === 'no-internet' || connectionStatus === 'disconnected'}
      timeout={200}
      classNames={transitions.names.fade}
      mountOnEnter
      unmountOnExit
    >
      <IndicatorWrapper>
        <Spinner size="small" />
        <TextWrapper>
          {connectionStatus === 'no-internet' && (
            <StyledTitle variant="subtitle2">No connection to internet...</StyledTitle>
          )}
          {connectionStatus === 'disconnected' && <StyledTitle variant="body2">Disconnected from node...</StyledTitle>}
          <StyledSubTitle variant="body2">Wait to restore connection</StyledSubTitle>
        </TextWrapper>
      </IndicatorWrapper>
    </CSSTransition>
  )
}

export default NoConnectionIndicator
