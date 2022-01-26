import { useEnvironmentStore } from '@/providers/environment'

type BuildEnv = 'production' | 'development'

export const ENV_PREFIX = 'VITE'
const getEnvName = (name: string) => {
  return `${ENV_PREFIX}_${name}`
}

export const BUILD_ENV = (import.meta.env[getEnvName('ENV')] || 'production') as BuildEnv

export const availableEnvs = () => {
  return Array.from(
    new Set(
      Object.keys(import.meta.env)
        .filter(
          (key) =>
            key.startsWith(ENV_PREFIX) &&
            !key.startsWith(`${ENV_PREFIX}_ENV`) &&
            !key.startsWith(`${ENV_PREFIX}_VERCEL`)
        )
        .map((key) => {
          return key.replace(ENV_PREFIX, '').split('_')[1].toLowerCase()
        })
    )
  )
}

export const readEnv = (name: string, required = true): string => {
  const fullName =
    BUILD_ENV === 'production'
      ? getEnvName(`PRODUCTION_${name}`)
      : getEnvName(`${useEnvironmentStore.getState().targetDevEnv.toUpperCase()}_${name}`)
  const value = import.meta.env[fullName]
  if (!value && required) {
    throw new Error(`Missing required env variable "${name}", tried access via "${fullName}"`)
  } else if (!value) {
    return ''
  }
  return value.toString()
}
