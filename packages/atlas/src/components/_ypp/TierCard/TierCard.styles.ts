import styled from '@emotion/styled'

import { cVar, sizes } from '@/styles'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${sizes(2)};
  gap: ${sizes(4)};
  background-color: ${cVar('colorBackgroundStrong')};
  border-radius: ${cVar('radiusLarge')};
  width: fit-content;
`

export const RewardWrapper = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${sizes(2)};
  gap: ${sizes(2)};
  border-radius: ${cVar('radiusMedium')};
  background-color: ${cVar('colorBackgroundMutedAlpha')};
`

export const TierBanner = styled.div`
  width: 100%;
  height: 80px;
  border-radius: ${cVar('radiusMedium')};
  background: yellow;
`
