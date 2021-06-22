type BuildEnv = 'production' | 'development'

export const BUILD_ENV = (process.env.REACT_APP_ENV || 'production') as BuildEnv
export const TARGET_DEV_ENV = window.localStorage.getItem('target_env') || 'development'
export const ENV_PREFIX = 'REACT_APP'

export const setEnvInLocalStorage = (value: string) => {
  if (availableEnvs().includes(value)) {
    window.localStorage.setItem('target_env', value)
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

export const readEnv = (name: string, required = true): string => {
  const fullName =
    BUILD_ENV === 'production'
      ? `${ENV_PREFIX}_PRODUCTION_${name}`
      : `${ENV_PREFIX}_${TARGET_DEV_ENV.toUpperCase()}_${name}`
  const value = process.env[fullName]
  if (!value && required) {
    throw new Error(`Missing required env variable "${name}", tried access via "${fullName}"`)
  } else if (!value) {
    return ''
  }
  return value
}
