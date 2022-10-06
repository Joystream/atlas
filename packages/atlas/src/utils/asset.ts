import { atlasConfig } from '@/config'

export const joinUrlFragments = (...fragments: string[]) => {
  // remove trailing/leading slashes
  const strippedFragments = fragments.map((f) => f.replace(/^\/|\/$/, ''))
  return strippedFragments.join('/')
}

export const createAssetUploadEndpoint = (operatorEndpoint: string) =>
  joinUrlFragments(operatorEndpoint, atlasConfig.storage.uploadPath)

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
