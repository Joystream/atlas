import React from 'react'
import ReactDOM from 'react-dom'

import { useEnvironmentStore } from '@/providers/environment'
import { AssetLogger, ConsoleLogger, SentryLogger } from '@/utils/logs'

import { App } from './App'
import { BUILD_ENV } from './config/envs'
import { ASSET_LOGS_URL, SENTRY_DSN } from './config/urls'

const initApp = async () => {
  if (BUILD_ENV !== 'production' && useEnvironmentStore.getState().targetDevEnv === 'mocking') {
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
