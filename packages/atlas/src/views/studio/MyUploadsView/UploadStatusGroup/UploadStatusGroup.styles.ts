import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { ExpandButton } from '@/components/_buttons/ExpandButton'
import { cVar, media, sizes, square, transitions } from '@/styles'

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
  background-color: ${cVar('colorCoreNeutral900')};
  cursor: pointer;
  transition: background-color ${transitions.timings.sharp} ${transitions.easing};
`

export const Thumbnail = styled.div`
  ${square(40)};

  position: relative;
  z-index: 1;
  display: flex;
  flex-shrink: 0;
  justify-content: center;
  align-items: center;

  ${media.md} {
    ${square(48)};
  }
`
export const AssetsInfoContainer = styled.div`
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  margin-left: ${sizes(4)};
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
  color: ${cVar('colorCoreNeutral300')};
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
  background-color: ${cVar('colorCoreNeutral800')};
  overflow: hidden;
  transition: max-height ${transitions.timings.loading} ${transitions.easing};
`
