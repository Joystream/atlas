import { writeToLocalStorage } from '@/utils/localStorage'

export const BUILD_ENV = process.env.REACT_APP_ENV || 'production'
export const TARGET_DEV_ENV = window.localStorage.getItem('target_env') || 'staging'
export const ENV_PREFIX = 'REACT_APP'

export const setEnvInLocalStorage = (value: string) => {
  if (availableEnvs().includes(value)) {
    writeToLocalStorage<string>('target_env', value)
  }
}

export const availableEnvs = () => {
  return Array.from(
    new Set(
      Object.keys(process.env)
        .filter((key) => key.startsWith(ENV_PREFIX) && !key.startsWith(`${ENV_PREFIX}_ENV`))
        .map((key) => {
          return key.replace(ENV_PREFIX, '').split('_')[1].toLowerCase()
        })
    )
  )
}

export const readEnv = (name: string): string | undefined => {
  if (BUILD_ENV === 'production') {
    const fullName = `${ENV_PREFIX}_PRODUCTION_${name}`
    return process.env[fullName]
  }
  const fullName = `${ENV_PREFIX}_${TARGET_DEV_ENV.toUpperCase()}_${name}`
  return process.env[fullName]
}
