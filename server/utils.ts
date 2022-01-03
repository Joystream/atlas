import parseHtml from 'node-html-parser'

import { Channel, Video } from './types'

const joinUrlFragments = (...fragments: string[]) => {
  const strippedFragments = fragments.map((f) => f.replace(/^\/|\/$/, ''))
  return strippedFragments.join('/')
}

export const generateVideoMetadata = (htmlData: string, video: Video, metadata: string) => {
  const assetUrl = joinUrlFragments(metadata, '/asset/v0', video.thumbnailPhotoDataObject.joystreamContentId)
  const videoUrl = joinUrlFragments(metadata, '/asset/v0', video.mediaDataObject.joystreamContentId)
  const html = parseHtml(htmlData)
  const head = html.querySelector('head')
  const title = html.querySelector('title') || { innerHTML: undefined }

  title.innerHTML = `Joystream - ${video.title}`
  head?.insertAdjacentHTML(
    'beforeend',
    `
      <meta name="twitter:card" content="player" />
      <meta name="twitter:player" content="https://play.joystream.org/embedded/video/${video.id}" />
      <meta name="twitter:player:width" content="1280">
      <meta name="twitter:player:height" content="720">
      <meta name="description" content="${video.description}">
      <meta name="og:url" content="https://play.joystream.org/video/${video.id}">
      <meta name="og:title" content="${video.title}">
      <meta name="og:description" content="${video.description}">
      <meta name="og:image" content="${assetUrl}">
      <meta name="og:video" content=${videoUrl}">
      <meta name="og:video:width" content="${video.mediaMetadata.pixelWidth}">
      <meta name="og:video:height" content="${video.mediaMetadata.pixelHeight}">
    `
  )

  return html.toString()
}

export const generateChannelMetadata = (htmlData: string, channel: Channel, metadata: string) => {
  const assetUrl = joinUrlFragments(metadata, '/asset/v0', channel.avatarPhotoDataObject.joystreamContentId)
  const html = parseHtml(htmlData)
  const head = html.querySelector('head')
  const title = html.querySelector('title') || { innerHTML: undefined }

  title.innerHTML = `Joystream - ${channel.title}`
  head?.insertAdjacentHTML(
    'beforeend',
    `
      <meta name="twitter:card" content="summary" />
      <meta name="description" content="${channel.description}">
      <meta name="og:url" content="https://play.joystream.org/channel/${channel.id}">
      <meta name="og:title" content="${channel.title}">
      <meta name="og:description" content="${channel.description}">
      <meta name="og:image" content="${assetUrl}">
    `
  )

  return html.toString()
}
