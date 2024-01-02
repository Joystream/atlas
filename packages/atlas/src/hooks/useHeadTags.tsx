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
        <meta
          name="twitter:player"
          property="twitter:player"
          content="https://dist1.joyutils.org/distributor/api/v1/assets/918952"
        />
        <meta name="twitter:player:width" property="twitter:player:width" content="1280" />
        <meta name="twitter:player:height" property="twitter:player:height" content="720" />
        <meta
          name="og:video"
          property="og:video"
          content="https://dist1.joyutils.org/distributor/api/v1/assets/918952"
        />
        <meta
          name="og:video:secure_url"
          property="og:video:secure_url"
          content="https://dist1.joyutils.org/distributor/api/v1/assets/918952"
        />
        <meta name="og:video:width" property="og:video:width" content="1920" />
        <meta name="og:video:height" property="og:video:height" content="1080" />
        <meta name="og:video:type" property="og:video:type" content="video/mp4" />
        <title>{pageTitle}</title>
        {metaTags}
      </Helmet>
    )
  }, [title, metaTagsMapping])
}
