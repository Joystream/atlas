import React from 'react'
import ReactDOM from 'react-dom'

import { AssetLogger, ConsoleLogger, SentryLogger } from '@/utils/logs'

import { App } from './App'
import { BUILD_ENV, TARGET_DEV_ENV } from './config/envs'
import { ASSET_LOGS_URL, SENTRY_DSN } from './config/urls'

const initApp = async () => {
  if (BUILD_ENV !== 'production' && TARGET_DEV_ENV === 'mocking') {
    try {
      const { worker } = await import('./mocking/browser')
      await worker.start()
    } catch (e) {
      ConsoleLogger.error('Failed to load mocking server', e)
    }
  }

  if (BUILD_ENV === 'production') {
    SentryLogger.initialize(SENTRY_DSN)
    AssetLogger.initialize(ASSET_LOGS_URL)
  }

  ReactDOM.render(<App />, document.getElementById('root'))
}

initApp()
