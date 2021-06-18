import { css } from '@emotion/react'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

import { absoluteRoutes } from '@/config/routes'
import { ENV_DEVELOPMENT, ENV_PRODUCTION, ENV_STAGING } from '@/config/urls'
import { Select, Text } from '@/shared/components'

const items = [
  { name: ENV_DEVELOPMENT, value: ENV_DEVELOPMENT },
  { name: ENV_PRODUCTION, value: ENV_PRODUCTION },
  { name: ENV_STAGING, value: ENV_STAGING },
]

export const AdminView = () => {
  const [value, setValue] = useState<null | string>(ENV_STAGING)

  useEffect(() => {
    const env = window.localStorage.getItem('env')
    if (env) {
      setValue(env)
    }
  }, [])

  const handleChange = (value?: string | null | undefined) => {
    if (!value) {
      return
    }
    window.localStorage.setItem('env', value)
    const env = window.localStorage.getItem('env')

    if (env) {
      setValue(env)
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
