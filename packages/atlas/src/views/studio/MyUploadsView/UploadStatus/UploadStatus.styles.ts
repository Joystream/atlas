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
  height: 64px;
  display: flex;
  align-items: center;
  position: relative;

  ${media.md} {
    height: 56px;
  }
`

export const FileLinePoint = styled.div`
  display: block;
  height: 100%;
  border-left: 2px solid ${cVar('colorBorder')};
  flex-shrink: 0;
  margin-left: ${sizes(9.5)};
  width: 16px;

  ${media.md} {
    width: 33px;
  }

  &::after {
    content: '';
    position: absolute;
    border-top: 2px solid ${cVar('colorBorder')};
    width: 16px;
    top: 50%;
    transform: translateY(-50%);

    ${media.md} {
      width: 33px;
    }
  }
`

export const FileLineLastPoint = styled.div`
  display: block;
  width: 16px;
  height: 50%;
  flex-shrink: 0;
  border-left: 2px solid ${cVar('colorBorder')};
  border-bottom: 2px solid ${cVar('colorBorder')};
  margin-left: ${sizes(9.5)};
  align-self: flex-start;

  ${media.md} {
    width: 32px;
  }
`

export const FailedStatusWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${sizes(3)} ${sizes(6)};
  background-color: ${cVar('colorBackgroundStrong')};

  ${media.md} {
    padding: 0 ${sizes(6)};
    justify-content: flex-end;
    background-color: transparent;
  }

  ${media.lg} {
    justify-content: flex-end;
    background-color: unset;
  }
`

export const RetryButton = styled(Button)`
  margin-left: ${sizes(4)};
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
  align-items: center;
  width: 100%;
  max-width: 600px;
  margin-left: ${sizes(4)};
  color: ${cVar('colorCoreNeutral300')};

  ${media.md} {
    display: flex;
  }
`

type FileInfoTypeProps = {
  warning?: boolean
}

export const FileInfoType = styled.div<FileInfoTypeProps>`
  display: flex;
  align-items: center;
  height: ${sizes(6)};
  flex: 0 0 auto;

  ${media.md} {
    width: 280px;
    margin-right: ${sizes(6)};
  }

  svg {
    margin-right: ${sizes(2)};

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
  gap: ${sizes(6)};
  grid-template-columns: ${({ size }) => (size === 'compact' ? 'min-content max-content' : '1fr 1fr')};
`

export const FileDimension = styled(Text)`
  ${media.md} {
    width: 96px;
  }
`

export const ProgressbarContainer = styled.div`
  width: ${sizes(5)};
  height: ${sizes(5)};
`
