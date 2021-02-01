import { ModelInstance } from 'miragejs/-types'
import faker from 'faker'
import {
  mockCategories,
  mockChannels,
  mockVideos,
  mockVideosMedia,
  mockLicenses,
  FEATURED_VIDEOS_INDEXES,
} from '@/mocking/data'
import { AllChannelFieldsFragment } from '@/api/queries/__generated__/channels.generated'
import { CategoryFieldsFragment } from '@/api/queries/__generated__/categories.generated'
import {
  mockCoverVideo,
  mockCoverVideoChannel,
  mockCoverVideoMedia,
  mockCoverVideoInfo,
  mockCoverVideoLicense,
} from '@/mocking/data/mockCoverVideo'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type MirageJSServer = any

export const createMockData = (server: MirageJSServer) => {
  const channels = mockChannels.map((channel) => {
    server.create('ChannelFollowsInfo', {
      id: channel.id,
      follows: channel.follows,
    })
    return server.schema.create('Channel', {
      ...channel,
    }) as ModelInstance<AllChannelFieldsFragment>
  })

  const categories = mockCategories.map((category) => {
    return server.schema.create('Category', {
      ...category,
    }) as ModelInstance<CategoryFieldsFragment>
  })

  const videoMedias = mockVideosMedia.map((videoMedia) => {
    // FIXME: This suffers from the same behaviour as the search resolver - all the returned items have the same location
    const location = server.schema.create('HttpMediaLocation', {
      id: faker.random.uuid(),
      ...videoMedia.location,
    })

    const model = server.schema.create('VideoMedia', {
      ...videoMedia,
      location,
    })
    return model
  })

  const licenseEntities = mockLicenses.map((licenseEntity) => {
    const licenseType = licenseEntity.type.__typename === 'KnownLicense' ? 'KnownLicense' : 'UserDefinedLicense'
    const license = server.schema.create(licenseType, {
      id: faker.random.uuid(),
      ...licenseEntity.type,
    })

    const model = server.schema.create('LicenseEntity', {
      ...licenseEntity,
      type: license,
    })
    return model
  })
  const videos = mockVideos.map((video, idx) => {
    const mediaIndex = idx % mockVideosMedia.length

    server.create('EntityViewsInfo', {
      id: video.id,
      views: video.views,
    })

    return server.schema.create('Video', {
      ...video,
      views: undefined,
      duration: mockVideosMedia[mediaIndex].duration,
      channel: channels[idx % channels.length],
      category: categories[idx % categories.length],
      media: videoMedias[mediaIndex],
      license: licenseEntities[idx % licenseEntities.length],
    })
  })

  videos
    .filter((_, idx) => FEATURED_VIDEOS_INDEXES.includes(idx))
    .forEach((video) => {
      server.schema.create('FeaturedVideo', {
        id: faker.random.uuid(),
        video,
      })
    })

  createCoverVideoData(server, categories)
}

const createCoverVideoData = (server: MirageJSServer, categories: unknown[]) => {
  const channel = server.schema.create('Channel', {
    ...mockCoverVideoChannel,
  })

  const location = server.schema.create('HttpMediaLocation', {
    id: faker.random.uuid(),
    ...mockCoverVideoMedia.location,
  })

  const coverCutMediaLocation = server.schema.create('HttpMediaLocation', {
    id: faker.random.uuid(),
    ...mockCoverVideoInfo.coverCutMedia.location,
  })

  const media = server.schema.create('VideoMedia', {
    ...mockCoverVideoMedia,
    location,
  })

  const coverCutMedia = server.schema.create('VideoMedia', {
    ...mockCoverVideoInfo.coverCutMedia,
    location: coverCutMediaLocation,
  })

  const license = server.schema.create('UserDefinedLicense', {
    id: faker.random.uuid(),
    ...mockCoverVideoLicense.type,
  })

  const licenseEntity = server.schema.create('LicenseEntity', {
    ...mockCoverVideoLicense,
    type: license,
  })

  const video = server.schema.create('Video', {
    ...mockCoverVideo,
    duration: media.duration,
    category: categories[0],
    channel,
    media,
    license: licenseEntity,
  })

  server.create('EntityViewsInfo', {
    id: video.id,
    views: video.views,
  })

  server.create('CoverVideo', {
    id: faker.random.uuid(),
    video,
    coverDescription: mockCoverVideoInfo.coverDescription,
    coverCutMedia,
  })
}
