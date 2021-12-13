import React from 'react'
import { CSSTransition } from 'react-transition-group'

import { Text } from '@/components/Text'
import { SvgAlertsWarning24 } from '@/components/_icons'
import { ConnectionStatus } from '@/providers/connectionStatus'
import { cVar } from '@/styles'

import {
  CONNECTION_INDICATOR_CLASSNAME,
  ENTER_TRANSITION_DELAY,
  IconWrapper,
  IndicatorWrapper,
  TextWrapper,
} from './NoConnectionIndicator.styles'

export type NoConnectionIndicatorProps = {
  nodeConnectionStatus: ConnectionStatus
  isConnectedToInternet: boolean
}

export const NoConnectionIndicator: React.FC<NoConnectionIndicatorProps> = ({
  nodeConnectionStatus,
  isConnectedToInternet,
}) => {
  return (
    <CSSTransition
      in={nodeConnectionStatus === 'disconnected' || !isConnectedToInternet}
      timeout={{
        enter: parseInt(cVar('animationTimingMedium', true)) + ENTER_TRANSITION_DELAY,
        exit: parseInt(cVar('animationTimingMedium', true)),
      }}
      classNames={CONNECTION_INDICATOR_CLASSNAME}
      mountOnEnter
      unmountOnExit
    >
      <IndicatorWrapper>
        <IconWrapper>
          <SvgAlertsWarning24 />
        </IconWrapper>
        <TextWrapper>
          {!isConnectedToInternet ? (
            <Text variant="h400">No network connection</Text>
          ) : (
            nodeConnectionStatus === 'disconnected' && <Text variant="t200">No node connection</Text>
          )}
          <Text variant="t200" secondary>
            Wait for connection to restore
          </Text>
        </TextWrapper>
      </IndicatorWrapper>
    </CSSTransition>
  )
}
