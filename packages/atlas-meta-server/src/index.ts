/* eslint-disable no-console */
import express from 'express'
import * as fs from 'fs'
import parseHtml from 'node-html-parser'
import * as path from 'path'

import { getChannel, getVideo } from './api'
import { PORT } from './config'
import {
  generateChannelMetaTags,
  generateChannelSchemaTagsHtml,
  generateMetaHtml,
  generateVideoMetaTags,
  generateVideoSchemaTagsHtml,
} from './tags'
import { generateAssetUrl } from './utils'

const app = express()

const indexPath = path.resolve(__dirname, 'index.html')
const indexHtml = fs.readFileSync(indexPath, 'utf8')

if (!indexHtml) {
  console.error(`index.html not found at "${indexPath}"`)
  process.exit(1)
}

app.get('/video/:id', async (req, res) => {
  try {
    const id = req.params['id']
    const video = await getVideo(id)

    if (!video) {
      return res.status(404).send('Video not found')
    }

    const html = parseHtml(indexHtml)
    const head = html.querySelector('head')
    const title = html.querySelector('title')

    if (title) {
      title.innerHTML = `${video.title} - Joystream`
    }

    const thumbnailUrl = video.thumbnailPhoto ? generateAssetUrl(video.thumbnailPhoto) : ''

    const videoMetaTags = generateVideoMetaTags(video, thumbnailUrl)
    const videoMetaTagsHtml = generateMetaHtml(videoMetaTags)
    const videoSchemaTagsHtml = generateVideoSchemaTagsHtml(video, thumbnailUrl)

    head?.insertAdjacentHTML('beforeend', videoMetaTagsHtml)
    head?.insertAdjacentHTML('beforeend', videoSchemaTagsHtml)

    return res.send(html.toString())
  } catch (err) {
    console.error(err)
    return res.status(500).send()
  }
})

app.get('/channel/:id', async (req, res) => {
  try {
    const id = req.params['id']
    const channel = await getChannel(id)

    if (!channel) {
      return res.status(404).send('Channel not found')
    }

    const html = parseHtml(indexHtml)
    const head = html.querySelector('head')
    const title = html.querySelector('title')

    if (title) {
      title.innerHTML = `${channel.title} - Joystream`
    }

    const avatarUrl = channel.avatarPhoto ? generateAssetUrl(channel.avatarPhoto) : ''

    const channelMetaTags = generateChannelMetaTags(channel, avatarUrl)
    const channelMetaTagsHtml = generateMetaHtml(channelMetaTags)
    const channelSchemaTagsHtml = generateChannelSchemaTagsHtml(channel, avatarUrl)

    head?.insertAdjacentHTML('beforeend', channelMetaTagsHtml)
    head?.insertAdjacentHTML('beforeend', channelSchemaTagsHtml)

    return res.send(html.toString())
  } catch (err) {
    console.error(err)
    return res.status(500).send()
  }
})

app.get('/*', (req, res) => {
  res.sendFile(indexPath)
})

app
  .listen(PORT, () => console.log('listening on ' + PORT + '...'))
  .on('error', (error) => console.log('Error during app startup', error))
