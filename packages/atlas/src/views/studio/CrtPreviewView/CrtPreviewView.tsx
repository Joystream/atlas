import { CrtPreviewLayout } from '@/components/CrtPreviewLayout'
import { TokenDetails } from '@/components/_crt/TokenDetails/TokenDetails'

export const CrtPreviewView = () => {
  return (
    <CrtPreviewLayout
      mode="preview"
      tokenDetails={
        <TokenDetails
          videoId="784"
          about="This is about"
          benefits={[
            {
              title: 'Each holder has access to my secret discord server',
              description:
                'To get access to my secret discord server - buy my token, copy link to your wallet and send it via email to : joyblocks@fun.com ',
            },
            {
              title: 'Free premium tutorials access',
              description:
                'When you hold my tokens you have access to my premium crypto tutorials about investing and earning in the crypto space.',
            },
          ]}
        />
      }
    />
  )
}
