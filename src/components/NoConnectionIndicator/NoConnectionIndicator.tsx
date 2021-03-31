import { ConnectionStatus } from '@/hooks'
import { Text } from '@/shared/components'
import { transitions } from '@/shared/theme'
import React from 'react'
import { CSSTransition } from 'react-transition-group'
import { IndicatorWrapper } from './NoConnectionIndicator.style'

type NoConnectionIndicatorProps = {
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
        {connectionStatus === 'no-internet' && <Text variant="body2">No internet, waiting to reconnect...</Text>}
        {connectionStatus === 'disconnected' && (
          <Text variant="body2">Disconnected from node, waiting to reconnect...</Text>
        )}
      </IndicatorWrapper>
    </CSSTransition>
  )
}

export default NoConnectionIndicator
