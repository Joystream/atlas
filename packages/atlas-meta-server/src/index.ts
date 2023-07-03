/* eslint-disable no-console */
import express from 'express'

import { OrionClient } from './api'
import { APP_URL, PORT } from './config'
import {
  generateChannelMetaTags,
  generateChannelSchemaTagsHtml,
  generateCommonMetaTags,
  generateVideoMetaTags,
  generateVideoSchemaTagsHtml,
} from './tags'
import { applyMetaTagsToHtml, applySchemaTagsToHtml, fetchHtmlAndAppData, generateAssetUrl } from './utils'

const app = express()
let orionClient: OrionClient

app.get('/video/:id', async (req, res) => {
  try {
    const id = req.params['id']
    const [[html, appData], video] = await Promise.all([fetchHtmlAndAppData(APP_URL), orionClient.getVideo(id)])

    if (!video) {
      return res.status(404).send('Video not found')
    }

    const title = html.querySelector('title')

    if (title) {
      title.innerHTML = video.title || appData.name
    }

    const thumbnailUrl = video.thumbnailPhoto ? generateAssetUrl(video.thumbnailPhoto) : ''

    const videoMetaTags = generateVideoMetaTags(video, [thumbnailUrl], appData.name, APP_URL, appData.twitterId)
    const videoSchemaTagsHtml = generateVideoSchemaTagsHtml(video, thumbnailUrl, appData.name, APP_URL)

    applyMetaTagsToHtml(html, videoMetaTags)
    applySchemaTagsToHtml(html, videoSchemaTagsHtml)

    return res.send(html.toString())
  } catch (err) {
    console.error(err)
    return res.status(500).send()
  }
})

app.get('/channel/:id', async (req, res) => {
  try {
    const id = req.params['id']
    const [[html, appData], channel] = await Promise.all([fetchHtmlAndAppData(APP_URL), orionClient.getChannel(id)])

    if (!channel) {
      return res.status(404).send('Channel not found')
    }

    const title = html.querySelector('title')

    if (title) {
      title.innerHTML = channel.title || appData.name
    }

    const avatarUrl = channel.avatarPhoto ? generateAssetUrl(channel.avatarPhoto) : ''

    const channelMetaTags = generateChannelMetaTags(channel, avatarUrl, appData.name, APP_URL, appData.twitterId)
    const channelSchemaTagsHtml = generateChannelSchemaTagsHtml(channel, avatarUrl, APP_URL)

    applyMetaTagsToHtml(html, channelMetaTags)
    applySchemaTagsToHtml(html, channelSchemaTagsHtml)

    return res.send(html.toString())
  } catch (err) {
    console.error(err)
    return res.status(500).send()
  }
})

app.get('/ypp', async (req, res) => {
  try {
    const [html, appData] = await fetchHtmlAndAppData(APP_URL)
    const titleNode = html.querySelector('title')

    if (titleNode && appData.yppOgTitle) {
      titleNode.innerHTML = appData.yppOgTitle
    }

    const metaTags = generateCommonMetaTags(
      appData.name,
      APP_URL,
      appData.yppOgTitle || appData.name,
      appData.yppOgDescription,
      appData.yppOgImage,
      appData.twitterId
    )
    applyMetaTagsToHtml(html, metaTags)

    return res.send(html.toString())
  } catch (err) {
    console.error(err)
    return res.status(500).send()
  }
})

const init = async () => {
  console.log('Initializing...')

  console.log(`Fetching app data from ${APP_URL}...`)
  const [html, appData] = await fetchHtmlAndAppData(APP_URL)
  console.log('App data fetched')
  console.log(JSON.stringify(appData, null, 2))

  console.log('Initializing Orion client...')
  orionClient = new OrionClient(appData.orionUrl)
  await orionClient.testConnection()
  console.log('Orion client initialized')

  app.get('/*', (req, res) => {
    res.send(html.toString())
  })

  app
    .listen(PORT, () => console.log('Listening on ' + PORT + '...'))
    .on('error', (error) => console.log('Error during app startup', error))
}

init()
