import { generateCommonMetaTags } from '@joystream/atlas-meta-server/src/tags'
import { MetaTags } from '@joystream/atlas-meta-server/src/types'
import { useMemo } from 'react'
import { Helmet } from 'react-helmet'

import { atlasConfig } from '@/config'

export const useHeadTags = (title?: string | null, metaTagsMapping: MetaTags = {}) => {
  return useMemo(() => {
    const pageTitle = title ? `${title} - ${atlasConfig.general.appName}` : atlasConfig.general.appName
    const commonTags = generateCommonMetaTags(
      atlasConfig.general.appName,
      atlasConfig.general.appUrl,
      pageTitle,
      atlasConfig.general.appDescription,
      atlasConfig.general.appOgImgPath,
      atlasConfig.general.appTwitterId
    )
    const allMetaTagsMapping = { ...commonTags, ...metaTagsMapping }
    const metaTags = Object.entries(allMetaTagsMapping).map(([name, content]) => (
      <meta name={name} content={content.toString()} property={content.toString()} key={name} />
    ))
    return (
      <Helmet>
        <title>{pageTitle}</title>
        {metaTags}
      </Helmet>
    )
  }, [title, metaTagsMapping])
}
