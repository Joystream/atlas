import styled from '@emotion/styled'

import { media, colors, sizes, transitions, typography } from '@/shared/theme'

import CircularProgressbar from '../CircularProgressbar'
import Text from '../Text'

type StepProps = {
  active?: boolean
  disabled?: boolean
}

export const StepWrapper = styled.div<StepProps>`
  height: ${sizes(14)};
  padding: ${sizes(3)} ${sizes(4)};
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 1px solid ${({ active }) => (active ? colors.blue[500] : colors.gray[600])};
  transition: border ${transitions.timings.routing} ${transitions.easing};
  cursor: pointer;
  transition: background-color ${transitions.timings.routing} ${transitions.easing};
  background-color: ${({ active }) => (active ? 'rgba(180, 187, 255, 0.06)' : 'none')};
  :hover:not([aria-disabled='true']) {
    background-color: rgba(180, 187, 255, 0.12);
  }
  &[aria-disabled='true'] {
    opacity: 0.6;
    cursor: not-allowed;
    background: none;
  }
`

export const StepStatus = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  position: relative;
`

export const StepNumber = styled.div<StepProps>`
  background-color: ${({ active }) => (active ? colors.blue[500] : colors.gray[600])};
  font-size: ${typography.sizes.subtitle2};
  color: ${colors.white};
  border-radius: 100%;
  height: ${sizes(7)};
  width: ${sizes(7)};
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color ${transitions.timings.routing} ${transitions.easing};
`

export const StepDetails = styled.div`
  margin-left: 10px;
  width: 100%;
`

export const Overhead = styled(Text)`
  display: block;
  color: ${colors.gray[300]};
  font-weight: ${typography.weights.regular};
  overflow: hidden;
`

export const FileName = styled(Text)`
  display: block;
  font-family: ${typography.fonts.headers};
  font-size: ${typography.sizes.caption};
  height: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const StyledProgress = styled(CircularProgressbar)`
  width: ${sizes(7)};
  height: ${sizes(7)};
`

export const Thumbnail = styled.div`
  flex-shrink: 0;
  color: white;
  background: ${colors.gray[600]};
  width: ${sizes(7)};
  height: ${sizes(6)};

  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;

  img {
    object-fit: cover;
    height: 100%;
  }
`
