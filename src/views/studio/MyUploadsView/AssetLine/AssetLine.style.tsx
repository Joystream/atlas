import styled from '@emotion/styled'
import { Text } from '@/shared/components'
import { colors, sizes, breakpoints } from '@/shared/theme'

type FileLineProps = {
  isLast?: boolean
}

export const FileLineContainer = styled.div<FileLineProps>`
  display: flex;
  align-items: center;
  height: ${sizes(12)};
  margin-bottom: ${({ isLast }) => !isLast && sizes(12)};
  @media screen and (min-width: ${breakpoints.small}) {
    margin-bottom: ${({ isLast }) => !isLast && sizes(6)};
  }
`

export const FileLinePoint = styled.div`
  display: none;
  width: 37px;
  height: 32px;
  border-left: 2px solid ${colors.gray[500]};
  flex-shrink: 0;
  &:after {
    content: '';
    position: absolute;
    border-top: 2px solid ${colors.gray[500]};
    width: 33px;
    height: 32px;
    transform: translateY(calc(50% - 1px));
  }
  @media screen and (min-width: ${breakpoints.small}) {
    display: block;
  }
`

export const FileLineLastPoint = styled.div`
  display: none;
  width: 35px;
  height: 17px;
  flex-shrink: 0;
  border-left: 2px solid ${colors.gray[500]};
  border-bottom: 2px solid ${colors.gray[500]};
  transform: translateY(calc(-50% + 1px));
  @media screen and (min-width: ${breakpoints.small}) {
    display: block;
  }
`
export const StatusMessage = styled(Text)`
  width: 100%;
  max-width: ${sizes(16)};
  height: 48px;
  margin-left: auto;
  color: ${colors.gray[300]};
  display: flex;
  align-items: center;
  justify-content: flex-end;
  @media screen and (min-width: ${breakpoints.medium}) {
    max-width: ${sizes(42)};
  }
`

export const FileStatusContainer = styled.div`
  width: ${sizes(6)};
  height: ${sizes(6)};
  margin-left: ${sizes(4)};
  flex-shrink: 0;
`

export const FileInfoContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
  width: 100%;
  max-width: 600px;
  margin-left: ${sizes(2)};
  color: ${colors.gray[300]};

  p {
    display: flex;
    align-items: center;
  }
  @media screen and (min-width: ${breakpoints.small}) {
    margin-left: ${sizes(6)};
    grid-template-columns: repeat(3, 1fr);
  }
`

export const FileInfoType = styled.div`
  display: flex;
  align-items: center;
  height: ${sizes(6)};
  color: ${colors.white};
  svg {
    width: ${sizes(6)};
    height: ${sizes(6)};
    margin-right: 10px;
  }
`
