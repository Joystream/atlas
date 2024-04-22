import { useState } from 'react'

import { SvgActionPlay } from '@/assets/icons'
import { WelcomeView } from '@/components/WelcomeView'
import { CreateTokenDrawer } from '@/components/_crt/CreateTokenDrawer/CreateTokenDrawer'

export const CrtWelcomeView = () => {
  const [showDrawer, setShowDrawer] = useState(false)
  return (
    <>
      <CreateTokenDrawer show={showDrawer} onClose={() => setShowDrawer(false)} />
      <WelcomeView
        headTagTitle="Creator tokens"
        title="Ready to create your channel token?"
        pageTitle="Creator tokens"
        subtitle="Create your very own channel token, sell it on your own terms and share your success with your token holders."
        type="crt"
        buttons={[
          { children: 'Create token', size: 'large', onClick: () => setShowDrawer(true) },
          {
            children: 'Learn more',
            size: 'large',
            variant: 'tertiary',
            to: '',
            _textOnly: true,
            icon: <SvgActionPlay />,
          },
        ]}
      />
    </>
  )
}
