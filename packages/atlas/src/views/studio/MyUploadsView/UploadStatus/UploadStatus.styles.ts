import { css } from '@emotion/react'
import styled from '@emotion/styled'

import { Text } from '@/components/Text'
import { Button } from '@/components/_buttons/Button'
import { cVar, media, sizes } from '@/styles'

export type UploadStatusGroupSize = 'large' | 'compact'

type FileLineContainerProps = {
  isLast?: boolean
  size?: UploadStatusGroupSize
}

export const FileLineContainer = styled.div<FileLineContainerProps>`
  display: grid;
  align-items: center;

  ${({ size }) =>
    size === 'compact'
      ? css`
          grid-template-rows: auto auto;
          grid-template-columns: 1fr;
        `
      : css`
          grid-template-rows: 1fr;
          grid-template-columns: 1fr auto;
        `};
`

export const FileInfoContainer = styled.div`
  padding: ${sizes(3)} 0;
  height: 62px;
  display: flex;
  align-items: center;
`

type FileLineProps = {
  size?: UploadStatusGroupSize
}

export const FileLinePoint = styled.div<FileLineProps>`
  display: block;
  width: 35px;
  height: 32px;
  border-left: 2px solid ${cVar('colorCoreNeutral500')};
  flex-shrink: 0;
  margin-left: ${({ size }) => (size === 'compact' ? sizes(6) : sizes(13))};

  &::after {
    content: '';
    position: absolute;
    border-top: 2px solid ${cVar('colorCoreNeutral500')};
    width: 33px;
    height: 32px;
    transform: translateY(calc(50% - 1px));
  }
`

export const FileLineLastPoint = styled.div<FileLineProps>`
  display: block;
  width: 35px;
  height: 17px;
  flex-shrink: 0;
  border-left: 2px solid ${cVar('colorCoreNeutral500')};
  border-bottom: 2px solid ${cVar('colorCoreNeutral500')};
  transform: translateY(calc(-50% + 1px));
  margin-left: ${({ size }) => (size === 'compact' ? sizes(6) : sizes(13))};
`

type StatusMessageWrapperProps = {
  error?: boolean
}
export const FailedStatusWrapper = styled.div<StatusMessageWrapperProps>`
  width: 100%;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 ${sizes(6)};
  background-color: ${cVar('colorCoreYellow200')};
  ${media.lg} {
    justify-content: flex-end;
    background-color: unset;
  }
`

export const RetryButton = styled(Button)`
  margin-left: ${sizes(4)};
  color: ${cVar('colorCoreNeutral900')};

  path {
    stroke: ${cVar('colorCoreNeutral900')};
  }
  ${media.lg} {
    color: ${cVar('colorCoreNeutral50')};

    path {
      stroke: ${cVar('colorCoreNeutral50')};
    }
  }
`

type StatusTextProps = {
  size?: UploadStatusGroupSize
}
export const StatusText = styled(Text)<StatusTextProps>`
  ${({ size }) => size === 'compact' && `color: ${cVar('colorCoreNeutral900')}`};
`

export const FileStatusContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: ${sizes(6)};
  height: ${sizes(6)};
  margin-left: ${sizes(4)};
  flex-shrink: 0;
`

type FileInfoProps = {
  size?: UploadStatusGroupSize
}

export const FileInfo = styled.div<FileInfoProps>`
  display: grid;
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin-left: ${sizes(2)};
  color: ${cVar('colorCoreNeutral300')};

  ${({ size }) =>
    size === 'compact'
      ? css`
          grid-template-columns: 1fr;
          grid-template-rows: 1fr;
          margin-left: ${sizes(2)};
        `
      : css`
          margin-left: ${sizes(6)};
          grid-template-columns: 1fr 2fr;
        `};
`

type FileInfoTypeProps = {
  warning?: boolean
}

export const FileInfoType = styled.div<FileInfoTypeProps>`
  display: flex;
  align-items: center;
  height: ${sizes(6)};

  svg {
    margin-right: 10px;

    path {
      ${({ warning }) => warning && `fill: ${cVar('colorCoreRed400')}`};
    }
  }

  p {
    ${({ warning }) => warning && `color: ${cVar('colorCoreRed400')}`};
  }
`

type FileInfoDetailsProps = {
  size?: UploadStatusGroupSize
}
export const FileInfoDetails = styled.div<FileInfoDetailsProps>`
  display: grid;
  gap: ${sizes(2)};
  grid-template-columns: ${({ size }) => (size === 'compact' ? 'min-content max-content' : '1fr 1fr')};
`

export const ProgressbarContainer = styled.div`
  width: ${sizes(5)};
  height: ${sizes(5)};
`
