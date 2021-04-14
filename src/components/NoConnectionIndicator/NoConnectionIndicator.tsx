import { ConnectionStatus } from '@/hooks'
import { Spinner } from '@/shared/components'
import { transitions } from '@/shared/theme'
import React from 'react'
import { CSSTransition } from 'react-transition-group'
import { IndicatorWrapper, StyledSubTitle, StyledTitle, TextWrapper } from './NoConnectionIndicator.style'

export type NoConnectionIndicatorProps = {
  nodeConnectionStatus: ConnectionStatus
  isConnectedToInternet: boolean
}

const NoConnectionIndicator: React.FC<NoConnectionIndicatorProps> = ({
  nodeConnectionStatus,
  isConnectedToInternet,
}) => {
  return (
    <CSSTransition
      in={nodeConnectionStatus === 'disconnected' || !isConnectedToInternet}
      timeout={200}
      classNames={transitions.names.fade}
      mountOnEnter
      unmountOnExit
    >
      <IndicatorWrapper>
        <Spinner size="small" />
        <TextWrapper>
          {!isConnectedToInternet ? (
            <StyledTitle variant="subtitle2">No connection to internet...</StyledTitle>
          ) : (
            nodeConnectionStatus === 'disconnected' && (
              <StyledTitle variant="body2">Disconnected from node...</StyledTitle>
            )
          )}
          <StyledSubTitle variant="body2">Wait to restore connection</StyledSubTitle>
        </TextWrapper>
      </IndicatorWrapper>
    </CSSTransition>
  )
}

export default NoConnectionIndicator
