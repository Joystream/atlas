import styled from '@emotion/styled'
import { fluidRange } from 'polished'

import { colors, media, sizes, typography } from '@/shared/theme'

import { Text } from '../Text'

type HelperTextProps = {
  error?: boolean
  warning?: boolean
}

type StyledInputProps = {
  widthSize: number | null
}

export const Container = styled.div`
  position: relative;
  width: fit-content;
  background-color: ${colors.gray[800]};
`

export const StyledInput = styled.input<StyledInputProps>`
  --input-max-width: 60vw;
  ${media.small} {
    --input-max-width: 400px;
  }

  ${media.medium} {
    --input-max-width: 600px;
  }

  line-height: 1;
  padding: ${sizes(1)} 0 ${sizes(2)} ${sizes(2)};
  ${fluidRange({ prop: 'fontSize', fromSize: '32px', toSize: '40px' })};

  color: white;
  background-color: ${colors.transparent};
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  font-family: ${typography.fonts.headers};
  font-weight: ${typography.weights.bold};
  border: none;
  min-width: 100px;
  max-width: var(--input-max-width);
  width: ${({ widthSize }) => (widthSize ? `${widthSize}ch` : '100%')};
  height: ${sizes(13)};

  &:hover {
    filter: brightness(80%);
  }
`

export const HelperText = styled(Text)<HelperTextProps>`
  color: ${({ warning, error }) => {
    if (warning) return colors.warning
    if (error) return colors.error
  }};
  background-color: ${colors.gray[800]};
  width: fit-content;
  max-width: 600px;
  padding: ${sizes(2)};
  ${fluidRange({ prop: 'fontSize', fromSize: '10px', toSize: '16px' })};
`
