import styled from '@emotion/styled'
import { ReactElement, ReactNode } from 'react'

import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { cVar, sizes } from '@/styles'

export type InfoStartCardProps = {
  variant?: 'default' | 'warning'
  actionNode?: ReactNode
  text: string
  icon: ReactElement
}
export const InfoStartCard = ({ actionNode, variant, text, icon }: InfoStartCardProps) => {
  return (
    <Wrapper alignItems="center" gap={4} variant={variant}>
      <IconBox className="icon-box">{icon}</IconBox>
      <FlexBox flow="column">
        <Text variant="t200" as="p">
          {text}
        </Text>
        {actionNode}
      </FlexBox>
    </Wrapper>
  )
}

const Wrapper = styled(FlexBox)<{ variant: InfoStartCardProps['variant'] }>`
  padding: ${sizes(4)};
  background-color: ${cVar('colorBackgroundMutedAlpha')};
  border: ${(props) => (props.variant === 'warning' ? `1px solid ${cVar('colorBackgroundCautionStrong')}` : 'unset')};
  border-radius: ${cVar('radiusLarge')};
  text-align: left;

  .icon-box {
    svg {
      path {
        fill: ${(props) => props.variant === 'warning' && ` ${cVar('colorBackgroundCautionStrong')}`};
      }
    }
  }
`

const IconBox = styled.div`
  border-radius: 50%;
  display: grid;
  place-items: center;
  padding: ${sizes(3)};
  background-color: ${cVar('colorBackgroundAlpha')};
`
