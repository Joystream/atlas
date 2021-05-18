import Cropper from 'cropperjs'

export type ImageCropData = Cropper.CropBoxData & { zoom: number }

export type AssetDimensions = {
  width: number
  height: number
}
