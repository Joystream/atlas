import Cropper from 'cropperjs'

export type ImageCropData = {
  data: Cropper.Data
  canvasData: Cropper.CanvasData
  cropBoxData: Cropper.CropBoxData
  zoom: number
}

export type AssetDimensions = {
  width: number
  height: number
}
