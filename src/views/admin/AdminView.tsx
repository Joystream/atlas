import React, { useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { availableNodes } from '@/config/availableNodes'
import { TARGET_DEV_ENV, availableEnvs } from '@/config/envs'
import { absoluteRoutes } from '@/config/routes'
import { NODE_URL } from '@/config/urls'
import { useEnvironmentStore } from '@/providers/environment/store'
import { useSnackbar } from '@/providers/snackbars'
import { Button } from '@/shared/components/Button'
import { Checkbox } from '@/shared/components/Checkbox'
import { Select } from '@/shared/components/Select'
import { Text } from '@/shared/components/Text'
import { TextField } from '@/shared/components/TextField'
import { SentryLogger } from '@/utils/logs'

type SelectValue = string | null

const items = availableEnvs().map((item) => ({ name: item, value: item }))

export const AdminView = () => {
  const [customUrlError, setCustomUrlError] = useState<string | null>(null)
  const { setSelectedNode, selectedNode, setTargetEnv, targetEnv } = useEnvironmentStore((state) => ({
    ...state.actions,
    ...state,
  }))
  const determinedNode = selectedNode || NODE_URL
  const isCustomUrl = availableNodes.find(({ value }) => value === determinedNode)
  const [customUrlChecked, setCustomUrlChecked] = useState(!isCustomUrl)
  const { displaySnackbar } = useSnackbar()
  const customNodeRef = useRef<HTMLInputElement>(null)

  const handleEnvironmentChange = (value?: SelectValue) => {
    if (!value) {
      return
    }
    setTargetEnv(value)

    if (TARGET_DEV_ENV) {
      window.location.reload()
    }
  }

  const handleNodeChange = (value?: SelectValue) => {
    setSelectedNode(value as string)
  }

  const handleCustomNodeChange = () => {
    if (customNodeRef.current) {
      if (customNodeRef.current.value.length) {
        setSelectedNode(customNodeRef.current.value)
      } else {
        setCustomUrlError('Custom url cannot be empty')
      }
    }
  }

  const toggleCustomUrl = () => {
    setCustomUrlError(null)
    if (!customUrlChecked) {
      setCustomUrlChecked(true)
    } else {
      setCustomUrlChecked(false)
      setSelectedNode(isCustomUrl ? availableNodes[0].value : determinedNode)
    }
  }

  const handleExportClick = () => {
    const storageKeys = Object.keys(window.localStorage)
    const storage = storageKeys.reduce((acc, key) => {
      const rawValue = window.localStorage.getItem(key)
      if (rawValue) {
        acc[key] = JSON.parse(rawValue)
      }

      return acc
    }, {} as Record<string, unknown>)
    const jsonStorage = JSON.stringify(storage)

    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', 'data:application/json;charset=utf-8,' + encodeURIComponent(jsonStorage))
    linkElement.setAttribute('download', `atlas-export-${new Date().toISOString()}.json`)
    linkElement.click()
  }

  const handleFileChange = async (e: Event) => {
    try {
      const file = (e.target as HTMLInputElement).files?.[0]
      if (!file) return
      const fileText = await file.text()
      const storage = JSON.parse(fileText)
      Object.keys(storage).forEach((key) => {
        window.localStorage.setItem(key, JSON.stringify(storage[key]))
      })
      displaySnackbar({
        title: 'Local state updated',
        iconType: 'success',
      })
    } catch (error) {
      SentryLogger.error('Failed to import local state', 'AdminView', error)
      displaySnackbar({
        title: 'JSON file seems to be corrupted',
        description: 'Please try again with different file',
        iconType: 'error',
      })
    }
  }

  const handleImportClick = () => {
    const inputElement = document.createElement('input')
    inputElement.setAttribute('type', 'file')
    inputElement.onchange = handleFileChange
    inputElement.click()
  }

  return (
    <div style={{ padding: '40px' }}>
      <div>
        <Text variant="h2">Choose environment</Text>
        <Select items={items} onChange={handleEnvironmentChange} value={targetEnv} />
      </div>
      <div style={{ margin: '20px 0' }}>
        <Text variant="h2">
          Choose node url <Checkbox value={customUrlChecked} label="Custom URL" onChange={toggleCustomUrl} />
        </Text>
        {customUrlChecked ? (
          <>
            <TextField
              ref={customNodeRef}
              placeholder="Type your Node URL"
              defaultValue={determinedNode}
              error={!!customUrlError}
              helperText={customUrlError}
            />
            <Button onClick={handleCustomNodeChange}>Update node</Button>
          </>
        ) : (
          <Select items={availableNodes} onChange={handleNodeChange} value={determinedNode} />
        )}
      </div>
      <div>
        <Text variant="h2">Import/Export Local state</Text>
        <div style={{ margin: '20px 0' }}>
          <Button onClick={handleExportClick}>Export local state</Button>
        </div>
        <Button onClick={handleImportClick}>Import local state</Button>
      </div>
      <div style={{ marginTop: '40px' }}>
        {' '}
        <Link to={absoluteRoutes.viewer.index()}>Back to homepage</Link>
      </div>
    </div>
  )
}
