import styled from '@emotion/styled'

import { Button } from '@/shared/components/Button'
import { Text } from '@/shared/components/Text'
import { colors, media, sizes } from '@/shared/theme'

type FileLineProps = {
  isLast?: boolean
}

export const FileLineContainer = styled.div<FileLineProps>`
  display: grid;
  grid-template-rows: auto auto;
  grid-template-columns: 1fr;
  align-items: center;
  ${media.lg} {
    grid-template-rows: 1fr;
    grid-template-columns: 1fr auto;
  }
`

export const FileInfoContainer = styled.div`
  padding: ${sizes(3)} 0;
  height: 62px;
  display: flex;
  align-items: center;
  ${media.lg} {
    height: 58px;
  }
`

export const FileLinePoint = styled.div`
  display: block;
  width: 35px;
  height: 32px;
  border-left: 2px solid ${colors.gray[500]};
  flex-shrink: 0;
  margin-left: ${sizes(6)};

  &::after {
    content: '';
    position: absolute;
    border-top: 2px solid ${colors.gray[500]};
    width: 33px;
    height: 32px;
    transform: translateY(calc(50% - 1px));
  }

  ${media.lg} {
    margin-left: ${sizes(13)};
  }
`

export const FileLineLastPoint = styled.div`
  display: block;
  margin-left: ${sizes(6)};
  width: 35px;
  height: 17px;
  flex-shrink: 0;
  border-left: 2px solid ${colors.gray[500]};
  border-bottom: 2px solid ${colors.gray[500]};
  transform: translateY(calc(-50% + 1px));

  ${media.lg} {
    margin-left: ${sizes(13)};
  }
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
  background-color: ${colors.secondary.warning[100]};
  ${media.lg} {
    padding-right: ${sizes(6)};
    margin-left: auto;
    justify-content: flex-end;
    background-color: unset;
  }
`

export const RetryButton = styled(Button)`
  margin-left: ${sizes(4)};
  color: ${colors.gray[900]};

  path {
    stroke: ${colors.gray[900]};
  }
  ${media.lg} {
    color: ${colors.gray[50]};

    path {
      stroke: ${colors.gray[50]};
    }
  }
`

type StatusTextProps = {
  mobileText?: string
}
export const StatusText = styled(Text)<StatusTextProps>`
  color: ${colors.gray[900]};
  text-indent: -9999px;
  line-height: 0;

  ::after {
    text-indent: 0;
    content: '${({ mobileText }) => mobileText}';
    color: ${colors.gray[900]};
    display: block;
    line-height: initial;
  }
  ${media.lg} {
    text-indent: unset;
    line-height: unset;
    color: ${colors.gray[300]};

    ::after {
      content: '';
    }
  }
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

export const FileInfo = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  width: 100%;
  max-width: 600px;
  margin-left: ${sizes(2)};
  color: ${colors.gray[300]};

  ${media.lg} {
    margin-left: ${sizes(6)};
    grid-template-columns: 1fr 2fr;
  }
`

export const FileInfoType = styled.div`
  display: flex;
  align-items: center;
  height: ${sizes(6)};
  color: ${colors.white};

  svg {
    margin-right: 10px;
  }
`
type FileInfoDetailsProps = {
  isReconnecting?: boolean
}
export const FileInfoDetails = styled.div<FileInfoDetailsProps>`
  display: ${({ isReconnecting }) => (isReconnecting ? 'none' : 'grid')};
  gap: ${sizes(2)};
  grid-template-columns: min-content min-content;
  ${media.lg} {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
`
export const ReconnectingText = styled(Text)`
  ${media.lg} {
    display: none;
  }
`

export const ProgressbarContainer = styled.div`
  width: ${sizes(5)};
  height: ${sizes(5)};
`
