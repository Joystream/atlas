import styled from '@emotion/styled'

import { colors, sizes, transitions } from '@/shared/theme'

import { VideoCategoryCardProps } from '.'

type ContainerProps = { variant?: VideoCategoryCardProps['variant']; color: string }

export const CoverImg = styled.div<{ bgImgUrl: string }>`
  background: url(${({ bgImgUrl }) => bgImgUrl});
  background-position: center;
  background-size: cover;
  filter: grayscale(100%);
`

export const Container = styled.div<ContainerProps>`
  transition: all ${transitions.timings.regular} ${transitions.easing},
    border ${transitions.timings.sharp} ${transitions.easing};
  display: grid;
  grid-template-columns: 1fr 138px;
  background-color: ${colors.gray[800]};
  cursor: pointer;

  /* default styles */
  height: 228px;

  /* /// */

  border-left: 4px solid ${({ color }) => color};

  &:hover {
    border-left: 0 solid ${({ color }) => color};
    transform: translate(-${sizes(2)}, -${sizes(2)});
    box-shadow: ${sizes(2)} ${sizes(2)} 0 ${({ color }) => color};

    ${CoverImg} {
      /* cover img hover */
      filter: grayscale(0%);
    }
  }
`

export const Content = styled.div`
  padding: ${sizes(8)} 0 ${sizes(8)} ${sizes(8)};
`
