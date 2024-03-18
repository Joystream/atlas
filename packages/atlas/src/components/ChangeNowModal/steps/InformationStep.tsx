import styled from '@emotion/styled'

import { SvgActionClock, SvgActionCreatorToken, SvgActionHide, SvgActionLock } from '@/assets/icons'
import { CommonProps } from '@/components/ChangeNowModal/steps/types'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { Checkbox } from '@/components/_inputs/Checkbox'
import { usePersonalDataStore } from '@/providers/personalData'
import { cVar, sizes } from '@/styles'

const PROS = [
  [<SvgActionLock key="lock" />, 'No sign up'],
  [<SvgActionHide key="hide" />, 'No KYC'],
  [<SvgActionClock key="clock" />, 'Only 10-15 minutes'],
  [<SvgActionCreatorToken key="token" />, '900+ cryptos supported'],
]

const getCopy = (type: CommonProps['type']) => {
  switch (type) {
    case 'topup':
      return 'You need additional funds. Buy JOY effortlessly using ChangeNOW extension.'
    case 'buy':
      return 'Top up JOY effortlessly using ChangeNOW extension.'
    case 'sell':
      return 'Cash out JOY effortlessly using ChangeNOW extension.'
    default:
      return ''
  }
}

export const CHANGE_NOW_DISMISSIBLE_ID = 'change-now'

export const InformationStep = ({ type }: CommonProps) => {
  const hasDismissedInfo =
    usePersonalDataStore((state) =>
      state.dismissedMessages.some((message) => message.id === CHANGE_NOW_DISMISSIBLE_ID)
    ) && !!CHANGE_NOW_DISMISSIBLE_ID
  const updateDismissedMessages = usePersonalDataStore((state) => state.actions.updateDismissedMessages)
  return (
    <>
      <FlexBox gap={6} flow="column">
        <FlexBox flow="column">
          <Text variant="h500" as="h3">
            {type === 'topup' ? 'Top up JOY' : ''}
          </Text>
          <Text variant="t200" color="colorText" as="h3">
            {getCopy(type)}
          </Text>
        </FlexBox>

        <FlexBox gap={2} flow="column">
          {PROS.map(([icon, text], idx) => (
            <ProsItem key={idx}>
              {icon}
              <Text variant="t300" as="p">
                {text}
              </Text>
            </ProsItem>
          ))}
        </FlexBox>
        <Checkbox
          label="Do not show this again"
          value={hasDismissedInfo}
          onChange={(value) => updateDismissedMessages(CHANGE_NOW_DISMISSIBLE_ID, value)}
        />
      </FlexBox>
    </>
  )
}

const ProsItem = styled.div`
  display: flex;
  padding: ${sizes(3)};
  gap: ${sizes(2)};
  align-items: center;
  width: 100%;
  border-radius: ${cVar('radiusSmall')};
  background-color: ${cVar('colorBackgroundMutedAlpha')};
`
