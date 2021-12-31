/* eslint-disable no-console */
import express from 'express'
import { Response } from 'express-serve-static-core'
import * as fs from 'fs'
import { GraphQLClient } from 'graphql-request'
import parseHtml from 'node-html-parser'
import * as path from 'path'

import { channelsQuery, videoQuery, workerQuery } from './queries'
import { joinUrlFragments } from './utils'

const app = express()

const PORT = process.env.PORT || 3000
const indexPath = path.resolve('dist', 'index.html')
const client = new GraphQLClient('https://hydra.joystream.org/graphql')

const getWorker = async (res: Response) => {
  const { workers } = await client.request(workerQuery)
  if (!workers.length) return res.status(500)
  const random = Math.floor(Math.random() * workers.length)

  return workers[random]
}

app.use(express.static(path.resolve('dist'), { maxAge: '30d' }))

app.get('/video/:id', (req, res) => {
  fs.readFile(indexPath, 'utf8', async (err, htmlData) => {
    if (err) {
      console.error('Error during file reading', err)
      return res.status(404).end()
    }

    const id = req.params['id']
    const { videos } = await client.request(videoQuery(id))
    const { metadata } = await getWorker(res)
    if (!videos.length) return res.status(404).send('Video not found')
    const video = videos[0]
    const assetUrl = joinUrlFragments(metadata, '/asset/v0', video.thumbnailPhotoDataObject.joystreamContentId)
    const videoUrl = joinUrlFragments(metadata, '/asset/v0', video.mediaDataObject.joystreamContentId)
    const html = parseHtml(htmlData)
    const head = html.querySelector('head')
    const title = html.querySelector('title') || { innerHTML: undefined }

    title.innerHTML = `Joystream - ${video.title}`
    head?.insertAdjacentHTML(
      'beforeend',
      `
      <meta name="description" content="${video.description}">
      <meta name="og:url" content="https://play.joystream.org/video/${id}">
      <meta name="og:title" content="${video.title}">
      <meta name="og:description" content="${video.description}">
      <meta name="og:image" content="${assetUrl}">
      <meta name="og:video" content=${videoUrl}">
      <meta name="og:video:width" content="${video.mediaMetadata.pixelWidth}">
      <meta name="og:video:height" content="${video.mediaMetadata.pixelHeight}">
    `
    )
    return res.send(html.toString())
  })
})

app.get('/channel/:id', (req, res) => {
  fs.readFile(indexPath, 'utf8', async (err, htmlData) => {
    if (err) {
      console.error('Error during file reading', err)
      return res.status(404).end()
    }
    const id = req.params['id']
    const { channels } = await client.request(channelsQuery(id))
    const { metadata } = await getWorker(res)
    if (!channels || !channels.length) return res.status(404).send('Channel not found')
    const channel = channels[0]
    const assetUrl = joinUrlFragments(metadata, '/asset/v0', channel.avatarPhotoDataObject.joystreamContentId)
    const html = parseHtml(htmlData)
    const head = html.querySelector('head')
    const title = html.querySelector('title') || { innerHTML: undefined }

    title.innerHTML = `Joystream - ${channel.title}`
    head?.insertAdjacentHTML(
      'beforeend',
      `
      <meta name="description" content="${channel.description}">
      <meta name="og:url" content="https://play.joystream.org/channel/${id}">
      <meta name="og:title" content="${channel.title}">
      <meta name="og:description" content="${channel.description}">
      <meta name="og:image" content="${assetUrl}">
    `
    )
    return res.send(html.toString())
  })
})

app.get('/*', (req, res) => {
  res.sendFile(indexPath)
})

app
  .listen(PORT, () => console.log('listening on ' + PORT + '...'))
  .on('error', (error) => console.log('Error during app startup', error))
