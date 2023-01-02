import styled from '@emotion/styled'

import { Button } from '@/components/_buttons/Button'
import { VideoListItem } from '@/components/_video/VideoListItem/VideoListItem'
import { media, sizes } from '@/styles'

export const WorkspaceWrapper = styled.div`
  display: grid;
  row-gap: ${sizes(6)};
  margin: ${sizes(10)} ${sizes(8)};

  ${media.md} {
    column-gap: ${sizes(8)};
    grid-template-columns: 450px 1fr auto;
  }
`

export const StyledButton = styled(Button)`
  height: min-content;
`

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(4)};
`

export const StyledVideoListItem = styled(VideoListItem)`
  cursor: grab;
`
