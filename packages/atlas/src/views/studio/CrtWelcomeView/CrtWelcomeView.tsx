import { useState } from 'react'

import { SvgActionPlay } from '@/assets/icons'
import { WelcomeView } from '@/components/WelcomeView'
import { CreateTokenDrawer } from '@/components/_crt/CreateTokenDrawer/CreateTokenDrawer'
import { atlasConfig } from '@/config'
import { CrtMaintenanceView } from '@/views/studio/CrtMaintenanceView'

export const CrtWelcomeView = () => {
  const [showDrawer, setShowDrawer] = useState(false)
  if (atlasConfig.general.crtMaintenanceMode) {
    return <CrtMaintenanceView />
  }
  return (
    <>
      <CreateTokenDrawer show={showDrawer} onClose={() => setShowDrawer(false)} />
      <WelcomeView
        headTagTitle="Creator tokens"
        title="Ready to create your channel token?"
        pageTitle="Creator tokens"
        subtitle="Convert your viewers to investors, explore new ways to engage with community and monetize your content."
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
