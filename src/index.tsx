import { CaptureConsole } from '@sentry/integrations'
import * as Sentry from '@sentry/react'
import React from 'react'
import ReactDOM from 'react-dom'

import { Logger } from '@/utils/logger'

import { App } from './App'
import { SENTRY_DSN } from './config/urls'

type Env = 'production' | 'staging' | 'development'

const env = (process.env.REACT_APP_ENV?.toLowerCase() || 'development') as Env

const initApp = async () => {
  if (env === 'development') {
    try {
      const { worker } = await import('./mocking/browser')
      await worker.start()
    } catch (e) {
      Logger.error('Failed to load mocking server', e)
    }
  }

  if (env === 'production') {
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
