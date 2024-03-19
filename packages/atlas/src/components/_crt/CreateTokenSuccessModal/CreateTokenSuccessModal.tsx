import { useApolloClient } from '@apollo/client'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'

import { SvgActionNewTab } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
import { AnimatedCoin } from '@/components/_crt/AnimatedCoin/AnimatedCoin'
import { DialogModal } from '@/components/_overlays/DialogModal'
import { absoluteRoutes } from '@/config/routes'
import { useUser } from '@/providers/user/user.hooks'
import { cVar, media, sizes } from '@/styles'

export type CreateTokenSuccessModalProps = {
  show: boolean
  tokenName: string
}

export const CreateTokenSuccessModal = ({ tokenName, show }: CreateTokenSuccessModalProps) => {
  const navigate = useNavigate()
  const client = useApolloClient()
  const { channelId } = useUser()

  return (
    <DialogModal
      show={show}
      primaryButton={{
        text: 'Go to dashboard',
        onClick: () => {
          client.refetchQueries({ include: 'active' }).then(() => {
            navigate(absoluteRoutes.studio.crtDashboard())
          })
        },
      }}
      additionalActionsNode={
        <TextButton
          variant="secondary"
          icon={<SvgActionNewTab />}
          iconPlacement="right"
          disabled={!channelId}
          to={absoluteRoutes.viewer.channel(channelId ?? '-1', { tab: 'Token' })}
          onClick={() => {
            client.refetchQueries({ include: 'active' })
          }}
        >
          View your token page
        </TextButton>
      }
      dividers
    >
      <IllustrationWrapper>
        <AnimatedCoin />
      </IllustrationWrapper>
      <FlexBox flow="column" gap={2} alignItems="center">
        <Text variant="h500" as="h3">
          Congratulations, you just made (minted) your ${tokenName} token!
        </Text>
        <Text variant="t200" as="p" color="colorText">
          Help your buyers discover your token by customizing the token page and putting it ouy to market!
        </Text>
      </FlexBox>
    </DialogModal>
  )
}

export const IllustrationWrapper = styled.div`
  margin: calc(var(--local-size-dialog-padding) * -1) calc(var(--local-size-dialog-padding) * -1) ${sizes(6)}
    calc(var(--local-size-dialog-padding) * -1);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  background-color: ${cVar('colorBackground')};
  padding: ${sizes(16)};

  > * {
    width: 100%;
    height: 208px;

    ${media.sm} {
      height: 264px;
    }
  }
`
