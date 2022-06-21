import { FC } from 'react'
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
  hasSidebar: boolean
}

export const NoConnectionIndicator: FC<NoConnectionIndicatorProps> = ({
  nodeConnectionStatus,
  isConnectedToInternet,
  hasSidebar,
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
      <IndicatorWrapper hasSidebar={hasSidebar}>
        <IconWrapper>
          <SvgAlertsWarning24 />
        </IconWrapper>
        <TextWrapper>
          {!isConnectedToInternet ? (
            <Text as="span" variant="h400">
              No network connection
            </Text>
          ) : (
            nodeConnectionStatus === 'disconnected' && (
              <Text as="span" variant="t200">
                No node connection
              </Text>
            )
          )}
          <Text as="span" variant="t200" color="colorText">
            Wait for connection to restore
          </Text>
        </TextWrapper>
      </IndicatorWrapper>
    </CSSTransition>
  )
}
