import { useApolloClient } from '@apollo/client'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import { useNavigate } from 'react-router-dom'

import { SvgActionNewTab } from '@/assets/icons'
import { FlexBox } from '@/components/FlexBox'
import { Text } from '@/components/Text'
import { TextButton } from '@/components/_buttons/Button'
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
          onClick={() => {
            client.refetchQueries({ include: 'active' }).then(() => {
              navigate(absoluteRoutes.viewer.channel(channelId ?? '', { tab: 'Token' }))
            })
          }}
        >
          View your token page
        </TextButton>
      }
      dividers
    >
      <IllustrationWrapper>
        <div className="coin silver" />
      </IllustrationWrapper>
      <FlexBox flow="column" gap={2} alignItems="center">
        <Text variant="h500" as="h3">
          Congratulations you just made (minted) your ${tokenName} token!
        </Text>
        <Text variant="t200" as="p" color="colorText">
          Help your buyers discover your token by customizing the token page and putting it ouy to market!
        </Text>
      </FlexBox>
    </DialogModal>
  )
}

const spin = keyframes`
  0% {
    width: var(--coin-size);
    box-shadow:
            0 0 0 var(--side-dark);
    animation-timing-function: ease-in;
  }

  49.999% {
    width: 0.1rem;
    box-shadow:
            0.05rem 0 0 var(--side),
            0.1rem 0 0 var(--side),
            0.15rem 0 0 var(--side),
            0.2rem 0 0 var(--side),
            0.25rem 0 0 var(--side),
            0.3rem 0 0 var(--side),
            0.35rem 0 0 var(--side),
            0.4rem 0 0 var(--side),
            0.45rem 0 0 var(--side),
            0.5rem 0 0 var(--side),
            0.55rem 0 0 var(--side),
            0.6rem 0 0 var(--side),
            0.65rem 0 0 var(--side),
            0.7rem 0 0 var(--side),
            0.75rem 0 0 var(--side);
    transform: translateX(-0.375rem);
    background-color: var(--lowlight);
    animation-timing-function: linear;
  }

  50.001% {
    width: 0.1rem;
    box-shadow:
            -0.05rem 0 0 var(--side),
            -0.1rem 0 0 var(--side),
            -0.15rem 0 0 var(--side),
            -0.2rem 0 0 var(--side),
            -0.25rem 0 0 var(--side),
            -0.3rem 0 0 var(--side),
            -0.35rem 0 0 var(--side),
            -0.4rem 0 0 var(--side),
            -0.45rem 0 0 var(--side),
            -0.5rem 0 0 var(--side),
            -0.55rem 0 0 var(--side),
            -0.6rem 0 0 var(--side),
            -0.65rem 0 0 var(--side),
            -0.7rem 0 0 var(--side),
            -0.75rem 0 0 var(--side);
    transform: translateX(0.375rem);
    background-color: var(--lowlight);
    animation-timing-function: ease-out;
  }

  100% {
    width: var(--coin-size);
    box-shadow:
            0 0 0 var(--side-dark);
  }
}

@keyframes flip {
  0% {
    height: var(--coin-size);
    box-shadow:
            0 0 0 var(--side-dark);
    animation-timing-function: ease-in;
  }

  49.999% {
    height: 0.1rem;
    box-shadow:
            0 0.05rem 0 var(--side),
            0 0.1rem 0 var(--side),
            0 0.15rem 0 var(--side),
            0 0.2rem 0 var(--side),
            0 0.25rem 0 var(--side),
            0 0.3rem 0 var(--side),
            0 0.35rem 0 var(--side),
            0 0.4rem 0 var(--side),
            0 0.45rem 0 var(--side),
            0 0.5rem 0 var(--side),
            0 0.55rem 0 var(--side),
            0 0.6rem 0 var(--side),
            0 0.65rem 0 var(--side),
            0 0.7rem 0 var(--side),
            0 0.75rem 0 var(--side);
    transform: translateY(-0.375rem);
    background-color: var(--lowlight);
    animation-timing-function: linear;
  }

  50.001% {
    height: 0.1rem;
    box-shadow:
              0 -0.05rem 0 var(--side),
              0 -0.1rem 0 var(--side),
              0 -0.15rem 0 var(--side),
              0 -0.2rem 0 var(--side),
              0 -0.25rem 0 var(--side),
              0 -0.3rem 0 var(--side),
              0 -0.35rem 0 var(--side),
              0 -0.4rem 0 var(--side),
              0 -0.45rem 0 var(--side),
              0 -0.5rem 0 var(--side),
              0 -0.55rem 0 var(--side),
              0 -0.6rem 0 var(--side),
              0 -0.65rem 0 var(--side),
              0 -0.7rem 0 var(--side),
              0 -0.75rem 0 var(--side);
    transform: translateY(0.375rem);
    background-color: var(--lowlight);
    animation-timing-function: ease-out;
  }

  100% {
    height: var(--coin-size);
    box-shadow:
            0 0 0 var(--side-dark);
  }
`
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

  --face: #be9d66;
  --lowlight: #111;
  --side: #896c3b;
  --side-dark: #120e08;
  --coin-size: 9rem;
  --coin-face: url('https://i.ibb.co/mCKfp8Q/Avatar.png');

  .coin {
    height: var(--coin-size);
    width: var(--coin-size);
    margin: 0.5rem;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .coin::before {
    content: '';
    display: block;
    position: relative;
    height: var(--coin-size);
    width: var(--coin-size);
    border-radius: 50%;
    background-color: var(--face);
    animation: ${spin} 3s linear infinite;
    background-image: var(--coin-face);
    background-size: 100% 100%;
    background-position: center;
    background-blend-mode: overlay;
  }

  .coin.copper::before {
    filter: hue-rotate(-40deg) brightness(0.75) contrast(115%);
    animation-delay: -0.25s;
  }

  .coin.silver::before {
    filter: saturate(0);
    animation-delay: -0.5s;
  }

  > * {
    width: 100%;
    height: 208px;

    ${media.sm} {
      height: 264px;
    }
  }
`
