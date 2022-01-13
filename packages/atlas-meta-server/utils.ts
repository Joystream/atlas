import parseHtml from 'node-html-parser'

import { Channel, Video } from './types'

const joinUrlFragments = (...fragments: string[]) => {
  const strippedFragments = fragments.map((f) => f.replace(/^\/|\/$/, ''))
  return strippedFragments.join('/')
}

const commonTags = [
  {
    name: 'twitter:site',
    content: '@JoystreamDAO',
  },
  {
    name: 'og:site_name',
    content: 'Joystream',
  },
]

export const generateVideoMetadata = (htmlData: string, video: Video, metadata: string) => {
  const assetUrl = joinUrlFragments(metadata, '/asset/v0', video.thumbnailPhotoDataObject.joystreamContentId)
  const videoUrl = joinUrlFragments(metadata, '/asset/v0', video.mediaDataObject.joystreamContentId)
  const html = parseHtml(htmlData)
  const head = html.querySelector('head')
  const title = html.querySelector('title') || { innerHTML: undefined }

  const tagsMap = [
    ...commonTags,
    {
      name: 'twitter:card',
      content: 'player',
    },
    {
      name: 'twitter:player',
      content: `https://play.joystream.org/embedded/video/${video.id}`,
    },
    {
      name: 'twitter:url',
      content: `https://play.joystream.org/video/${video.id}`,
    },
    {
      name: 'twitter:player:width',
      content: 1280,
    },
    {
      name: 'twitter:player:height',
      content: 720,
    },
    {
      name: 'description',
      content: video.description,
    },
    {
      name: 'og:description',
      content: video.description,
    },
    {
      name: 'twitter:description',
      content: video.description,
    },
    {
      name: 'og:url',
      content: `https://play.joystream.org/video/${video.id}`,
    },
    {
      name: 'og:title',
      content: video.title,
    },
    {
      name: 'twitter:title',
      content: video.title,
    },
    {
      name: 'og:image',
      content: assetUrl,
    },
    {
      name: 'twitter:image',
      content: assetUrl,
    },
    {
      name: 'og:image:width',
      content: 1280,
    },
    {
      name: 'og:image:height',
      content: 720,
    },
    {
      name: 'og:type',
      content: 'video.other',
    },
    {
      name: 'og:video',
      content: videoUrl,
    },
    {
      name: 'og:video:url',
      content: `https://play.joystream.org/embedded/video/${video.id}`,
    },
    {
      name: 'og:video:secure_url',
      content: `https://play.joystream.org/embedded/video/${video.id}`,
    },
    {
      name: 'og:video:type',
      content: 'text/html',
    },
    {
      name: 'og:video:width',
      content: video.mediaMetadata.pixelWidth,
    },
    {
      name: 'og:video:height',
      content: video.mediaMetadata.pixelHeight,
    },
  ]

  title.innerHTML = `Joystream - ${video.title}`
  head?.insertAdjacentHTML(
    'beforeend',
    tagsMap.map((tag) => `<meta name="${tag.name}" content="${tag.content}" />`).join('')
  )

  return html.toString()
}

export const generateChannelMetadata = (htmlData: string, channel: Channel, metadata: string) => {
  const assetUrl = joinUrlFragments(metadata, '/asset/v0', channel.avatarPhotoDataObject.joystreamContentId)
  const html = parseHtml(htmlData)
  const head = html.querySelector('head')
  const title = html.querySelector('title') || { innerHTML: undefined }

  const tagsMap = [
    ...commonTags,
    {
      name: 'twitter:card',
      content: 'summary',
    },
    {
      name: 'description',
      content: channel.description,
    },
    {
      name: 'og:description',
      content: channel.description,
    },
    {
      name: 'twitter:description',
      content: channel.description,
    },
    {
      name: 'og:url',
      content: `https://play.joystream.org/video/${channel.id}`,
    },
    {
      name: 'twitter:url',
      content: `https://play.joystream.org/video/${channel.id}`,
    },
    {
      name: 'og:title',
      content: channel.title,
    },
    {
      name: 'twitter:title',
      content: channel.title,
    },
    {
      name: 'og:image',
      content: assetUrl,
    },
    {
      name: 'twitter:image',
      content: assetUrl,
    },
    {
      name: 'og:video:width',
      content: 256,
    },
    {
      name: 'og:video:height',
      content: 256,
    },
    {
      name: 'og:type',
      content: 'profile',
    },
  ]

  title.innerHTML = `Joystream - ${channel.title}`
  head?.insertAdjacentHTML(
    'beforeend',
    tagsMap.map((tag) => `<meta name="${tag.name}" content="${tag.content}" />`).join('')
  )

  return html.toString()
}
