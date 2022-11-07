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
  const uploadEndpoint = new URL(atlasConfig.storage.uploadPath, operatorEndpoint)
  Object.entries(uploadParams).forEach(([key, value]) => {
    uploadEndpoint.searchParams.set(key, value)
  })
  return uploadEndpoint.toString()
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
