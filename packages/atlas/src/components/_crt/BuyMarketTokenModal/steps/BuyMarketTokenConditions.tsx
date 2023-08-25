import styled from '@emotion/styled'
import { useEffect, useState } from 'react'

import { FlexBox } from '@/components/FlexBox/FlexBox'
import { Text } from '@/components/Text'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { cVar, media, sizes } from '@/styles'

import { CommonProps } from './types'

const DETAILS = [
  {
    title: 'Introduction',
    content:
      'Aliquet et mauris mi id at pulvinar. Odio augue tristique nibh vitae lorem. Id scelerisque sit malesuada id vitae turpis ipsum. Maecenas fermentum diam volutpat eget tellus interdum sit. Et porttitor rhoncus laoreet velit. Magna adipiscing pulvinar phasellus urna bibendum venenatis consequat volutpat. A netus magna in imperdiet convallis sem augue vivamus.',
  },
  {
    title: 'Scope of Terms',
    content:
      'Etiam egestas nec quis turpis eros mattis in ac quam. Laoreet aliquam dui viverra pretium massa. Auctor diam neque blandit tincidunt nibh odio nunc non varius. Arcu viverra pretium aliquet vel nulla mi vel diam laoreet.',
  },
  {
    title: 'Purpose of Tokens',
    content:
      'Risus libero donec et venenatis. Auctor posuere purus orci habitasse aliquet. At nibh in duis est. Laoreet egestas tempor non eu. Justo pretium vulputate tellus condimentum vel sit tellus enim sed.\n' +
      'Ultricies erat mauris cursus augue pretium tristique ullamcorper aliquam enim. Placerat eget hendrerit convallis arcu fermentum mi pretium.',
  },
]

type BuySaleTokenTermsProps = {
  onSubmit: () => void
} & CommonProps

export const BuyMarketTokenConditions = ({ setPrimaryButtonProps, onSubmit }: BuySaleTokenTermsProps) => {
  const [isChecked, setIsChecked] = useState(false)
  const [checkboxError, setCheckboxError] = useState('')

  useEffect(() => {
    setPrimaryButtonProps({
      text: 'Buy token',
      onClick: () => {
        if (isChecked) {
          onSubmit()
        } else {
          setCheckboxError('Terms & Conditions have to be accepted to continue')
        }
      },
    })
  }, [isChecked, onSubmit, setPrimaryButtonProps])

  return (
    <Container>
      <FlexBox flow="column" gap={6} style={{ position: 'relative' }}>
        <Text variant="h400" as="h4">
          Holders terms
        </Text>

        <FlexBox flow="column" gap={2}>
          {DETAILS.map((row) => (
            <FlexBox key={row.title} flow="column">
              <Text variant="t200-strong" as="p" color="colorText">
                {row.title}
              </Text>

              <Text variant="t100" as="p" color="colorTextMuted">
                {row.content}
              </Text>
            </FlexBox>
          ))}
        </FlexBox>
      </FlexBox>
      <CheckboxWrapper isAccepted={isChecked}>
        <Checkbox
          onChange={(val) => {
            setIsChecked(val)
            setCheckboxError('')
          }}
          caption={checkboxError}
          error={!!checkboxError}
          value={isChecked}
          label="I have saved my wallet seed phrase safely"
        />
      </CheckboxWrapper>
    </Container>
  )
}

export const CheckboxWrapper = styled.div<{ isAccepted: boolean }>`
  position: fixed;
  bottom: 80px;
  left: 0;
  right: 1px;
  width: 100%;
  display: flex;
  align-items: center;
  background-color: ${({ isAccepted }) => (isAccepted ? cVar('colorBackground') : cVar('colorBackgroundElevated'))};
  padding: ${sizes(4)} var(--local-size-dialog-padding);

  ${media.sm} {
    bottom: 87px;
  }
`

const Container = styled.div`
  display: flex;
  max-height: calc(100% - 55px);
  overflow-x: hidden;
  overflow-y: auto;
  padding: var(--local-size-dialog-padding);
  padding-bottom: 0;
  margin-bottom: 55px;
`
