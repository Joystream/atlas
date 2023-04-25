import { atlasConfig } from '@/config'

export const joinUrlFragments = (...fragments: string[]) => {
  // remove trailing/leading slashes
  const strippedFragments = fragments.map((f) => f.replace(/^\/|\/$/, ''))
  return strippedFragments.join('/')
}

type UploadRequestParams = {
  dataObjectId: string
  storageBucketId: string
  bagId: string
}
export const createAssetUploadEndpoint = (operatorEndpoint: string, uploadParams: UploadRequestParams) => {
  try {
    const url = operatorEndpoint[operatorEndpoint.length - 1] === '/' ? operatorEndpoint : operatorEndpoint + '/'
    const uploadEndpoint = new URL(atlasConfig.storage.uploadPath, url)
    Object.entries(uploadParams).forEach(([key, value]) => {
      uploadEndpoint.searchParams.set(key, value)
    })
    return uploadEndpoint.toString()
  } catch (error) {
    throw new Error(error)
  }
}

export const imageUrlValidation = async (imageUrl: string): Promise<boolean> =>
  new Promise((resolve) => {
    const image = new Image()
    image.onload = () => {
      resolve(true)
    }
    image.src = imageUrl
    image.onerror = () => resolve(false)
  })

export const createChannelBagId = (channelId: string) => atlasConfig.storage.channelBagPrefix + channelId
