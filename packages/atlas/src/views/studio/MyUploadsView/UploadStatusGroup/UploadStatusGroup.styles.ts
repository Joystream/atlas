import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { ExpandButton } from '@/components/_buttons/ExpandButton'
import { oldColors, sizes, transitions } from '@/styles'

export type UploadStatusGroupSize = 'large' | 'compact'

type UploadStatusGroupProps = {
  isActive?: boolean
}

type DrawerProps = {
  maxHeight?: number
} & UploadStatusGroupProps

export const Container = styled.div`
  position: relative;
  margin-bottom: ${sizes(6)};
`

export const UploadStatusGroupContainer = styled.div<UploadStatusGroupProps>`
  position: relative;
  display: flex;
  align-items: center;
  padding: ${sizes(4)};
  width: 100%;
  background-color: ${oldColors.gray[900]};
  cursor: pointer;
  transition: background-color ${transitions.timings.sharp} ${transitions.easing};
`

type ThumbnailProps = {
  size?: UploadStatusGroupSize
}

export const Thumbnail = styled.div<ThumbnailProps>`
  position: relative;
  z-index: 1;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;
  background-color: ${oldColors.gray[700]};
  height: ${sizes(12)};

  ${({ size }) => {
    if (size === 'compact') {
      return css`
        width: ${sizes(12)};
      `
    }
    if (size === 'large') {
      return css`
        width: ${sizes(18)};
      `
    }
  }};
`
export const AssetsInfoContainer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: ${sizes(4)};
  color: ${oldColors.gray[300]};
  flex: 0 1 auto;
  overflow: hidden;
`

export const AssetGroupTitleText = styled(Text)`
  overflow: hidden;
  text-overflow: ellipsis;
`

export const UploadInfoContainer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  margin-left: auto;
  width: fit-content;
  color: ${oldColors.gray[300]};
`

export const StyledExpandButton = styled(ExpandButton)`
  margin-left: ${sizes(4)};
`

export const AssetsDrawerContainer = styled.div<DrawerProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  top: 0;
  width: 100%;
  max-height: ${({ isActive, maxHeight }) => (isActive ? `${maxHeight}px` : '0px')};
  background-color: ${oldColors.gray[800]};
  overflow: hidden;
  transition: max-height ${transitions.timings.loading} ${transitions.easing};
`
