import { css } from '@emotion/react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { TARGET_DEV_ENV, availableEnvs, setEnvInLocalStorage } from '@/config/envs'
import { absoluteRoutes } from '@/config/routes'
import { Button, Select, Text } from '@/shared/components'

const items = availableEnvs().map((item) => ({ name: item, value: item }))

export const AdminView = () => {
  const env = availableEnvs().includes(TARGET_DEV_ENV) ? TARGET_DEV_ENV : null
  const [value, setValue] = useState<null | string>(env)
  const [file, setFile] = useState<File | null>(null)

  const handleChange = (value?: string | null | undefined) => {
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
    const fileName = 'atlas_local_state'
    const state = Object.keys(localStorage).reduce((obj, k) => {
      return { ...obj, [k]: localStorage.getItem(k) }
    }, {})

    const json = JSON.stringify(state)
    const blob = new Blob([json], { type: 'application/json' })
    const href = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = href
    link.download = fileName + '.json'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length) {
      return
    }
    setFile(e.target.files[0])
  }

  const handleImportClick = async () => {
    if (!file) {
      return
    }
    const text = await file.text()
    const state = JSON.parse(text)
    Object.keys(state).forEach((key) => localStorage.setItem(key, state[key]))
  }

  return (
    <>
      <div>
        <Text variant="h2">Choose environment</Text>
        <Select
          items={items}
          onChange={handleChange}
          value={value}
          css={css`
            margin-top: 20px;
            max-width: 400px;
          `}
        />
      </div>
      <div>
        <Text variant="h2">Import/Export Local state</Text>
        <Button onClick={handleExportClick}>Export local state</Button>
        <div style={{ margin: '20px 0' }}>
          <input type="file" onChange={handleFileChange} accept="application/json" />
          <Button onClick={handleImportClick}>Import state</Button>
        </div>
      </div>
      <Link to={absoluteRoutes.viewer.index()}>Back to homepage</Link>
    </>
  )
}
