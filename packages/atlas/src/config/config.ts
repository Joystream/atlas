import { cloneDeepWith } from 'lodash-es'

import { SelectItem } from '@/components/_inputs/Select'
import { createLookup } from '@/utils/data'
import { ConsoleLogger } from '@/utils/logs'

import { RawConfig, configSchema } from './configSchema'

import rawConfig from '../../atlas.config.yml'

const YppWidgetIconEnum = z.enum(['info', 'message', 'tokenStack'])

type SelectValue = Pick<SelectItem, 'value' | 'name'>
export type Config = RawConfig & {
  derived: {
    languagesLookup: Record<string, string>
    languagesSelectValues: SelectValue[]
    popularLanguagesSelectValues: SelectValue[]
    commentReactionsLookup: Record<number, RawConfig['features']['comments']['reactions'][number]>
  }
}
export type YppWidgetIcons = z.infer<typeof YppWidgetIconEnum>

let parsedConfig: RawConfig

try {
  const configWithEnv = cloneDeepWith(rawConfig, (value) => {
    if (typeof value === 'string') {
      const match = value.match(/^\$(.*)$/)
      if (!match) return
      const envVar = match[1]
      const envValue = import.meta.env[envVar]
      return envValue ?? null
    }
  })
  parsedConfig = configSchema.parse(configWithEnv)
} catch (e) {
  ConsoleLogger.error('Failed to parse app config', e)
  throw e
}

const extendedConfig: Config = {
  ...parsedConfig,
  derived: {
    languagesLookup: parsedConfig.content.languages.reduce((acc, { isoCode, name }) => {
      acc[isoCode] = name
      return acc
    }, {} as Record<string, string>),
    languagesSelectValues: parsedConfig.content.languages.map(({ isoCode, name }) => ({
      name: name,
      value: isoCode,
    })),
    popularLanguagesSelectValues: parsedConfig.content.languages
      .filter((language) => parsedConfig.content.popularLanguages.includes(language.isoCode))
      .map(({ isoCode, name }) => ({
        name: name,
        value: isoCode,
      }))
      .sort(
        (a, b) =>
          parsedConfig.content.popularLanguages.indexOf(a.value) -
          parsedConfig.content.popularLanguages.indexOf(b.value)
      ),
    commentReactionsLookup: createLookup(parsedConfig.features.comments.reactions),
  },
}

export const atlasConfig = Object.freeze(extendedConfig)
