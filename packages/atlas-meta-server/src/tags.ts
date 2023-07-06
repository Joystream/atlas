import { formatISODuration } from 'date-fns'

import { BasicChannelFieldsFragment, BasicVideoFieldsFragment } from './api/__generated__/sdk'
import { MetaTags, SchemaOrgTag } from './types'
import { joinUrlFragments } from './utils'

const THUMBNAIL_WIDTH = 640
const THUMBNAIL_HEIGHT = 360
const VIDEO_WIDTH = 1280
const VIDEO_HEIGHT = 720
const AVATAR_SIZE = 192

const sanitizeDescription = (appName: string, fullDescription: string) => {
  const oneLineDescription = fullDescription
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => !!line)
    .join(' ')
  const needsTrimming = oneLineDescription.length > 160
  return needsTrimming ? oneLineDescription.slice(0, 157) + '...' : oneLineDescription
}

export const generateCommonMetaTags = (
  appName: string,
  appUrl: string,
  title: string,
  description?: string,
  image?: string,
  twitterId?: string | null
): MetaTags => {
  const sanitizedDescription = description && sanitizeDescription(appName, description)
  return {
    'og:title': title,
    'twitter:title': title,
    ...(sanitizedDescription && {
      description: sanitizedDescription,
      'og:description': sanitizedDescription,
      'twitter:description': sanitizedDescription,
    }),
    ...(image && {
      'og:image': image,
      'twitter:image:src': appUrl + image,
      'og:image:alt': title,
      'twitter:image:alt': title,
      'og:image:type': 'image/webp',
    }),
    'og:site_name': appName,
    'og:url': appUrl,
    'og:type': 'website',
    'twitter:card': 'summary_large_image',
    ...(twitterId && { 'twitter:site': twitterId }),
  }
}

export const generateVideoMetaTags = (
  video: BasicVideoFieldsFragment,
  thumbnailUrls: string[],
  appName: string,
  baseAppUrl: string,
  twitterId?: string
): MetaTags => {
  const videoUrl = joinUrlFragments(baseAppUrl, 'video', video.id)
  const videoEmbedUrl = joinUrlFragments(baseAppUrl, 'embedded', 'video', video.id)
  const videoTitle = video.title || 'Untitled'
  const commonTags = generateCommonMetaTags(
    appName,
    videoUrl,
    videoTitle,
    video.description || videoTitle,
    thumbnailUrls[0],
    twitterId
  )

  return {
    ...commonTags,
    'og:type': 'video.other',
    'og:url': videoUrl,
    'og:image:width': THUMBNAIL_WIDTH,
    'og:image:height': THUMBNAIL_HEIGHT,
    'og:video': videoEmbedUrl,
    'og:video:secure_url': videoEmbedUrl,
    'og:video:width': video.mediaMetadata?.pixelWidth || VIDEO_WIDTH,
    'og:video:height': video.mediaMetadata?.pixelHeight || VIDEO_HEIGHT,
    'og:video:type': video.mediaMetadata?.encoding?.mimeMediaType || 'video/mp4',
    'twitter:card': 'player',
    'twitter:player': videoEmbedUrl,
    'twitter:player:width': VIDEO_WIDTH,
    'twitter:player:height': VIDEO_HEIGHT,
  } as const
}

export const generateChannelMetaTags = (
  channel: BasicChannelFieldsFragment,
  avatarUrl: string,
  appName: string,
  baseAppUrl: string,
  twitterId?: string
): MetaTags => {
  const channelUrl = joinUrlFragments(baseAppUrl, 'channel', channel.id)
  const commonTags = generateCommonMetaTags(
    appName,
    channelUrl,
    channel.title || 'Unnamed channel',
    channel.description || '',
    avatarUrl,
    twitterId
  )

  return {
    ...commonTags,
    'og:type': 'profile',
    'og:image:width': AVATAR_SIZE,
    'og:image:height': AVATAR_SIZE,
    'twitter:card': 'summary',
  }
}

export const generateVideoSchemaTagsHtml = (
  video: BasicVideoFieldsFragment,
  thumbnailUrl: string,
  appName: string,
  baseAppUrl: string
) => {
  const videoUrl = joinUrlFragments(baseAppUrl, 'video', video.id)
  const channelUrl = joinUrlFragments(baseAppUrl, 'channel', video.channel.id)
  const videoEmbedUrl = joinUrlFragments(baseAppUrl, 'embedded', 'video', video.id)
  const sanitizedDescription = sanitizeDescription(appName, video.description || '')

  const schemaOrgTags: SchemaOrgTag[] = [
    {
      type: 'link',
      prop: 'url',
      value: videoUrl,
    },
    {
      type: 'regular',
      prop: 'name',
      value: video.title,
    },
    {
      type: 'regular',
      prop: 'description',
      value: sanitizedDescription,
    },
    {
      type: 'regular',
      prop: 'channelId',
      value: video.channel.id,
    },
    {
      type: 'regular',
      prop: 'videoId',
      value: video.id,
    },
    {
      type: 'regular',
      prop: 'duration',
      value: formatISODuration({
        seconds: video.duration || 0,
      }),
    },
    {
      type: 'regular',
      prop: 'unlisted',
      value: (!(video.isPublic ?? true)).toString(),
    },
    {
      type: 'regular',
      prop: 'thumbnailUrl',
      value: thumbnailUrl,
    },
    {
      type: 'link',
      prop: 'embedUrl',
      value: videoEmbedUrl,
    },
    {
      type: 'regular',
      prop: 'playerType',
      value: 'HTML5',
    },
    {
      type: 'regular',
      prop: 'width',
      value: video.mediaMetadata?.pixelWidth || VIDEO_WIDTH,
    },
    {
      type: 'regular',
      prop: 'height',
      value: video.mediaMetadata?.pixelHeight || VIDEO_HEIGHT,
    },
    {
      type: 'regular',
      prop: 'isFamilyFriendly',
      value: (!(video.isExplicit ?? true)).toString(),
    },
    {
      type: 'regular',
      prop: 'datePublished',
      value: video.createdAt,
    },
    {
      type: 'regular',
      prop: 'uploadDate',
      value: video.createdAt,
    },
    {
      type: 'regular',
      prop: 'genre',
      value: video.category?.name || '',
    },
  ]

  const htmlTags = [
    '<div itemscope itemId="" itemtype="http://schema.org/VideoObject">',
    ...schemaOrgTags.map(({ type, prop, value }) =>
      type === 'regular' ? `<meta itemprop="${prop}" content="${value}">` : `<link itemprop="${prop}" href="${value}">`
    ),
    '<span itemprop="author" itemscope itemtype="http://schema.org/Person">',
    `<link itemprop="url" href="${channelUrl}">`,
    `<meta itemprop="name" content="${video.channel.title || ''}">`,
    '</span>',
    '<span itemprop="thumbnail" itemscope itemtype="http://schema.org/ImageObject">',
    `<link itemprop="url" href="${thumbnailUrl}">`,
    `<meta itemprop="width" content="${THUMBNAIL_WIDTH}">`,
    `<meta itemprop="height" content="${THUMBNAIL_HEIGHT}">`,
    '</span>',
    '</div>',
  ]

  return htmlTags.join('\n')
}

export const generateChannelSchemaTagsHtml = (
  channel: BasicChannelFieldsFragment,
  avatarUrl: string,
  baseAppUrl: string
) => {
  const channelUrl = joinUrlFragments(baseAppUrl, 'channel', channel.id)

  const schemaOrgTags: SchemaOrgTag[] = [
    {
      type: 'link',
      prop: 'url',
      value: channelUrl,
    },
    {
      type: 'regular',
      prop: 'name',
      value: channel.title || '',
    },
    {
      type: 'regular',
      prop: 'description',
      value: channel.description,
    },
  ]

  const htmlTags = [
    '<div itemscope itemId="" itemtype="http://schema.org/Person">',
    ...schemaOrgTags.map(({ type, prop, value }) =>
      type === 'regular' ? `<meta itemprop="${prop}" content="${value}">` : `<link itemprop="${prop}" href="${value}">`
    ),
    '<span itemprop="image" itemscope itemtype="http://schema.org/ImageObject">',
    `<link itemprop="url" href="${avatarUrl}">`,
    `<meta itemprop="width" content="${AVATAR_SIZE}">`,
    `<meta itemprop="height" content="${AVATAR_SIZE}">`,
    '</span>',
    '</div>',
  ]

  return htmlTags.join('\n')
}
