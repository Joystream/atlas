import React, { useCallback, useEffect } from 'react'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { Modal } from '@/components/_overlays/Modal'
import { absoluteRoutes } from '@/config/routes'
import { useConnectionStatusStore } from '@/providers/connectionStatus'
import { ConsoleLogger } from '@/utils/logs'

const fakeNodeConnection = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000))
  ConsoleLogger.log('disconnected from node')
  return false
}

export const PlaygroundConnectionState = () => {
  const nodeConnectionStatus = useConnectionStatusStore((state) => state.nodeConnectionStatus)
  const internetConnectionStatus = useConnectionStatusStore((state) => state.internetConnectionStatus)
  const setNodeConnection = useConnectionStatusStore((state) => state.actions.setNodeConnection)

  const connectToNode = useCallback(async () => {
    const isConnected = await fakeNodeConnection()
    if (!isConnected) {
      setNodeConnection('disconnected')
    }
  }, [setNodeConnection])

  useEffect(() => {
    connectToNode()
  }, [connectToNode])
  return (
    <div>
      <Text variant="h3">Connection state</Text>
      <Text variant="body1">{nodeConnectionStatus}</Text>
      <Modal show={nodeConnectionStatus === 'disconnected'}>
        {nodeConnectionStatus === 'disconnected' && (
          <>
            <Text variant="h3">Disconnected from node</Text>
            <Text variant="body2">Waiting to reconnect...</Text>
            <Button to={absoluteRoutes.viewer.index()}>Back to homepage</Button>
          </>
        )}
        {internetConnectionStatus === 'connected' && (
          <>
            <Text variant="h3">No internet</Text>
            <Text variant="body2">Waiting to reconnect...</Text>
          </>
        )}
      </Modal>
    </div>
  )
}
