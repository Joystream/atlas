import { CaptureConsole } from '@sentry/integrations'
import * as Sentry from '@sentry/react'
import React from 'react'
import ReactDOM from 'react-dom'

import { Logger } from '@/utils/logger'

import { App } from './App'
import { BUILD_ENV, TARGET_DEV_ENV } from './config/envs'
import { SENTRY_DSN } from './config/urls'

const initApp = async () => {
  if (BUILD_ENV !== 'production' && TARGET_DEV_ENV === 'mocking') {
    try {
      const { worker } = await import('./mocking/browser')
      await worker.start()
    } catch (e) {
      Logger.error('Failed to load mocking server', e)
    }
  }

  if (BUILD_ENV === 'production') {
    Sentry.init({
      dsn: SENTRY_DSN,
      integrations: [
        new CaptureConsole({
          levels: ['error'],
        }),
      ],
    })
  }
  ReactDOM.render(<App />, document.getElementById('root'))
}

initApp()
