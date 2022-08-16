import { MetaTags } from '@joystream/atlas-meta-server/src/tags'
import { useMemo } from 'react'
import { Helmet } from 'react-helmet'

export const useHeadTags = (title?: string | null, metaTagsMapping: MetaTags = {}) => {
  return useMemo(() => {
    const pageTitle = title ? `${title} - Atlas` : 'Atlas'
    const metaTags = Object.entries(metaTagsMapping).map(([name, content]) => (
      <meta name={name} content={content.toString()} key={name} />
    ))
    return (
      <Helmet>
        <title>{pageTitle}</title>
        {metaTags}
      </Helmet>
    )
  }, [title, metaTagsMapping])
}
