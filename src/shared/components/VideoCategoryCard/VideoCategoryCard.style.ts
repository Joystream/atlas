import { css } from '@emotion/react'
import styled from '@emotion/styled'
import { transparentize } from 'polished'
import { Link } from 'react-router-dom'

import { Text } from '@/shared/components/Text'
import { colors, sizes, transitions } from '@/shared/theme'

type ColorProps = { color: string }
type LoadingProps = { isLoading?: boolean }
type VariantProps = { variantCategory?: 'default' | 'compact' }

export const CoverImg = styled.div<{ bgImgUrl: string }>`
  transition: opacity ${transitions.timings.regular} ${transitions.easing};
  position: relative;
  width: 100%;
  height: 100%;
  background: url(${({ bgImgUrl }) => bgImgUrl});
  background-position: center;
  background-size: cover;
  opacity: 0.2;
`

export const CoverImgOverlay = styled.div`
  transition: opacity ${transitions.timings.regular} ${transitions.easing};
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
  background-color: ${colors.gray[800]};
  mix-blend-mode: color;
`

export const CoverImgContainer = styled.div`
  position: relative;
`

const hoverStyles = ({ isLoading, color }: LoadingProps & ColorProps) =>
  !isLoading &&
  css`
    border-left: 0 solid ${color};
    transform: translate(-${sizes(2)}, -${sizes(2)});
    box-shadow: ${sizes(2)} ${sizes(2)} 0 ${color};
  `

export const Container = styled(Link)<ColorProps & VariantProps & LoadingProps>`
  text-decoration: unset;
  transition: all ${transitions.timings.regular} ${transitions.easing},
    border ${transitions.timings.sharp} ${transitions.easing};
  display: grid;
  cursor: ${({ isLoading }) => (isLoading ? 'initial' : 'pointer')};
  border-left: 4px solid ${({ color, isLoading }) => (color && !isLoading ? color : 'transparent')};
  background-color: ${({ isLoading }) => (isLoading ? colors.gray[900] : colors.gray[800])};

  &:hover {
    ${hoverStyles}

    ${CoverImgOverlay} {
      opacity: 0;
    }

    ${CoverImg} {
      opacity: 1;
    }

    ::after {
      transform: translate(${sizes(2)}, ${sizes(2)});
    }
  }

  ::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
`

const generalStyles = ({ variantCategory }: VariantProps) =>
  variantCategory === 'default' &&
  css`
    height: 228px;
    grid-template-columns: 2fr 1fr;
  `
export const GeneralContainer = styled(Container)`
  ${generalStyles}

  height: 100%;
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
  width: ${sizes(10)};
  height: ${sizes(10)};
  border-radius: 100%;
  background: ${({ color }) => transparentize(0.8, color)};

  path {
    fill: ${({ color }) => color};
  }
`

export const Title = styled(Text)<VariantProps>`
  margin-bottom: ${({ variantCategory }) => (variantCategory === 'default' ? sizes(6) : sizes(4))};
`

// ref https://codeburst.io/how-to-pure-css-pie-charts-w-css-variables-38287aea161e
export const PieChart = styled.div`
  margin-right: ${sizes(2)};
  background: ${transparentize(0.8, '#7b8a95')};
  border-radius: 100%;
  height: ${sizes(4)};
  width: ${sizes(4)};
  overflow: hidden;
  position: relative;
`

export const PieSegment = styled.div<{ value: number }>`
  --a: calc(var(--over50, 0) * -100%);
  --b: calc((1 + var(--over50, 0)) * 100%);
  --degrees: calc((var(--offset, 0) / 100) * 360);
  --over50: ${({ value }) => (value > 50 ? 1 : 0)};
  --pieChartValue: ${({ value }) => value};

  -webkit-clip-path: polygon(var(--a) var(--a), var(--b) var(--a), var(--b) var(--b), var(--a) var(--b));
  clip-path: polygon(var(--a) var(--a), var(--b) var(--a), var(--b) var(--b), var(--a) var(--b));
  height: 100%;
  width: 100%;
  position: absolute;
  transform: translate(0, -50%) rotate(90deg) rotate(calc(var(--degrees) * 1deg));
  transform-origin: 50% 100%;
  z-index: calc(1 + var(--over50));

  &::after,
  &::before {
    background: ${colors.gray[300]};
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
  }

  &::before {
    --degrees: calc((var(--pieChartValue, 0) / 100) * 360);

    transform: translate(0, 100%) rotate(calc(var(--degrees) * 1deg));
    transform-origin: 50% 0%;
  }

  &::after {
    opacity: var(--over50, 0);
  }
`

export const VideosNumberContainer = styled.div`
  display: flex;
  align-items: center;
`
