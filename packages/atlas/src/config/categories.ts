import { concat, intersection } from 'lodash-es'

import { RawConfig, atlasConfig } from '@/config'
import { createLookup } from '@/utils/data'

export type DisplayCategory = RawConfig['content']['categories'][0]

export const displayCategories = atlasConfig.content.categories

export const displayCategoriesLookup = createLookup(displayCategories)

export const allUniqueVideoCategories = intersection(
  concat(...displayCategories.map((category) => category.videoCategories))
)
