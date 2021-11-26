import React from 'react'
import ReactDOM from 'react-dom'

import { AssetLogger, SentryLogger } from '@/utils/logs'

import { App } from './App'
import { BUILD_ENV } from './config/envs'
import { ASSET_LOGS_URL, SENTRY_DSN } from './config/urls'

const initApp = async () => {
  if (BUILD_ENV === 'production') {
    SentryLogger.initialize(SENTRY_DSN)
    AssetLogger.initialize(ASSET_LOGS_URL)
  }

  ReactDOM.render(<App />, document.getElementById('root'))
}

initApp()
