// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
//disabled because mp4box has no typescript support
import mp4box from 'mp4box/dist/mp4box.simple.js'

import { ConsoleLogger } from '@/utils/logs'

async function fetchPartialContent(url: string, range: { start: number; end: number }) {
  const headers = new Headers()
  headers.append('Range', `bytes=${range.start}-${range.end}`)

  try {
    const response = await fetch(url, { headers })
    if (response.status === 206) {
      return await response.arrayBuffer()
    }
  } catch (error) {
    ConsoleLogger.warn('Error fetching partial content:', error)
  }
  return null
}

export const getVideoCodec = async (url: string): string => {
  const fetchRange = { start: 0, end: 8192 }
  const arrayBuffer = await fetchPartialContent(url, fetchRange)
  if (arrayBuffer) {
    arrayBuffer.fileStart = 0
    const mp4boxFile = mp4box.createFile()
    mp4boxFile.appendBuffer(arrayBuffer)
    mp4boxFile.flush()

    const codec = mp4boxFile.getInfo()?.videoTracks[0]?.codec
    return codec
  }
  return ''
}
