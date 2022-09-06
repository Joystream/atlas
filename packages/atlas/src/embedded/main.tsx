import { createRoot } from 'react-dom/client'

import { ASSET_LOGS_URL, SENTRY_DSN } from '@/config/env'
import { BUILD_ENV } from '@/config/envs'
import { AssetLogger, SentryLogger } from '@/utils/logs'

import { App } from './App'

const initApp = async () => {
  if (BUILD_ENV === 'production') {
    SentryLogger.initialize(SENTRY_DSN)
    AssetLogger.initialize(ASSET_LOGS_URL)
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const container = document.getElementById('root')!
  const root = createRoot(container)
  root.render(<App />)
}

initApp()
