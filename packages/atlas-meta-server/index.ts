/* eslint-disable no-console */
import express from 'express'
import { Response } from 'express-serve-static-core'
import * as fs from 'fs'
import { GraphQLClient } from 'graphql-request'
import * as path from 'path'

import { channelsQuery, videoQuery, workerQuery } from './queries'
import { generateChannelMetadata, generateVideoMetadata } from './utils'

const app = express()

const PORT = process.env.NGINX_PORT || 3000
const indexPath = path.resolve('packages', 'atlas-meta-server', 'dist', 'index.html')
const client = new GraphQLClient(process.env.GRAPHQL_URL || '')

const getWorker = async (res: Response) => {
  const { workers } = await client.request(workerQuery)
  if (!workers.length) return res.status(500)
  const random = Math.floor(Math.random() * workers.length)

  return workers[random].metadata
}

app.get('/video/:id', (req, res) => {
  fs.readFile(indexPath, 'utf8', async (err, htmlData) => {
    if (err) {
      console.error('Error during file reading', err)
      return res.status(500).end()
    }

    const id = req.params['id']
    const { videos } = await client.request(videoQuery(id))
    const metadata = await getWorker(res)
    if (!videos.length) return res.status(404).send('Video not found')
    const video = videos[0]

    return res.send(generateVideoMetadata(htmlData, video, metadata))
  })
})

app.get('/channel/:id', (req, res) => {
  fs.readFile(indexPath, 'utf8', async (err, htmlData) => {
    if (err) {
      console.error('Error during file reading', err)
      return res.status(500).end()
    }
    const id = req.params['id']
    const { channels } = await client.request(channelsQuery(id))
    const metadata = await getWorker(res)
    if (!channels || !channels.length) return res.status(404).send('Channel not found')
    const channel = channels[0]

    return res.send(generateChannelMetadata(htmlData, channel, metadata))
  })
})

app.get('/*', (req, res) => {
  res.sendFile(indexPath)
})

app
  .listen(PORT, () => console.log('listening on ' + PORT + '...'))
  .on('error', (error) => console.log('Error during app startup', error))
