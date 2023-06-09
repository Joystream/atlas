export const ENV_PREFIX = 'VITE'

export const getEnvName = (name: string) => {
  return `${ENV_PREFIX}_${name}`
}

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
