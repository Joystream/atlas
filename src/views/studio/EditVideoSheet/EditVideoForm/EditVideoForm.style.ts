import styled from '@emotion/styled'
import { media, sizes, colors } from '@/shared/theme'
import { HeaderTextField, Button } from '@/shared/components'

export const StyledRadioContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  > * + * {
    margin-top: ${sizes(2)};
  }
`

export const FormContainer = styled.form`
  display: flex;
  flex-direction: column;

  padding: ${sizes(4)};
  margin-top: ${sizes(8)};
  ${media.medium} {
    padding: ${sizes(4)};
    margin-top: 0;
    overflow-y: auto;
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
