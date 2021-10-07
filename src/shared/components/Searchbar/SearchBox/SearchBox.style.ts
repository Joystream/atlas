import styled from '@emotion/styled'
import { Link } from 'react-router-dom'

import { Button } from '@/shared/components/Button'
import { ShortcutIndicator } from '@/shared/components/ShortcutIndicator'
import { SkeletonLoader } from '@/shared/components/SkeletonLoader'
import { Text } from '@/shared/components/Text'
import { colors, media, sizes, square, typography } from '@/shared/theme'

export const Container = styled.div<{ visible: boolean }>`
  position: absolute;
  left: 0;
  top: 100%;
  width: 100%;
  background-color: ${colors.gray[800]};
  overflow-y: auto;
  height: 100vh;
  box-shadow: inset 0 1px 0 ${colors.gray[700]};
  ${({ visible }) => !visible && 'display: none'};

  ${media.sm} {
    box-shadow: none;
    height: auto;
    max-height: 400px;
  }
`

export const Section = styled.section`
  :not(:last-child) {
    box-shadow: inset 0 -1px 0 ${colors.gray[700]};
  }
`

export const ShortcutsWrapper = styled.section`
  display: none;
  align-items: center;
  justify-content: center;
  color: ${colors.gray[300]};
  padding: ${sizes(6)} 0;
  font-size: ${typography.sizes.caption};
  line-height: ${typography.lineHeights.caption};

  ${media.sm} {
    display: flex;
  }
`

export const ShortcutsGroup = styled.div`
  margin: 0 ${sizes(3)};
`

export const StyledShortcutIndicator = styled(ShortcutIndicator)<{ group?: boolean }>`
  margin: 0;
  margin-right: 6px;

  ${({ group }) =>
    group &&
    `
    margin-left: 6px;
    margin-right: ${sizes(1)};
  `}
`

export const Caption = styled(Text)`
  display: block;
  padding: ${sizes(4)};
  padding-bottom: ${sizes(2)};
`

export const SearchItemWrapper = styled(Link)`
  display: flex;
  align-items: center;
  padding: ${sizes(2)} ${sizes(4)};
  text-decoration: none;

  &:hover {
    background-color: ${colors.transparentPrimary[10]};

    ${() => `
      ${Shortcut} {
        display: flex;
      }
      
      ${ClockWrapper} {
        path {
          fill: ${colors.gray[50]};
        }
      }
      
      ${DeleteButton} {
        path {
          stroke: ${colors.gray[50]};
        }
      }
    `}
  }
`

export const DeleteButton = styled(Button)`
  margin-left: ${sizes(2)};

  path {
    stroke: ${colors.gray[300]};
  }
`

export const ClockWrapper = styled.div`
  ${square(32)};

  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background-color: ${colors.transparentPrimary[10]};
  margin-right: ${sizes(4)};
`

export const Shortcut = styled.div`
  display: none;
  align-items: center;
  margin-left: auto;
`

export const SearchItemContent = styled.div`
  flex-grow: 1;
`

export const RecentSearchItemWrapper = styled.div`
  display: flex;
  align-items: center;
`

export const ResultThumbnail = styled.img<{ rounded?: boolean }>`
  ${({ rounded }) => `
    width: ${rounded ? '32px' : '64px'};
    height: ${rounded ? '32px' : '40px'};
    ${rounded && `border-radius: ${rounded ? '50%' : 'unset'}`};
  `};

  margin-right: ${sizes(4)};
`

export const StyledSkeletonLoader = styled(SkeletonLoader)`
  margin-right: ${sizes(4)};
`

export const ResultContent = styled.div`
  display: flex;
  padding: ${sizes(1)} 0;
`

export const PlaceholderWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: ${sizes(4)};
`
