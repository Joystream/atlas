import styled from '@emotion/styled'

import { studioContainerStyle } from '@/components/StudioContainer'
import { HeaderTextField, Button } from '@/shared/components'
import { media, sizes, colors } from '@/shared/theme'

export const StyledRadioContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  > * + * {
    margin-top: ${sizes(2)};
  }
`

export const FormWrapper = styled.form`
  display: grid;
  grid-template-rows: max-content max-content;
  grid-template-columns: 100%;
  overflow-y: auto;
  padding: ${sizes(8)} ${sizes(4)};

  ${media.small} {
    padding: ${sizes(8)} ${sizes(8)};
  }

  ${media.medium} {
    overflow-y: hidden;
    padding-bottom: 0;
    grid-gap: ${sizes(12)};
    grid-template-rows: 1fr;
    grid-template-columns: 1fr 1fr;
  }

  ${media.large} {
    padding: ${sizes(8)} 0 0 0;
  }

  ${studioContainerStyle}
`

export const InputsContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: ${sizes(4)};
  margin-top: ${sizes(8)};
  ${media.medium} {
    margin-top: 0;
    overflow-y: auto;
  }

  > :last-child {
    padding-bottom: 100px;
  }
`

export const StyledHeaderTextField = styled(HeaderTextField)`
  margin-bottom: ${sizes(4)};
`

export const DeleteVideoContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: ${sizes(6)};
  padding-top: ${sizes(4)};
  border-top: 1px solid ${colors.gray[400]};
`

export const DeleteVideoButton = styled(Button)`
  width: 100%;
`
