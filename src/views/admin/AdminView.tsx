import { css } from '@emotion/react'
import React, { useState } from 'react'
import { Link } from 'react-router-dom'

import { TARGET_DEV_ENV, availableEnvs, setEnvInLocalStorage } from '@/config/envs'
import { absoluteRoutes } from '@/config/routes'
import { Select, Text } from '@/shared/components'

const items = availableEnvs().map((item) => ({ name: item, value: item }))

export const AdminView = () => {
  const env = availableEnvs().includes(TARGET_DEV_ENV) ? TARGET_DEV_ENV : null
  const [value, setValue] = useState<null | string>(env)

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
  return (
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
      <br />
      <Link to={absoluteRoutes.viewer.index()}>Back to homepage</Link>
    </div>
  )
}
