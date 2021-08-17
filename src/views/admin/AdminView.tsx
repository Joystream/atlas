import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { TARGET_DEV_ENV, availableEnvs, setEnvInLocalStorage } from '@/config/envs'
import { absoluteRoutes } from '@/config/routes'
import { useSnackbar } from '@/providers'
import { Button, Select, Text } from '@/shared/components'
import { Logger } from '@/utils/logger'

const items = availableEnvs().map((item) => ({ name: item, value: item }))

export const AdminView = () => {
  const env = availableEnvs().includes(TARGET_DEV_ENV) ? TARGET_DEV_ENV : null
  const [value, setValue] = useState<null | string>(env)
  const { displaySnackbar } = useSnackbar()

  const handleEnvironmentChange = (value?: string | null | undefined) => {
    if (!value) {
      return
    }
    setEnvInLocalStorage(value)

    if (TARGET_DEV_ENV) {
      setValue(TARGET_DEV_ENV)
      window.location.reload()
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
      Logger.captureError('Failed to import local state', 'AdminView', error)
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
    <>
      <div>
        <Text variant="h2">Choose environment</Text>
        <Select items={items} onChange={handleEnvironmentChange} value={value} />
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
    </>
  )
}
