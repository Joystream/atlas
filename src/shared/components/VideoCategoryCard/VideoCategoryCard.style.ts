import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { transparentize } from 'polished'

import { Text } from '@/shared/components'
import { colors, sizes, transitions } from '@/shared/theme'

import { VideoCategoryCardProps } from '.'

type ColorProps = { color: string }
type LoadingProps = { loading?: VideoCategoryCardProps['loading'] }
type VariantProps = { variantCategory?: VideoCategoryCardProps['variant'] }
export const CoverImg = styled.div<{ bgImgUrl: string }>`
  background: url(${({ bgImgUrl }) => bgImgUrl});
  background-position: center;
  background-size: cover;
  filter: grayscale(100%);
`

const defaultStyles = ({ variantCategory }: VariantProps) =>
  variantCategory === 'default' &&
  css`
    height: 228px;
    grid-template-columns: 2fr 1fr;
  `

const hoverStyles = ({ loading, color }: LoadingProps & ColorProps) =>
  !loading &&
  css`
    border-left: 0 solid ${color};
    transform: translate(-${sizes(2)}, -${sizes(2)});
    box-shadow: ${sizes(2)} ${sizes(2)} 0 ${color};
  `

export const Container = styled.div<ColorProps & VariantProps & LoadingProps>`
  transition: all ${transitions.timings.regular} ${transitions.easing},
    border ${transitions.timings.sharp} ${transitions.easing};
  display: grid;
  background-color: ${({ loading }) => (loading ? colors.gray[900] : colors.gray[800])};
  cursor: pointer;

  ${defaultStyles}

  border-left: 4px solid ${({ color, loading }) => (!loading && color ? color : 'transparent')};

  &:hover {
    ${hoverStyles}

    ${CoverImg} {
      filter: grayscale(0%);
    }
  }
`

export const Content = styled.div<VariantProps>`
  display: grid;
  grid-template-rows: auto auto 1fr;
  padding: ${({ variantCategory }) => (variantCategory === 'default' ? sizes(8) : sizes(4))};
`

export const IconCircle = styled.div<ColorProps>`
  display: flex;
  margin-bottom: ${sizes(4)};
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: ${({ color }) => transparentize(0.8, color)};
  border-radius: 100%;

  path {
    fill: ${({ color }) => color};
  }
`

export const Title = styled(Text)<VariantProps>`
  margin-bottom: ${({ variantCategory }) => (variantCategory === 'default' ? sizes(6) : sizes(4))};
`

export const VideoCountContainer = styled.div`
  align-self: end;
`
