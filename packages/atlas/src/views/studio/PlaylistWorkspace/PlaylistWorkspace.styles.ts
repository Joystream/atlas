import styled from '@emotion/styled'

import { Button } from '@/components/_buttons/Button'
import { ImageUploadAndCrop } from '@/components/_inputs/ImageUploadAndCrop/ImageUploadAndCrop'
import { VideoListItem } from '@/components/_video/VideoListItem/VideoListItem'
import { cVar, media, sizes } from '@/styles'

export const WorkspaceWrapper = styled.div`
  display: grid;
  gap: ${sizes(6)};
  margin: ${sizes(10)} ${sizes(8)};

  > :nth-child(1) {
    grid-row: 1/2;
  }

  > :nth-child(4) {
    grid-row: 3/4;
  }

  ${media.sm} {
    > :nth-child(1),
    > :nth-child(2) {
      grid-column: 1/5;
    }

    > :nth-child(3) {
      grid-row: 3/4;
      grid-column: 1/4;
    }
  }

  ${media.lg} {
    column-gap: ${sizes(8)};
    grid-template-columns: 450px 1fr auto;
    grid-template-rows: auto;

    > * {
      grid-column: unset !important;
      grid-row: unset !important;
    }
  }
`

export const StyledButton = styled(Button)`
  height: min-content;
`

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(4)};

  > * {
    flex: 1;
  }

  ${media.sm} {
    flex-direction: row;
  }

  ${media.lg} {
    flex-direction: column;
  }
`

export const StyledImageUploadAndCrop = styled(ImageUploadAndCrop)`
  flex: 1;
`

export const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${sizes(4)};
`

export const StyledVideoListItem = styled(VideoListItem)`
  ${media.xs} {
    flex-direction: column;
  }

  ${media.sm} {
    cursor: grab;
    flex-direction: row;
  }
`

export const EmptyFallbackWrapper = styled.div`
  ${media.sm} {
    grid-column: 1/3;
  }

  ${media.lg} {
    grid-column: unset;
  }
`

export const Divider = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${cVar('colorBackgroundAlpha')};
  margin: ${sizes(2)} 0;
`
