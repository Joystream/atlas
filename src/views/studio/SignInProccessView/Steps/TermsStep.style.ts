import { Button, Text } from '@/shared/components'
import { colors, sizes } from '@/shared/theme'
import styled from '@emotion/styled'

export const TermsBox = styled.div`
  scroll-behavior: smooth;
  text-align: left;
  margin-top: ${sizes(6)};
  position: relative;
  height: 300px;
  width: 100%;
  background-color: ${colors.gray[800]};
  overflow: auto;
`
export const TextWrapper = styled.div`
  margin: ${sizes(9)} ${sizes(8)};
  max-width: 450px;
`
export const TermsParagraph = styled(Text)`
  margin-top: 24px;
  color: ${colors.gray[200]};
`

export const TermsOverlay = styled.div`
  position: sticky;
  left: 0;
  bottom: 0;
  height: 35%;
  width: auto;
  background: linear-gradient(180deg, transparent 0%, ${colors.gray[800]} 100%);
`
export const ScrollButton = styled(Button)`
  border-radius: 100%;
  position: absolute;
  right: ${sizes(6)};
  bottom: ${sizes(6)};
  cursor: pointer;
`
export const TermsForm = styled.form`
  margin-top: ${sizes(4)};
  width: 100%;
  display: flex;
  justify-content: space-between;
  label span {
    color: ${colors.white};
  }
`

export const ContinueButton = styled(Button)`
  margin-left: auto;
`
