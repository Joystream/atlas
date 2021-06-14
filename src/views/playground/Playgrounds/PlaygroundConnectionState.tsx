import React, { useCallback, useEffect } from 'react'

import { BaseDialog } from '@/components/Dialogs'
import { absoluteRoutes } from '@/config/routes'
import { useConnectionStatus } from '@/hooks'
import { Button, Text } from '@/shared/components'
import { Logger } from '@/utils/logger'

const fakeNodeConnection = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000))
  Logger.log('disconnected from node')
  return false
}

const PlaygroundConnectionState = () => {
  const { nodeConnectionStatus, setNodeConnection, isUserConnectedToInternet } = useConnectionStatus()

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
      <BaseDialog exitButton={false} showDialog={nodeConnectionStatus === 'disconnected'}>
        {nodeConnectionStatus === 'disconnected' && (
          <>
            <Text variant="h3">Disconnected from node</Text>
            <Text variant="body2">Waiting to reconnect...</Text>
            <Button to={absoluteRoutes.viewer.index()}>Back to homepage</Button>
          </>
        )}
        {isUserConnectedToInternet && (
          <>
            <Text variant="h3">No internet</Text>
            <Text variant="body2">Waiting to reconnect...</Text>
          </>
        )}
      </BaseDialog>
    </div>
  )
}

export default PlaygroundConnectionState
