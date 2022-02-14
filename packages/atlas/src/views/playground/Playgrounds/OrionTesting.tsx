import React, { useEffect, useState } from 'react'

import {
  useGetChannelsConnectionLazyQuery,
  useGetChannelsLazyQuery,
  useGetVideosConnectionLazyQuery,
  useGetVideosLazyQuery,
} from '@/api/queries'
import { Button } from '@/components/_buttons/Button'

export const OrionTesting = () => {
  const [data, setData] = useState<unknown>(null)
  const [getVideos, { data: videosData, loading: videosLoading }] = useGetVideosLazyQuery({
    variables: {
      limit: 5,
    },
    fetchPolicy: 'network-only',
  })
  const [getVideosConnection, { data: videosConnectionData, loading: videosConnectionLoading }] =
    useGetVideosConnectionLazyQuery({
      variables: {
        first: 5,
      },
      fetchPolicy: 'network-only',
    })

  const [getChannels, { data: channelsData, loading: channelsLoading }] = useGetChannelsLazyQuery({
    variables: {
      limit: 5,
    },
    fetchPolicy: 'network-only',
  })

  const [getChannelsConnection, { data: channelsConnectionData, loading: channelsConnectionLoading }] =
    useGetChannelsConnectionLazyQuery({
      variables: {
        first: 5,
      },
      fetchPolicy: 'network-only',
    })

  useEffect(() => {
    if (videosData) {
      setData(videosData)
    }
  }, [videosData])

  useEffect(() => {
    if (videosConnectionData) {
      setData(videosConnectionData)
    }
  }, [videosConnectionData])

  useEffect(() => {
    if (channelsData) {
      setData(channelsData)
    }
  }, [channelsData])

  useEffect(() => {
    if (channelsConnectionData) {
      setData(channelsConnectionData)
    }
  }, [channelsConnectionData])

  const isLoading = videosLoading || videosConnectionLoading || channelsLoading || channelsConnectionLoading
  return (
    <>
      <div>
        <Button
          onClick={() => {
            getVideos()
          }}
        >
          getVideos(5 videos)
        </Button>{' '}
        <Button
          onClick={() => {
            getVideosConnection()
          }}
        >
          getVideosConnection(5 videos)
        </Button>
        <Button
          onClick={() => {
            getChannels()
          }}
        >
          getChannels(5 channels)
        </Button>
        <Button
          onClick={() => {
            getChannelsConnection()
          }}
        >
          getChannelsConnection(5 channels)
        </Button>
      </div>
      <div>{isLoading ? 'loading' : <pre>{JSON.stringify(data, null, 2)}</pre>}</div>
    </>
  )
}
