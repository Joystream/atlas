import { BaseDialog } from '@/components/Dialogs'
import { absoluteRoutes } from '@/config/routes'
import { useConnectionStatus } from '@/hooks'
import { Button, Text } from '@/shared/components'
import React, { useCallback, useEffect } from 'react'

const fakeNodeConnection = async () => {
  await new Promise((resolve) => setTimeout(resolve, 3000))
  console.log('disconnected from node')
  return false
}

const PlaygroundConnectionState = () => {
  const { connectionStatus, setConnectionStatus } = useConnectionStatus()

  const connectToNode = useCallback(async () => {
    const isConnected = await fakeNodeConnection()
    if (!isConnected) {
      setConnectionStatus('disconnected')
    }
  }, [setConnectionStatus])

  useEffect(() => {
    connectToNode()
  }, [connectToNode])
  return (
    <div>
      <Text variant="h3">Connection state</Text>
      <Text variant="body1">{connectionStatus}</Text>
      <BaseDialog
        exitButton={false}
        showDialog={connectionStatus === 'disconnected' || connectionStatus === 'no-internet'}
      >
        {connectionStatus === 'disconnected' && (
          <>
            <Text variant="h3">Disconnected from node</Text>
            <Text variant="body2">Waiting to reconnect...</Text>
            <Button to={absoluteRoutes.viewer.index()}>Back to homepage</Button>
          </>
        )}
        {connectionStatus === 'no-internet' && (
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
