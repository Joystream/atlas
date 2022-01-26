export type Video = {
  id: string
  title: string
  description: string
  thumbnailPhotoDataObject: {
    joystreamContentId: string
  }
  mediaDataObject: {
    joystreamContentId: string
  }
  mediaMetadata: {
    pixelWidth: number
    pixelHeight: number
  }
}

export type Channel = {
  id: string
  title: string
  description: string
  avatarPhotoDataObject: {
    joystreamContentId: string
  }
}

export type Worker = {
  metadata: string
}
